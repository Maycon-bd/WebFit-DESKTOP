# Pendências da auditoria visual — 2026-10-08

**Status do lote: oito implementações locais; decisão funcional V05 aprovada e executada.** Revisão independente e aceite/ensaio Windows pendentes. Registro original preservado como histórico; retomada autorizada por Maycon em 2026-10-08.

## Registro

Pedido de Maycon: “crie uma spec para cada problema encontrado, coloque como pendente para resolver depois”.
Classificação desta entrega: LIGHT documental, com Discovery/Plan inline e criação/revisão proporcional destes documentos. IDs V01–V08 são locais à auditoria, não IDs Plane ou novos requisitos aprovados.
Branch main; commit-base 680fad5616d54a895dbecc6702595a1b5d232cfd; HEAD/origin/main local 0/0, sem consulta ao remoto vivo ou Git mutável. Trabalho preexistente preservado.
Escopo: somente os oito achados da [auditoria atual](../../.impeccable/critique/2026-10-08T18-50-31Z__artifacts-ui-audit-2026-10-08-source-app-tsx.md); não incorpora automaticamente findings antigos ou observações secundárias.

## Specs

| Achado | Severidade | Spec | Estado |
| --- | --- | --- | --- |
| V01 | P1 | [Contraste do foco e dos contornos](V01-contraste/spec.md) | Implementado; revisão/aceite pendentes |
| V02 | P2 | [Convenção uniforme para campos obrigatórios e opcionais](V02-campos-obrigatorios/spec.md) | Implementado; revisão/aceite pendentes |
| V03 | P2 | [Feedback visível junto às ações de formulário](V03-feedback-formulario/spec.md) | Implementado; revisão/aceite pendentes |
| V04 | P2 | [Reduzir a altura ocupada pelo cabeçalho](V04-cabecalho/spec.md) | Implementado; revisão/aceite pendentes |
| V05 | P2 | [Avaliar saída neutra do modal de recuperação](V05-saida-recuperacao/spec.md) | Implementado / WEBFIT-13; revisão/aceite pendentes |
| V06 | P2 | [Explicar a preservação do rascunho ao sair da edição](V06-cancelar-edicao/spec.md) | Implementado; revisão/aceite pendentes |
| V07 | P2 | [Traduzir eventos de atualização na auditoria](V07-eventos-auditoria/spec.md) | Implementado; revisão/aceite pendentes |
| V08 | P2 | [Explicar a finalidade das tags no cadastro](V08-orientacao-tags/spec.md) | Implementado; revisão/aceite pendentes |

Severidade é avaliação da auditoria (um P1, sete P2); a ordem V01–V08 foi solicitada por Maycon na retomada.
Cada arquivo é a fonte única do problema neste lote; não há plan/tasks paralelos. Na futura execução, vinculá-lo ao item Plane apropriado e reutilizar as especificações existentes relacionadas.

## Limites e próxima ação do registro original (histórico)

V02 depende da obrigatoriedade aprovada da versão alvo e se relaciona à WEBFIT-5; não aprova seus campos mínimos. V05 altera o fluxo aprovado da WEBFIT-7 e exige decisão explícita; V06 propõe esclarecer retenção sem transformar saída em descarte.
V01 precisa comparar os ajustes locais posteriores da WEBFIT-10 antes de aplicar uma correção. V03 é risco inferido, com reprodução pendente.
A próxima ação é escolher um item para retomada, comparar a versão vigente, validar critérios/decisões e seguir o fluxo de execução. Todos permanecem pendentes até essa retomada. Não há resolução automática nem monitoramento agendado.

## Evidência documental original (histórico)

Criados: este índice e oito spec.md. Atualizado: checkpoint da trilha de auditoria em docs/project/status.md.
Checks documentais PASS: oito specs para os oito achados do relatório, IDs/aceite/status e dependências conferidos; 38 links relativos resolvidos e whitespace dos nove documentos verificado. git diff --check passou; avisos de normalização CRLF/LF em owners preexistentes, sem erro de whitespace. Nenhum owner de produto foi alterado por este registro.
Revisão: autorrevisão documental; revisão independente deste lote não realizada. Testes/build/UI do produto não executados porque comportamento não foi alterado.


## Execução sequencial — 2026-10-08

> Evidência da primeira passagem abaixo. Atualização vigente de V05/WEBFIT-13 ao final deste documento; bloqueio inicial e contagem de sete implementações foram superados pela aprovação humana.

Pedido explícito de Maycon: seguir webfit-task, uma spec após outra, registrar bloqueios e avançar; pendências para decisão humana ao final. main / HEAD 680fad5616d54a895dbecc6702595a1b5d232cfd / upstream local 0/0, sem fetch/pull. Alterações preexistentes WEBFIT-8/10/11, ativação e docs preservadas. Sem Git mutável, instalação, publicação, dependência ou mudança em Rust/schema.

V01/V02/V04/V06/V07/V08 LIGHT (apresentação dentro de requisitos aprovados); V03 STANDARD / WEBFIT-12; V05 Discovery parcial STRICT / WEBFIT-13 Blocked. Busca Plane confirmou ausência de correspondentes; exatamente dois itens criados, prioridade neutra. Specs existentes reutilizadas, sem task/spec concorrente. Os critérios de apresentação definidos foram autorizados pelo pedido no escopo de Maycon; isso não aprova cadastro mínimo WEBFIT-5 nem saída neutra WEBFIT-7.

| Item | Implementação / evidência | Pendência específica |
| --- | --- | --- |
| V01 | Tokens funcionais #65796a/#245840; contraste mínimo 3,46/6,11:1 sobre fundos claros CSS. Danger 3,49:1 mínimo. | Foco/recorte/estados por teclado no Windows. |
| V02 | Rótulos obrigatório/opcional conforme RF-PAT-001/003 e RF-CLI-001; SSR PASS. | Leitor de tela/envio; WEBFIT-5 continua separada, sem impedir este ajuste. |
| V03 / WEBFIT-12 | FormFeedback junto às ações, status único, foco/scroll de erro e guarda de duplo envio. 3 unitários + fixtures SSR PASS. | Backend com falha, envio duplicado, validação nativa e foco/rolagem/anúncios no WebView. |
| V04 | Menu/tutorial na mesma faixa flexível, margens/padding reduzidos. | Medir primeiro campo antes/depois a 1202×832; 1366×768/200%, menu aberto/recolhido. |
| V05 / WEBFIT-13 | Sem alteração; proposta bloqueada. | Decidir saída neutra/destinos/Escape antes de atualizar RF-DRF-002/TA-DRF-010. |
| V06 | Voltar à lista e descrição da retenção; saída bloqueada durante operação. | Ensaio fictício edição/saída/reentrada e falha autosave. |
| V07 | UPDATE_PREPARE, UPDATE_INSTALL_START e UPDATE_INSTALL traduzidos conforme backend; fallback/códigos preservados. | Auditoria renderizada com fixtures/Windows; sem update real. |
| V08 | Orientação neutra e acessível para tags opcionais/seleção/criação. | Ensaio vazio/com tags/criação/seleção no Windows. |

### Checks e limites

- PASS: npm run check (lint/TypeScript/18 testes/build), npm test final 21/21 incluindo 3 regressões V03; npm run format:check final; cargo fmt; cargo clippy --offline -- -D warnings; cargo test --offline com TEMP/TMP isolados 28/28 Rust/SQLite/migrações/backup; build Tauri release --no-bundle --offline final PASS; detector Impeccable [] e git diff --check.
- PASS: fixtures SSR extraídas das funções atuais de paciente/perfil, 28 asserções de conteúdo/posição do feedback/rótulos/descrições, sem I/O. Scripts/HTML/logs temporários em .artifacts/ui-refinement/; não são teste DOM/integração ou artefatos distribuídos. Regressão persistente: tests/unit/form-feedback.test.ts.
- FAIL inicial registrado/corrigido: TypeScript por variável contextualFeedback ausente, corrigida antes dos resultados PASS. Rust TEMP padrão 21/28, sete STORAGE em backup; repetição com TEMP no workspace 28/28, consistente com limitação de ambiente histórica, sem alterar/afrouxar testes. Não comprova causa definitiva do TEMP padrão.
- WARNING: chunk JS 544,69 kB; cache sem hardlink e PDB OpenSSL ausente no linker. Sem refatoração adjacente.
- NOT RUN: inspeção visual/DOM, ensaio nativo Windows/WebView, NVDA, foco/scroll e 200%, integridade da entrega instalada/distribuição. Build não comprova esses critérios.
- Autorrevisão: escopo/diff efetivo/código novo/contratos/fallbacks/erros/sem alteração de dados verificados. Segurança estática: sem SQL/credencial/I/O novo, renderização React escapa texto; controles backend preservados. Revisão independente pendente; **CODE REVIEW INCOMPLETE**, sem REVIEW PASSED/READY TO SHIP, sem Done/aceite/Gates.

### Decisões a resolver

V05 NEEDS-HUMAN-DECISION: manter fluxo binário ou permitir Voltar sem aplicar/excluir rascunho? Recomendação: permitir ação explícita; paciente → lista, perfil → lista de pacientes, prescrição → cadastro do paciente; Escape equivalente a Voltar, clique externo inerte. Alternativa manter comportamento atual/encerrar proposta. Recomendação não aplicada nem aprovada.

AGENT-PROVISIONAL, confiança alta/impacto baixo/reversível: sete escolhas locais (paleta funcional, convenção textual vigente, feedback contextual sem duplicação, compactação conservadora, saída explicada sem descarte, traduções conferidas, tags com orientação neutra). Validar no aceite final; nenhuma apresentada como aprovação humana. Sem mudança de domínio ou arquitetura.

### Inventário e próxima ação

Produto: src/App.tsx, src/style.css, novo src/FormFeedback.tsx. Teste: novo tests/unit/form-feedback.test.ts. Documentação: este índice e oito specs, docs/ux/flows.md (apresentação), docs/requirements/traceability.md (mapeamento), docs/project/status.md (checkpoint). Mudanças preexistentes nos mesmos owners preservadas. Versão de fonte 0.1.8 inalterada; base auditada instalada 0.1.9-pilot.16.1 não substituída.

Próxima ação: Maycon decidir V05; revisar as sete escolhas de apresentação no aceite, obter review independente e ensaiar fixtures/teclado/zoom no candidato integrado pelo seu fluxo. G5 em execução, G6/G7 não concluídos.

## V05 / WEBFIT-13 — aprovação e execução posterior

Maycon aprovou a recomendação anotada em 2026-10-08 (“Faça isso”): D-DRF-EXIT-001 ACCEPTED. Oito specs têm implementação local; nenhum bloqueio funcional restante identificado neste lote. Voltar/Escape preservam o rascunho sem API de gravação/exclusão/restauração: paciente/perfil → lista, prescrição → paciente; clique externo inerte; ações bloqueadas durante operação. Foco no título, com tentativa após concluir consulta de contexto para não focar elemento removido pelo loading.

Arquivos desta continuação: src/App.tsx, src/DraftRecoveryDialog.tsx, novo tests/unit/draft-recovery.test.ts; spec V05, spec histórica WEBFIT-7 (refinamento), RF-DRF-002/TA-DRF-010, casos de uso, fluxo, rastreabilidade, decision-log/ledger e checkpoint. Sem schema/Rust/dependência/Git/publicação.

Verificação final V05: npm run check PASS (lint/TS/24 Node, três novos testes V05/build Vite); formatação PASS e detector []. Rust/SQLite 28/28, fmt/clippy da passagem anterior reutilizados porque fontes/entradas backend permanecem iguais. Build Tauri final PASS (release sem bundle, 1m41s). Aviso Vite chunk 545,39 kB; cache/PDB existentes. Testes executam handlers reais com fronteiras lifecycle/document/state simuladas; não comprovam foco/showModal/teclado/reentrada/reinício no WebView.

Autorrevisão: sem API na saída, rascunhos/registro/resolução preservados, consulta existente de reentrada e foco por contexto conferidos. Revisão independente e ensaio Windows/NVDA/200% pendentes; CODE REVIEW INCOMPLETE, sem READY TO SHIP/Done/aceite final. Próxima ação: review independente e ensaio fictício dos oito itens no candidato integrado pelo fluxo humano; nenhuma decisão adicional V05 necessária.
