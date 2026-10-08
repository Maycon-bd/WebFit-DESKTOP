# Security Review — condicional interna do Code Review

Avalie risco identificado em Discovery/Plan: autenticação/autorização, sessão/permissões, entrada não confiável, dados pessoais/saúde, arquivos/uploads, IPC/endpoints, SQL, secrets, integrações e criptografia. Verifique autorização no backend, SQL parametrizado/transações/foreign keys, ausência de dados sensíveis em logs/frontend, e migração/backup/restauração quando afetados.

Use código/diff, testes e ferramentas locais disponíveis. Documentação de processo sem alteração dessas fronteiras pode ser N/A com motivo. Nunca declarar PASS a check não executado ou inventar vulnerabilidade.

Mantis é ferramenta futura condicional conforme [contrato](../integrations/mantis.md). Sem integração, execute análise possível e registre limitações. Orientação read-only no Plan é permitida; reprodução só em isolamento autorizado, sem host/produção/dados reais. Ausência de Mantis não é bloqueio automático; falta de evidência para critério crítico é bloqueio real.

Deduplicar findings com evidência/severidade/impacto; corrigir no Plan autorizado, revalidar ou solicitar decisão sensível. Não criar fase/gate de ferramenta obrigatório.
