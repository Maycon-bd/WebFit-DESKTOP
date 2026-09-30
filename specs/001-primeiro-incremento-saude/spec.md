# Feature Specification: Primeiro incremento de Saúde

**Feature Branch**: `feature/pbi-001-primeiro-incremento-saude`

**Created**: 2026-09-15

**Status**: Aprovada como baseline do primeiro incremento; G4 concluído; implementação de produto bloqueada até aprovação específica do G5 e gates sensíveis

**Input**: User description: "Entregar o primeiro incremento funcional do WebFit Desktop para a operação de Saúde, local e offline, cobrindo acesso de usuários, perfil da nutricionista, pacientes, plano alimentar e orientações, auditoria e backup/restauração conforme requisitos aprovados."

**Canonical scope**: Esta specification organiza os requisitos aprovados em `docs/requirements/functional-requirements.md`, as regras de `docs/requirements/business-rules.md`, os critérios de `docs/requirements/acceptance-criteria.md` e os RNFs de `docs/requirements/non-functional-requirements.md`. Ela não aprova novos requisitos nem substitui essas fontes.

## User Scenarios & Testing

### User Story 1 - Acessar o espaço Saúde com segurança (Priority: P1)

Como administrador ou nutricionista, quero acessar o espaço Saúde com uma credencial local, encerrar ou retomar minha sessão com segurança e manter meu perfil profissional, para trabalhar sem servidor ou internet.

**Why this priority**: Sem autenticação, sessão e perfil não existe operação segura nem identificação do profissional nos registros.

**Independent Test**: Em uma instalação sem internet, preparar os dois usuários locais, autenticar, entrar em Saúde, alterar o perfil, sair, reiniciar e confirmar que os dados persistem sem expor senha.

**Acceptance Scenarios**:

1. **Given** uma instalação inicial sem usuários, **When** o administrador prepara nutricionista e administrador, **Then** ambos ficam persistidos com papel identificado e senha protegida.
2. **Given** credenciais válidas, **When** o usuário autentica e escolhe Saúde, **Then** entra somente no espaço autorizado e consegue sair sem manter acesso autenticado.
3. **Given** quatro falhas sucessivas de autenticação, **When** novas tentativas ocorrerem, **Then** as esperas progressivas são aplicadas sem bloqueio permanente e sem indicar qual campo falhou.
4. **Given** uma sessão inativa por uma hora ou o Windows bloqueado, **When** o usuário retornar, **Then** a sessão exige nova autenticação.
5. **Given** o administrador redefine a senha da nutricionista, **When** ela acessa pela primeira vez, **Then** deve trocar a senha temporária, a anterior nunca é exibida e a ação é auditada.
6. **Given** um perfil profissional válido, **When** o usuário salva e reabre o perfil, **Then** os campos confirmados persistem e alterações de assinatura ou logotipo seguem autorização e auditoria.

---

### User Story 2 - Cadastrar e acompanhar pacientes (Priority: P1)

Como nutricionista, quero cadastrar, localizar, editar, arquivar e restaurar pacientes, para manter a base do consultório organizada e iniciar o atendimento de cada pessoa.

**Why this priority**: Pacientes são a base para prescrições e orientações e representam o primeiro valor operacional do sistema.

**Independent Test**: Criar um paciente fictício válido, fechar e reabrir o sistema, localizá-lo por diferentes campos, editar, arquivar e restaurar, confirmando histórico e validações.

**Acceptance Scenarios**:

1. **Given** o espaço Saúde autenticado, **When** o usuário abre Pacientes, seleciona Novo e preenche os obrigatórios, **Then** o paciente é salvo e reaparece após reiniciar.
2. **Given** CPF inválido, duplicado ou campo obrigatório ausente, **When** o usuário tenta salvar, **Then** a operação é rejeitada, o motivo é apresentado sem expor dado sensível e os dados digitados não são perdidos.
3. **Given** pacientes cadastrados, **When** o usuário pesquisa por nome, nome social, CPF formatado ou telefone, **Then** a busca ignora caixa, acentos e formatação e a listagem mascara o CPF.
4. **Given** um paciente existente, **When** o usuário cancela uma edição ou confirma Salvar, **Then** o cancelamento não altera dados e o salvamento persiste somente após confirmação.
5. **Given** um paciente arquivado, **When** o usuário tenta iniciar novo registro ou restaurá-lo, **Then** novos registros ficam bloqueados até a restauração e nenhum dado ou histórico é excluído.
6. **Given** tags de paciente, **When** o usuário cria, atribui, renomeia ou desativa uma tag, **Then** relações históricas continuam interpretáveis.

---

### User Story 3 - Elaborar plano alimentar e orientações (Priority: P1)

Como nutricionista, quero elaborar uma prescrição vinculada a um paciente ativo, montar refeições, calcular composição e metas e versionar o resultado, para produzir uma orientação nutricional rastreável.

**Why this priority**: O plano alimentar/orientação é o núcleo do uso clínico pretendido para o MVP Saúde.

**Independent Test**: Para um paciente fictício ativo, criar prescrição, incluir alimentos de fonte conhecida, calcular composição e meta, salvar rascunho, finalizar, criar uma nova versão e cancelar uma versão com motivo.

**Acceptance Scenarios**:

1. **Given** paciente ativo e usuário autenticado, **When** o usuário cria uma prescrição, **Then** ela fica vinculada ao paciente, autor e espaço Saúde e pode ser salva como rascunho.
2. **Given** alimento disponível na TBCA, **When** o usuário o inclui por medida caseira, **Then** a quantidade é convertida explicitamente para gramas e a fonte/versão é preservada.
3. **Given** alimento ausente na TBCA, **When** o usuário utiliza TACO ou cria alimento personalizado, **Then** a origem é apresentada e os valores oficiais não são alterados silenciosamente.
4. **Given** itens com composição por 100 g, **When** o usuário monta refeição e cardápio, **Then** energia, macronutrientes, fibras e micronutrientes iniciais são calculados com precisão interna e arredondados somente na apresentação.
5. **Given** entradas insuficientes ou protocolo não selecionado, **When** o usuário solicita metas, **Then** o sistema não apresenta uma estimativa como resultado clínico nem apaga os dados informados.
6. **Given** protocolo e entradas válidos, **When** o usuário calcula metas, **Then** método, referência, versão, entradas, origem e alertas ficam registrados junto ao resultado.
7. **Given** uma prescrição finalizada, **When** o usuário tenta alterá-la ou corrigi-la, **Then** a versão anterior permanece imutável e a correção cria nova versão ligada ao histórico.
8. **Given** uma prescrição a cancelar, **When** o usuário informa o motivo, **Then** o cancelamento preserva o histórico e gera o evento de auditoria correspondente.

---

### User Story 4 - Recuperar preenchimentos interrompidos (Priority: P2)

Como usuário autenticado, quero recuperar um formulário longo interrompido, para não perder trabalho durante um bloqueio, fechamento ou nova autenticação.

**Why this priority**: Formulários de paciente e prescrição são longos; a proteção reduz perda de trabalho sem transformar autosave em registro clínico definitivo.

**Independent Test**: Preencher parcialmente cada formulário longo do incremento, aguardar ou provocar autosave, autenticar novamente e escolher continuar ou descartar, verificando que senha, login, confirmações e backup não geram rascunho.

**Acceptance Scenarios**:

1. **Given** formulário longo do mesmo usuário e espaço, **When** houver alteração e passar aproximadamente 30 segundos ou ocorrer navegação segura, **Then** o preenchimento é protegido como rascunho temporário.
2. **Given** falha no autosave, **When** ela ocorrer, **Then** o sistema informa o estado real, não simula sucesso e preserva a última versão válida.
3. **Given** um rascunho automático após nova autenticação, **When** o usuário escolher continuar ou descartar, **Then** somente o rascunho autorizado é afetado.
4. **Given** prescrição explicitamente salva como rascunho, **When** o autosave temporário expirar, **Then** a prescrição persistente e versionável não é removida.

---

### User Story 5 - Consultar auditoria de forma segura (Priority: P2)

Como usuário autenticado e autorizado, quero consultar a trilha de eventos críticos, para verificar ações relevantes sem visualizar conteúdo clínico indevido.

**Why this priority**: Auditoria é necessária para responsabilização, diagnóstico e proteção de dados de saúde.

**Independent Test**: Gerar eventos de autenticação, paciente, prescrição e backup com dados fictícios, abrir a auditoria, filtrar, paginar e consultar detalhe, verificando que eventos não podem ser alterados ou exportados.

**Acceptance Scenarios**:

1. **Given** eventos dentro e fora dos últimos 30 dias, **When** o usuário abre Auditoria, **Then** a primeira página apresenta até 50 eventos recentes, ordenados do mais novo para o mais antigo.
2. **Given** filtros de período, usuário, ação, entidade e resultado, **When** o usuário combina filtros, **Then** somente eventos que satisfazem todos os filtros são retornados.
3. **Given** mais de 50 eventos e novos eventos durante a navegação, **When** o usuário percorre as páginas, **Then** o conjunto consultado permanece estável, sem duplicação ou perda.
4. **Given** sessão ausente, expirada ou sem autorização, **When** o usuário solicita lista ou detalhe, **Then** a operação é negada na fronteira de confiança e não retorna metadados.
5. **Given** evento de usuário, sistema ou tentativa pré-autenticação, **When** o usuário consulta a trilha, **Then** o ator é apresentado conforme o catálogo controlado, sem revelar credencial, CPF completo ou conteúdo clínico.
6. **Given** falha de consulta, ausência de eventos ou ausência de resultados, **When** a interface apresenta o estado, **Then** esses estados são distintos e uma falha nunca aparece como lista vazia.

---

### User Story 6 - Proteger e restaurar os dados (Priority: P1)

Como responsável pela operação, quero criar e restaurar backups consistentes, para limitar perda de dados e retomar o trabalho quando houver falha ou corrupção.

**Why this priority**: Dados de saúde exigem recuperação verificável; backup e restauração são parte do mínimo operacional, não uma melhoria posterior.

**Independent Test**: Criar backup manual e automático com dados fictícios, validar o pacote, restaurar uma cópia válida e rejeitar pacote corrompido sem alterar o estado atual.

**Acceptance Scenarios**:

1. **Given** dados persistidos, **When** o usuário cria backup manual ou ocorre o primeiro uso diário, **Then** é produzido um pacote consistente com banco, arquivos, manifesto e checksums.
2. **Given** backup válido recente, **When** o usuário consulta o estado, **Then** data e resultado do último backup são exibidos sem informação sensível.
3. **Given** pacote válido, **When** o usuário inicia restauração, **Then** versão, manifesto, checksums, banco e arquivos são validados em área temporária antes da troca e a confirmação é explícita.
4. **Given** pacote corrompido ou incompatível, **When** o usuário tenta restaurar, **Then** a operação é rejeitada e o estado atual permanece intacto.
5. **Given** falha ou atraso superior a 24 horas sem backup válido, **When** o estado for exibido, **Then** o sistema alerta imediatamente e mantém o diagnóstico seguro.

### Edge Cases

- A aplicação é iniciada sem internet ou com a rede indisponível; o núcleo Saúde continua utilizável.
- O computador é bloqueado, a aplicação é encerrada ou o processo falha durante um formulário longo; a última versão válida e o rascunho autorizado devem permanecer distinguíveis.
- Há tentativa de salvar CPF inválido, duplicado ou paciente arquivado; nenhuma operação parcial deve criar registro inconsistente.
- Falha a persistência do evento obrigatório de auditoria; a operação crítica ou login bem-sucedido não pode ser considerado concluído.
- A consulta de auditoria não encontra eventos, não encontra eventos para filtros ou falha tecnicamente; os três estados devem permanecer distintos.
- O backup novo falha em checksum ou integridade; o backup anterior válido não deve ser rotacionado.
- A restauração contém versão incompatível, checksum inválido ou arquivo ausente; o estado atual deve ser preservado.
- Instantes de auditoria coincidem ou novos eventos surgem depois do início da consulta; paginação e limites UTC devem permanecer determinísticos.
- Educação, sincronização entre máquinas, hospedagem, nuvem e colaboração em rede não devem aparecer como fluxo disponível no incremento.

## Requirements

### Functional Requirements

- **FR-001** (trace: RF-AUT-001..003): O sistema MUST preparar usuários locais administrador e nutricionista, autenticar, encerrar e bloquear sessão, aplicar esperas progressivas, permitir reset administrativo com troca obrigatória e nunca armazenar ou revelar senha em texto claro.
- **FR-002** (trace: RF-CLI-001..002): O sistema MUST manter o perfil profissional e permitir entrada somente no espaço Saúde autorizado; Educação permanece fora do produto executável deste incremento.
- **FR-003** (trace: RF-PAT-001..006): O sistema MUST cadastrar, validar, pesquisar, abrir, editar, arquivar, restaurar e etiquetar pacientes, preservando histórico e evitando exclusão física.
- **FR-004** (trace: RF-DRF-001): O sistema MUST proteger automaticamente formulários classificados como longos e distinguir rascunho temporário de prescrição explicitamente persistida como rascunho.
- **FR-005** (trace: RF-PRE-001..005): O sistema MUST permitir criar prescrição individual para paciente ativo, montar refeições e alimentos, calcular composição e metas por protocolos aprovados e manter versões e histórico.
- **FR-006** (trace: RN-PRE-001..024): O sistema MUST preservar fonte e versão de alimentos, usar grama como quantidade canônica, registrar origem e versão de cálculos, manter precisão interna e validar alertas, limites e entradas obrigatórias.
- **FR-007** (trace: RF-AUD-001): O sistema MUST registrar e consultar eventos críticos somente por usuários autenticados e autorizados, com metadados mínimos, filtros combinados, paginação estável e sem conteúdo clínico ou credenciais.
- **FR-008** (trace: RN-AUD-001..017): A auditoria MUST ser imutável no incremento, não excluir automaticamente eventos, diferenciar estados vazios de falhas e aplicar as decisões provisórias D-AUTO-001/D-AUTO-002 somente após validação humana antes do modelo de dados definitivo.
- **FR-009** (trace: RF-BKP-001..003): O sistema MUST criar backup manual e automático diário, exibir seu estado, validar pacote em área temporária, preservar o estado atual até confirmação e rejeitar pacotes inválidos.
- **FR-010** (trace: RN-BKP-001..007): Backup MUST atender RPO de 24 horas, retenção de 60 dias, snapshot consistente, manifesto, checksums e validação de integridade antes de rotação ou restauração.
- **FR-011** (trace: RNF-SEG-001..004, RNF-PRI-001): O sistema MUST proteger autenticação, operações autorizadas, dados sensíveis, arquivos e backups; logs e evidências não podem conter senhas, CPF completo, prontuário, mensagem ou documento clínico.
- **FR-012** (trace: RNF-OFF-001, RNF-POR-001, RNF-CON-001): O núcleo Saúde MUST funcionar localmente e offline em Windows 10 x64 sem ferramenta de desenvolvimento e preservar dados confirmados após fechar e reabrir.
- **FR-013** (trace: RNF-DES-001..003): No ambiente de medição definido, a aplicação MUST abrir em até 5 segundos, pesquisar/abrir paciente em até 1 segundo no percentil 95 e salvar operação comum em até 2 segundos no percentil 95.
- **FR-014** (trace: RNF-ACE-001..002, RNF-USA-001): Os fluxos principais MUST funcionar por teclado, com foco visível, ampliação de 200% sem perda de ação e cadastro de paciente organizado em tela única.
- **FR-015**: O incremento MUST usar somente dados fictícios em desenvolvimento, testes e evidências; Educação, rede entre máquinas, nuvem, hospedagem, impressão, PDF, XLSX, CSV, financeiro, agenda, anamnese, antropometria e arquivos clínicos permanecem fora deste escopo.

### Key Entities

- **Usuário local**: pessoa autenticada com papel administrador ou nutricionista.
- **Perfil profissional**: dados profissionais, contatos e recursos privados do usuário.
- **Espaço Saúde**: contexto funcional único do incremento; Educação não é implementada aqui.
- **Paciente**: pessoa atendida, com identificação, contatos, situação, tags e histórico não destrutivo.
- **Rascunho automático**: proteção temporária de um formulário longo, ligada a usuário, espaço e formulário.
- **Prescrição**: plano alimentar/orientação ligado a paciente, autor e espaço, com estado, versões, refeições, alimentos, porções, composição e metas.
- **Alimento e composição**: item oficial ou personalizado com origem, versão, quantidade canônica e valores nutricionais.
- **Evento de auditoria**: registro imutável de metadados de ação, ator, instante UTC, entidade e resultado.
- **Pacote de backup**: conjunto validável de dados, arquivos, manifesto e checksums.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Em teste offline com dados fictícios, 100% dos fluxos P1 concluem sem depender de servidor, internet ou segundo computador.
- **SC-002**: Uma nutricionista consegue autenticar, entrar em Saúde, cadastrar paciente e salvar uma prescrição inicial em uma sessão guiada, sem recorrer a procedimento manual fora do sistema.
- **SC-003**: Em uma base de 2.400 pacientes fictícios, pelo menos 95% das pesquisas/aberturas de paciente concluem em até 1 segundo e pelo menos 95% das operações comuns de salvamento em até 2 segundos.
- **SC-004**: Nenhum teste de logs, auditoria ou evidência encontra senha, CPF completo, prontuário, mensagem ou documento clínico em texto indevido.
- **SC-005**: 100% dos eventos críticos definidos na matriz de rastreabilidade produzem auditoria conforme escopo, resultado e metadados permitidos; falha de auditoria impede operação crítica ou login bem-sucedido.
- **SC-006**: Um backup diário válido limita a perda máxima testada a 24 horas e uma restauração válida restabelece o trabalho até o próximo dia útil previsto no procedimento.
- **SC-007**: 100% dos pacotes corrompidos ou incompatíveis usados nos testes são rejeitados antes da substituição, sem alterar o estado atual.
- **SC-008**: Os fluxos principais são executáveis por teclado e permanecem utilizáveis com ampliação de 200% em 1366×768.
- **SC-009**: A Specification, o Plan, as Tasks e os testes mantêm rastreabilidade para todos os RFs, RNFs e critérios de aceite do primeiro incremento antes do início da implementação.

## Assumptions

- A operação do MVP ocorre em um único computador por instalação, local e offline; conectividade entre computadores e sincronização são decisões futuras fora desta feature.
- Saúde e Educação permanecem domínios isolados. O incremento disponibiliza apenas Saúde e não cria telas fictícias, entidades ou atalhos de Educação.
- Os usuários aprovados são administrador e nutricionista, ambos com acesso total no MVP, sem recuperação remota de senha.
- Os dados usados em desenvolvimento, testes, demonstrações e evidências são fictícios.
- A direção de proteção criptográfica do banco, arquivos e backups foi aceita no G4/ADR-0001; os detalhes de implementação, migração e testes de produção pertencem ao G5/G6.
- D-AUTO-001 e D-AUTO-002 foram aceitos por Amanda e Maycon; o modelo de dados e os testes definitivos devem preservar seus contratos.
- A política de backup aceita é backup automático no primeiro uso diário e manual, retenção de 60 dias, RPO de 24 horas e RTO até o próximo dia útil.
- PDF, impressão, exportações, agenda, anamnese, antropometria, arquivos clínicos, financeiro e demais itens propostos do backlog não fazem parte desta Specification.

## Out of Scope

- Sistema de Educação, cardápio escolar e pedidos.
- Sincronização ou colaboração entre computador de mesa e notebook.
- Servidor remoto, nuvem, hospedagem obrigatória ou mensalidade.
- Importação/exportação de dados, PDF, impressão, agenda, financeiro e módulos clínicos ainda propostos.