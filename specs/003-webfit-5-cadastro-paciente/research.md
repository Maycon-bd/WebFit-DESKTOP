# Research: WEBFIT-5

2026-10-07. Pesquisa somente leitura por agente sob speckit-plan; produto/banco nao alterados.

## CPF ausente

- **Decision**: propor SQL NULL em TEXT UNIQUE anulavel; UUID continua chave.
- **Rationale**: `001_initial.sql` exige NOT NULL UNIQUE e `service.rs` valida CPF obrigatorio. String vazia colide no segundo cadastro.
- **Alternatives considered**: vazio unico inviabiliza cadastro; sentinela/CPF sintetico distorce dados; remover unicidade enfraquece a regra. NULL preserva unicidade dos informados.

## Migracao

- **Decision**: nova 002, runner sequencial, snapshot criptografado anterior e transacao com checagem de integridade/referencias. Provar defer_foreign_keys no SQLCipher existente antes de integrar reconstrucao.
- **Rationale**: database.rs aceita somente v1; patient_tags/prescriptions referenciam UUID; Service::open migra antes de construir Service. Manter ordem de colunas para import logico.
- **Alternatives considered**: editar 001 nao atualiza instalacoes; renomear tabela antiga primeiro pode redirecionar referencias; writable_schema e desativacao nao verificada de FKs nao atendem restricoes. DROP NOT NULL recente nao deve ser presumido suportado.

## Backup/restauracao

- **Decision**: schema real nos metadados; aceitar v1/v2, validar concordancia e migrar copia temporaria v1 antes do import logico.
- **Rationale**: recovery.rs fixa Snapshot.schema=1 e aceita somente user_version=1; auditoria e unida, nao apagada. Envelope v1 pode continuar porque criptografia nao muda.
- **Alternatives considered**: recusar backup anterior quebra continuidade; rotular v2 como v1 oculta incompatibilidade; alterar banco ativo antes de validar backup arrisca dados.

## UI / legado

- **Decision**: radios nativos F/M sem default. D-PAT-002 AGENT-PROVISIONAL: equivalencias inequivocas para exibicao; valor diferente preservado ate escolha explicita ao salvar.
- **Rationale**: App.tsx usa texto livre; fixtures atuais nem informam sexo. Nao inferir dado clinico.
- **Alternatives considered**: select exige abrir menu; radios mostram ambas opcoes; default/inferencia registra dado nao fornecido.

D-PAT-001 AGENT-PROVISIONAL: responsavel opcional com validacao dos preenchidos, pela interpretacao literal de apenas tres obrigatorios; alternativa de obrigatorios condicionais precisa de excecao humana explicita.

## Fontes primarias

- [SQLite CREATE TABLE / UNIQUE](https://www.sqlite.org/lang_createtable.html): NULLs distintos sob UNIQUE.
- [SQLite ALTER TABLE](https://www.sqlite.org/lang_altertable.html): reconstrucao e referencias ao renomear.
- [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html): restricoes diferidas.

Semantica pesquisada, nao migracao executada. Compatibilidade SQLCipher, referencias e rollback exigem testes previstos.
