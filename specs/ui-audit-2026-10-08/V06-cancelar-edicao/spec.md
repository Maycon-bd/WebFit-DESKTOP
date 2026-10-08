# V06 — Explicar a preservação do rascunho ao sair da edição

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: Clareza de ação.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V06; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/App.tsx:1495,879. Callback de Cancelar edição salva o preenchimento dirty antes de sair. Retenção verificada por código; não houve ensaio com novos valores.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

Cancelar edição pode ser entendido como descarte, embora o preenchimento permaneça disponível para recuperação.

Esclarecer no rótulo, instrução ou feedback que sair mantém o rascunho e não salva as alterações no registro definitivo. Preservar autosave e descarte explícito.

## Escopo e restrições

Texto e feedback da saída de edição em src/App.tsx; conferir a mesma semântica nos contextos já cobertos. Sem mudar política de autosave.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V06-AC01 — autorizado no escopo:** Antes ou no momento de sair, a interface deixa claro que alterações não são confirmadas no registro e que o preenchimento fica disponível como rascunho.
- **V06-AC02 — autorizado no escopo:** Após editar uma fixture e sair sem salvar o registro, o registro persistido permanece inalterado e a reentrada permite recuperar o preenchimento.
- **V06-AC03 — autorizado no escopo:** Não ocorre descarte automático por esta ação; falha ao preservar o rascunho não apresenta uma confirmação falsa de retenção.

## Dependências e decisões

[WEBFIT-7](../../007-recuperar-rascunho-contextual/spec.md) e regras de autosave; V05 trata de saída do modal, enquanto V06 trata do significado da ação no formulário.

AGENT-PROVISIONAL: corrigir clareza preservando retenção. Qualquer intenção de transformar Cancelar em descarte exige nova decisão explícita; não integra esta proposta.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Caracterizar a saída atual; ensaiar edição/saída/reentrada e falha de autosave com fixtures; conferir rótulo, teclado e anúncio. Efeito ainda não ensaiado nativamente pela auditoria.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Retomada — 2026-10-08

LIGHT, apresentação dentro de RF-PAT-003, RF-DRF-001/002 aprovados. Pedido explícito desta sessão autoriza escopo definido; PLAN APPROVED BY SCOPE. Discovery confirmou implementação vigente; Plan inline: menor mudança em src/App.tsx, preservar domínio/I/O, checks frontend e revisão de consistência.

Execução: Cancelar edição agora Voltar à lista; ambos os botões descrevem a retenção antes da saída e falha mantém formulário. Somente copy e disabled durante operação; autosave/persistência preservados.

Texto selecionado AGENT-PROVISIONAL, confiança alta, baixo impacto/reversível, validação no aceite final. Checks e limites finais no índice do lote. Review independente e ensaio Windows pendentes.

## Verificação e Code Review da retomada

V06-AC01: PASS copy/descrição acessível e SSR. AC02/03: callbacks de retenção/erro preservados, inspeção estática; edição/saída/reentrada e falha real de autosave NOT RUN. Texto descreve o comportamento vigente, não transforma saída em descarte.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
