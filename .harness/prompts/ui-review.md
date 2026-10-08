# UI/UX Review — condicional interna do Code Review

Se alteração envolve frontend/experiência visual, use Impeccable quando disponível conforme [contrato](../integrations/impeccable.md). Primeira avaliação read-only: hierarquia/clareza, consistência/padrões/design system existentes, acessibilidade, teclado/foco, responsividade/zoom, loading/erro/vazio/recuperação e overflow.

Referenciar requisito, tela/componente e evidência; diferenciar análise estática e inspeção visual real. Sem browser/ensaio Windows, declarar não verificado, não inferir PASS visual. Sem Impeccable, avaliar com ferramentas disponíveis e registrar limite.

Deduplicar findings, separar bug funcional de visual e severidade/impacto. Correção segura no Plan pode avançar automaticamente; repetir checks/revisão afetados. Reformulação grande ou comportamento fora do escopo exige decisão; não abrir outro item Plane automaticamente.
