# Feature Specification: Informações do aplicativo em todas as telas

**Feature Branch**: `main` (observada; Git controlado por Maycon, DEC-054)

**Created**: 2026-10-08

**Status**: Draft — proposta preparada para decisão e aprovação de implementação

**Work Item**: WEBFIT-6 · STANDARD · HEAD-base e07cdc8300de0421dbdc7fd64aafe7d30a191e80

**Input**: “Quero adicionar o ícone de (i) que está na tela de login durante o sistema todo”, com indicação do canto inferior direito na captura de Pacientes.

## Contexto e fontes

Refinamento de [RF-UX-002](../../docs/requirements/functional-requirements.md) e [TA-UX-002](../../docs/requirements/acceptance-criteria.md), originalmente aprovados para o login por [DEC-049](../../docs/project/decision-log.md). A ampliação foi solicitada por Maycon; não atribui aprovação funcional a Amanda nem aceite final. Fundação ADR-0001/DEC-045 preservada. Os requisitos desta proposta não são uma nova baseline aprovada.

## User Scenarios & Testing

### User Story 1 - Consultar informações em qualquer tela (Priority: P1)

Como usuário, quero abrir as informações do aplicativo sem sair da tela onde trabalho.

**Why this priority**: permite conferir a versão instalada durante o uso, atendendo ao pedido inteiro em uma única história.

**Independent Test**: abrir e fechar o painel no login e em cada página interna, incluindo formulário com preenchimento fictício não salvo.

**Acceptance Scenarios**:

1. **Given** login ou página interna aberta, **When** procurar o canto inferior direito, **Then** encontrar um único ícone (i) com o mesmo desenho do login. (TA-INFO-001)
2. **Given** ícone disponível, **When** ativá-lo por clique, Enter ou Espaço, **Then** abrir painel com “WebFit Desktop”, versão instalada e “Desenvolvido por Eng. Maycon Garcia Silva”. (TA-INFO-002)
3. **Given** painel aberto, **When** usar Escape ou Fechar, **Then** fechar, devolver foco ao ícone e preservar página e campos. O teclado fica contido no painel durante a abertura. (TA-INFO-003)
4. **Given** navegação entre Pacientes, cadastro/edição, prescrição/energia, Perfil, Acesso, Configurações, Auditoria e Backup/restauração, **When** trocar a página ou recolher a lateral, **Then** manter o acesso ao ícone. (TA-INFO-004)
5. **Given** sessão ativa, **When** abrir informações, **Then** mostrar nome, versão, crédito e Fechar. O acesso administrativo permanece no login, conforme proposta D-INFO-001 pendente de validação. (TA-INFO-005)
6. **Given** conteúdo longo ou janela redimensionada/zoom 200%, **When** rolar ou alcançar o último controle, **Then** poder usar tanto o ícone quanto os controles, sem sobreposição impeditiva. (TA-INFO-006)

### Edge Cases

- Consulta de versão falha: manter a mensagem de falha existente e permitir fechar o painel.
- Instalação nova ou acesso administrativo no login: preservar preparação e credenciais existentes.
- Formulários e rascunhos: abrir/fechar informações não navega, não descarta e não altera os campos.
- Outro diálogo modal ou tour: o ícone segue a contenção de foco/modal vigente; não fica acima de outro diálogo nem intercepta suas ações.
- Bloqueio/logout: informações continuam disponíveis na tela de acesso, sem expor dados da sessão anterior.

## Requirements

### Functional Requirements

- **FR-001**: apresentar um único ícone de informações no canto inferior direito do login e de todas as telas internas. Aceite TA-INFO-001/004/006.
- **FR-002**: abrir informações com nome, versão instalada e crédito idênticos aos existentes, incluindo indicação de consulta/falha de versão. Aceite TA-INFO-002.
- **FR-003**: permitir abrir por teclado, conter foco no painel e fechar por Escape/Fechar com retorno ao ícone. Aceite TA-INFO-003.
- **FR-004**: preservar tela, sessão, formulários, rascunhos, lateral, tour e demais diálogos ao consultar informações. Aceite TA-INFO-003/004 e casos de borda.
- **FR-005**: preservar o acesso administrativo do login; durante sessão mostrar apenas informações e Fechar, condicionado à validação de D-INFO-001. Aceite TA-INFO-005 e regressão TA-UX-002.

## Success Criteria

### Measurable Outcomes

- **SC-001**: todas as telas enumeradas em TA-INFO-004 e o login permitem consultar as mesmas informações em um clique.
- **SC-002**: os dois caminhos de fechamento devolvem foco ao ícone e preservam integralmente o preenchimento fictício no ensaio.
- **SC-003**: em zoom 200%, nenhum controle final fica inacessível por causa do ícone.

## Assumptions

- Escopo abrange telas existentes e futuras que usem a estrutura compartilhada da aplicação; não adiciona telas ou capacidades.
- D-INFO-001, AGENT-PROVISIONAL: opção administrativa somente no login. Pergunta apresentada nesta conversa; ausência de resposta não é aprovação. Alternativa: mostrar opção também na sessão, exigindo definir como sair/trocar de acesso; isso ampliaria o fluxo além da consulta de informações.
- Nenhuma persistência, migração, dependência ou alteração de autorização está prevista. Informações não exibem dados clínicos, senhas ou tokens.
