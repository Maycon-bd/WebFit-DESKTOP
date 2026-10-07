# Feature Specification: Cadastro minimo de paciente

**Feature Branch**: `main` (DEC-054)
**Work Item**: WEBFIT-5
**Created**: 2026-10-07
**Status**: READY FOR HUMAN DECISION REVIEW; preparacao autorizada por Maycon, implementacao pendente.
**Input**: "No cadastro de paciente apenas os campos de Nome, data de nascimento, sexo serem obrigatorios, e o sexo ser duas opcoes: feminino e masculino so pra apertar, sem ter que escrever."

## User Scenarios & Testing

### User Story 1 - Cadastrar com os dados minimos (Priority: P1)

Nutricionista ou administrador cadastra um paciente com nome, nascimento e sexo, sem precisar informar documentos e contato.

**Why this priority**: remover impedimentos ao cadastro solicitado por Maycon.
**Independent Test**: salvar dois pacientes ficticios sem CPF, fechar/reabrir e localizar ambos.

**Acceptance Scenarios**:

1. **Given** Novo paciente, **When** preencher somente nome e nascimento valido e selecionar Feminino ou Masculino, **Then** salvar e reencontrar depois de reiniciar (TA-PAT-008).
2. **Given** CPF ausente em dois cadastros, **When** salvar ambos, **Then** cada cadastro possuir identidade independente (TA-PAT-009).
3. **Given** nome vazio, nascimento ausente/invalido/futuro ou sexo sem selecao, **When** salvar pela tela ou comando direto, **Then** rejeitar indicando o campo e preservar o formulario (TA-PAT-010).
4. **Given** CPF ou e-mail preenchido, **When** salvar com valor invalido ou CPF duplicado, inclusive de arquivado, **Then** rejeitar sem apagar o digitado (TA-PAT-011).
5. **Given** o grupo Sexo, **When** clicar ou usar teclado, **Then** selecionar exclusivamente Feminino ou Masculino sem digitar e sem selecao inicial presumida (TA-PAT-012).

### User Story 2 - Editar e atualizar sem perder dados (Priority: P1)

O profissional conserva pacientes, prescricoes, tags e historico ao atualizar a aplicacao e continua restaurando backups anteriores.

**Why this priority**: a opcionalidade do CPF muda a persistencia e nao pode causar perda de historico.
**Independent Test**: atualizar uma instalacao ficticia anterior, editar um paciente, criar/restaurar backup e comparar IDs e relacionamentos.

**Acceptance Scenarios**:

1. **Given** cadastro existente, **When** remover CPF/contato e salvar com os tres obrigatorios, **Then** preservar o ID, tags, prescricoes, arquivamento e auditoria (TA-PAT-013).
2. **Given** base anterior ou backup anterior, **When** atualizar ou restaurar em versao nova, **Then** preservar conteudos, referencias e auditoria; uma falha preservar o estado anterior (TA-PAT-014).
3. **Given** cadastro antigo com sexo vazio ou fora das duas opcoes, **When** abrir, **Then** preservar o valor antigo ate salvar e pedir escolha explicita antes de salvar; nunca inferir sexo (TA-PAT-015, proposta D-PAT-002).
4. **Given** dados opcionais de responsavel parcialmente preenchidos, **When** salvar, **Then** nao exigir seus campos; validar CPF/e-mail somente se informados (TA-PAT-016, proposta D-PAT-001).

### Edge Cases

- CPF ausente, vazio ou contendo somente espacos equivale a nao informado; texto nao vazio que nao seja CPF valido e rejeitado.
- Nascimento e data civil, sem conversao de fuso; manter rejeicao de data futura.
- Sem CPF nao ha deduplicacao automatica por nome/nascimento; identidade existente continua independente.
- Sexo antigo nao e descartado na atualizacao nem no rascunho. Nenhuma inferencia por nome, genero ou prescricao.
- Arquivamento, sessoes, permissoes, rascunhos e auditoria mantem seus contratos existentes.
- Versao antiga nao pode abrir base nova; mostrar incompatibilidade sem alterar o banco.

## Requirements

### Functional Requirements

- **FR-001** (RF-PAT-007, TA-PAT-008/010): exigir somente nome, nascimento e sexo no cadastro e edicao, na tela e na operacao protegida.
- **FR-002** (RF-PAT-007, TA-PAT-012): oferecer somente Feminino e Masculino por selecao exclusiva acessivel, sem texto livre nem valor presumido.
- **FR-003** (RF-PAT-007, TA-PAT-009/011): permitir CPF/telefone/e-mail/endereco vazios; validar e normalizar CPF preenchido e impedir duplicidade entre ativos/arquivados; validar e-mail preenchido.
- **FR-004** (RF-PAT-007, TA-PAT-013/014): preservar IDs, conteudos, relacionamentos e trilha de auditoria durante atualizacao e backup/restauracao, inclusive backups da versao anterior.
- **FR-005** (RF-PAT-007, TA-PAT-015, D-PAT-002 AGENT-PROVISIONAL): preservar sexo antigo e exigir escolha explicita ao salvar se o valor nao corresponder a Feminino/Masculino.
- **FR-006** (RF-PAT-007, TA-PAT-016, D-PAT-001 AGENT-PROVISIONAL): campos de responsavel tambem opcionais, com validacao de CPF/e-mail preenchidos.

### Key Entities

- **Paciente**: identidade independente do CPF, nome, nascimento, sexo, documentos/contato opcionais, genero separado e opcional, responsavel opcional, tags, observacoes e situacao.
- **Backup**: estado consistente e protegido, incluindo versao dos dados, identidade e relacionamentos.

## Success Criteria

### Measurable Outcomes

- **SC-001**: dois cadastros contendo somente os tres campos persistem e podem ser reabertos e editados independentemente.
- **SC-002**: todos os cenarios TA-PAT-008..016 passam com dados ficticios; os tres obrigatorios e valores invalidos sao rejeitados inclusive fora da tela.
- **SC-003**: atualizacao e restauracao anterior/atual conservam IDs e relacionamentos; falhas e versoes incompatíveis nao perdem dados.
- **SC-004**: sexo pode ser selecionado com mouse e teclado, com foco visivel e selecao exclusiva anunciada por tecnologia assistiva.

## Assumptions

- Pedido e autorizacao de preparacao sao de Maycon, em 2026-10-07. Nao ha evidencia de aprovacao funcional de Amanda nem de autorizacao de implementacao deste plano.
- RF-PAT-001/003 e RN-PAT-001/003/005/006 anteriores continuam baseline ate aprovacao do refinamento; RF-PAT-007 e proposta rastreavel, sem substituir silenciosamente regras aceitas.
- D-PAT-001 e D-PAT-002 aguardam validacao em lote. A opcionalidade de responsavel segue a interpretacao literal de "apenas" tres campos; preservar sexo antigo evita perda e inferencia clinica.
- Somente dados ficticios. Sem dependencias novas, alteracao de calculos nutricionais, dados reais ou publicacao. Pesquisa tecnica em research.md.
