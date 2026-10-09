# UI/UX Review — condicional interna do Code Review

## Preferência persistente de layout — Maycon

Objetivo de telas e modais: mostrar o máximo de conteúdo útil na área visível e evitar rolagem vertical desnecessária. No Plan e no Code Review, conferir aproveitamento da largura, dimensões responsivas, colunas/agrupamentos quando couberem e redução de espaços excessivos. Não obter esse resultado reduzindo legibilidade, alvos de interação ou escondendo conteúdo/ações. Em telas menores e zoom de 200%, manter reflow e rolagem acessível quando necessária, sem overflow horizontal. Validar estados expandidos, erros e ações finais; distinguir evidência visual de inspeção estática. Aplicar em novas telas e alterações no escopo, sem redesenhar interfaces alheias automaticamente.

Se alteração envolve frontend/experiência visual, use Impeccable quando disponível conforme [contrato](../integrations/impeccable.md). Primeira avaliação read-only: hierarquia/clareza, consistência/padrões/design system existentes, acessibilidade, teclado/foco, responsividade/zoom, loading/erro/vazio/recuperação e overflow.

Referenciar requisito, tela/componente e evidência; diferenciar análise estática e inspeção visual real. Sem browser/ensaio Windows, declarar não verificado, não inferir PASS visual. Sem Impeccable, avaliar com ferramentas disponíveis e registrar limite.

Deduplicar findings, separar bug funcional de visual e severidade/impacto. Correção segura no Plan pode avançar automaticamente; repetir checks/revisão afetados. Reformulação grande ou comportamento fora do escopo exige decisão; não abrir outro item Plane automaticamente.
