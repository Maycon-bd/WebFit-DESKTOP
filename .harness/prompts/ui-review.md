# UI/UX Review — condicional interna do Code Review

## Foco de interação e de contexto — Maycon, 2026-10-09

Ao implementar/revisar páginas, diálogos e tutoriais, distinguir controles interativos de textos que recebem foco programático apenas para orientar a leitura. Títulos de contexto usam `tabIndex={-1}` e a classe compartilhada `focus-anchor`: preservar `.focus()`, sem inserir o título na ordem de Tab e sem contorno visual que o faça parecer um campo. Labels e textos estáticos não recebem `tabIndex={0}` ou foco de interação sem necessidade funcional aprovada.

Não aplicar remoção global de outline a `:focus`, `:focus-visible` ou `[tabindex]`. Botões, links, campos, seleções, tabelas navegáveis e regiões de erro mantêm o indicador adequado. Regras locais de foco devem excluir `focus-anchor`, sem sobrescrever seu tratamento. Conferir abertura por mouse e por teclado, foco inicial real, Tab/Shift+Tab, Escape e retorno ao controle de origem. Confirmar que títulos continuam recebendo foco de contexto e que controles continuam com foco visível; ensaio de navegador não substitui leitor de tela ou WebView2. Aplicar o padrão às próximas telas e registrar exceções justificadas. Regressão disponível para novidades e título de página: `node scripts/focus-context-visual-smoke.mjs`, com backend fictício; executar quando essa fronteira for alterada.

## Preferência persistente de layout — Maycon

Objetivo de telas e modais: mostrar o máximo de conteúdo útil na área visível e evitar rolagem vertical desnecessária. No Plan e no Code Review, conferir aproveitamento da largura, dimensões responsivas, colunas/agrupamentos quando couberem e redução de espaços excessivos. Não obter esse resultado reduzindo legibilidade, alvos de interação ou escondendo conteúdo/ações. Em telas menores e zoom de 200%, manter reflow e rolagem acessível quando necessária, sem overflow horizontal. Validar estados expandidos, erros e ações finais; distinguir evidência visual de inspeção estática. Aplicar em novas telas e alterações no escopo, sem redesenhar interfaces alheias automaticamente.

Se alteração envolve frontend/experiência visual, use Impeccable quando disponível conforme [contrato](../integrations/impeccable.md). Primeira avaliação read-only: hierarquia/clareza, consistência/padrões/design system existentes, acessibilidade, teclado/foco, responsividade/zoom, loading/erro/vazio/recuperação e overflow.

Referenciar requisito, tela/componente e evidência; diferenciar análise estática e inspeção visual real. Sem browser/ensaio Windows, declarar não verificado, não inferir PASS visual. Sem Impeccable, avaliar com ferramentas disponíveis e registrar limite.

Deduplicar findings, separar bug funcional de visual e severidade/impacto. Correção segura no Plan pode avançar automaticamente; repetir checks/revisão afetados. Reformulação grande ou comportamento fora do escopo exige decisão; não abrir outro item Plane automaticamente.
