# Codex Skills
Status: skills locais disponíveis em `.agents/skills/`; validação estrutural local, sem ativação de loops.

Não duplicar nem modificar skills oficiais do Spec Kit. Customizações pertencem às skills locais e ao harness.

## Skills locais

- [webfit-task](../../.agents/skills/webfit-task/SKILL.md): entrypoint para demandas de engenharia; preserva classificação, Spec Kit, Plane, branches e gates. Renomeada de `project-task` por solicitação humana em 2026-09-30.
- [webfit-checkpoint](../../.agents/skills/webfit-checkpoint/SKILL.md): retomada e salvamento do checkpoint canônico, comparação Git e próxima ação.
- [webfit-verificar](../../.agents/skills/webfit-verificar/SKILL.md): checks relevantes à mudança e evidência breve, sem substituir review ou aceite humano.

Os auxiliares podem ser usados diretamente ou pelo entrypoint; não acrescentam etapas duplicadas. Nomes antigos permanecem apenas em registros históricos e no relatório baseline. A descoberta na interface de uma sessão já aberta pode depender de nova leitura do catálogo; não foi verificada aqui.

Não automatizar implementação, criar agente persistente ou executar loops nesta fase.
