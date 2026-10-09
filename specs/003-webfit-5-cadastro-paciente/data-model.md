# Modelo de dados — WEBFIT-5

Schema 3, implementação local autorizada em 2026-10-08; integração nativa SQLCipher com fixtures PASS. Aceite Windows pendente. [Plano/evidência](plan.md).

| Campo | Contrato |
|---|---|
| id | UUID NOT NULL UNIQUE preservado, alvo das FKs e identidade independente do CPF |
| internal_number | INTEGER PRIMARY KEY AUTOINCREMENT, 1..9007199254740991; gerado pelo backend, visível sem zeros, imutável pelo cliente |
| name | obrigatório, não vazio após trim |
| birth | data civil válida/não futura, obrigatória |
| sex | F/M obrigatório no salvamento; legado não reescrito automaticamente |
| cpf | SQL NULL se ausente/vazio/espaços; informado normalizado/válido/único inclusive em arquivados |
| phone, email, address, socialName, gender, notes, tags | opcionais; e-mail informado validado |
| guardian | opcional, todos os campos opcionais; CPF/e-mail preenchidos validados |
| payload, search, archived, created_at, updated_at | preservados na migração, incluindo sexo legado |

Migration003 conserva UUIDs de patient_tags/prescriptions e usa memória para cópias temporárias. FKs ON, transação/integridade. Migra 0/1/2→3. Backup schemas1/2/3 com envelope1; metadata concordante, staging migrado antes de import. Número de schema3 preservado; em 1/2 UUID conhecido conserva número local, demais alocados acima do contador do destino. Maior contador origem/destino conservado; fonte pode ter números consumidos sem linha atual. Dados/licença/credenciais/auditoria conforme contratos existentes.
