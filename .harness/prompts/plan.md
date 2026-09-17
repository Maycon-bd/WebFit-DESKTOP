# plan.md

Converta uma Spec aprovada — ou tecnicamente completa com decisões provisórias permitidas — em plano rastreável. Liste escopo, não escopo, arquivos, dependências, migrações, riscos, testes, documentação, gates e evidência esperada.

Separe decisões `ACCEPTED`, `AGENT-PROVISIONAL` e `NEEDS-HUMAN-DECISION`. O plano pode usar decisões provisórias não sensíveis e reversíveis, mas não deve autorizar ação irreversível ou ASK-FIRST antes da validação. Decisões pequenas surgidas no planejamento devem seguir a matriz, ser registradas proporcionalmente e agrupadas para revisão ao final da fase.

Aplicar [HUMAN INTERACTION CONTRACT](../HUMAN-INTERACTION-CONTRACT.md): separar IMPLEMENTATION DETAIL de PRODUCT BEHAVIOR e investigar lacunas relevantes do comportamento antes de consolidar. Para decisão humana, usar DECISION com origem, motivo atual, estado, opções, recomendação, impacto e pergunta específica. Explicar a cadeia requisito/ADR/decisão → dependência; necessidade técnica não autoriza instalação. Recuperar respostas existentes e preservar o protocolo das skills oficiais.
