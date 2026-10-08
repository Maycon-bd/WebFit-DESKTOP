# Codex Skills
Status: skills locais disponíveis em `.agents/skills/`; validação estrutural local, sem ativação de loops.

Não duplicar nem modificar skills oficiais do Spec Kit. Customizações pertencem às skills locais e ao harness.

## Skills locais

- [webfit-task](../../.agents/skills/webfit-task/SKILL.md): entrypoint das quatro fases contínuas; profundidade, Plane e controles humanos preservados, Spec Kit opcional. Renomeada de `project-task` por solicitação humana em 2026-09-30.
- [webfit-checkpoint](../../.agents/skills/webfit-checkpoint/SKILL.md): retomada e salvamento do checkpoint canônico, comparação Git e próxima ação.
- [webfit-verificar](../../.agents/skills/webfit-verificar/SKILL.md): checks relevantes à mudança e evidência breve, sem substituir review ou aceite humano.

Os auxiliares podem ser usados diretamente ou pelo entrypoint; não acrescentam etapas duplicadas. Nomes antigos permanecem apenas em registros históricos e no relatório baseline. O catálogo da sessão expõe as três skills locais; seus SKILL.md são lidos ao uso. Sessão já aberta pode exigir novo chat para atualizar metadados; não depende de API de chamadas aninhadas.

Invocação autoriza desenvolvimento no escopo com Scope Check, sem pedir fase por fase. Não criar agente persistente, scheduler/loop autônomo. Autocorreção interna limitada conforme governança.

## Uso nas duas máquinas

As três skills próprias do WebFit acima e as dez skills oficiais `speckit-*` estão no repositório em `.agents/skills/`. Essa é a localização compartilhada do projeto; não é necessário manter cópias das skills do WebFit no perfil pessoal de cada máquina.

Ao sincronizar o repositório pelo fluxo Git controlado por Maycon, preserve `.agents/skills/`, `.specify/`, `.harness/`, `docs/`, `specs/` e `AGENTS.md`: as skills referenciam esses recursos do projeto. Abra o checkout do WebFit no Codex da outra máquina e use `$webfit-task`, `$webfit-checkpoint` ou `$webfit-verificar`. Se uma sessão aberta ainda não mostrar o catálogo atualizado, inicie um novo chat no projeto e confira as skills disponíveis.

Integrações externas, credenciais, runtimes e plugins instalados continuam sendo configuração de cada máquina; não são transportados por essas skills.

Conferência LIGHT em 2026-10-07: 13 arquivos `SKILL.md` já rastreados por Git, nenhuma skill WebFit adicional encontrada em `.codex/skills` ou `.agents/skills` do perfil pessoal e nenhuma cópia necessária. As skills oficiais foram preservadas. A conferência local não executou a descoberta ou os workflows na segunda máquina.
