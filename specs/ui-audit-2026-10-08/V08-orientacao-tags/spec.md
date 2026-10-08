# V08 — Explicar a finalidade das tags no cadastro

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: Texto de interface e carga cognitiva.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V08; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/App.tsx:1398,1457,1462,1479; captura 06-patient-actions. Nova tag/Criar tag aparecem sem explicação contextual de finalidade.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

Quem está começando não recebe orientação para entender por que selecionar ou criar tags.

Acrescentar uma explicação curta sobre organização de pacientes e um exemplo neutro compatível com a função aprovada.

## Escopo e restrições

Texto contextual da seção de tags em src/App.tsx; estados sem tags, seleção e criação. Sem alterar modelo, criar tags automaticamente ou inventar taxonomia clínica.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V08-AC01 — autorizado no escopo:** Na seção de tags, uma instrução curta explica a finalidade antes da primeira criação e permanece disponível a tecnologia assistiva.
- **V08-AC02 — autorizado no escopo:** A orientação permite compreender seleção de tags existentes e criação de novas, sem indicar que preenchimento é obrigatório quando não for.
- **V08-AC03 — autorizado no escopo:** Exemplo, se usado, não estabelece regra clínica, categoria automática ou dado persistido; criação/seleção/desativação continuam conforme RF-PAT-005.

## Dependências e decisões

RF-PAT-005; [WEBFIT-5](../../003-webfit-5-cadastro-paciente/spec.md) somente para coerência da apresentação do cadastro.

AGENT-PROVISIONAL: orientação neutra, sem exemplo clínico obrigatório. Texto final será definido na execução e validado no aceite.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Revisar texto contra RF-PAT-005; conferir estado vazio e com tags, nome/descrição acessível e regressão básica de seleção/criação usando fixtures.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Retomada — 2026-10-08

LIGHT, apresentação dentro de RF-PAT-005 aprovados. Pedido explícito desta sessão autoriza escopo definido; PLAN APPROVED BY SCOPE. Discovery confirmou implementação vigente; Plan inline: menor mudança em src/App.tsx, preservar domínio/I/O, checks frontend e revisão de consistência.

Execução: Orientação neutra de etiquetas opcionais; seleção/criação explicadas, grupo de tags e campo de nova tag associados ao texto por aria-describedby. Sem taxonomia/exemplo clínico ou criação automática.

Texto selecionado AGENT-PROVISIONAL, confiança alta, baixo impacto/reversível, validação no aceite final. Checks e limites finais no índice do lote. Review independente e ensaio Windows pendentes.

## Verificação e Code Review da retomada

V08-AC01/02/03: PASS copy neutra, associação aria-describedby e SSR. Operações de tags preservadas; ensaio de criação/seleção/vazio no Windows NOT RUN.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
