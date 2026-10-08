# Spec Kit ↔ Harness

Status: AVAILABLE — OPTIONAL WITHIN FOUR PHASES, conforme [DEC-057](../../docs/project/decision-log.md#dec-057--harness-com-quatro-fases).

## Papel e artefatos

Harness/webfit-task orquestram Discovery, Plan, Execução e Code Review. Spec Kit mantém Constitution e ferramentas oficiais Specify/Clarify/Plan/Checklist/Tasks/Analyze/Implement/Converge disponíveis dentro das fases; não é pipeline obrigatório paralelo. Ler skill não comprova executá-la.

Planejamento persistente novo prefere specs/WEBFIT-XX/task.md pelo [template](../templates/task.md); LIGHT pode ser inline. Requisitos aprovados continuam em docs/, arquitetura em ADRs e decisões no registro canônico. Não criar .harness/specs/ ou exigir arquivo separado por responsabilidade.

Features existentes conservam spec.md/plan.md/tasks.md/evidências válidos: atualizar só necessário, sem conversão, exclusão ou task.md concorrente. Retomar primeira atividade pendente com ID Plane/branch observada. Aprovações preservadas no escopo; política nova não aceita decisão clínica pendente.

## Uso condicional

| Fase | Ferramentas úteis quando necessárias |
|---|---|
| Discovery | specify/clarify para especificação detalhada ou ambiguidade material |
| Plan | plan/checklist/tasks/analyze para decomposição/análise formal |
| Execução | implement/converge com seus artefatos oficiais válidos e compatíveis |
| Code Review | Referenciar artefatos/evidências, com review independente do harness |

Antes de usar skill oficial, leia SKILL.md e cumpra seus pré-requisitos. Não force helper que exige tasks.md sobre task.md compacto; cumpra responsabilidade diretamente via skill local. Pedido explícito de skill oficial exige seu procedimento/artefatos, sem modificá-la ou simular execução. Restrições humanas de Git/autorização prevalecem.

O workflow gerenciado .specify/workflows/speckit/workflow.yml é opção oficial SDD completa preservada para uso explícito; webfit-task não o invoca por rotina. Seus gates/arquivos não são obrigações da orquestração local. Não reescrever manifests/scripts oficiais para impor fluxo local.

## Autorização e upgrades

Scope Check conforme [governança](../GOVERNANCE.md): pedido autoriza escopo aderente, ação sensível não autorizada exige decisão específica. Analyze não introduz Human Gate genérico. Aceite final e autorização Git/publicação seguem humanos.

Preservar skills, scripts e templates oficiais. Customizar Constitution, harness e skills locais. Helpers não podem criar/trocar branch: usar opção suportada/seleção explícita; incompatibilidade é limitação concreta, sem mutação Git ou escolha de outra feature pela branch.

Versionar recursos respeitando .gitignore; excluir feature.json/local-config.yml, caches, secrets/credenciais/dados reais. Após upgrades, rever compatibilidade do procedimento usado, sem reinstalar cadeia completa. Plane gere trabalho, Obsidian navega mesmos arquivos e segurança/UI são condicionais.
