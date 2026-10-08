# V04 — Reduzir a altura ocupada pelo cabeçalho

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: Composição e eficiência.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V04; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/App.tsx:732,749,752; source/style.css:222,228,841; capturas 05-patient-restored, 08-backup e 13-profile. Primeiro campo aproximadamente a 430px do topo na captura 1202×832. Ampliação de 200% não verificada.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

Menu, tutorial, aviso de dados fictícios e título ocupam faixas sucessivas e reduzem a área inicial de trabalho.

Compactar espaçamentos e avaliar alinhamento de menu/tutorial numa faixa, mantendo orientação, avisos e legibilidade.

## Escopo e restrições

Shell/cabeçalho de src/App.tsx e src/style.css; cadastro, perfil e ferramentas. Sem alterar navegação aprovada, conteúdo clínico ou dividir o formulário em etapas.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V04-AC01 — autorizado no escopo:** Na mesma janela de 1202×832 e no mesmo estado do piloto de referência, a posição do primeiro campo melhora em relação à captura 05, com medição antes/depois registrada.
- **V04-AC02 — autorizado no escopo:** Aviso de ambiente fictício, título e ações continuam disponíveis e legíveis; menu recolhido/aberto não provoca sobreposição ou recorte.
- **V04-AC03 — autorizado no escopo:** Em 1366×768 e ampliação suportada de 200%, todos os controles permanecem alcançáveis por teclado e rolagem, sem conteúdo encoberto pelo cabeçalho.

## Dependências e decisões

[WEBFIT-4](../../002-webfit-4-navegacao-consultorio/spec.md), WEBFIT-6 e WEBFIT-9: preservar informações globais, tutorial e faixa de atualização; checar a versão integrada.

AGENT-PROVISIONAL: compactação conservadora. Não há altura final ou redesign aprovado; definir solução verificável na retomada.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Capturas comparáveis antes/depois; medir posição do primeiro campo; ensaiar janelas, menu e ampliação real suportada no Windows. Não inferir reprovação a 200% do ensaio anterior.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Retomada — 2026-10-08

LIGHT; RF-UX-003 e RF-UX-001 vigentes. PLAN APPROVED BY SCOPE pelo pedido explícito desta sessão. Menu e tutorial na mesma faixa flexível; toolbar 56px, aviso com padding 8px/margem 18px e título com margem 20px. Redução nominal de espaçamentos; medição visual antes/depois e 200% ainda NOT RUN, sem declarar AC01/03 cumpridos. Sem alterar navegação, tutorial ou faixa updater. Arquivos src/App.tsx/src/style.css. Escolha AGENT-PROVISIONAL conservadora, reversível, baixo impacto.

## Verificação e Code Review da retomada

V04-AC01/03: NOT RUN medição visual de primeiro campo e 1366×768/200%. AC02: inspeção estática confirma manutenção de conteúdo/ações e flex-wrap; resultado visual não confirmado.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
