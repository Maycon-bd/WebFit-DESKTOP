# Execução — referência interna da fase 3

Execute integralmente o Plan coberto pelo pedido e Scope Check. Preserve alterações preexistentes, branch atual, padrões e documentação. Incrementos verticais unem comportamento, domínio, persistência, erros e testes.

Implementar → checks relevantes → investigar/corrigir no escopo → repetir afetados → confirmar cobertura integral. Convergência é interna. Até três ciclos sem convergência por problema, depois registrar causa/tentativas e pedir decisão necessária. Sem scheduler/loop persistente.

Autonomia cobre escolhas internas reversíveis, nunca requisito inventado, dependência não autorizada, schema/segurança sensível ou ampliação silenciosa. Extraordinário retorna ao Scope Check e bloqueia dependente. Sem banco real, destruição ou Git/publicação por iniciativa própria. [Governança](../GOVERNANCE.md) e [interação](../HUMAN-INTERACTION-CONTRACT.md) definem limites e comunicação.
