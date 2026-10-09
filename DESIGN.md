---
name: WebFit Desktop
description: Interface de operação local com identidade verde e temas Claro e Escuro.
colors:
  light-text: "#20332b"
  light-green: "#245840"
  light-on-primary: "white"
  light-primary-hover: "#173e2c"
  light-surface: "#fff"
  light-dialog-surface: "#fffef8"
  light-surface-subtle: "#f5f6f2"
  light-sidebar-surface: "#e9eee5"
  light-surface-hover: "#e9efe7"
  light-line: "#d7dfd7"
  light-control-line: "#65796a"
  light-muted: "#52665a"
  light-focus: "#245840"
  light-selected: "#d3e2cf"
  light-selected-text: "#173d2c"
  light-error-surface: "#f4e5df"
  light-error-text: "#7b3028"
  light-success-surface: "#e0edda"
  light-success-text: "#214d2e"
  dark-text: "#e2ece5"
  dark-green: "#8dcba4"
  dark-on-primary: "#142019"
  dark-primary-hover: "#a6dbb9"
  dark-surface: "#1e2b24"
  dark-dialog-surface: "#233128"
  dark-surface-subtle: "#152019"
  dark-sidebar-surface: "#1b2920"
  dark-surface-hover: "#304238"
  dark-line: "#394a40"
  dark-control-line: "#7d9587"
  dark-muted: "#afc0b4"
  dark-focus: "#9ddeaf"
  dark-selected: "#365342"
  dark-selected-text: "#c5efd3"
  dark-error-surface: "#452a28"
  dark-error-text: "#f4aaa0"
  dark-success-surface: "#293f30"
  dark-success-text: "#addaba"
typography:
  body:
    fontFamily: '"Segoe UI", sans-serif'
  theme-legend:
    fontSize: "20px"
    fontWeight: 600
rounded:
  control: "6px"
  panel: "12px"
  dashboard-panel: "16px"
components:
  button-primary:
    backgroundColor: "{colors.light-green}"
    textColor: "{colors.light-on-primary}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-primary-dark:
    backgroundColor: "{colors.dark-green}"
    textColor: "{colors.dark-on-primary}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  input:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  nav-selected:
    backgroundColor: "{colors.light-selected}"
    textColor: "{colors.light-selected-text}"
    padding: "12px 14px"
  dashboard-panel:
    backgroundColor: "{colors.light-surface}"
    rounded: "{rounded.dashboard-panel}"
    padding: "24px"
  theme-choice:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.panel}"
    padding: "14px"
---

# Interface de trabalho

Marca do sistema: símbolo sem texto em public/brand/webfit-icon.png, RF-UX-004/DEC-056, aplicação local autorizada em 2026-10-08. Acesso, lateral, informações e recursos nativos usam a mesma identidade. Guia: docs/ux/system-branding.md. Logo profissional permanece separado.

Direção técnica dentro da UX aprovada: aplicação de operação, sem telas promocionais. Barra lateral recolhível pelo hambúrguer, com Consultório, Dashboard e Pacientes; nome do usuário abre Acesso e Perfil profissional, engrenagem adjacente abre Configurações com Personalização, Auditoria e Backup e restauração (RF-UX-003/DEC-055; RF-UX-009). Recolhida, toda a lateral desaparece e o hambúrguer permanece no conteúdo para reabri-la, preservando tela e campos. Estado transitório, aberto a cada sessão. Conteúdo central com lista pesquisável ou formulário único. Tema Claro com fundo claro quente, texto escuro e verde escuro para ação primária; tema Escuro com superfícies verde/carvão, texto claro e verde claro para ação primária. Ambos preservam a fonte Segoe UI nativa do Windows. Sem imagens externas ou dependência de rede. Ação principal evidente, erros junto ao formulário, preservação do texto digitado, confirmação de arquivamento/restauração. Não altera campos nem fluxos aprovados.

## Padrão de formulários — RF-UX-007

Todos os formulários atuais e futuros usam `src/FormField.tsx` para apresentar rótulos, obrigatoriedade já definida e erros de validação inline. Só campos exigidos pela regra existente exibem `*`; campos opcionais não usam o sufixo “(opcional)”. Após tentativa de envio inválida, controles e rótulos afetados ficam em vermelho, com mensagem segura associada ao campo; corrigir um campo limpa somente o próprio erro. Formulários novos devem reutilizar o componente e adicionar regressão para envio inválido e correção. Grupos de controles customizados seguem o mesmo padrão sem alterar suas regras.

Todos os campos de data usam `src/DateField.tsx`: datas simples têm edição e apresentação `DD/MM/AAAA`, calendário navegável por teclado e valor ISO civil `AAAA-MM-DD` no contrato do formulário; data e hora usam o modo nativo `datetime-local` do mesmo componente. O componente integra-se a `FormField` para obrigatoriedade e mensagens inline.

## Dashboard — RF-UX-008 / WEBFIT-17

Dashboard é a entrada do Consultório e destino do símbolo WebFit. A referência fornecida por Maycon orienta header, quatro indicadores, gráfico principal e painel secundário: superfícies brancas, bordas suaves e raio 16px, mantendo Segoe UI, verde e fundo do produto. Período seis/doze meses pertence ao gráfico, cartões explicitamente globais; contagens alinhadas e tabulares, sem tendências fictícias. Estados vazio/erro/carregando, tabela alternativa e atalhos existentes. Componentes próprios sem plataforma especulativa de widgets; novos módulos acrescentam indicadores com requisito aprovado.

O histórico anual de consultas (TA-DASH-006..008) usa painel claro, título e filtro por ano, meses Jan–Dez com linhas suaves de guia. Enquanto consultas não são registradas nesta versão, apresenta mensagem central de indisponibilidade sem barras ou zeros de atendimento. Mantém os demais indicadores e segue `FormField` no filtro de ano. RF-AGE-001 futuro alimentará histórico mediante requisito próprio.

## Novidades após atualização — RF-UPD-002

Diálogo curto nativo central, título Novidades do WebFit e poucos tópicos em linguagem do consultório; cores/tipografia do produto. Confirmar leitura com Entendi ou Escape, voltar ao controle de origem; no primeiro acesso, foco de retorno ao conteúdo principal. Erro de gravação permite retry/Fechar por agora. Menu da conta oferece Ver novidades para consulta posterior. Tours aguardam consulta/fechamento das notas. Evitar informações técnicas na apresentação; scroll permitido quando necessário no zoom/tela pequena.

## Colors

Tokens normativos extraídos de `src/style.css`: o prefixo `light-` corresponde à propriedade CSS homônima em `:root`; `dark-` corresponde à substituição em `:root[data-theme="dark"]`. Por exemplo, `dark-green` é `--green` no tema Escuro. As cores aqui registradas são o núcleo reutilizado; demais cores semânticas de gráficos e estados continuam no CSS. Componentes referenciados sem sufixo de tema mostram a composição clara no frontmatter; no aplicativo e nos snippets do sidecar usam as propriedades CSS ativas, inclusive no Escuro.

### Primary

Verde escuro no Claro e verde claro no Escuro identificam ações e links. `on-primary` acompanha a ação preenchida: texto claro no Claro, texto escuro no Escuro. Usar o par do tema ativo e seu `primary-hover`, sem fixar branco no botão primário escuro.

### Neutral

`surface-subtle` sustenta o fundo, `surface` os painéis e controles, `dialog-surface` os diálogos e `sidebar-surface` a navegação. `text` e `muted` distinguem conteúdo e apoio; `line` separa superfícies, `control-line` delimita campos e `focus` evidencia o teclado. `selected`/`selected-text` indicam a navegação atual. `error-*` e `success-*` mantêm significado e contraste nos dois temas. Descrições claras nas seções históricas acima representam o tema Claro; os mesmos componentes usam esses papéis semânticos no Escuro.

## Typography

Segoe UI com fallback sans-serif permanece nos dois temas. A troca da paleta não modifica tamanhos, pesos, densidade ou hierarquia. `theme-legend` registra somente o tamanho e peso observados no título do grupo de opções, sem criar uma escala tipográfica nova.

## Components

### Personalização — RF-UX-009 / WEBFIT-22

Configurações → Personalização apresenta Claro e Escuro com radios nativos e miniaturas fixas de ambas as paletas, mesmo quando o tema atual muda. A escolha aplica imediatamente a aparência global; não há botão de confirmação. Cartões usam o raio de painel e mostram seleção com contorno verde; o foco de teclado usa o token de foco. As opções ocupam duas colunas quando cabem e uma coluna até o breakpoint de 560px, permitindo rolagem necessária em tela pequena ou zoom.

Somente a preferência visual é persistida na chave `webfit:appearance:v1`. Falha de armazenamento preserva a escolha nesta sessão, explica o limite e oferece Tentar salvar novamente. Padrão Claro e preferência compartilhada pelos acessos neste computador são D-THEME-001 `AGENT-PROVISIONAL`, com validação humana pendente em `specs/WEBFIT-22/task.md`. A documentação registra a implementação e não representa aceite funcional ou verificação nativa Windows/WebView2.

### Primitivas compartilhadas

Botões e campos mantêm raio de controle e cores semânticas; o botão tem altura mínima de 44px, preservada por `min-height` no snippet. Navegação selecionada usa seu par de seleção. Painéis do Dashboard mantêm raio próprio e separação por borda. Snippets em `.impeccable/design.json` reproduzem essas primitivas com variáveis CSS herdadas e estados de interação observados, sem nova linguagem visual.
