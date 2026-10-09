# N04 — Desfazer inclusão de refeição

- Data: 2026-10-09.
- Status: **PROPOSTA PENDENTE — P2 da auditoria, não prioridade humana**.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

Refeição adicionada sem remoção local observada na auditoria; conteúdo atual precisa revalidação.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Definir reversão para refeição vazia/preenchida preservando o restante; confirmar compatibilidade com requisitos antes de implementar.

## Restrições e decisões

Revalidar achado no código/candidato vigente; não autorizar regra clínica ou implementação pela criação deste documento.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Inclusão acidental reversível conforme comportamento aprovado.
- [ ] conteúdo preenchido protegido.
- [ ] teclado/foco e demais refeições preservados.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Retomar Discovery do achado, vincular item Plane pertinente e decisões necessárias antes de execução.

## Detalhamento para retomada

### Objetivo, atores e entradas

Permitir corrigir inclusão acidental de refeição preservando o restante do cardápio. A auditoria identifica falta de remoção local; revalidar na árvore atual antes de adicionar ação.

Prescrição editável, refeições vazias/preenchidas, alimentos/porções fictícios e prescrição finalizada. Identidade e ordem das refeições precisam ser preservadas conforme contrato atual.

### Fluxo de trabalho previsto

1. Revalidar ação existente e estado de edição/finalização; conferir requisito de montagem e invariantes do cardápio.
2. Definir remoção de refeição vazia e tratamento de conteúdo preenchido, com confirmação/desfazer proporcional a decidir.
3. Definir restrição de última refeição, se houver regra aprovada; não inventar mínimo.
4. Especificar nome acessível da ação, posição e destino do foco após remover.
5. Garantir atualização dos totais e autosave contextual sem afetar refeições alheias.
6. Ensaiar cancelar remoção, salvar/reabrir e estado finalizado sem edição permitida.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| N04-C01 | Refeição vazia acidental | Remover | Só refeição alvo sai; foco fica em destino útil |
| N04-C02 | Refeição com alimentos | Iniciar remoção e cancelar | Conteúdo permanece intacto |
| N04-C03 | Remoção preenchida autorizada | Confirmar | Refeição alvo removida, totais e demais refeições corretos |
| N04-C04 | Última refeição | Solicitar remoção | Regra aprovada explícita, sem mínimo arbitrário |
| N04-C05 | Prescrição finalizada | Acessar ações | Imutabilidade aprovada preservada |
| N04-C06 | Cardápio editado | Salvar/reabrir ou recuperar autosave | Resultado conforme semântica aprovada |

### Fronteiras técnicas e verificação

Alvos: editor de refeições em src/App.tsx, tipos API, cálculo nutricional e rascunho existentes. Verificar se remoção antes do salvamento é alteração local de payload ou precisa comando específico; não presumir nova migration.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

NEEDS-HUMAN-DECISION quando tratamento de conteúdo preenchido/última refeição não estiver definido. Remoção local não pode contornar imutabilidade de prescrição finalizada. Evitar nova infraestrutura de undo global para uma ação localizada.

### Entrega e evidência esperadas

Comportamento de remoção aprovado, cenários vazia/preenchida/cancelamento/última/finalizada, foco/teclado e persistência/autosave testados. Auditoria é origem da proposta, não autorização clínica ou implementação.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [critique/2026-10-08T22-48-16Z_src-app-tsx.md](../../.impeccable/critique/2026-10-08T22-48-16Z_src-app-tsx.md).

