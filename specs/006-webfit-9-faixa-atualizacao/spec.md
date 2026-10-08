# Feature Specification: Atualização durante o uso e faixa compacta

**Feature Branch**: `main` (observada; DEC-054)
**Work Item**: WEBFIT-9 (`6e3ae7d6-743e-4a09-bad6-ea8da0a4f7fc`)
**Created**: 2026-10-08
**Status**: implementação autorizada por Maycon após análise nesta conversa; aceite final pendente.
**Input**: detectar atualizações durante o uso, faixa curta acima de todo o sistema, botão Atualizar à direita e lembrete para salvar. Maycon: “Autorizo a implementação”.

## User Scenarios & Testing

### User Story 1 - Descobrir uma versão durante o trabalho (Priority: P1)

Nutricionista ou administrador autenticado descobre uma publicação sem sair e entrar novamente.
**Why this priority**: sessões longas não devem ocultar novas versões.
**Independent Test**: disponibilizar versão fictícia após login; manter sessão aberta e simular passagem do intervalo ou retorno à janela. Testes com relógio controlado obrigatórios.
**Acceptance Scenarios**:

1. **Given** sessão sem nova versão, **When** passa o intervalo de 30 minutos com aplicativo aberto e internet, **Then** nova consulta detecta versão publicada depois do login.
2. **Given** aplicativo em segundo plano, **When** usuário retorna à janela, **Then** consulta ocorre respeitando intervalo mínimo de um minuto entre tentativas.
3. **Given** falha de rede, **When** consulta falha, **Then** formulários e navegação continuam utilizáveis e outra tentativa é possível nesta sessão.
4. **Given** saída da sessão, **When** chega uma resposta antiga, **Then** não aparece aviso na sessão seguinte; consultas periódicas e listeners da sessão anterior são removidos.

### User Story 2 - Atualizar por uma faixa discreta (Priority: P1)

O aviso ocupa o topo geral, abaixo do título nativo, acima da lateral e do conteúdo. Usuário salva seu trabalho e escolhe instalar.
**Why this priority**: preservar espaço e evitar perda de preenchimento.
**Independent Test**: versão fictícia disponível na lista e em formulário; conferir faixa, botão, teclado, janela estreita e zoom 200%.
**Acceptance Scenarios**:

1. **Given** atualização disponível, **When** aviso aparece, **Then** faixa global verde contém “Salve o que estiver fazendo antes de atualizar” e “O aplicativo será reiniciado”, com Atualizar à direita.
2. **Given** formulário aberto ou operação ativa, **When** aviso aparece, **Then** campos/foco são preservados e instalar permanece bloqueado com orientação para concluir a edição e voltar à lista.
3. **Given** usuário adia, **When** mesma versão é consultada novamente, **Then** aviso não reaparece nesta sessão; outra versão ou novo login pode avisar novamente.
4. **Given** usuário confirma instalação permitida, **When** atualiza, **Then** backup, validação de assinatura, bloqueios e progresso existentes são preservados.

### Edge Cases

Eventos de foco/visibilidade simultâneos e remontagem não duplicam tentativa; suspender computador pode atrasar timer, retorno recupera consulta. Sem internet não há detecção imediata. Zoom/janela estreita permitem quebra sem sobrepor conteúdo. Checagens param durante instalação. Erro de instalação mantém orientação de recuperação.

## Requirements

### Functional Requirements

- **FR-001**: consultar no login, a cada 30 minutos e ao retornar à janela durante sessão habilitada; sem consultas concorrentes da mesma sessão ou rajadas menores que um minuto por retorno.
- **FR-002**: falha de consulta é silenciosa e recuperável na mesma sessão; logout remove agendamento e respostas antigas não alteram a nova sessão.
- **FR-003**: faixa global compacta, acima da navegação/conteúdo, somente com versão disponível; texto para salvar antes de atualizar/reiniciar e Atualizar à direita; detalhes de versão/notas acessíveis sob demanda.
- **FR-004**: detecção não instala nem altera campos, foco, página ou rascunhos. Preservar bloqueio de instalação fora da lista livre de edição/operações, backup, assinatura e confirmação explícita.
- **FR-005**: permitir adiar versão por sessão, progresso e erro recuperável na faixa; não ocultar progresso durante instalação.

### Key Entities

Versão disponível (versão/notas); tentativa de consulta e versão adiada pertencem somente à sessão em memória. Nenhum dado persistido novo.

## Success Criteria

- **SC-001**: publicação fictícia posterior ao login é detectada na próxima consulta periódica ou retorno permitido, sem novo login.
- **SC-002**: em janela desktop larga, aviso principal usa faixa de aproximadamente 48–56 px, sem expansão por notas; em janela estreita/zoom 200% todo texto e botão permanecem acessíveis.
- **SC-003**: nenhum campo preenchido é alterado e nenhuma instalação começa pela mera detecção; testes comprovam consulta deduplicada, retry offline e isolamento entre sessões.

## Assumptions

RF-UPD-001/DEC-053 e infraestrutura existente são reutilizados. Intervalo da proposta anterior está abrangido pela autorização explícita de implementação. Instalação mantém o contrato existente, sem mudança de schema, backend, credenciais, dependências ou publicação. Adiamento por versão e limite de um minuto são detalhes reversíveis AGENT-PROVISIONAL (D-UPD9-001), com validação no aceite final. Escopo fictício G5; não inferir aceite de Amanda/G6/G7.
