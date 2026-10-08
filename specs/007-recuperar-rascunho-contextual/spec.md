# Feature Specification: Recuperação contextual de rascunhos

**Feature Branch**: `main` (observada; DEC-054)
**Work Item**: WEBFIT-7
**Created**: 2026-10-08
**Status**: implementação autorizada por Maycon em 2026-10-08; aceite funcional final pendente.
**Input**: “Essa recuperação vai ser chamar salvamento de rascunho e quando entrar na tela que estava trabalhando, por exemplo, se estava criando alguma coisa e saiu sem salvar e o sistema salvou como rascunho, só vai aparecer para recuperar quando entrar na tela de cadastro novamente, com um modal dizendo que o rascunho anterior foi salvo e perguntando se deseja restaurar, sim ou não, se sim preencher os campos respectivos com oque está salvo, se não apenas limpar o rascunho e deixar a tela com os campos limpos para registros novos”. Maycon confirmou escopo de todos os formulários longos do incremento e aprovou a implementação.

## Clarifications

### Session 2026-10-08

- Q: A recuperação contextual vale para todos os formulários longos ou só para cadastro de paciente? → A: todos os formulários longos do incremento (perfil, cadastro/edição de paciente e prescrição).
- Para a pergunta “Descartar” em uma edição, reaplicar o comportamento já aprovado de cancelar alterações não confirmadas: manter os dados persistidos do registro (RF-PAT-003/TA-PAT-004); um cadastro novo fica vazio. Em prescrição, preservar a distinção entre autosave e estado clínico persistente (RN-DRF-005).

## User Scenarios & Testing

### User Story 1 - Retomar preenchimento no formulário correspondente (Priority: P1)

Nutricionista ou administrador autentica-se e abre novamente o formulário longo em que havia interrompido um preenchimento. A recuperação aparece naquele formulário, por uma pergunta com as ações “Restaurar” e “Descartar”, em vez de uma lista global na tela de pacientes.

**Why this priority**: a pessoa consegue retomar o trabalho sem procurar rascunhos de outras telas e sem expor conteúdo de saúde fora do contexto em que será usado.

**Independent Test**: salvar preenchimentos fictícios em cada tipo de formulário longo, sair sem concluir e retornar à mesma tela/contexto; confirmar o aviso contextual e a restauração exata dos campos.

**Acceptance Scenarios**:

1. **Given** um rascunho automático do usuário autenticado para o mesmo formulário, **When** a pessoa abre esse formulário novamente, **Then** aparece uma pergunta para restaurar ou descartar o preenchimento.
2. **Given** rascunhos existentes, **When** a pessoa está na lista de pacientes ou abre outro formulário/registro, **Then** rascunhos sem correspondência não são apresentados nessa tela.
3. **Given** a pergunta de recuperação aberta, **When** a pessoa escolhe “Restaurar”, **Then** os campos do formulário são preenchidos com os valores daquele rascunho e o trabalho continua editável.

### User Story 2 - Descartar o preenchimento interrompido (Priority: P1)

Quando a pessoa não quiser retomar o preenchimento interrompido, poderá descartar aquele rascunho e seguir no mesmo contexto para um trabalho novo ou para editar o registro já salvo.

**Why this priority**: evita reabrir dados antigos por engano e impede que descartar um rascunho apague um registro já persistido.

**Independent Test**: recusar a recuperação num cadastro novo e numa edição existente; confirmar a exclusão do rascunho, campos vazios no cadastro novo e preservação dos dados salvos na edição.

**Acceptance Scenarios**:

1. **Given** uma pergunta referente a um cadastro novo, **When** a pessoa escolhe “Descartar”, **Then** somente aquele rascunho é removido e o formulário fica vazio, pronto para novo cadastro.
2. **Given** uma pergunta referente à edição de um registro existente, **When** a pessoa escolhe “Descartar”, **Then** somente o rascunho é removido e o formulário mostra os dados persistidos do registro, preservando o comportamento aprovado de cancelar alterações não confirmadas (RF-PAT-003/TA-PAT-004).
3. **Given** uma falha ao consultar ou descartar o rascunho, **When** ela ocorre, **Then** a interface informa a falha e mantém a última versão válida e o registro persistido sem simular sucesso.
4. **Given** a recuperação modal aberta, **When** a pessoa usa somente teclado ou tecnologia assistiva, **Then** ambas as ações são identificáveis e operáveis, o foco permanece no modal até a escolha explícita e retorna ao formulário após a escolha.

### Edge Cases

- A recuperação pertence somente ao usuário autenticado e ao formulário/contexto correspondente; rascunhos de outro usuário não são oferecidos.
- Abrir uma tela sem rascunho correspondente não apresenta modal e mantém o fluxo normal.
- Prescrição automaticamente autosalva e prescrição explicitamente salva no estado clínico “rascunho” continuam sendo conceitos distintos; descartar o autosave não exclui prescrição clínica persistente.
- O salvamento automático, o salvamento antes de navegação segura, a expiração em 30 dias e a remoção após concluir ou descartar permanecem conforme RN-DRF-001..005.
- Formulários protegidos (senha, login, administração, confirmação e backup) não passam a gerar rascunhos.

## Requirements

### Functional Requirements

- **FR-001**: O sistema MUST consultar rascunhos automáticos somente no contexto do formulário longo ao qual pertencem e somente para o usuário autenticado correspondente.
- **FR-002**: Quando houver rascunho correspondente, o sistema MUST perguntar se a pessoa deseja restaurá-lo ou descartá-lo; rascunhos sem correspondência MUST NOT aparecer como lista global na tela de pacientes.
- **FR-003**: Ao restaurar, o sistema MUST preencher os campos do formulário com os dados do rascunho escolhido e permitir que a pessoa continue o trabalho.
- **FR-004**: Ao descartar, o sistema MUST remover somente o rascunho correspondente; em cadastro novo, MUST deixar os campos de entrada vazios. Em edição existente, MUST preservar os dados persistidos e descartar apenas alterações não confirmadas, conforme RF-PAT-003/TA-PAT-004. Em prescrição, MUST preservar eventual registro clínico persistente conforme RN-DRF-005.
- **FR-005**: O fluxo MUST aplicar-se aos formulários longos aprovados para o incremento: perfil profissional, cadastro e edição de paciente e montagem de prescrição/cardápio. A inclusão de outro formulário continua dependendo de requisito que o classifique como longo.
- **FR-006**: Falhas de consulta ou descarte MUST ser informadas sem falso sucesso e sem apagar a última versão válida, conforme RN-DRF-002.
- **FR-007**: O fluxo MUST preservar autenticação, escopo por usuário/espaço, privacidade, autosave, expiração, regras de conclusão/descarte e distinção entre autosave temporário e prescrição clínica persistente conforme RN-DRF-001..005.
- **FR-008**: O modal MUST expor os nomes acessíveis “Sim, restaurar” e “Não, descartar”, ser operável por teclado e tecnologia assistiva, manter o foco no modal até a escolha explícita e devolver o foco ao formulário após a escolha, sem descarte passivo por Escape ou clique externo.

### Key Entities

- **Rascunho automático**: preenchimento temporário pertencente ao usuário e ao espaço, com tipo, contexto do formulário, conteúdo e instante da última gravação; não integra o histórico clínico.
- **Contexto do formulário**: tela e registro/instância de trabalho a que o rascunho pertence, usados para oferecer recuperação somente na reentrada correspondente.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Nos quatro tipos de formulário longo cobertos, 100% dos rascunhos fictícios são oferecidos ao reabrir seu contexto correspondente e nenhum é oferecido na lista global de pacientes ou em outro contexto.
- **SC-002**: Ao escolher “Restaurar”, todos os campos cobertos pelo rascunho apresentam os valores salvos, sem alterar campos não pertencentes a ele.
- **SC-003**: Ao escolher “Descartar”, o rascunho correspondente deixa de ser recuperável; cadastro novo fica vazio, e edição existente mantém os valores persistidos.
- **SC-004**: Testes com usuários e espaços distintos confirmam que nenhum rascunho é apresentado a uma sessão diferente da sua proprietária.
- **SC-005**: Em navegação somente por teclado e tecnologia assistiva, ambas as ações são alcançáveis, nomeadas e operáveis, e a pessoa conclui a recuperação sem o foco escapar do modal.

## Assumptions

- Os rascunhos e os comandos autorizados existentes são reutilizados; esta mudança não requer um novo tipo de persistência nem amplia a retenção aprovada.
- Uma edição descartada volta ao estado persistido da entidade, seguindo o comportamento aprovado de cancelar alterações não confirmadas; autosave de prescrição não exclui prescrição clínica persistente.
- A recuperação funciona sem rede, de acordo com a operação local/offline do produto.
- Só dados fictícios serão usados durante implementação e verificação no G5.
