# Code Review — referência interna da fase 4

Faça passagem independente da implementação, inicialmente read-only: revisor humano/agente distinto disponível e autorizado. Autorrevisão não substitui independência; indisponibilidade deve ser explícita e impede REVIEW PASSED/READY TO SHIP.

Compare diff/arquivos novos e Plan/aceite: bugs, regressões, contratos, integridade, autorização, erros, escopo e complexidade. Confira checks no estado final. Segurança/UI são verificações condicionais internas, não fases. Sem findings cosméticos especulativos: registre evidência, arquivo/trecho, severidade CRITICAL/HIGH/MEDIUM/LOW e impacto; deduplique, separando funcional/visual.

Corrija finding seguro no Plan sem nova aprovação, repita checks/revisão afetados. Limite de autocorreção conforme [governança](../GOVERNANCE.md). Finding externo ao escopo segue decisão/backlog, sem item Plane extra automático.

Verifique decisões provisórias/ASK-FIRST e compreensão do comportamento no Scope Check. Resultado REVIEW PASSED / REVIEW PASSED WITH WARNINGS / CHANGES REQUIRED. Evidence resume arquivos, comportamento, checks, findings, riscos, decisões e limites. READY TO SHIP só sem bloqueadores e com evidência técnica/review independente; não aprova Done, uso clínico ou publicação.
