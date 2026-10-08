# V01 — Contraste do foco e dos contornos

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P1 (avaliação do agente, não prioridade humana). Tipo: Acessibilidade.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V01; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/style.css:54,67; capturas 01-login, 05-patient-restored e 15-keyboard-focus. Foco #8fb19e: 2,35:1 sobre branco e 2,16:1 sobre #f5f6f2; contorno #a9b8ac: 2,07:1 e 1,91:1. Cálculo de cores associado à inspeção visual; não é certificação WCAG.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

O foco e os contornos necessários para identificar controles têm contraste insuficiente nos fundos auditados.

Ajustar tokens de foco e contorno para atingir pelo menos 3:1 nas superfícies efetivamente usadas, preservando a identidade visual.

## Escopo e restrições

src/style.css e estilos de controles afetados; login, cadastro e perfil. Separadores decorativos não são tratados como contornos funcionais.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V01-AC01 — autorizado no escopo:** Dado um controle cujo contorno seja necessário para identificá-lo, quando exibido em cada superfície usada, então o contraste entre contorno e cor adjacente será pelo menos 3:1.
- **V01-AC02 — autorizado no escopo:** Dado um controle alcançado por Tab ou Shift+Tab, quando recebe foco, então o indicador permanece visível, sem recorte, e atinge pelo menos 3:1 em relação às cores adjacentes.
- **V01-AC03 — autorizado no escopo:** Os estados de erro, desabilitado e seleção continuam distinguíveis; texto e botão primário não sofrem regressão.

## Dependências e decisões

WEBFIT-8 (marca) e WEBFIT-10 (superfícies novas). WEBFIT-10 já registra ajuste de foco local: comparar o estado integrado antes de corrigir; não reaplicar automaticamente a cor do piloto.

AGENT-PROVISIONAL: priorizar contraste funcional preservando a paleta. Revalidar o defeito na versão selecionada para execução; esta spec não aprova redesenho.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Calcular pares finais dos tokens; percorrer controles por teclado no Windows; verificar foco/recorte em 1366×768 e ampliação de 200% suportada. Esses ensaios ainda não foram executados.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Execução da retomada — 2026-10-08

Classificação: LIGHT. Requisitos aprovados relacionados: RF-UX-003/004. Pedido explícito de Maycon nesta sessão para executar V01–V08 pelo webfit-task autoriza o escopo suficientemente definido; não equivale a aceite final. PLAN APPROVED BY SCOPE; sem schema, backend, dependência ou regra clínica alterada.

Discovery: código atual comparado com o achado; preservadas alterações preexistentes main/680fad5. Plan inline: menor mudança em src/App.tsx e/ou src/style.css, FormFeedback extra em V03; validar formatação/lint/TS/testes/build, contraste e inspeção proporcional.

Execução: Tokens --focus #245840 e --control-line #65796a em controles funcionais; foco inclui links/summary; separadores continuam --line. Comparação local confirmou defeito geral ainda presente.

Decisões locais de texto/token são AGENT-PROVISIONAL, reversíveis, confiança alta/impacto baixo; validação no aceite. Verificação/limites finais serão consolidados no índice, sem inferir aceite Windows.

## Verificação e Code Review da retomada

V01-AC01: PASS matemático para fundos claros declarados: contorno #65796a mínimo 3,46:1, foco #245840 mínimo 6,11:1, ação danger #a26357 mínimo 3,49:1. AC02/03: inspeção estática parcial; teclado/recorte/estados Windows NOT RUN.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
