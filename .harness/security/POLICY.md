# Política de segurança do harness

Dados de saúde, CPF, credenciais/chaves, documentos e backups são sensíveis. Desenvolvimento/evidências usam somente dados fictícios. Não incluir conteúdo clínico/secrets em logs, prompts, issues ou relatórios. Operações protegidas são autorizadas no backend; ocultar botão não basta.

Discovery identifica risco; Plan avalia impacto/autorizações; Execução preserva controles; Code Review incorpora análise de segurança obrigatória quando houver autenticação/autorização/sessão, permissões, entrada não confiável, saúde/dados pessoais, SQL/arquivos/backup, integrações, financeiro, infraestrutura ou criptografia. Sem fase adicional.

Checks concretos: autorização Tauri, consultas parametrizadas/transações/foreign keys, proteção de secrets/logs, migração transacional numerada, banco vazio/versão anterior, snapshot consistente e integridade de restauração quando aplicáveis. Critério crítico sem evidência permanece bloqueante. Não declarar testes PASS sem execução.

Mantis é ferramenta condicional futura, não requisito de toda revisão. Sem integração, usar ferramentas disponíveis e declarar limitações. Reprodução somente isolada/especificamente autorizada, nunca host, produção, rede interna ou dados reais. Não gerar vulnerabilidades fictícias. [Contrato](../integrations/mantis.md).

DefectDojo é possibilidade futura de centralização de findings, sem serviço/instalação nesta mudança; Plane permanece backlog. Strix permanece OPTIONAL / FUTURE, sem instalação redundante. Operações extraordinárias obedecem ao Scope Check e ASK-FIRST.
