# V07 — Traduzir eventos de atualização na auditoria

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: Vocabulário e apresentação.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V07; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/App.tsx:82,2232,2238; árvore acessível 12-account-menu.txt. UPDATE_INSTALL_START e UPDATE_PREPARE aparecem como rótulos por ausência no mapa de traduções.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

Identificadores técnicos em inglês aparecem na lista de eventos destinada ao usuário.

Apresentar descrições claras em português brasileiro para os eventos conhecidos de atualização, preservando seus identificadores técnicos.

## Escopo e restrições

Mapa e renderização de eventos em src/App.tsx. Sem modificar schema, registros históricos, payloads ou semântica da auditoria.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V07-AC01 — autorizado no escopo:** Dadas fixtures com UPDATE_INSTALL_START e UPDATE_PREPARE, a lista e seus nomes acessíveis apresentam descrições em português que correspondem à etapa real.
- **V07-AC02 — autorizado no escopo:** Filtros, ordem e detalhe continuam coerentes com o evento original; o código técnico permanece disponível em detalhe se necessário ao diagnóstico.
- **V07-AC03 — autorizado no escopo:** Um evento desconhecido continua consultável por fallback seguro, sem ser ocultado ou receber tradução com significado inventado.

## Dependências e decisões

RF-AUD-001 e RF-UPD-001; respeitar eventos existentes e proteções de dados sensíveis.

AGENT-PROVISIONAL: vocabulário de interface em português; validar textos com os eventos reais, sem adicionar eventos ou alterar auditoria.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Conferir significados no backend vigente; testar renderização dos dois eventos e um desconhecido; ensaio visual/árvore acessível com fixtures, sem iniciar atualização real.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Retomada — 2026-10-08

LIGHT, apresentação dentro de RF-AUD-001, RF-UPD-001 aprovados. Pedido explícito desta sessão autoriza escopo definido; PLAN APPROVED BY SCOPE. Discovery confirmou implementação vigente; Plan inline: menor mudança em src/App.tsx, preservar domínio/I/O, checks frontend e revisão de consistência.

Execução: Mapa inclui UPDATE_PREPARE (preparação com backup), UPDATE_INSTALL_START (início) e UPDATE_INSTALL (etapa instalação). Significados conferidos em service.rs; fallback e códigos originais preservados em filtros/detalhes.

Texto selecionado AGENT-PROVISIONAL, confiança alta, baixo impacto/reversível, validação no aceite final. Checks e limites finais no índice do lote. Review independente e ensaio Windows pendentes.

## Verificação e Code Review da retomada

V07-AC01..03: PASS inspeção do mapa compartilhado por filtros/lista/detalhe contra service.rs: três eventos conhecidos traduzidos, identificadores dos filtros e fallback desconhecido mantidos. Renderização de auditoria com fixtures/ensaio Windows NOT RUN; nenhuma atualização real iniciada.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
