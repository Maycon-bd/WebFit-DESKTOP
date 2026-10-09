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
