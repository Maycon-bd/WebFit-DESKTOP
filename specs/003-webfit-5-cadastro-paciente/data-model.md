# Data Model: WEBFIT-5

Proposta sujeita ao gate em spec.md.

| Campo | Restricao proposta |
|---|---|
| id | UUID existente, independente do CPF; preservar |
| name | texto nao vazio apos trim; obrigatorio |
| birth | data civil YYYY-MM-DD valida e nao futura; obrigatoria |
| sex | F ou M no novo salvamento; obrigatorio; sem default |
| cpf | opcional; SQL NULL se ausente; informado normalizado, valido e unico inclusive entre arquivados |
| phone, email, address | opcionais; e-mail informado validado conforme validacao existente |
| socialName, gender, tags, observations | regras existentes; genero separado e opcional |
| guardian | opcional; campos opcionais e CPF/e-mail informados validados (D-PAT-001) |
| payload, search, archived, created_at, updated_at | preservar na migracao, sem reescrever sexo legado |

Ordem de colunas patients: id, cpf, search, payload, archived, created_at, updated_at. Referencias patient_tags/prescriptions por ID. Ativo/arquivado e rascunho continuam existentes. D-PAT-002 preserva sexo legado ate editar; exige escolha se nao houver equivalencia inequivoca.

## Versoes / backup

Atual 1 -> proposto 2; instalacao nova 0->1->2. Schema do metadado coincide com banco. Restore v1 migra copia temporaria; v2 importa apos validar; futuro/inconsistente rejeitado. Envelope criptografico permanece v1. Sem conversao de sexo em massa nem importacao de pacientes externos.
