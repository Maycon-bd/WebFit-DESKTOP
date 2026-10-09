# Implementation Plan: Primeiro incremento de Saúde

## Reinício de tutoriais — 2026-10-09

Pedido explícito de Maycon com captura: remover Ver tutorial fixo e permitir reset para ensinar novamente ao entrar nas telas. RF-UX-001/DEC-046/TA-UX-TUT-001/T114; reuso deste incremento, sem item/spec concorrente. PLAN APPROVED BY SCOPE para Configurações → Reiniciar tutoriais do usuário conectado; frontend e settings existentes, sem migration/schema/dependência/regra clínica. Registro de replay fixo supersedido no decision-log; ensino automático/Pular/Concluir preservados.

Implementado: Action ResetTours passa pela autorização/licença/troca de senha existentes, exclui somente prefixo tour:v1:user.id derivado no backend com SQL parametrizado; idempotente. App fornece ação/descrição em Configurações com feedback de operação existente, sem duplicar avisos; GuidedTour remove replay fixo e conserva restauração do foco anterior. Toolbar vazia escondida quando lateral aberta, tour montado fora dela. Configurações não tem tour: ao sair, GuidedTour remonta e consulta as preferências reiniciadas. Cada tela volta a ensinar uma vez após reset, não em loop depois de concluir/pular.

Entrada: feature/pbi-001-primeiro-incremento-saude/818d097edcf473061fb634eb473f7c64a1f56af0, referência local upstream alinhada, sem fetch. Alterações preexistentes de menu/cadastro/componentes/FoodPicker/harness preservadas. Somente fixtures, fonte 0.1.10, nenhuma distribuição/Git mutável/instalação clínica aberta. Plane indisponível, sincronização degradada; reuso da rastreabilidade vigente.

Checks finais: npm run check PASS (lint/TypeScript/43 Node/build Vite), npm run format:check PASS. Cargo fmt check, cargo test --locked --offline (46/46) e Clippy all-targets -D warnings PASS em Rust1.98.1/cache isolado/TEMP fictício da sessão. Teste tours_require_authorization_and_persist_per_user_without_migration cobre acesso negado, repetição, reinício/reabertura e preservação de outro usuário/preferência alheia; guided-tour.test.ts SSR comprova ausência de replay e manutenção de Pular/Próximo/diálogo/erro. Detector Impeccable [] e diff PASS. Build Tauri `--debug --no-bundle -- --locked --offline` PASS, executável em .tools/patient-native-target/debug/webfit-desktop.exe; sem instalador/publicação. Bundle551,53 kB WARNING; warnings ambientais de cache/PDB OpenSSL/colisão bin-lib/STATIC_VCRUNTIME registrados, sem falha de compilação. Logs ignorados .tools/tutorial-native-test.log, tutorial-clippy.log e tutorial-build.log. Sem alteração de dependências.

Review independente review_patient sem finding concreto: backend autorizado/isolado, consulta nova após sair de Configurações, Pular/Concluir/foco e tour fora da toolbar ocultável. Revisão estática/SSR não prova foco/posicionamento/interação reais na WebView. Ensaio Windows/zoom/leitor de tela NOT RUN; nenhum aceite humano ou gate inferido. REVIEW PASSED WITH WARNINGS, sem READY TO SHIP enquanto ensaio integrado pendente. Arquivos: App/GuidedTour/style, service/tests.rs, guided-tour.test.ts, fontes requisito/aceite/rastreabilidade/DEC-046/tasks/status e este plano.

Próxima ação: ensaiar reinício em Configurações e entrada nas oito telas com fixtures, Pular/Concluir e outro usuário preservado, após integração pelo humano; sem commit/push/publicação automática.

**Branch**: `feature/pbi-001-primeiro-incremento-saude` | **Date**: 2026-09-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-primeiro-incremento-saude/spec.md`

## Summary

### Retomada de auditoria, recuperação e catálogo — 2026-10-08

Maycon solicitou iniciar as pendências de catálogo/TACO, auditoria e backup/restauração e confirmou que possui autorização TBCA, autorizando prosseguir. Confirmação humana registrada; documento/licença da fonte não foi inspecionado. Continuidade nos artefatos aprovados por DEC-045, com vínculo Plane pendente por indisponibilidade da ferramenta; nenhum ID inventado ou item legado reaberto. Branch atual main; alterações simultâneas WEBFIT-5 preservadas, sem assumir seu aceite.

RF-AUD-001 / TA-AUD-003..015: restringir lista/detalhe ao espaço HEALTH, conservar cursor em falha recuperável e cobrir filtros AND, imutabilidade, autorização, paginação e falha transacional. RF-BKP-001..003 / TA-BKP-001..005: corrigir limpeza de temporários/publicação que falha em auditoria, registrar falhas automáticas como SYSTEM e não ocultar erros de leitura do estado; atualizar estado após falha manual e apresentar alerta na sessão. Testes isolados com fixtures, sem banco de instalação. Sem nova migração/dependência, preservando a compatibilidade de restore em trabalho pela WEBFIT-5. Checks frontend, Rust/SQLite, formatação e build aplicáveis; ausência de toolchain/ensaio nativo será registrada, não representada como PASS.

RF-PRE-002 / RN-PRE-001/002: obter o catálogo autorizado completo, preservar códigos/origem/preparação/unidades e ausências nutricionais; TACO somente após demonstrar ausência do item na TBCA completa. A fonte pública retornou HTTP 429 na investigação; não contornar bloqueio nem inferir catálogo completo a partir dos 88 itens locais. Importação depende de fonte íntegra/acessível; implementação independente de auditoria/backup continua.

RF-UX-002: reutilizar Setup/Login e autorização existentes, sem migração ou dependência nova. Componente LoginInfo com botão SVG e dialog nativo para foco/Escape; getVersion da API Tauri para versão instalada e package.json como fallback de preview web. Nome admin fixado somente no payload de preparação de instalações novas, sem renomear contas existentes. Formulário administrativo separado da tela normal de acesso.

O primeiro incremento entrega o núcleo operacional do espaço Saúde em uma instalação local e offline: autenticação e sessão, perfil profissional, pacientes, rascunhos protegidos, plano alimentar/orientações, auditoria e backup/restauração. O plano organiza a execução vertical desses fluxos, mas segue a direção aceita pelo ADR-0001 e a execução G5 autorizada pela DEC-045. Educação, sincronização entre máquinas, nuvem e colaboração ficam fora. A distribuição do canal piloto é uma trilha operacional separada, aprovada pelo ADR-0002, sem alterar o escopo clínico.

## Technical Context

**Language/Version**: Rust na fronteira local e TypeScript na interface; direção aceita pelo ADR-0001, com versões exatas a serem fixadas no G5.

**Primary Dependencies**: A fundação aceita Tauri 2, React, TypeScript, Vite, Rust, SQLite/SQLCipher e DPAPI. DEC-050 retoma o updater nativo no produto com tauri-plugin-updater 2.12.0 e lockfile fixado; origem/licença/permissões no inventário de componentes. Spike continua separado. Segredos já cadastrados segundo confirmação do usuário; uso no pipeline, ativação e distribuição externa exigem revisão final.

**Storage**: Persistência local embarcada; SQLCipher Community com DPAPI CurrentUser é a direção aceita pelo ADR-0001. Não usar banco em pasta de rede ou sincronizada.

**Testing**: Testes unitários de domínio, integração de persistência, contrato de comandos, aceitação dos TA-* e ensaios de backup/restauração; ferramentas definitivas dependem do spike.

**Target Platform**: Windows 10 x64, computador único por instalação, núcleo Saúde funcional sem internet.

**Project Type**: Aplicação desktop local/offline.

**Performance Goals**: Abertura até 5 s; pesquisa/abertura de paciente até 1 s no p95; salvamento comum até 2 s no p95, usando a base fictícia de 2.400 pacientes.

**Constraints**: Dados de saúde sensíveis; autorização na fronteira confiável; nenhum segredo ou dado clínico em logs; instantes UTC; foreign keys, transações e consultas parametrizadas; backup por snapshot consistente; restauração validada e confirmada; sem SQL genérico na interface.

**Scale/Scope**: Dois papéis locais com acesso total no MVP, espaço Saúde, primeiro incremento funcional, dados fictícios, um computador por instalação. Educação e múltiplas máquinas são evolução separada.

## Constitution Check

*GATE: PASS para iniciar execução G5: G4/ADR-0001 aceitos; Implementation Approval e Sensitive Change Approval previstos concedidos por DEC-045 em 2026-10-06. Não representa G5 concluído, revisão independente, G6 ou G7.*

- Specification antes de implementação: PASS. A spec referencia RFs, RNFs, regras e TAs aprovados.
- Segurança e privacidade: PASS com controles a comprovar no spike. Nenhum dado real será usado.
- Decisões explícitas: PASS. ADR-0001 foi aceito no G4; ADR-0002/DEC-043 aprovam o canal piloto e mantêm o updater sujeito a spike e gates de implementação; D-AUTO-001/002 foram aceitos por Amanda e Maycon em 2026-09-17.
- Complexidade mínima: PASS. Não há servidor, sincronização ou dependência externa no incremento.
- Rastreabilidade: PASS para o design; tasks, testes e Evidence ainda serão produzidos nas fases seguintes.
- Mudança controlada: PASS. Schema, migrações, dependências, autenticação e arquitetura de produção exigem gate sensível.
- STRICT: obrigatório por autenticação, dados clínicos, auditoria, backup e persistência.
- Condições de parada: novo escopo/arquitetura material fora da DEC-045; publicação e uso real permanecem fora da autorização.

## Research Strategy

### Phase 0 — Research

1. Validar a hipótese desktop local do ADR-0001 contra os critérios de empacotamento, persistência, migração, autorização, proteção local e recuperação.
2. Confirmar a restrição de que SQLite não pode ser compartilhado por rede e registrar a consequência para a futura Educação.
3. Comparar opções de proteção de banco, arquivos, chaves e backups sem escolher produção por inferência.
4. Definir semântica determinística de auditoria: UTC, intervalo semiaberto, ordenação, limite de 50 e cursor.
5. Verificar protocolos clínicos e regras nutricionais já aprovados sem alterar seus valores ou escopo.
6. Definir critérios de teste para backup, restauração, erro seguro, dados fictícios e desempenho.

A consolidação está em [research.md](research.md).

## Design Outputs

- [data-model.md](data-model.md): modelo conceitual, relacionamentos, estados e validações.
- [contracts/authorized-operations.md](contracts/authorized-operations.md): fronteira de operações autorizadas e erros seguros.
- [quickstart.md](quickstart.md): roteiro de validação para o spike e para a futura implementação.
- [research.md](research.md): decisões de planejamento e pontos que continuam dependentes de gate.
- [spec.md](spec.md): escopo e critérios funcionais.

## Execution Phases

### Phase 0 — Fechar pesquisa e decisões

- Reproduzir os critérios mínimos do ADR-0001.
- Registrar evidência de ambiente e limitações.
- Submeter D-AUTO-001/D-AUTO-002 à validação humana.
- Não instalar dependências nem executar migração do produto.

### Phase 1 — Spike G4 da arquitetura (concluído)

- Provar shell desktop, ciclo de vida e empacotamento Windows.
- Provar persistência, foreign keys, transações, banco vazio e migração de versão.
- Provar comandos tipados e autorização fora da interface.
- Provar proteção local de banco, arquivos, chaves e backup.
- Provar criação de snapshot, checksums, restauração segura e falhas de permissão/espaço.
- Medir os RNFs com dados fictícios.
- Resultado: ADR-0001 aceito, G4 encerrado e evidência registrada; detalhes de produção permanecem condicionados ao G5.

### Phase 1A — Preparação do canal piloto do G5

A decisão T081 permite a preparação local no spike descartável. A fundação vertical do produto continua separada; a configuração externa do runner/repositório e a primeira publicação permanecem em T082/T083.

- definir contrato do canal piloto, SemVer pré-release, `latest.json`, notas, checksums e promoção para estável;
- definir o fluxo de `main` → runner Windows → artefato assinado → repositório público separado;
- definir custódia, recuperação e rotação da chave privada do updater;
- preparar casos de teste para assinatura inválida, rede indisponível, backup pré-atualização, migração, interrupção e retorno;
- registrar inventário de dependências, licenças, permissões Tauri e critérios de custo zero;
- registrar a configuração externa de runner, repositório, secrets e endpoint em T082;

### Phase 2 — Fundação vertical

Somente após aprovação de G4/G5: shell, identidade/sessão, persistência mínima, migrações testadas, tratamento de erro e testes de fundação juntos.

### Phase 3 — Fluxos clínicos verticais

Entregar em ordem de dependência: perfil e espaço Saúde; pacientes e tags; rascunhos; prescrição, composição e metas; cada fatia com interface, domínio, persistência, autorização, auditoria e testes.

### Phase 4 — Operação e recuperação

Entregar consulta de auditoria e backup/restauração com os testes TA-AUD-* e TA-BKP-*, incluindo falhas e preservação do estado atual.

### Phase 5 — Convergência, atualização piloto e gates

Executar checklist, Tasks, Analyze, Human Gate, Implement, Converge, Verification, Review, Security Gate condicional, Evidence e aprovação final. Nenhum commit, push, merge ou release é automático.

## Project Structure

A árvore abaixo é uma estrutura candidata para validar no spike; o repositório ainda não possui código.

~~~text
specs/001-primeiro-incremento-saude/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── authorized-operations.md
├── checklists/
│   └── requirements.md
└── tasks.md                  # criado somente por speckit-tasks

src/                           # interface, após aprovação da fundação
src-tauri/                     # comandos, domínio, persistência e arquivos, após G4
tests/
├── unit/
├── integration/
├── acceptance/
└── security/
~~~

**Structure Decision**: manter a separação de interface e fronteira confiável proposta pelo ADR-0001, com fatias verticais por domínio. A árvore só se torna compromisso de implementação após o spike e a decisão arquitetural.

## Constitution Check — Post-Design

- PASS: o design não cria requisitos clínicos aceitos nem altera o schema do produto; a preparação de dependências ficou restrita ao spike descartável e a trilha do updater está documentada no ADR-0002.
- PASS: o modelo separa Saúde de Educação e não assume sincronização.
- PASS: contratos proíbem acesso genérico a dados pela interface e exigem autorização.
- PASS: backup/restauração, auditoria, logs e dados fictícios estão cobertos.
- PENDING HUMAN: aprovação específica para iniciar a implementação do G5; T082/T083 ainda exigem configuração externa e validação do canal piloto.
## Revisão de prioridade — DEC-044, 2026-10-06

Atualização automática e T082/T083 ADIADOS; instalação/atualização manual no MVP. Esta trilha não bloqueia G5. Arquitetura de dados, escopo clínico e critérios de aceite preservados. Próxima etapa: aprovação específica G5 e gates sensíveis aplicáveis antes da fundação; não reutilizar código do spike como produto.

## Execução G5 — 2026-10-06

DEC-045 autoriza produto novo, schema/migrações, dependências previstas e ferramentas de compilação, com dados fictícios. DEC-044 adia updater. Código novo em `src/` e `src-tauri/`, sem reaproveitar o spike. Node:test cobre cálculos de apresentação e Rust cobre comandos/persistência/recuperação. As unidades inicialmente previstas em subpastas são consolidadas em módulos pequenos de fundação e `service.rs`; o mapeamento e as lacunas ficam na evidência de implementação. Catálogo TBCA inicial limitado, sem alegação de base completa ou TACO já integrada.


## Refinamento de interface RF-UX-001 (DEC-046)

Tours curtos nas oito telas autenticadas, componentes React locais sem dependência nova. Preferência `tour:v1:<user UUID>:<tour id>` na tabela settings criptografada existente; comandos tipados TourState/CompleteTour, autenticados e sem user ID fornecido pelo frontend. IDs limitados pelo enum backend. Nenhuma migração ou alteração de dados clínicos; skip/replay permanece disponível e erros de preferência não bloqueiam o trabalho. Verificação e ensaio visual registrados em T084–T087.


## RF-DIS-001 — atualização manual (DEC-048)

Usar customLanguageFiles do NSIS/Tauri para tornar explícita a opção de atualização já existente no template oficial. Comparação SemVer e registro Windows continuam fornecidos pelo bundler; nome WebFit Desktop, identificador br.webfit.desktop e currentUser preservados. Sem template próprio, hook, execução externa ou alteração de banco. Opção de atualização usa o ramo sem desinstalar; opção de reparação para mesma versão. Escolha padrão permanece a do NSIS. allowDowngrades=false desabilita sobrescrita direta por versão anterior, sem representar bloqueio total de downgrade por desinstalação. Ensaio de preservação manual em T093.

## Retomada DEC-050 — 2026-10-07

Retomar trilha local T081–T083 no produto novo, sem promover código do spike. Integração nativa Rust com tauri-plugin-updater 2.12.0 (MIT/Apache-2.0), já avaliado no spike; nenhuma permissão genérica de updater concedida à WebView. Comandos de consulta/instalação exigem sessão válida no Service. Instalação confirmada exige edição encerrada, bloqueio de operações, backup consistente, download com verificação e nova autorização antes do instalador. Configuração pública da chave/endpoint é reaproveitada como dado de configuração, sem acesso a segredo. Produto atual é candidato piloto com identificador br.webfit.desktop preservado; futuro estável terá identidade/dados separados antes de G7, conforme ADR-0002. Pipeline usa checkout isolado de main, runners próprios, versão única e verificações locais antes de publicar; bloqueio explícito mantido até final approval. Sem migração de schema. Subtarefas T101–T105; cenários UPD-001 a UPD-015 do plano existente permanecem aplicáveis.
DEC-051: usar dialog HTML nativo em portal para body, showModal e ::backdrop com blur. Reutiliza padrão do login, estilos/tokens e semântica nativa de foco/inert; cancel prevenido durante instalação. Sem biblioteca adicional ou alteração backend.

## RF-AUT-004 — nome lembrado

Comandos fechados RememberedLogin (leitura pública somente do nome escolhido neste computador) e RememberLogin (gravação autenticada, usuário/papel da sessão); settings existentes referenciam UUID do usuário ativo, uma preferência por papel. Frontend busca a preferência na abertura do formulário, protege texto digitado contra resposta tardia, e salva após login válido sem persistir senha/token. Sem dependência, schema ou localStorage; backup existente pode transportar a preferência, mas nunca concede autenticação.
DEC-053 substitui dialog/portal/blur por faixa UpdatePanel no início de workspace-main. Consulta cacheada somente por token de sessão, reutilizando promessa no remontar StrictMode; novo token inicia nova consulta. Sem persistir token ou dados de domínio. Workflow habilitado localmente para main, integração pelo usuário. Ferramentas do runner preparadas independentemente do notebook, que não bloqueia usar o da empresa.
