# V02 — Convenção uniforme para campos obrigatórios e opcionais

**Status: IMPLEMENTADO — checks locais concluídos; revisão independente e aceite pendentes.**
Data: 2026-10-08. Severidade da auditoria: P2 (avaliação do agente, não prioridade humana). Tipo: Clareza e acessibilidade.
Branch observada: main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd.
Versão auditada: 0.1.9-pilot.16.1. Identificador local: V02; sem Work Item Plane neste registro LIGHT de documentação.

## Origem e evidência

Maycon solicitou uma spec por problema identificado e registro pendente para resolver depois. O pedido original autorizou somente documentação; a retomada abaixo registra a autorização posterior.
Fontes: [auditoria completa](../../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md), [evidência e limites](../../../.harness/evidence/ui-audit/2026-10-08-pilot-16.md) e [índice do lote](../README.md).
source/App.tsx:1295,1302,1335–1344; capturas 05-patient-restored e 13-profile. Alguns rótulos indicam opcional, os obrigatórios não têm convenção explícita e Sexo não tem required nem indicação de opcional. Não houve envio para conferir validações.
As referências source/... apontam ao snapshot de comparação, não às linhas atuais do produto. Capturas/source estão em .artifacts/ui-audit/2026-10-08/, ignorados pelo Git; o relatório preserva o resumo versionável.

## Problema e resultado proposto

A interface não permite antecipar de forma consistente quais campos devem ser preenchidos.

Adotar uma convenção textual e acessível para obrigatoriedade, aplicada às regras vigentes; esclarecer formatos quando necessário.

## Escopo e restrições

Rótulos, instruções e atributos acessíveis de cadastro/edição de paciente e perfil em src/App.tsx. Nenhuma alteração em validação, obrigatoriedade de domínio ou banco.
Somente dados fictícios nos ensaios. Sem dependência nova, migração/schema, publicação ou mudança de arquitetura prevista. Reavaliar o escopo se a solução futura exigir qualquer uma dessas operações.

## Critérios de aceite do escopo autorizado

- **V02-AC01 — autorizado no escopo:** Dadas as regras aprovadas para a versão alvo, quando um formulário abre, então seus campos obrigatórios e opcionais podem ser identificados antes do envio por uma convenção explícita.
- **V02-AC02 — autorizado no escopo:** A informação de obrigatoriedade está disponível no nome ou descrição acessível e não depende somente de cor.
- **V02-AC03 — autorizado no escopo:** As validações existentes permanecem coerentes com as indicações; instruções de formato não contradizem os formatos aceitos.

## Dependências e decisões

[WEBFIT-5](../../003-webfit-5-cadastro-paciente/spec.md): cadastro mínimo possui decisões funcionais pendentes. Esta spec cobre apresentação, não substitui essa demanda nem antecipa sua lista de obrigatórios.

NEEDS-HUMAN-DECISION somente se a execução depender das regras propostas em WEBFIT-5. Até lá, usar a obrigatoriedade aprovada da versão alvo; não escolher campos clínicos por conta própria.
Nenhum requisito RF/TA canônico foi criado ou aprovado por esta spec.

## Trabalho pendente e verificação

- [x] Comparar o achado com a versão integrada escolhida; registrar se ainda ocorre, foi resolvido em outra demanda ou precisa ajustar escopo.
- [x] Reutilizar/criar a demanda Plane na retomada caso a execução seja STANDARD/STRICT, vinculando esta fonte sem criar especificação concorrente.
- [x] Validar decisões e critérios necessários; planejar os arquivos e checks da solução.
- [x] Implementar somente o escopo autorizado, preservando alterações preexistentes.
- [ ] Verificar critérios, obter revisão aplicável e aceite humano; atualizar esta spec e checkpoint.

Verificação futura: Mapear regra aprovada → campo → rótulo → validação; testar com fixtures os campos ausentes e opcionais informados; percorrer com teclado/leitor de tela. Validação de envio ainda pendente.
Verificação de produto no registro documental original: **NOT RUN**; os resultados da retomada estão abaixo. Esta spec não afirma correção, teste passado, READY TO SHIP ou conclusão de G5/G6/G7.


## Execução da retomada — 2026-10-08

Classificação: LIGHT. Requisitos aprovados relacionados: RF-PAT-001/003 e RF-CLI-001. Pedido explícito de Maycon nesta sessão para executar V01–V08 pelo webfit-task autoriza o escopo suficientemente definido; não equivale a aceite final. PLAN APPROVED BY SCOPE; sem schema, backend, dependência ou regra clínica alterada.

Discovery: código atual comparado com o achado; preservadas alterações preexistentes main/680fad5. Plan inline: menor mudança em src/App.tsx e/ou src/style.css, FormFeedback extra em V03; validar formatação/lint/TS/testes/build, contraste e inspeção proporcional.

Execução: Rótulos explícitos obrigatório/opcional, incluindo responsável quando habilitado; regras e required preservados. Sexo segue opcional nesta versão. WEBFIT-5 não antecipada.

Decisões locais de texto/token são AGENT-PROVISIONAL, reversíveis, confiança alta/impacto baixo; validação no aceite. Verificação/limites finais serão consolidados no índice, sem inferir aceite Windows.

## Verificação e Code Review da retomada

V02-AC01/02: PASS inspeção e SSR de rótulos/required; nome acessível deriva do label. AC03: atributos/validações preservados, envio/leitor de tela Windows NOT RUN. Sexo opcional da versão vigente; aprovação de WEBFIT-5 continua pendente e não bloqueia esta apresentação.

Checks compartilhados finais e pendências no [índice](../README.md#execução-sequencial--2026-10-08). Autorrevisão estática realizada; revisão independente indisponível nesta passagem e pendente, sem REVIEW PASSED/READY TO SHIP. Aceite humano e G5/G6/G7 permanecem separados.
