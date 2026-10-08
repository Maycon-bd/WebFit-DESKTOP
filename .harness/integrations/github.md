# Git/GitHub

Status: **Git sob controle de Maycon; agente com inspeção somente leitura.**

Repositório oficial: `Maycon-bd/WebFit-DESKTOP`. Política vigente: DEC-054 em [decision-log.md](../../docs/project/decision-log.md) e [git-workflow.md](../../docs/project/git-workflow.md).

## Execução na branch atual

Todas as demandas, inclusive STANDARD/STRICT, são executadas na branch ativa. Não exigir branch exclusiva, nome com ID, base `develop`, upstream sincronizado ou árvore limpa para escrever artefatos ou implementar escopo aprovado. Registrar branch/HEAD observados e preservar alterações preexistentes.

A DEC-054 substitui o antigo Local Branch Setup e o bloqueio por Dirty Worktree. Branch chamada `main`, `master` ou `develop` não bloqueia a edição local pelo agente. Configurações remotas e consequências de commits/publicações continuam sob controle humano.

## Preservação do trabalho

Inspecionar somente o necessário, sem atribuir todo o diff à entrega. Alterações de outras demandas não constituem bloqueio por si só. Se houver conflito concreto no conteúdo ou risco de sobrescrita que não possa ser resolvido preservando o trabalho, pausar somente a edição dependente e explicar a ação necessária. Não apagar ou esconder trabalho.

## Autoridade

O agente não cria/troca branches ou worktrees, nem executa fetch/pull, stash/reset/clean, commit/push/merge, PR, tag ou release por iniciativa própria. Uma instrução humana explícita posterior pode autorizar uma operação específica. Git somente leitura continua permitido para contexto/evidência.

Esta política não substitui autorizações específicas de mudanças sensíveis, aceite final, dependências, publicação ou dados reais; Scope Check permite execução aderente ao pedido sem gate genérico. ID Plane e rastreabilidade permanecem; o ID é associado nos artefatos, não imposto ao nome da branch.
