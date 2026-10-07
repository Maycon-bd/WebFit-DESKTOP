---
name: webfit-checkpoint
description: Retomar o WebFit Desktop ou salvar seu checkpoint entre chats e máquinas, comparando Git, fase, aprovações e próxima ação. Use para onde paramos, continuar o trabalho, salvar checkpoint ou preparar handoff; não inicia nova demanda nem substitui planejamento ou implementação.
---

# WebFit Checkpoint

Leia AGENTS.md e integralmente `docs/project/status.md`. Esse arquivo é o único checkpoint operacional; não crie outro resumo de estado concorrente. Aplique a [governança](../../../.harness/GOVERNANCE.md) e recupere fontes relacionadas apenas quando necessário.

## Escolher o modo

- **Retomar:** onde paramos, continuar ou trocar de chat/máquina. Consulta de status é somente leitura; pedido para continuar também autoriza prosseguir no trabalho já aprovado.
- **Salvar:** salvar checkpoint, encerrar sessão ou preparar troca de máquina. Atualize o checkpoint com fatos observados nesta sessão.
- Se o pedido combina os dois, compare primeiro, execute apenas o trabalho autorizado e salve o resultado ao encerrar.

## Comparar o estado

Execute `git status --short --branch`, `git rev-parse HEAD` e `git branch --show-current`. Para comparar com o upstream local conhecido, use `git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'` e `git rev-list --left-right --count 'HEAD...@{upstream}'`, com aspas no PowerShell. Se não houver upstream, registre essa ausência; não faça fetch/pull automaticamente.

Compare branch, commit-base, sincronização registrada, worktree e fase. Informe divergências antes de editar. Um upstream local alinhado não comprova o remoto atual. Commit mais novo não invalida automaticamente aprovações: localize a mudança relevante; não redefina gate por inferência.

Worktree sujo não significa perda nem bloqueio por si só. DEC-054 mantém toda demanda na branch atual, com Git controlado por Maycon. Preserve alterações; não crie/troque branches ou worktrees nem use operações Git mutáveis para facilitar a retomada. Pause somente a edição afetada por conflito concreto que impeça preservação segura.

## Retomar sem reiniciar

Recupere **Próxima ação exata**, artefatos da demanda, aprovações e bloqueios concretos. Se checkpoint, ADR e ledger divergirem, consulte a fonte canônica e exponha a diferença; não peça novamente uma aprovação já suficientemente comprovada.

Em consulta, responda com fase, trabalho concluído, bloqueio e próxima ação, sem editar. Em pedido de continuação, siga pela primeira etapa pendente usando [webfit-task](../webfit-task/SKILL.md) quando houver demanda de engenharia. Não refaça Specify/Plan/Tasks válidos e não implemente produto antes da aprovação específica do G5. Questões pendentes bloqueiam somente trabalho dependente.

## Salvar um checkpoint factual

Atualize no mesmo `docs/project/status.md`: data, branch, commit-base/HEAD observado, sincronização e sua fonte, última etapa concluída, próxima ação exata e checklist do gate afetado. Preserve a última etapa técnica relevante ao registrar manutenção do harness. Registre comandos/resultados por referência à evidência existente; não copie logs ou inventários extensos.

Não altere uma decisão humana, não marque etapa como executada sem resultado e não registre valores de secrets ou dados clínicos. Atividade de documentação não aprova G5 ou publicação. Atualize PROJECT-STATE somente se sua descrição derivada precisar de correção; a próxima ação deve apontar ao checkpoint canônico.

Verifique o diff e `git diff --check -- docs/project/status.md` (inclua outros arquivos realmente alterados); confira Git novamente e relate o checkpoint salvo e a próxima ação. Não crie Work Item/SDD para uma simples atualização documental.
