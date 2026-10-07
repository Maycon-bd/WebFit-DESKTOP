# MCP
Status: **ACTIVE para Plane; demais integrações PREPARED — NOT ACTIVE.**

MCP é camada de integração, não fonte de requisitos ou decisões. O MCP `plane` está configurado, autenticado por OAuth e validado em leitura. A integração ativa usa somente o workspace conectado e o projeto WebFit (`WEBFIT`).

ALLOW: leitura do Plane necessária ao fluxo, checks locais seguros e escrita controlada pelo contrato de `$webfit-task`.

ASK: operações Plane fora do Work Item correspondente à execução atual, dependências, migrations/schema, efeitos externos não previstos, infraestrutura, GitHub, dados, autenticação ou secrets.

DENY: produção, secrets, DELETE/reset destrutivo, credenciais, bypass e deploy automático. Não ativar outras integrações por consequência desta configuração.
