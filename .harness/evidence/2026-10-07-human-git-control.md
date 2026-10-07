# Evidência — Git sob controle humano

- Data: 2026-10-07. Classificação: LIGHT documental, sem mudança de produto ou arquitetura.
- Fonte e autoridade: instrução explícita de Maycon para administrar Git pessoalmente e executar todas as demandas na branch ativa; registrada como DEC-054 ACCEPTED no decision-log e referenciada no ledger.
- Branch/HEAD observados: `feature/pbi-001-primeiro-incremento-saude`, `fa70d8fa4eac712801c2f3297d29e78a0f130bdb`. Alterações anteriores de produto e comunicação preservadas. Nenhuma operação Git mutável executada.

## Resultado

Atualizados AGENTS.md, Governance, integração Git/GitHub, fluxo Git canônico, integração Spec Kit, integração Plane, README, contrato de interação e skills locais webfit-task/webfit-checkpoint. Retirados setup autônomo e bloqueio por nome/base/árvore suja; preservadas inspeção somente leitura, rastreabilidade, proteção contra sobrescrita e aprovações de produto/sensíveis. A regra cobre também branch ativa com nome main/master/develop; proteções remotas e publicação não foram alteradas.

Helpers oficiais Spec Kit não podem criar/trocar branch automaticamente: usar caminho suportado sem branch ou seleção explícita da feature, sem alterar skills oficiais. Sem nova Constitution, requisito ou arquitetura. Git Flow histórico permanece como referência para operação humana.

WEBFIT-4 voltou de Blocked a Planning pelo contrato já autorizado de webfit-task. Somente seu item foi atualizado. Sem implementação ou aprovação de produto inferida; Specification/Plan/Tasks ainda pendentes. O bloqueio anterior é histórico e foi explicitamente retirado pela DEC-054. Evidências antigas permanecem com as regras vigentes na sua data.

## Verificação

Verificação documental concluída: `git diff --check` passou; referências locais verificadas em 14 arquivos; `quick_validate.py` com Python UTF-8 aprovou webfit-task e webfit-checkpoint. Busca direcionada não encontrou as antigas instruções ativas de concluir Branch Safety ou bloquear antes dele nos owners atualizados. Testes de frontend/Rust/SQLite e build não são aplicáveis aos arquivos documentais; não há review independente ou simulação de comportamento futuro nesta entrega.

A primeira escrita Python nas skills locais encontrou PermissionError na pasta `.agents`; as edições autorizadas dessas duas skills foram concluídas com apply_patch, sem escalada, instalação ou operação Git. O status final também mostrou `scripts/runner-env.ps1` surgindo durante a sessão; trabalho paralelo preservado e não atribuído a esta entrega.

## Agent Decisions e próxima ação

Decisão material ACCEPTED pelo humano: DEC-054. Nenhuma decisão provisória de produto nem autorização de commit/publicação. Ajuste de política concluído após verificação; WEBFIT-4 segue no discovery, com lateral totalmente oculta definida e organização por módulos a confirmar antes de consolidar o planejamento.
