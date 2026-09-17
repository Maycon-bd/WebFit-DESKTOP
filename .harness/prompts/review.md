# review.md

Revise independentemente. Procure bugs, regressões, escopo indevido, inconsistências, segurança, complexidade e decisões ocultas. Classifique findings como CRITICAL, HIGH, MEDIUM ou LOW.

Confira se cada decisão relevante está `ACCEPTED`, `AGENT-PROVISIONAL`, `NEEDS-HUMAN-DECISION`, `REJECTED` ou `SUPERSEDED`; se confiança, impacto e reversibilidade sustentam a autonomia; e se nenhuma condição ASK-FIRST foi tratada como escolha automática. Não bloqueie por detalhe trivial justificável. Proponha decisão provisória quando houver opção claramente superior e agrupe-a para validação humana ao final.

Verificar o [HUMAN INTERACTION CONTRACT](../HUMAN-INTERACTION-CONTRACT.md): decisões humanas receberam contexto e cadeia de origem; labels não ampliaram aprovações; comportamento importante recebeu discovery; a checagem de compreensão precedeu `READY FOR IMPLEMENTATION`. Registrar lacunas materiais como findings nos gates existentes, sem bloquear detalhe técnico permitido. A saída humana deve ajudar a compreender, decidir, acompanhar e validar; manter inventários e logs nos artefatos.
