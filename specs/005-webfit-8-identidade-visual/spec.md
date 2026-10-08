# Feature Specification: identidade visual — WEBFIT-8

**Feature Branch**: `main` (DEC-054). **Created**: 2026-10-08.
**Status**: escopo e aplicação local autorizados por Maycon neste chat; aceite final separado.
**Input**: “Quero apenas o ícone” e “Coloque em todos os lugares que exige logo do sistema”.
**Fonte canônica**: RF-UX-004 / DEC-056.

## User Scenarios & Testing

### User Story 1 — reconhecer o aplicativo no Windows (Priority: P1)

A pessoa identifica o WebFit pelo símbolo escolhido no executável, janela, atalhos e instalador.
**Why this priority**: objetivo explícito de uso na área de trabalho.
**Independent Test**: inspecionar recursos construídos e conferir atalhos após atualização Windows.
**Acceptance Scenarios**:
1. **Given** pacote novo, **When** observa executável/janela/instalador, **Then** aparece o símbolo sem texto embutido.
2. **Given** instalação atualizada, **When** observa atalhos da área de trabalho/menu Iniciar, **Then** vê o mesmo símbolo, após atualização do cache do Windows.

### User Story 2 — reconhecer a identidade na interface (Priority: P2)

O símbolo identifica acesso, lateral do Consultório, informações do aplicativo e aba do navegador.
**Why this priority**: consistência com a identidade externa.
**Independent Test**: conferir as quatro superfícies com identificação acessível e proporção preservada.
**Acceptance Scenarios**:
1. **Given** qualquer estado do acesso, **When** a tela aparece, **Then** símbolo substitui a marca textual existente.
2. **Given** sessão aberta, **When** lateral está visível, **Then** exibe símbolo; recolher continua ocultando todo conteúdo lateral.
3. **Given** informações abertas, **When** lê nome/versão, **Then** símbolo acompanha identificação sem mudar controles.
4. **Given** interface no navegador, **When** observa aba, **Then** favicon corresponde ao símbolo.

### Edge Cases

- Tamanhos pequenos mantêm proporção/transparência; imagem não recebe foco.
- Logo/assinatura profissional e ícones de ações não são marca do sistema.
- Instalação existente recebe novos recursos somente após atualização; cache Windows pode atrasar exibição.
- Spike e documentos clínicos futuros ficam fora da aplicação de produto.

## Requirements

### Functional Requirements

- **FR-001**: usar somente símbolo escolhido, sem letras incorporadas, nos pontos de identidade existentes.
- **FR-002**: aplicar símbolo a executável/janela, instalador e atalhos Windows gerados pelo pacote.
- **FR-003**: aplicar símbolo a acesso, lateral, informações e favicon, preservando proporção e identificação acessível.
- **FR-004**: preservar logo profissional, controles, foco, navegação, dados, autorização e identidade da instalação.

### Key Entities

Nenhuma entidade de domínio nova; marca é recurso estático.

## Success Criteria

### Measurable Outcomes

- **SC-001**: sete pontos inventariados usam a mesma identidade nos recursos entregues.
- **SC-002**: zero letras embutidas, distorções ou controles substituídos por logo.
- **SC-003**: checks existentes passam, preservando fluxos e identidade da instalação.

## Assumptions

- Pedido autoriza aplicar localmente símbolo mostrado antes; não autoriza publicação/instalação no host.
- Produto da raiz e spike são separados. Review independente e aceite Windows são distintos dos checks locais.
