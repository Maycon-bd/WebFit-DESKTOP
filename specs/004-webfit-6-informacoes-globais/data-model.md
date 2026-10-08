# WEBFIT-6 — Estado e dados

Sem entidade de domínio, schema, migração ou persistência nova.

- Painel fechado → aberto por ativação → fechado por Escape/Fechar.
- Versão transitória: consultando → obtida ou falha; mecanismo existente. Preview usa package.json.
- Contexto público fornece callback administrativo; contexto autenticado não fornece, segundo D-INFO-001 pendente.
- Paciente, prescrição, perfil, sessão e rascunho pertencem a App e não são alterados pelo painel.

Sem novos logs, eventos de auditoria, credenciais ou preferências. Sem ensaio novo de migração/backup por não alterar dados; regressões existentes mantidas.
