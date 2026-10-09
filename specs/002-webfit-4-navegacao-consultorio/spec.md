# Feature Specification: Navegação do Consultório

**Feature Branch**: `main` (branch observada; Git humano, DEC-054)

**Work Item**: WEBFIT-4

**Created**: 2026-10-07

**Status**: aprovado por Maycon em 2026-10-07; implementado localmente, checks e review de código PASS, aceite integrado pendente.

**Input**: Maycon solicitou hambúrguer para ocultar toda a lateral deixando apenas o ícone para reabrir; engrenagem ao lado do nome para Configurações com Auditoria e Backup/restauração; Acesso e Perfil profissional pelo nome; somente módulo Consultório no menu.

## User Scenarios & Testing

### Refinamento de movimento — 2026-10-09

Pedido explícito de Maycon com captura, usando Impeccable; aprovado para implementação no escopo RF-UX-003, sem mudar destinos ou domínio. **TA-NAV-009:** um único hambúrguer permanece na mesma altura e tamanho; com a lateral aberta, fica próximo ao canto superior direito da lateral e, recolhida, retorna ao canto superior esquerdo do conteúdo. Rótulo/estado acessíveis alternam. Abertura/fechamento graduais sem remontar tela/perder formulário; foco permanece no botão e lateral recolhida fica fora de interação/leitor de tela. Cliques repetidos revertem a transição sem espera. Movimento reduzido elimina deslocamento/zoom mantendo feedback de estado. Feedback breve de cores nos botões, abertura do disclosure de conta e diálogos existentes; sem animação contínua, dependência ou atraso nas ações. Prioridade: refinamento solicitado; aceite Windows pendente.

### User Story 1 - Controlar a lateral e localizar o Consultório (Priority: P1)

Como usuário autenticado, quero liberar espaço de trabalho fechando a lateral e recuperar o menu quando necessário. O menu organiza as telas sob Consultório, com Pacientes como entrada disponível neste incremento.

**Why this priority**: é o mecanismo de navegação usado nas demais jornadas; mantém o trabalho em foco.

**Independent Test**: recolher e reabrir durante um formulário fictício e confirmar que o conteúdo e os campos permanecem.

**Acceptance Scenarios**:

1. **Given** lateral aberta, **When** acionar o hambúrguer, **Then** ocultar toda a lateral (marca, módulo, usuário e ações), mantendo somente o botão de menu e ampliando a área de conteúdo.
2. **Given** lateral recolhida, **When** acionar o mesmo botão, **Then** exibir novamente a lateral e permanecer na mesma tela com os mesmos campos.
3. **Given** lateral aberta, **When** consultar o menu principal, **Then** encontrar somente o módulo Consultório com Pacientes; não mostrar Educação nem telas futuras, e não duplicar as entradas de conta/configurações.
4. **Given** uso por teclado, **When** alternar a lateral, **Then** manter foco no botão, anunciar seu estado e retirar os controles ocultos da ordem de foco.

### User Story 2 - Abrir ferramentas nas Configurações (Priority: P1)

Como usuário autenticado, quero usar a engrenagem ao lado do meu nome para entrar em Configurações e escolher Auditoria ou Backup e restauração.

**Why this priority**: separa ferramentas de administração do trabalho de consultório.

**Independent Test**: engrenagem → Configurações → ferramenta desejada → retorno às Configurações ou ao Consultório.

**Acceptance Scenarios**:

1. **Given** lateral aberta, **When** clicar na engrenagem junto ao usuário, **Then** abrir uma tela denominada Configurações com duas entradas: Auditoria e Backup e restauração.
2. **Given** Configurações aberta, **When** não selecionar ferramenta, **Then** não carregar eventos de auditoria nem iniciar backup/restauração.
3. **Given** Configurações, **When** selecionar Auditoria, **Then** abrir a consulta existente com filtros, resultados e registro de acesso preservados; oferecer retorno às Configurações.
4. **Given** Configurações, **When** selecionar Backup e restauração, **Then** abrir as ações e confirmações existentes; oferecer retorno às Configurações. Restauração continua encerrando a sessão conforme regra vigente.

### User Story 3 - Localizar acesso e perfil pelo usuário (Priority: P1)

Como usuário autenticado, quero clicar no meu nome para encontrar Acesso e Perfil profissional separados das ferramentas de Configurações.

**Why this priority**: dá uma origem coerente às ações relacionadas à identidade do usuário.

**Independent Test**: nome → opção Acesso ou Perfil profissional → executar o fluxo existente com dados fictícios.

**Acceptance Scenarios**:

1. **Given** lateral aberta, **When** clicar no nome, **Then** exibir opções Acesso e Perfil profissional sem navegar imediatamente nem descartar o formulário atual.
2. **Given** opções abertas, **When** selecionar uma delas, **Then** navegar para a tela existente com o salvamento seguro do rascunho atual antes da troca.
3. **Given** opções abertas, **When** pressionar Escape ou clicar novamente no nome, **Then** fechar as opções e manter foco em um controle visível.
4. **Given** senha temporária com troca obrigatória, **When** entrar, **Then** permanecer no fluxo obrigatório de Acesso sem poder navegar para outro conteúdo.

### Edge Cases

- Recolher a lateral não navega, não altera sessão, não salva/desfaz um formulário e não reinicia aviso de atualização ou tutorial.
- Falha ao salvar um rascunho impede a troca de destino, mantém os dados e apresenta o erro já previsto no produto.
- Operação em andamento respeita os bloqueios vigentes de navegação; apenas ocultar/exibir a lateral não dispara operação de domínio.
- Menu de conta aberto é fechado antes de ocultar a lateral; nenhuma opção oculta retém foco.
- Nome de usuário comprido, janela estreita e zoom 200% mantêm hambúrguer e engrenagem utilizáveis; há rolagem quando necessária.
- Tour não aponta para controles ocultos e mantém Pular/Ver tutorial; os textos refletem Consultório e as novas entradas.

## Requirements

### Functional Requirements

- **FR-001**: permitir ocultar/reabrir toda a lateral pelo hambúrguer, mantendo somente seu botão quando recolhida e o conteúdo na mesma tela.
- **FR-002**: mostrar apenas Consultório como módulo do menu e Pacientes como sua entrada neste incremento, sem criar módulos futuros.
- **FR-003**: exibir engrenagem identificável e acessível junto ao nome, abrindo a tela Configurações com Auditoria e Backup e restauração.
- **FR-004**: abrir ferramentas somente após seleção, preservar comportamentos existentes e oferecer retorno às Configurações.
- **FR-005**: disponibilizar Acesso e Perfil profissional pelo nome do usuário; abrir as opções não deve navegar e selecionar destino deve preservar rascunhos.
- **FR-006**: preservar sessão, logout, troca obrigatória de senha, regras de autorização, erros e bloqueios durante operações.
- **FR-007**: preservar tutoriais e faixa de atualização, ajustando os alvos/textos afetados pela navegação.
- **FR-008**: todos os novos controles devem funcionar por teclado com nome acessível, foco visível, indicação de estado e ausência de controles ocultos na ordem de foco.

Rastreabilidade canônica: RF-UX-003, TA-UX-NAV-001..008. Regressões: RF-DRF-001, RF-AUT-001..003, RF-CLI-001/002, RF-AUD-001, RF-BKP-001..003, RF-UX-001 e RF-UPD-001.

## Success Criteria

### Measurable Outcomes

- **SC-001**: fechar e reabrir o menu exige uma ação em cada sentido; a tela e todos os campos preenchidos permanecem iguais.
- **SC-002**: partindo da lateral aberta, alcançar Auditoria, Backup/restauração, Acesso ou Perfil profissional exige no máximo duas seleções; somente Consultório aparece como módulo principal.
- **SC-003**: todas as novas ações são executáveis por teclado; a lateral oculta tem zero controles focáveis e o retorno de foco é verificável.
- **SC-004**: os oito cenários TA-UX-NAV passam com dados fictícios, incluindo rascunho/falha, troca obrigatória, atualização e tutorial, sem alterar regras de domínio.

## Assumptions

- Público e permissões existentes: nutricionista e administrador; Saúde permanece o espaço autorizado. Consultório é o agrupamento visual e não um novo domínio/perfil de acesso.
- Auditoria e Backup/restauração mantêm suas telas e regras atuais; não separam backup e restauração em dois mecanismos novos.
- D-NAV-001, ACCEPTED por Maycon em 2026-10-07: lateral inicia aberta a cada sessão; recolhimento é estado transitório, sem preferência persistida.
- D-NAV-002, ACCEPTED por Maycon em 2026-10-07: nome abre uma lista simples de opções; Configurações é um índice com duas entradas e as ferramentas preservam suas telas com retorno ao índice.
- Identidade visual existente é preservada. Nenhuma tela futura, dependência, migração, integração externa ou mudança de autenticação entra no escopo.
- Verificação inclui regressões relevantes e inspeção visual no Windows; não se declara resultado de implementação durante planejamento.


## Complemento autorizado — conta e fechamento, 2026-10-09

Pedido explícito de Maycon nesta conversa aprova RF-UX-003/TA-UX-NAV-010 (painel compacto/ícone de logout com mesma ação) e RF-UX-006/TA-UX-WINDOW-003 (X com confirmação e opt-out persistido). Preferência somente visual, sem sessão/dados de domínio; salvar rascunho continua obrigatório mesmo com opt-out. Operação pendente adia fechamento; falha preserva janela e oferece recuperação. Sem schema/backend/dependência nova. Plane sync degraded; reutilizada WEBFIT-4. Aceite funcional/Windows não inferido.

Refinamento visual aprovado por pedido de Maycon em 2026-10-09: nome e função da conta ficam ao lado dos ícones de configurações/saída, em uma única linha compacta próxima à base da lateral. Nome de acesso continua completo e alvos dos ícones permanecem com 44 px.
