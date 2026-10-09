"""Offline XLSX -> review/import SQL. Never opens a destination database."""
import argparse
import collections
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import unicodedata
import uuid
import openpyxl


def normalize(value):
    return ''.join(c for c in unicodedata.normalize('NFD', value.lower()) if not unicodedata.combining(c))


def digits(value):
    return re.sub(r'[^0-9]', '', value)


def valid_cpf(value):
    if len(value) != 11 or len(set(value)) == 1:
        return False
    for count in (9, 10):
        check = sum(int(value[i]) * (count + 1 - i) for i in range(count)) * 10 % 11
        if (0 if check == 10 else check) != int(value[count]):
            return False
    return True


def literal(value):
    return 'NULL' if value is None else "'" + str(value).replace("'", "''") + "'"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    output = args.output.resolve()
    if not output.is_relative_to(root / '.artifacts'):
        raise SystemExit('Use uma pasta de saída dentro de .artifacts, ignorada pelo Git.')
    output.mkdir(parents=True, exist_ok=True)
    if any(output.iterdir()):
        raise SystemExit('Pasta de saída já contém arquivos; use uma pasta nova.')
    workbook = openpyxl.load_workbook(args.source, read_only=True, data_only=True)
    sheet = workbook.worksheets[0]
    iterator = sheet.iter_rows(values_only=True)
    headers = next(iterator)
    required = ['Nome do paciente', 'CPF', 'Telefone', 'Email', 'Genero', 'Data de Nascimento']
    if any(name not in headers for name in required):
        raise SystemExit('Cabeçalhos incompatíveis com a exportação WebDiet.')
    prepared, invalid = [], []
    today = dt.datetime.now(dt.timezone.utc).date()
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat()
    for number, values in enumerate(iterator, 2):
        if not any(v is not None for v in values):
            continue
        record = dict(zip(headers, values))
        def text(name):
            value = record.get(name)
            return '' if value is None else str(value).strip()
        name, phone, cpf, email = text('Nome do paciente'), text('Telefone'), digits(text('CPF')), text('Email')
        reason = None
        try:
            birth = dt.datetime.strptime(text('Data de Nascimento'), '%d/%m/%Y').date()
            if birth > today:
                reason = 'Nascimento no futuro'
        except ValueError:
            reason = 'Nascimento inválido'
            birth = None
        sex = {'Feminino': 'F', 'Masculino': 'M'}.get(text('Genero'))
        if not name or not sex:
            reason = 'Nome ou sexo inválido'
        if text('CPF') and not valid_cpf(cpf):
            reason = 'CPF inválido'
        if email and not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email):
            reason = 'Email inválido'
        if reason:
            invalid.append({'linha_excel': number, 'motivo': reason})
            continue
        birth = birth.isoformat()
        normalized_name, normalized_phone = normalize(name), digits(phone)
        identity = json.dumps([normalized_name, birth, normalized_phone], ensure_ascii=False)
        patient_id = str(uuid.uuid5(uuid.NAMESPACE_URL, 'webfit:webdiet:' + identity))
        payload = dict(name=name, socialName='', cpf=cpf, phone=phone, birth=birth,
                       email=email, address='', sex=sex, gender='', notes='', tags=[])
        prepared.append((number, patient_id, cpf or None, normalize(f'{name}  {cpf} {normalized_phone}'),
                         json.dumps(payload, ensure_ascii=False, separators=(',', ':')),
                         normalized_name, normalized_phone, birth))
    workbook.close()
    prefix = '''-- Dados pessoais: guardar privadamente. Não versionar.
PRAGMA foreign_keys=ON;
PRAGMA temp_store=MEMORY;
CREATE TEMP TABLE IF NOT EXISTS webdiet_stage (
 linha INTEGER, id TEXT, cpf TEXT, search TEXT, payload TEXT,
 nome_normalizado TEXT, telefone_normalizado TEXT, nascimento TEXT
);
DELETE FROM temp.webdiet_stage;
'''
    prefix += '\n'.join('INSERT INTO temp.webdiet_stage VALUES(' + ','.join(literal(v) for v in row) + ');' for row in prepared)
    phone_value = "COALESCE(json_extract(p.payload,'$.phone'),'')"
    existing_phone = f"""COALESCE((WITH RECURSIVE chars(pos,digit) AS (
 SELECT 1,substr({phone_value},1,1)
 UNION ALL SELECT pos+1,substr({phone_value},pos+1,1) FROM chars WHERE pos<length({phone_value})
 ) SELECT group_concat(digit,'') FROM (SELECT digit FROM chars WHERE digit GLOB '[0-9]' ORDER BY pos)), '')"""
    # SQLite lower() only handles ASCII: map Portuguese/Latin diacritics first.
    whitespace = [code for code in range(0x3001) if chr(code).isspace()]
    trim_chars = 'char(' + ','.join(str(code) for code in whitespace) + ')'
    name_value = f"trim(COALESCE(json_extract(p.payload,'$.name'),''),{trim_chars})"
    substitutions = []
    for code in range(0xC0, 0x250):
        char = chr(code)
        ascii_name = normalize(char)
        if len(ascii_name) == 1 and ascii_name.isascii() and ascii_name.isalpha():
            substitutions.append(f'WHEN {literal(char)} THEN {literal(ascii_name)}')
    mapped = "CASE WHEN unicode(c) BETWEEN 768 AND 879 THEN '' ELSE CASE c " + ' '.join(substitutions) + ' ELSE lower(c) END END'
    existing_name = f"""COALESCE((WITH RECURSIVE chars(pos,c) AS (
 SELECT 1,substr({name_value},1,1)
 UNION ALL SELECT pos+1,substr({name_value},pos+1,1) FROM chars WHERE pos<length({name_value})
 ) SELECT group_concat(mapped,'') FROM (SELECT {mapped} AS mapped FROM chars ORDER BY pos)), '')"""
    prefix += f'''
DROP VIEW IF EXISTS temp.webdiet_candidates;
CREATE TEMP VIEW webdiet_candidates AS
SELECT s.*, CASE
 WHEN EXISTS (SELECT 1 FROM main.patients p WHERE p.id=s.id) THEN 'Já importado'
 WHEN EXISTS (SELECT 1 FROM main.patients p WHERE
   (s.cpf IS NOT NULL AND p.cpf=s.cpf)
   OR (s.telefone_normalizado<>'' AND {existing_phone}=s.telefone_normalizado)
   OR (json_extract(p.payload,'$.birth')=s.nascimento AND {existing_name}=s.nome_normalizado)
 ) THEN 'Possível duplicado no destino'
 WHEN EXISTS (SELECT 1 FROM temp.webdiet_stage other WHERE other.linha<>s.linha AND
   ((s.cpf IS NOT NULL AND other.cpf=s.cpf)
    OR (s.telefone_normalizado<>'' AND other.telefone_normalizado=s.telefone_normalizado)
    OR (other.nome_normalizado=s.nome_normalizado AND other.nascimento=s.nascimento))
 ) THEN 'Possível duplicado na planilha'
 ELSE 'Novo' END AS classificacao FROM temp.webdiet_stage s;
'''
    preview = prefix + '\nSELECT linha AS linha_excel, classificacao FROM temp.webdiet_candidates ORDER BY linha;\n'
    guard = '''
SAVEPOINT webdiet_import;
CREATE TEMP TABLE IF NOT EXISTS webdiet_guard (value INTEGER);
CREATE TEMP TRIGGER IF NOT EXISTS webdiet_schema_guard BEFORE INSERT ON webdiet_guard
WHEN (SELECT user_version FROM pragma_user_version)<>3
 OR NOT EXISTS(SELECT 1 FROM pragma_table_info('patients') WHERE name='internal_number')
 OR (SELECT foreign_keys FROM pragma_foreign_keys)<>1
BEGIN SELECT RAISE(ROLLBACK,'Banco incompatível ou foreign_keys desativado'); END;
INSERT INTO temp.webdiet_guard VALUES(1);
'''
    write = prefix + guard + f'''
CREATE TEMP TABLE IF NOT EXISTS webdiet_to_insert AS SELECT * FROM temp.webdiet_candidates WHERE 0;
DELETE FROM temp.webdiet_to_insert;
INSERT INTO temp.webdiet_to_insert SELECT * FROM temp.webdiet_candidates WHERE classificacao='Novo';
INSERT INTO main.patients(id,cpf,search,payload,archived,created_at,updated_at)
SELECT id,cpf,search,payload,0,{literal(timestamp)},{literal(timestamp)} FROM temp.webdiet_to_insert ORDER BY linha;
SELECT changes() AS pacientes_inseridos;
RELEASE SAVEPOINT webdiet_import;
SELECT s.linha AS linha_excel, CASE WHEN i.id IS NOT NULL THEN 'Inserido nesta execução' ELSE c.classificacao END AS resultado
FROM temp.webdiet_stage s JOIN temp.webdiet_candidates c ON c.linha=s.linha
LEFT JOIN temp.webdiet_to_insert i ON i.linha=s.linha ORDER BY s.linha;
'''
    (output / '01_conferir.sql').write_text(preview, encoding='utf-8')
    (output / '02_importar_novos.sql').write_text(write, encoding='utf-8')
    report = {'linhas_lidas': len(prepared) + len(invalid), 'linhas_validas': len(prepared),
              'linhas_invalidas': invalid, 'source_sha256': hashlib.sha256(args.source.read_bytes()).hexdigest(),
              'datas_persistidas': 'UTC da preparação; datas históricas WebDiet não convertidas sem fuso',
              'novos_no_destino': 'Determinado somente ao executar conferência; banco não acessado'}
    counts = collections.Counter((r[5], r[7]) for r in prepared)
    report['linhas_com_nome_nascimento_repetidos'] = sum(n for n in counts.values() if n > 1)
    (output / 'resumo.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'linhas_lidas':report['linhas_lidas'],'linhas_validas':len(prepared),'linhas_invalidas':len(invalid),
                      'nome_nascimento_repetidos':report['linhas_com_nome_nascimento_repetidos']}, ensure_ascii=True))


if __name__ == '__main__':
    main()
