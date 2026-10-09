# Padrões de componentes e curadoria de components.rar

Data: 2026-10-09. Status: padronização visual local implementada e verificada por checks; revisão independente e aceite visual Windows pendentes.

## Origem e escopo autorizado

Maycon solicitou analisar `components.rar` e aplicar o que já fosse compatível para padronizar o WebFit. Fonte local na raiz; SHA-256 `0794dccb345d69d5736d14c4a77485067d226a5374083dfdbf6420eaf3151675`. Extração isolada em `.artifacts/components-analysis/components/`, ignorada pelo Git. O arquivo fornecido e a extração não integram o runtime.

Inventário: 82 arquivos, sendo 75 TSX (19 testes), cinco TS, um Markdown histórico e um `.gitkeep`. A identificação SAV/SAVWEB aparece nos comentários. A curadoria considera inventário/imports e implementação dos componentes principais; não executa nem certifica o sistema de origem. O pacote contém referências a contextos, hooks, serviços, páginas, catálogos, estilos e utilitários ausentes. Não inclui licença de redistribuição; nesta entrega reaproveitamos padrões de apresentação com implementação local, sem copiar os componentes.

Classificação LIGHT: apresentação localizada e reversível, mantendo controles, operações, conteúdo, sequência de foco e contratos. Referências aprovadas: RNF-USA-001, RNF-ACE-001/002, [acessibilidade](accessibility.md), [identidade](system-branding.md), RF-UX-002 (Sobre), RF-DRF-002 (recuperação contextual), apresentação V03 e requisitos existentes de pacientes/auditoria. O pedido autoriza esta padronização; não aprova novos recursos do pacote, dependências, regras clínicas, arquitetura, publicação ou aceite final.

## Resultado da curadoria

| Família / arquivos de origem | O que aproveitar | Aplicação ou condição no Desktop |
| --- | --- | --- |
| `ModalConfirmacao` | Aparência consistente, contraste, ações agrupadas, bloqueio durante operação | Aparência aplicada aos diálogos Sobre e Rascunho existentes. Comportamento nativo, handlers e bloqueios preservados. Não substituir `window.confirm` nesta entrega: essa adaptação muda execução assíncrona/foco e exige plano próprio. |
| `MestreGrid`, `Report/RelatorioPreviewGrid`, `ActionMenu`, `shared/TableColumnFilter` | Linhas alternadas, células compactas, indicação visual de linha e ações claras | Apresentação aplicada às tabelas atuais. Grid configurável, ordenação, filtros por coluna, seleção e menu de ações permanecem candidatos para uma demanda própria com critérios definidos. |
| `GlobalToast`, `GlobalLoader`, `LocalLoadingOverlay` | Cores por estado e apresentação compartilhada | Aplicado ao `FormFeedback` existente: progresso/sucesso/erro contextuais e persistentes. Não importar contextos globais, temporizadores, animações ou overlays. O overlay denominado local usa `fixed` e deslocamento lateral de 280px; não é uma base responsiva adequada para o Desktop. |
| `MasterCrudPage` | Cabeçalho, pesquisa, listagem e formulário visualmente coerentes | Referência para evoluir os layouts existentes. Implementação depende de empresa selecionada, exportação e permissões do outro sistema; abstração extensa sem consumidores atuais equivalentes não foi importada. |
| `MestreFiltro`, `MestreFiltroConfiguravel`, `FiltrosFinanceiros` | Agrupamento e rótulos dos filtros, separação entre editar filtros e pesquisar | Aproveitar ao evoluir filtros aprovados. Não importar regras financeiras, seleção de filial ou paginação remota. |
| `SearchableCombobox` | Contratos por props, identidade estável, erro/vazio explícitos e rejeição de respostas antigas | Boa referência para evolução do seletor de alimentos. Não substituir o `FoodPicker`: exige preservar busca/unidades, teclado/foco e identidade de alimentos. A suposição numérica de ID de parte do componente conflita com entidades UUID do Desktop. |
| `DateField` | Apresentação pt-BR com data civil ISO | Candidato; manter os campos nativos existentes neste recorte. Máscara/calendário próprios exigem validar datas incompletas, bissextos, min/max e teclado, sem conversão de data civil em instante UTC. |
| `ValueField`, `PercentField` | Formatação pt-BR e erro próximo do campo | Não importar parsers diretamente: removem caracteres não numéricos; `ValueField` devolve valor fracionário e transforma vazio em zero. Dinheiro no Desktop é inteiro em centavos; medidas/percentuais clínicos mantêm contratos e precisão próprios. Os labels também precisam de associação explícita ao input na adaptação. |
| `Report/A4PrintContainer`, `Report/ReportPage`, `Report/GridPrintReport`, `Report/GenericInvoiceReport`, `RelatorioMestre` | Folhas A4, cabeçalho/rodapé, número de página, colunas reutilizáveis | Referência futura para relatórios aprovados. Remover marcas/dados fiscais SAV, validar que conteúdo não seja cortado e usar logo profissional. `RelatorioMestre` exige `@react-pdf/renderer`, ausente no projeto; nenhuma dependência instalada. |
| `RelatorioViewer`, `pdf.worker`, `worker-polyfills` | Separação conceitual entre preparar e visualizar saída | Não importar pipeline: serviços/páginas ausentes, armazenamento de relatório via `localStorage`, mocks de globals e propagação de mensagem técnica de erro. Exportação clínica precisa de fluxo local aprovado, sem dados de domínio no armazenamento da WebView. |
| `GlobalHeader`, `Sidebar.tsx`, `Sidebar/*` e módulos | Hierarquia e agrupamento visual da navegação | Preservar RF-UX-003/DEC-055: Consultório, conta e Configurações existentes. Não importar router, catálogo, menus comerciais ou lógica de permissões do SAV. |
| `FornecedorCombobox`, `PesquisaCidade`, `shared/ModalPesquisaConveniada`, `shared/ModalPesquisaFilial`, `shared/SeletorFilialConveniada` | Padrão de seletor/pesquisa com campos bem rotulados | Serviços e entidades específicos de outro domínio; só adaptar após existir necessidade aprovada no Desktop. Não adicionar consulta externa de cidades. |
| `ModalExportar`, `ModalRedefinirSenha`, `ModalAprovacaoNotificacao`, `TransferenciaAutorizacaoModal`, `notifications/*` | Referências de organização de formulários/ações | Hooks, autenticação, autorização, notificações e serviços ausentes. Não importar operações nem políticas; funcionalidades exigem requisitos próprios e autorização específica quando sensíveis. |
| `InstallAppButton`, `AppUpdateButton` | Feedback explícito antes de instalar/atualizar | Implementações orientadas à aplicação web. Preservar instalador Tauri e updater existente, assinatura, backup, confirmação e política aprovada. |
| 19 testes TSX e `PLANO_MIGRACAO_TYPESCRIPT.md` | Cenários de teclado, erro, seleção e operação pendente como material de análise | Testes dependem de Vitest/Testing Library e do sistema ausente; não foram executados nem copiados. Markdown é histórico SAV, não plano ou evidência de maturidade do WebFit. |

As bibliotecas/contextos citados no pacote não são autorização para instalá-los. `lucide-react`, `react-router-dom`, `@react-pdf/renderer`, Vitest e Testing Library não integram as dependências atuais. Tailwind/classes `corp-*` também dependem do design system externo. Importar esses arquivos diretamente não preservaria aparência nem funcionamento.

## Padrão aplicado e manutenção

- `src/style.css` é a fonte visual compartilhada. Tokens de superfície, feedback, raio, altura dos botões e modal evitam valores concorrentes. Paleta, tipografia e marca WebFit preservadas.
- Botões têm altura mínima de 44px, com texto/nomes acessíveis existentes. Preservar contraste dos contornos `--control-line` e foco `--focus`; controles desabilitados continuam explícitos.
- Tabelas de pacientes e auditoria mantêm HTML semântico, ações por botão, dados/ordem atuais e rolagem horizontal no container quando necessária. Células passam de 16×18px para 12×16px; linhas alternadas e hover/focus-within auxiliam a leitura sem representar seleção de registro.
- Sobre e Rascunho compartilham superfície, contorno, sombra, backdrop, padding responsivo, quebra de texto e separador das ações. Larguras próprias de 960/480px, limite de viewport e rolagem permanecem. `showModal`, Escape, foco e bloqueios continuam sob responsabilidade dos componentes existentes.
- `FormFeedback` continua único nos formulários que já o usam. Aplica `.message.info` durante operação, `.message.success` para aviso existente e `.message.error` para falha. Texto, prioridade busy/notice, anúncio `status`/`alert`, escape React e foco em erro preservados. Região de status permanece montada; só a região vazia não ocupa espaço. Não criar toasts que desapareçam nem duplicar feedback global/contextual.
- Novas interfaces reutilizam esses tokens/classes e componentes existentes. Só extrair novo componente quando houver responsabilidade repetida real; referências SAV não criam regra obrigatória de usar uma grid genérica.

Decisão de apresentação AGENT-PROVISIONAL: adaptar os padrões ao CSS e componentes atuais em vez de incorporar framework/contextos SAV. Confiança alta, impacto baixo, reversível; validação no aceite visual humano. Não é aprovação humana de design system novo.

## Plan Scope Check e critérios

PLAN APPROVED BY SCOPE, 2026-10-09: padronização visual explicitamente solicitada, ligada a requisitos aprovados, sem mudança de dados, fluxos, dependências ou arquitetura. Plan inline: alterar somente CSS e classe do feedback; documentar análise e checkpoint; checks frontend/diff, seguido de autorrevisão estática.

1. Modais compartilham estilos sem perder largura responsiva, rolagem ou controles existentes.
2. Feedback mantém texto, anúncio e foco, com apresentação consistente entre erro, aviso e andamento.
3. Tabelas têm estilo comum, preservando semântica, resultados, ações e rolagem.
4. Dependências/backend/schema e comportamento de atualização/autorização permanecem intactos.
5. Checks existentes do frontend passam; limites visuais e review ficam explícitos.

## Execução, checks e revisão

EXECUTION COMPLETE no recorte visual. Arquivos: `src/style.css`, `src/FormFeedback.tsx`, este guia, link em `docs/ux/accessibility.md` e checkpoint em `docs/project/status.md`. Extração investigativa ignorada; nenhum código SAV copiado para `src/`.

PASS: `npm run check` (lint, TypeScript, 37 testes Node e build Vite); `npm run format:check`; `npm run issuer:build` (TypeScript e Vite do emissor, que também importa `src/style.css`); `git diff --check`. Testes existentes de FormFeedback cobrem anúncio, prioridade durante operação, escape e ausência de erro no sucesso; testes de rascunho/cadastro também passaram. Não adicionados testes que apenas reproduzam CSS.

WARNING: bundle JS 549,72 kB acima do limiar Vite de 500 kB; build concluído. Não houve nova dependência nem otimização de bundle nesta entrega.

Autorrevisão estática: diff conferido, regiões acessíveis/handlers mantidos, mídia estreita aplica padding compartilhado, foco/contraste herdados e overflow preservados. Sem finding impeditivo identificado neste recorte. Security: nenhum serviço, acesso a dados, log, permissão ou armazenamento introduzido. Impeccable indisponível nesta sessão; avaliação feita pelas regras de UI do harness.

NOT RUN: testes Rust/SQLite e build Tauri, sem alterações nativas ou contratos; ensaio visual/teclado/zoom Windows e revisão independente. Não afirmar equivalência visual, conformidade integral ou READY TO SHIP com base nestes checks. CODE REVIEW INCOMPLETE: autorrevisão não substitui review independente.

Git de entrada: branch `feature/pbi-001-primeiro-incremento-saude`, HEAD `7c2c5506df2f94cd35071bc1d5c828b23e06508e`, árvore limpa; comparação apenas com referências locais, sem fetch. Nenhum Git mutável/instalação/publicação. Fonte permanece 0.1.10.

Próxima ação: review independente e ensaio fictício no candidato integrado, incluindo feedback longo, tabelas, Sobre com licença/erro, Rascunho e controles do emissor, em 1366×768 e zoom 100/150/200%. Maycon controla integração/distribuição; aceite humano e G5/G6/G7 separados. Grids, combobox/calendário e exportação completa são candidatos de adaptação posterior, não implementação entregue.

## Continuação — Impeccable audit e extract, 2026-10-09

Pedido posterior de Maycon: instalar e usar a skill Impeccable, sem perguntas, auditar componentes e incluir padrões aproveitáveis no sistema. Autoriza a ferramenta e a adaptação local; não autoriza inferir novos filtros, regras, schema ou publicação. Manutenção de apresentação/estrutura LIGHT, sem novo fluxo de produto: table/field/search/date preservam dados e handlers existentes, acrescentando semântica/foco nas tabelas. Referências RNF-USA-001, RNF-ACE-001/002, RF-PAT-002, RF-PRE-002 e baseline de auditoria. Plane não requerido para este recorte; não inventado ID nem reutilizado item alheio.

### Instalação e execução reais

Skill 4.5.1 instalada no projeto pelo helper oficial `skill-installer`; engine 0.1.12 baixado pelo launcher Windows com validação de checksum. [Proveniência, comandos e hashes](../../.harness/integrations/impeccable.md). A leitura de SKILL.md e dos roteiros `audit`, `extract`, `craft-floor`, `operate` e `polish` ocorreu nesta sessão. `context --target src/App.tsx` carregou PRODUCT.md e DESIGN.md; refinamento do sistema existente em modo Operate. O contexto contém a referência antiga à instalação manual/DEC-044: distribuição/updater atuais seguem fontes canônicas, sem mudança oportunista deste documento.

`audit` é uma passagem de análise sem edição. Em seguida foi aplicado o roteiro `extract` e a revisão estática de `polish`, por autorização já fornecida; não confundidos com um comando CLI chamado audit. O detector CLI é um auxílio à auditoria, não a totalidade da avaliação.

### Auditoria anterior à extração

Veredito de integridade: sistema coerente com o consultório offline, mas com desvios locais de apresentação/manutenção. Detector inicial confirmou `side-tab` em `src/style.css` (linha 475 no snapshot anterior), faixa lateral de 4px nas mensagens. Não é falha de segurança ou acessibilidade automaticamente: foi tratado como desvio visual P3.

| Dimensão do roteiro | Nota provisória / 4 | Evidência e limite |
| --- | --- | --- |
| Acessibilidade | 3 | Labels implícitos, anúncios e diálogos nativos existentes; tabelas sem caption/nome de região e último cabeçalho vazio. Sem ensaio real de leitor de tela. |
| Performance | 2 | Busca local/paginação de resultados existente; warning de bundle 549,72 kB. Nenhum perfil de runtime ou latência medido. |
| Theming | 2 | Tokens compartilhados presentes, mas cores literais em partes do CSS. Apenas tema claro aprovado; ausência de dark mode não é defeito de requisito. |
| Responsividade | 3 | Breakpoints, larguras limitadas à viewport e containers de tabela; foco para rolar tabela não explicitado. Zoom/reflow reais não verificados. |
| Integridade de implementação | 3 | Identidade preservada; estrutura de tabela duplicada e campo privado em App impedem reuse uniforme. Detector confirmou o desvio de mensagem. |
| Total | 13/20 | Faixa Acceptable do roteiro; avaliação técnica estática do recorte, não nota de aceite do produto nem certificação WCAG. |

Achados deduplicados: zero P0/P1 comprovados nesta análise estática, dois P2 e dois P3. A falta de ensaio visual não permite concluir ausência de problemas graves no aplicativo real.

- **P2 / A11y — tabelas sem identificação completa:** `App.tsx` anterior, regiões de pacientes (1358) e auditoria (2424), último `<th />` vazio. Botões de linha já tinham nomes; melhora necessária é nome da tabela, associação explícita dos cabeçalhos e acesso à rolagem pelo teclado. Corrigido por `DataTable`: caption, `scope=col`, cabeçalho Ações e região nomeada/focável com foco visível. Comando correspondente: `impeccable harden`/`adapt`. Relação com RNF-ACE-001/002; não declarada violação WCAG sem ensaio.
- **P2 / Performance — bundle:** build anterior 549,72 kB; módulo App e catálogo importados pelo frontend. Aviso real, sem medição de impacto percebido. Continua aberto, solução por `impeccable optimize` exige análise separada de carregamento; não adicionar memo/cache sem medição.
- **P3 / Integridade — duplicação de padrões:** table em dois consumidores e campo privado em App, label repetido no FoodPicker. Extrair responsabilidades comuns no sistema existente com props precisas, preservar handlers e layout. Corrigido por `extract`, sem framework/contextos SAV. Dois consumidores de tabela já comprovam a duplicação real; regra genérica de frequência do playbook foi tratada proporcionalmente ao pedido e à regra do projeto de não usar limiares mecânicos.
- **P3 / Integridade — faixa decorativa:** detector confirmou a borda unilateral espessa; corrigida para contorno uniforme de 1px, mantendo paleta e textos. `impeccable polish` como acabamento final. Nenhuma regra do detector ignorada para obter resultado limpo.

Positivos preservados: React escapa texto; identidade própria; fonte nativa Windows adequada ao modo Operate; nenhuma imagem/rede nova; erros e rascunhos contextuais; seleção de alimento mantém origem/código e composição; dados e autorização continuam no backend. Os riscos dos componentes SAV continuam na matriz acima, incluindo IDs numéricos parciais, valores fracionários de dinheiro, labels sem associação, SQL montado em filtros, relatório em localStorage e dependências ausentes. Não importar essas implementações diretamente.

### Componentes incorporados ao produto

| Componente | Consumidores reais | Contrato / referência aproveitada |
| --- | --- | --- |
| `src/DataTable.tsx` | Lista de pacientes e eventos de auditoria | Colunas tipadas por registro, renderizador por célula, UUID como chave, caption e região acessível. Referência MestreGrid/RelatorioPreviewGrid. Fetch, vazio/erro, paginação, filtros, detalhes e permissões pertencem ao consumidor. |
| `src/FormField.tsx` | Campos de App e busca de alimentos | Mesmo wrapper label/span existente, agora compartilhado; filho mantém required, erros e eventos. Referência de composição dos filtros/campos, sem importar contextos. |
| `src/DateInput.tsx` | Nascimento do paciente e dois limites temporais da auditoria | Calendário nativo `date`/`datetime-local`, strings inalteradas, min/max/required e eventos repassados. Data civil não é convertida em UTC; auditQuery mantém conversão existente do intervalo. |
| `src/SearchInput.tsx` | Pesquisa de pacientes e alimentos | Campo controlado search; preserva acentos/código, handler e limite de pesquisa do consumidor. Reaproveita a separação entre input e busca do SearchableCombobox/MestreFiltro. Não se apresenta como combobox ARIA. |

Busca de alimento continua com resultados e botão Incluir, como aprovado. Não substituir essa ação por seleção automática nem truncar catálogo por cache: não seria mera extração. Um combobox completo precisa conservar identidade string/UUID, erro/vazio, semântica e teclado; não foi entregue como componente ocioso sem uso. Relatórios A4/PDF não têm consumidor implementado neste recorte: wrappers SAV, logos fiscais, workers e dependências não foram adicionados como infraestrutura especulativa. Isso delimita o que foi efetivamente incorporado, sem registrar os recursos futuros como concluídos.

Exemplo de uso: `DataTable` recebe `label`, `rows`, `rowKey`, `columns` (`key`, `label`, `render`) e `footer` opcional. `FormField` envolve um único controle rotulado; `SearchInput` e `DateInput` recebem props nativas do input. Um novo consumidor reutiliza esses contratos sem regras por entidade dentro dos componentes.

### Verificação, preservação e limites

PASS inicial: `npm run check` com 41 testes (quatro novos), `format:check`, `issuer:build` e `diff --check`. Testes novos verificam tabela nomeada/escape/rodapé, identidade/callback/disabled de ações, datas civis/locais sem alteração e busca controlada. Loader do teste de paciente atualizado para carregar componentes reais extraídos, sem enfraquecer assertions. Detector final `detect --json src` retornou `[]`; arquivos de trabalho em `.artifacts/components-audit/detect-before.json` e `detect-after.json`, ignorados. Não atribuir independência ao detector nem conformidade visual à ausência de findings.

Ensaio visual isolado: fixture `.artifacts/components-audit/preview.html` usa componentes reais com dados fictícios, sem backend/banco. Vite local em 127.0.0.1:1430 iniciado; navegador IAB falhou com `ERR_CONNECTION_TIMED_OUT`. Servidor encerrado. Visual/teclado/zoom/DOM real continuam NOT RUN; testes SSR/eventos não substituem WebView2/Windows.

Alterações simultâneas de cadastro (`PatientSexField`, validação em App/style e testes) identificadas após os checks iniciais e preservadas; não pertencem à extração. Entrada 7c2c550 com alterações da entrega anterior; integração externa observada em 818d097 durante a instalação. Mesma branch `feature/pbi-001-primeiro-incremento-saude`, sem Git mutável pelo agente. Checks finais combinados registrados no checkpoint, sem assumir que resultado anterior cobre entradas posteriormente alteradas.

Revalidação do estado combinado: `npm run check` PASS (lint, TypeScript, 42 testes, build Vite); `npm run format:check` PASS; `git diff --check` PASS. Bundle final 550,72 kB WARNING. `issuer:build` passou com o CSS final compartilhado; seu runtime não depende dos novos componentes. O resultado `[]` do detector corresponde à conclusão da extração, anterior ao refinamento simultâneo de validação; esse refinamento preservou os componentes e recebeu seus próprios checks/review, sem atribuir essa revisão independente à presente auditoria.

Autorrevisão: dados/ordem/colunas e callbacks conservados nas duas tabelas; referência de foco do botão Detalhes permanece no consumidor; calendário e query audit mantêm fronteiras atuais. Nenhum backend, schema, dependência de runtime ou operação clínica nova. Rust/SQLite/build nativo NOT RUN neste recorte de frontend. Revisão independente indisponível nesta passagem: CODE REVIEW INCOMPLETE, sem READY TO SHIP, aceite humano/G5/G6/G7 ou publicação.
