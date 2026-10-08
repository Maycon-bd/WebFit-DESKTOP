# V03 — Feedback visível junto às ações de formulário

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: Estados, erro e recuperação.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V03; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/App.tsx:266,273,755–765,1490; captura 06-patient-actions. Salvar fica no rodapé, mensagens globais antes do conteúdo, sem scroll/foco de correção em task. Risco inferido por código e geometria; não houve reprodução de falha de envio.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

Quem envia o formulário no fim da página pode não perceber progresso, falha ou sucesso.

Exibir feedback relevante perto das ações e conectar falhas de validação aos campos ou a um resumo acessível, com condução de foco quando apropriada.

## Escopo e restrições

src/App.tsx e estilos associados para cadastro/edição de paciente e perfil; estados ocupado, sucesso, erro de validação e falha de operação.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V03-AC01 — autorizado no escopo:** Dado envio a partir do rodapé, quando a operação está em andamento, então há indicação perceptível de progresso e prevenção de envio duplicado.
- **V03-AC02 — autorizado no escopo:** Dada falha de operação, então uma mensagem segura aparece perto das ações ou em região conduzida ao usuário, é anunciável e preserva o preenchimento para nova tentativa.
- **V03-AC03 — autorizado no escopo:** Dada falha de validação, então o resumo ou campo identifica o problema e permite alcançar sua correção por teclado; sucesso só é mostrado após confirmação efetiva.

## Dependências e decisões

Regras vigentes de perfil/paciente e mecanismo task. Considerar V02 para nomes/instruções e V04 para geometria; cada critério continua rastreado neste item.

AGENT-PROVISIONAL: feedback contextual sem duplicar anúncios. Confirmar a reprodução antes de tratar o risco inferido como bug comprovado.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Reproduzir primeiro com fixtures falhas de validação e de backend; verificar envio duplicado, recuperação, foco e anúncios no Windows com formulário rolado. Acrescentar regressão observável quando viável.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Execução da retomada — 2026-10-08

Classificação: STANDARD / WEBFIT-12. Requisitos aprovados relacionados: RF-PAT-001/003 e RF-CLI-001. Pedido explícito de Maycon nesta sessão para executar V01–V08 pelo webfit-task autoriza o escopo suficientemente definido; não equivale a aceite final. PLAN APPROVED BY SCOPE; sem schema, backend, dependência ou regra clínica alterada.

Discovery: código atual comparado com o achado; preservadas alterações preexistentes main/680fad5. Plan inline: menor mudança em src/App.tsx e/ou src/style.css, FormFeedback extra em V03; validar formatação/lint/TS/testes/build, contraste e inspeção proporcional.

Execução: FormFeedback junto às ações, progresso/sucesso em status, erro com foco/rolagem, sem duplicação global quando formulário ativo; guarda síncrona contra duplo envio. Validação nativa mantém foco no campo inválido.

Decisões locais de texto/token são AGENT-PROVISIONAL, reversíveis, confiança alta/impacto baixo; validação no aceite. Verificação/limites finais serão consolidados no índice, sem inferir aceite Windows.

## Verificação e Code Review da retomada

V03-AC01/02/03: progresso/sucesso/erro renderizados nos formulários por fixtures SSR (28 asserções compartilhadas), 3 regressões unitárias do componente PASS. Guardas de envio e foco/scroll conferidos no código. Erros de backend/envio duplicado real/validação DOM e foco/rolagem/anúncio Windows NOT RUN; não confundir SSR com integração.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
