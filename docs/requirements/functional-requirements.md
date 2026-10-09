# Requisitos funcionais

## Administração integrada — WEBFIT-16

RF-ADM-007 / TA-ADM-022..025 **aprovado para implementação por Maycon em 2026-10-09**: incluir pacote completo DB Browser 3.13.1 win64, fornecido por ZIP, no instalador/update em `GerenciadorBanco/` ao lado do WebFit. Preparação reproduzível por versão/hash oficial, licenças/subpastas preservadas, sem copiar banco/chaves/acessos da máquina de build. [Plan/aceite](../../specs/WEBFIT-16/task.md).

RF-ADM-001..006 / TA-ADM-001..021 **aprovados para implementação por Maycon em 2026-10-09**: painel pelo ícone de informações, senha mestra única para todas as funções/emissor, cinco tipos de licença e manutenção completa. Chave SQLCipher fixa hexadecimal existente e importação única do backup do emissor atual foram escolhas específicas. Verificador de build/backend; nenhum segredo claro no instalador/repo. [Registro/aceite](../../specs/WEBFIT-16/task.md), [ADR-0004](../architecture/adr/ADR-0004-painel-administrativo-integrado.md). Implementação/checks locais concluídos, revisão independente com warnings; provisionamento e aceite Windows pendentes. Sem reset de fábrica, importação WebDiet, banco real pelo agente ou publicação. Baseline WEBFIT-10 histórica abaixo preservada.

**RF-UX-005 — barra clara aprovada por Maycon, 2026-10-09:** barra de título própria com fundo da paleta WebFit (claro por padrão; acompanha o tema escolhido em RF-UX-009), independente da cor de destaque do Windows, fixa fora da rolagem; arrastar e minimizar/maximizar-restaurar/solicitar fechamento. Fechamento preserva confirmação/rascunhos vigentes. Prioridade: ajuste solicitado; TA-UX-WINDOW-002/T-UX-WINDOW-002 no registro WEBFIT-10, aceite integrado pendente.

**RF-UX-001 — refinamento aprovado por Maycon, 2026-10-09:** remover Ver tutorial fixo das telas. Em Configurações, Reiniciar tutoriais apaga somente as marcações do usuário conectado e reativa as orientações automaticamente na próxima entrada de cada tela; Pular/Concluir e persistência por tela mantidos. Prioridade: ajuste solicitado do incremento, aceite Windows pendente. TA-UX-TUT-001, DEC-046/T114; sem migration ou nova dependência.

## Refinamento de acesso — WEBFIT-10, 2026-10-08

Pedido explícito de Maycon neste chat; aprovado para implementação, aceite Windows pendente. RF-UX-002/RF-LIC-001: em instalação preparada, Licença e suporte fica dentro das informações do ícone (i), sem ocupar o formulário de login. Ativação inicial continua na entrada do destino vazio; autorizações/backend preservados. Critério TA-UX-LOGIN-003.

RF-UX-005 — Abrir a janela principal maximizada a cada início do aplicativo, preservando controles nativos e possibilidade de restaurar/minimizar. Interpretação comunicada de “tela cheia”: maximizada, sem modo exclusivo. Prioridade: solicitação atual, sem repriorizar backlog; aprovado para implementação por Maycon, aceite final pendente. Critério TA-UX-WINDOW-001; registro WEBFIT-10.

### RF-LIC-001 — extensão aprovada D-LIC-009, 2026-10-08

Permitir também ativação inicial offline com licença/código enviados junto do instalador, sem request prévio. Emissor define administrador e gera código aleatório; profissional importa licença, informa código e prepara seu acesso/backup. Backend verifica assinatura/confiança/código/tipo e recusa banco preparado. Credencial administrativa pertence à licença; senha fica com Maycon. Pacote pode ativar outras máquinas, limite explicitamente aceito para testes fictícios. Prioridade obrigatória para candidato de teste; status aprovado para implementação, aceite final pendente. TA-LIC-013..016 / T-LIC-012..015 no registro WEBFIT-10. Demais tipos/v1 preservados.

## Licenciamento offline — WEBFIT-10

**Fonte/status:** DEC-058, Maycon, 2026-10-08. Fluxo/tipos e ADR-0003 v1 aprovados para implementação por Maycon (“Aprovo a implementação”), D-LIC-006..008 ACCEPTED. Execução local em fixtures; aceite final pendente. Prioridade humana não definida. Plan/arquitetura material aceitos no [registro único](../../specs/WEBFIT-10/task.md); detalhes técnicos não recebem aprovação por inferência.

| ID         | Requisito / ator / resultado                                                                                                                                     | Regras                     | Aceite                  | Status                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------- | -------------------------------------------------- |
| RF-LIC-001 | visitante solicita/importa licença; Maycon emite para aquela instalação, definindo administrador próprio; preparação somente em banco vazio, validada no backend | RN-LIC-001..004            | TA-LIC-001..005/010/011 | aprovado para implementação; aceite final pendente |
| RF-LIC-002 | Maycon autoriza transferência/recuperação no novo destino, com backup validado antes de recuperar dados                                                          | RN-LIC-001/002/005         | TA-LIC-006              | aprovado para implementação; aceite final pendente |
| RF-LIC-003 | Maycon recebe suporte administrativo temporário por uma sessão de até 4 h, encerrada também ao sair/bloquear; sem acesso permanente                              | RN-LIC-001/002/006         | TA-LIC-007              | aprovado para implementação; aceite final pendente |
| RF-LIC-004 | Maycon autoriza recuperação de sua credencial naquela instalação sem apagar dados nem revelar senha anterior                                                     | RN-LIC-001/002/004         | TA-LIC-008              | aprovado para implementação; aceite final pendente |
| RF-LIC-005 | Maycon autoriza reinicialização, mantendo licença/acessos e limpando consultório; backup validado e confirmação separados; falha/cancelamento preserva dados     | RN-LIC-001/002/007         | TA-LIC-009              | aprovado para implementação; aceite final pendente |
| RF-LIC-006 | cópia protegida para diagnóstico isolado por Maycon e retorno sem perder trabalho posterior                                                                      | RN-LIC-008/RN-BKP-005..007 | TA-LIC-012              | adiado para outra demanda por Maycon, 2026-10-08   |

Emissor separado com interface, exclusivo de Maycon; sem chave privada/senha compartilhada no instalador clínico. Uso diário offline. Licença inválida/incompatível/destino errado/repetida não causa preparação, limpeza ou falso sucesso; UI preserva estado e permite recuperação. Solicitação sem credencial/CPF/conteúdo clínico. Protocolo, perda/rotação de chaves e consumo em backup/rollback no ADR aceito.

**Plan técnico 2026-10-08 — ACCEPTED (D-LIC-006..008):** assinatura Ed25519 + payload sealed box para o destino, duas novas crates Rust/migração 002 aditiva, cofre DPAPI/SQLCipher do emissor e backup portátil cifrado. Suporte temporário terá credencial temporária separada, consumida no login e com limite de 4 h desde autenticação; não altera senha permanente. Restore preservará acessos do destino e importará autoria histórica sem reativar login antigo. Banco legado de teste sem licença permitirá somente backup autenticado/solicitação, com clínica bloqueada. Esses efeitos foram aprovados no pacote técnico; detalhes no [ADR-0003](../architecture/adr/ADR-0003-ativacao-offline-e-suporte.md). Perfil profissional preservado na reinicialização é inventário aprovado P-LIC-001; limpeza somente em fixture nesta execução.

Instalações anteriores eram testes: entrega parte de ativação inicial; importar chave não limpa banco já preparado. Atualizar/reparar mantém dados/licença. RF-AUT-001, RF-UX-002, TA-AUT-001/TA-UX-002 descrevem código anterior até entrega; em nova instalação serão complementados por RF-LIC-001. Acesso total de ambos os papéis ao Saúde permanece.

## RF-UX-004 — identidade visual do sistema

- **Status:** aprovado por Maycon, 2026-10-08 neste chat; aplicação local solicitada, aceite final separado.
- **Prioridade:** pedido atual, sem redefinir prioridade do backlog.
- **Descrição:** aplicar símbolo sem texto escolhido como marca do WebFit no acesso/lateral/informações/favicon e recursos Windows do aplicativo/atalhos/instalador.
- **Critérios:** TA-UX-BRAND-001..004; proporção/transparência e identificação acessível, controles/dados e identidade da instalação preservados. Não substituir logo profissional ou ícones de ações.
- **Rastreabilidade:** WEBFIT-8 / DEC-056 / specs/005-webfit-8-identidade-visual/.

**Status:** baseline aprovada do primeiro incremento; demais itens do MVP Saúde permanecem propostos.

## Autenticação

### RF-UX-002 — Informações no login e preparação administrativa

- **Descrição:** botão de informação no canto inferior direito do acesso abre nome WebFit Desktop, versão atual, crédito “Desenvolvido por Eng. Maycon Garcia Silva” e opção Acesso do administrador.
- **Ator:** visitante; administrador na preparação e autenticação.
- **Fluxo:** instalação nova orienta procurar o administrador; preparação fica no acesso administrativo e predefine o nome admin, com senha definida localmente por Maycon. Instalação preparada apresenta login normal; o acesso administrativo usa as mesmas credenciais e autorização do backend.
- **Compatibilidade:** preservar nomes e senhas existentes; não renomear administrador de instalações anteriores. Orientar usar o nome já cadastrado.
- **Critérios:** TA-UX-002; botão acessível por teclado, painel fechável por Escape e Fechar com retorno do foco; versão obtida do aplicativo; nenhuma senha exibida nas informações ou embutida no código.
- **Prioridade:** alta — refinamento do incremento 1.
- **Status:** aprovado por Maycon em 2026-10-07 nesta conversa; ver DEC-049. Aceite visual pendente.
- **Regras:** RN-AUT-001 a RN-AUT-005; RF-AUT-001/002 e RF-BKP-001 preservados.

### RF-AUT-001 — Primeiro acesso e usuários locais

- **Descrição:** permitir preparar os usuários locais nutricionista e administrador sem depender de servidor.
- **Ator:** administrador.
- **Resultado:** usuários persistidos com senha protegida e papel identificado.
- **Regras:** RN-AUT-001, RN-AUT-002.
- **Critérios:** TA-AUT-001.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01 e DEC-016.

### RF-AUT-002 — Autenticar, encerrar e bloquear sessão

- **Descrição:** autenticar por credenciais locais, permitir logout e bloquear a sessão após uma hora de inatividade ou quando o Windows for bloqueado.
- **Erros:** credencial inválida não revela qual campo falhou; tentativas sucessivas recebem espera progressiva.
- **Regras:** RN-AUT-001 a RN-AUT-004.
- **Critérios:** TA-AUT-002 e TA-AUT-003.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-AUT-003 — Redefinir senha administrativamente

- **Descrição:** permitir que o administrador defina senha temporária para a nutricionista, exigindo troca no primeiro acesso e registrando a ação.
- **Restrição:** o administrador nunca vê a senha anterior.
- **Regras:** RN-AUT-005.
- **Critérios:** TA-AUT-004.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01. Recuperação remota permanece fora do MVP.

## Usuário e espaço de trabalho

### RF-CLI-001 — Manter perfil profissional

- **Descrição:** criar e editar perfil do usuário com nome completo, nome profissional, CRN, região, e-mail, telefone, endereço, cargo, local de trabalho, logotipo e assinatura.
- **Obrigatórios:** todos, exceto endereço, logotipo e assinatura no primeiro uso; documentos podem exigir os opcionais.
- **Regras:** RN-CLI-001 a RN-CLI-003.
- **Critérios:** TA-CLI-001.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-CLI-002 — Entrar em espaço de trabalho

- **Descrição:** após autenticação, permitir que o usuário entre em um espaço autorizado; o MVP disponibiliza Saúde.
- **Regra:** perfil pertence ao usuário; dados funcionais pertencem ao espaço.
- **Critérios:** TA-CLI-002.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** DEC-014 e DEC-015.

## Pacientes

### RF-PAT-007 — Refinar cadastro mínimo (WEBFIT-5)

- **Descrição:** cadastro e edição exigem somente nome, nascimento e sexo; Feminino/Masculino por seleção, sem digitação. CPF e contato opcionais; CPF informado válido, normalizado e único inclusive entre arquivados.
- **Identificação:** UUID independente do CPF; número sequencial visível sem zeros à esquerda, gerado no backend e preservado na edição/arquivamento/backup. Busca por número, nome ou documentos/contatos informados.
- **Critérios:** TA-PAT-008..017 em [spec.md](../../specs/003-webfit-5-cadastro-paciente/spec.md).
- **Prioridade:** refinamento solicitado do incremento 1; prioridade neutra no Plane.
- **Status:** aprovado para implementação em 2026-10-08 por Maycon; solicitação de Amanda conforme relato dele (“Foi solicitação dela”). Implementação local e verificação parcial; aceite final/nativo pendentes. Refina RF-PAT-001/002/003 e RN-PAT-001/003/005/006; origem anterior preservada no registro de decisões.
- **Decisões:** D-PAT-001/003 ACCEPTED; D-PAT-002 AGENT-PROVISIONAL não bloqueante (preservar sexo legado sem inferência). [Plan](../../specs/003-webfit-5-cadastro-paciente/plan.md) cobre migração 003/backup.

### RF-PAT-001 — Cadastrar paciente

- **Descrição:** permitir abrir a área de pacientes, acionar **Novo**, preencher os dados em um único formulário e salvar o paciente.
- **Obrigatórios:** nome completo, data de nascimento e sexo (Feminino/Masculino por radios sem seleção inicial), conforme RF-PAT-007.
- **Opcionais:** todos os demais campos, inclusive CPF, telefone, e-mail, endereço e todos os campos do responsável legal; opcionais preenchidos são validados. Número do paciente é gerado pelo sistema.
- **Regras:** RN-PAT-001 a RN-PAT-006.
- **Critérios:** TA-PAT-001 e TA-PAT-002.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-PAT-002 — Pesquisar e abrir paciente

- **Descrição:** listar e localizar por número do paciente, nome, nome social, CPF ou telefone e abrir o cadastro.
- **Listagem:** número sem zeros à esquerda, nome, nome social, CPF mascarado quando informado, nascimento, idade, sexo, telefone e situação; CPF/telefone vazios indicados como não informados.
- **Regras:** RN-PAT-007.
- **Critérios:** TA-PAT-003 e TA-PAT-020.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-PAT-003 — Editar paciente

- **Descrição:** editar dados do paciente e persistir somente após confirmação em Salvar.
- **Regras:** RN-PAT-001 a RN-PAT-006 e RN-AUD-001.
- **Critérios:** TA-PAT-004.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-PAT-004 — Arquivar e restaurar paciente

- **Descrição:** arquivar manualmente sem excluir dados e restaurar antes de novos registros.
- **Regras:** RN-PAT-008 e RN-PAT-009.
- **Critérios:** TA-PAT-005.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-PAT-005 — Gerenciar tags de paciente

- **Descrição:** selecionar várias tags predefinidas, criar novas e desativar tags sem remover relações históricas.
- **Regras:** RN-PAT-010.
- **Critérios:** TA-PAT-006.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-PAT-006 — Recuperar rascunho de cadastro

- **Descrição:** salvar periodicamente cadastro incompleto e oferecer continuar ou descartar após nova autenticação.
- **Regras:** RN-DRF-001 a RN-DRF-005.
- **Critérios:** TA-PAT-007.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01 e decisão de projeto.

## Rascunhos de formulários longos

### RF-DRF-001 — Proteger preenchimento de formulários longos

- **Descrição:** salvar automaticamente o preenchimento ainda não concluído de todo formulário classificado como longo no incremento e oferecer recuperação ou descarte após nova autenticação.
- **Escopo inicial:** perfil profissional, cadastro e edição de paciente e montagem de prescrição/cardápio; novos formulários só entram quando o respectivo requisito os classificar como longos.
- **Separação:** o rascunho automático é uma proteção temporária do formulário; a prescrição salva em estado rascunho é registro clínico persistente e versionável.
- **Erros:** falha no autosave deve ser informada sem simular sucesso e não pode apagar a última versão válida.
- **Regras:** RN-DRF-001 a RN-DRF-005.
- **Critérios:** TA-DRF-001 a TA-DRF-004 e TA-PAT-007.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado por Maycon em 2026-09-10.
- **Fonte:** DEC-024.

### RF-DRF-002 — Recuperar rascunho no contexto do formulário

- **Descrição:** ao abrir novamente o formulário longo de um preenchimento automaticamente salvo, perguntar se a pessoa deseja restaurar ou descartar o rascunho correspondente. Não apresentar uma lista global de rascunhos na tela de pacientes.
- **Escopo:** perfil profissional, cadastro e edição de paciente e montagem de prescrição/cardápio, conforme RF-DRF-001; outros formulários somente após serem classificados como longos por requisito aprovado.
- **Restaurar:** preencher o formulário correspondente com os valores salvos e permitir continuar o trabalho.
- **Voltar (WEBFIT-13 / D-DRF-EXIT-001):** sair sem aplicar, excluir ou regravar o rascunho; paciente/perfil retornam à lista de pacientes, prescrição ao cadastro do paciente. Reentrada oferece recuperação novamente. Escape equivale a Voltar; clique externo permanece inerte; durante operação as ações ficam indisponíveis. Foco no título do destino. Refinamento aprovado por Maycon em 2026-10-08 (“Faça isso”), aceite final separado.
- **Descartar:** remover somente o rascunho correspondente; formulário de criação fica vazio, edição retorna aos dados persistidos (RF-PAT-003) e rascunho clínico persistente de prescrição permanece conforme RN-DRF-005.
- **Regras:** RN-DRF-001 a RN-DRF-007.
- **Critérios:** TA-DRF-005 a TA-DRF-010.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado por Maycon em 2026-10-08 para implementação em WEBFIT-7; aceite funcional final separado.
- **Fonte operacional:** [Specification WEBFIT-7](../../specs/007-recuperar-rascunho-contextual/spec.md).

## Prescrições e cardápios

### RF-PRE-001 — Criar prescrição individual

- **Descrição:** criar prescrição vinculada a paciente ativo, autor e espaço Saúde.
- **Conteúdo mínimo:** identificação, objetivo, orientações e refeições.
- **Regras:** RN-PRE-001, RN-PRE-008 a RN-PRE-010.
- **Critérios:** TA-PRE-001 e TA-PRE-006.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado por Amanda em 2026-08-21.
- **Fonte:** entrevista 01, DEC-021 e DEC-022.

### RF-PRE-002 — Montar refeições, alimentos e porções

- **Descrição:** organizar refeições e incluir alimentos da TBCA, da TACO como fallback ou alimentos personalizados, sempre com quantidade convertível para gramas.
- **Regras:** RN-PRE-001 a RN-PRE-005.
- **Critérios:** TA-PRE-002 e TA-PRE-004.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado por Amanda em 2026-08-21.

### RF-PRE-003 — Calcular composição do cardápio

- **Descrição:** calcular energia, macronutrientes e micronutrientes de item, refeição e cardápio por proporção da composição por 100 g e quantidade canônica em gramas.
- **Micronutrientes iniciais:** fibras, sódio, cálcio, ferro, potássio, magnésio, zinco e vitaminas A, C, D e B12.
- **Regras:** RN-PRE-006 e RN-PRE-007.
- **Critérios:** TA-PRE-003 e TA-PRE-005.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado por Amanda em 2026-08-21.
- **Restrição:** a composição do cardápio é calculada independentemente da necessidade energética; metas do paciente seguem exclusivamente o protocolo versionado de RF-PRE-005.

### RF-PRE-004 — Manter rascunho, versões e histórico

- **Descrição:** salvar rascunho, criar versão final imutável, permitir nova versão derivada e consultar histórico sem sobrescrever versão anterior.
- **Estados:** rascunho, finalizada, substituída e cancelada.
- **Regras:** RN-PRE-008 a RN-PRE-010.
- **Critérios:** TA-PRE-006 e TA-PRE-007.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado por Amanda em 2026-08-21.

### RF-PRE-005 — Calcular necessidade energética e metas do paciente

- **Descrição:** calcular necessidade energética e metas de macronutrientes e fibras usando protocolo clínico explicitamente selecionado e versionado.
- **Protocolos iniciais:** Harris-Benedict revisada de Roza e Shizgal (1984) para adultos, idosos, atletas e uso selecionado pelo profissional; EER/DRI 2023 para crianças e adolescentes de 3 a 18,99 anos, gestação e lactação.
- **Entradas:** sexo usado no cálculo, idade, peso, altura e atividade; gestação exige semana gestacional e peso ou IMC pré-gestacional; lactação exige fase e modalidade; meta ponderal exige variação de peso e prazo válidos.
- **Resultados:** TMB ou EER, GET ou meta energética final, origem e versão do protocolo, distribuição de carboidratos, proteínas e gorduras, meta de fibras e alertas aplicáveis.
- **Alternativas:** permitir meta ou ajuste manual identificado no histórico, com observação opcional; ausência de entrada obrigatória impede o cálculo automático sem apagar o que foi informado.
- **Erros:** rejeitar distribuição que exceda a energia disponível, gordura negativa e prazo inválido; gordura igual a zero exige ajuste antes da conclusão.
- **Regras:** RN-PRE-011 a RN-PRE-024.
- **Critérios:** TA-PRE-008 a TA-PRE-016.
- **Prioridade:** obrigatória para concluir a seção 5.
- **Status:** aprovado por Amanda em 2026-09-10.
- **Fonte:** respostas clínicas de Amanda, DEC-023 e protocolo registrado em `energy-planning-decisions-2026-08-21.md`.

PDF, impressão e exportação não pertencem ao incremento 1.

## Auditoria

### RF-AUD-001 — Registrar e consultar auditoria

- **Descrição:** registrar ator, instante, espaço, ação, entidade e resultado de eventos críticos e permitir consulta paginada pelos usuários autenticados e autorizados. D-AUTO-001 define apresentação tipada para usuário, sistema e tentativa não autenticada.
- **Consulta:** abrir com os últimos 30 dias, 50 registros por página e ordenação fixa do mais recente para o mais antigo; permitir filtros combinados com AND por período, usuário, ação, tipo de entidade e resultado. D-AUTO-002 define janela UTC semiaberta congelada, desempate por ID e cursor opaco para estabilidade.
- **Detalhe:** apresentar somente metadados autorizados; resolver o rótulo atual da entidade quando permitido e usar tipo/ID como fallback.
- **Ações:** listar, filtrar, paginar e abrir detalhe; não editar, excluir ou exportar no incremento 1.
- **Retenção:** manter os eventos por tempo indeterminado no MVP, sem exclusão automática, até existir política legal aprovada.
- **Erro:** operação crítica ou autenticação bem-sucedida não é concluída se seu evento obrigatório não puder ser persistido; operação ou login já rejeitado permanece rejeitado e produz somente diagnóstico técnico seguro. Falha de consulta aparece como erro seguro, nunca como lista vazia, e permite nova tentativa quando recuperável.
- **Restrição:** não registrar senha, CPF completo, conteúdo clínico, nome de arquivo, snapshots ou dados anteriores/posteriores.
- **Regras:** RN-AUD-001 a RN-AUD-017.
- **Critérios:** TA-AUD-001 a TA-AUD-015.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** baseline aprovada por Maycon em 2026-09-10; refinamentos D-AUTO-001 e D-AUTO-002 `ACCEPTED` por Amanda e Maycon em 2026-09-17, conforme decision-log.md.
- **Fonte:** entrevista 01, DEC-016, DEC-025, DEC-026, DEC-028 a DEC-038, D-AUTO-001 e D-AUTO-002.

## Backup e restauração

### RF-BKP-001 — Criar backup

- **Descrição:** criar automaticamente uma vez ao dia e sob comando manual um pacote consistente com banco, arquivos, manifesto e checksums.
- **Regras:** RN-BKP-001 a RN-BKP-004.
- **Critérios:** TA-BKP-001 e TA-BKP-002.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-BKP-002 — Restaurar backup com segurança

- **Descrição:** validar o pacote em área temporária, preservar o estado atual e substituir dados somente após confirmação.
- **Regras:** RN-BKP-005 a RN-BKP-007.
- **Critérios:** TA-BKP-003 e TA-BKP-004.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-BKP-003 — Exibir estado do backup

- **Descrição:** mostrar data e resultado do último backup e alertar imediatamente sobre falha ou atraso superior a 24 horas.
- **Critérios:** TA-BKP-005.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01 e decisão de projeto.

## Backlog do restante do MVP Saúde

| ID         | Requisito resumido                                                                                   | Dependência                            | Status                        |
| ---------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------- |
| RF-AGE-001 | criar, reagendar, cancelar e concluir atendimento vinculado a paciente                               | estados e conflitos                    | proposto                      |
| RF-ANA-001 | registrar anamnese e histórico clínico                                                               | campos e política de correção          | proposto                      |
| RF-ANT-001 | registrar antropometria e apresentar evolução                                                        | protocolos e fórmulas                  | proposto                      |
| RF-ARQ-001 | importar, pesquisar, visualizar, exportar, arquivar e restaurar arquivo clínico vinculado a paciente | tipos, limites, integridade e retenção | proposto — incremento 4A      |
| RF-ARQ-002 | manter biblioteca profissional de documentos e imagens sem vínculo obrigatório com paciente          | acesso, categorias, limites e retenção | proposto — evolução posterior |
| RF-ARQ-003 | pesquisar arquivos clínicos e profissionais por nome, vínculo, categoria, tags, tipo e data          | RF-ARQ-001/002 e índice de metadados   | proposto                      |
| RF-REL-001 | gerar documentos A4 e exportações PDF, XLSX e CSV                                                    | modelos e campos obrigatórios          | proposto                      |
| RF-FIN-001 | registrar recebimentos e estados financeiros em centavos                                             | regras de cobrança e relatórios        | proposto                      |
| RF-PLN-001 | criar, concluir e reabrir tarefas administrativas                                                    | prioridade e recorrência               | proposto                      |

Esses itens não podem ser implementados até receberem detalhamento, critérios de aceite e status aprovado.

## Atualização piloto — RF-UPD-001

**Status:** aprovado por DEC-043/ADR-0002; preparação local retomada por DEC-050 em 2026-10-07. **Prioridade:** P1 operacional. Nutricionista e administrador autenticados podem consultar versão, ler notas, adiar ou confirmar atualização assinada do canal piloto. Instalação aguarda edição/atividade encerrada; cria backup local consistente e valida pacote antes de instalar. Rede indisponível não bloqueia o trabalho. Publicação ocorre após integração revisada em main e ativação aprovada; não envia dados de domínio. **Aceite:** UPD-001–UPD-015 em docs/quality/update-spike-test-plan.md; migração/retorno e publicação externa exigem ensaio específico. **Rastreabilidade:** T101–T105, DEC-050, ADR-0002.

### RF-AUT-004 — Lembrar nome de acesso

- **Descrição:** checkbox Lembrar de mim no login salva apenas o nome de acesso após autenticação bem-sucedida. Ao reabrir, preenche esse nome e mantém senha vazia/obrigatória.
- **Ator:** nutricionista ou administrador.
- **Critérios:** TA-AUT-005; marcado persiste após reiniciar; desmarcado remove preferência após login; falha de login não salva nome; preferências separadas entre acesso normal e administrativo; nenhum token/senha persistido por essa função; sessão/bloqueio permanecem obrigatórios.
- **Status:** aprovado por Maycon em 2026-10-07 nesta conversa, escolhendo explicitamente preencher somente nome e continuar pedindo senha.
- **Prioridade:** alta — refinamento do incremento 1. Regras RN-AUT-001..005 preservadas; DEC-052.
  Refinamento vigente RF-UPD-001 / DEC-053 / TA-UPD-UI-002: faixa superior em lugar de ícone/modal, consulta em cada login, adiar/confirmar pelo aviso; offline/sem versão não mostram aviso e não bloqueiam trabalho. Substitui apresentação e frequência anteriores, mantendo proteção/backup/assinatura. Ativação preparada localmente; Git e integração pelo usuário.

## Navegação do Consultório — WEBFIT-4

### RF-UX-003 — Menu recolhível, Configurações e conta do usuário

- **Descrição:** hambúrguer oculta toda a lateral e deixa somente seu botão para reabrir; menu principal contém Consultório com Dashboard e Pacientes (extensão RF-UX-008/WEBFIT-17 em 2026-10-09). Engrenagem ao lado do usuário abre tela Configurações com Auditoria e Backup e restauração. Nome clicável abre Acesso e Perfil profissional.
- **Atores:** nutricionista e administrador autenticados, com permissões existentes.
- **Prioridade:** incremento atual; ordem técnica das jornadas P1 em spec.md, sem atribuir prioridade humana alta/urgente no Plane.
- **Status:** escopo explicitamente aceito por Maycon em 2026-10-07 (DEC-055); execução do plano e D-NAV-001/002 aprovadas por Maycon em 2026-10-07. Nenhuma aprovação clínica ou de Amanda inferida.
- **Aceite:** TA-UX-NAV-001..008. Preservar rascunhos/erros, sessão/troca obrigatória, auditagem real de acesso, backup/restauração, tours e faixa de atualização. Consultório é grupo visual, Saúde continua espaço aprovado.
- **Fonte operacional:** [Specification](../../specs/002-webfit-4-navegacao-consultorio/spec.md), [Plan](../../specs/002-webfit-4-navegacao-consultorio/plan.md) e [Tasks](../../specs/002-webfit-4-navegacao-consultorio/tasks.md).

## WEBFIT-9 — complemento aprovado de RF-UPD-001

**Status:** aprovado para implementação por Maycon em 2026-10-08, após proposta nesta conversa. Consulta ao login, a cada 30 minutos e retorno à janela; faixa compacta acima de toda navegação/conteúdo com Atualizar à direita e orientação explícita para salvar antes do reinício. Consulta não interrompe edição/offline; instalação mantém backup/assinatura/autorização/bloqueios. Aceite TA-UPD-UI-003..006; spec em specs/006-webfit-9-faixa-atualizacao/. D-UPD9-001 provisória permitida: cooldown um minuto e adiamento por versão/sessão. Não aprova dados reais/publicação/aceite final.

## WEBFIT-4 — conta compacta e confirmação de fechamento (2026-10-09)

- **RF-UX-003, complemento:** substituir o botão textual da lateral por ícone de logout junto à conta/configurações, com nome acessível Sair da conta e a mesma sequência de salvar rascunho/encerrar sessão. Status: aprovado para implementação pelo pedido explícito de Maycon nesta conversa; prioridade: incremento atual; aceite TA-UX-NAV-010.
- **RF-UX-006 — confirmação do fechamento:** ao clicar no X, perguntar se deseja fechar, com Cancelar/Fechar e checkbox Não perguntar novamente. Persistir somente booleano de preferência visual neste perfil Windows ao confirmar; cancelamento não altera preferência. Com opt-out, fechar sem pergunta após operação pendente e gravação do rascunho. Falha mantém janela e permite repetir; nenhuma preferência autoriza perder rascunho. Status: aprovado para implementação por Maycon em 2026-10-09; prioridade: incremento atual; aceite TA-UX-WINDOW-003. Não representa aceite funcional/uso clínico. Sem schema/dependência nova.

## WEBFIT-15 — feedback visual de validação em formulários (2026-10-09)

### RF-UX-007 — Indicar campos inválidos após envio

- **Descrição:** em formulários de envio, quando restrições já existentes impedirem o envio, destacar inline os controles inválidos e explicar o problema junto ao rótulo. Esse é o padrão sistêmico para formulários atuais e futuros; novos formulários devem reutilizar o componente compartilhado e seus testes, sem redefinir obrigatoriedade por conveniência visual.
- **Abrangência:** cadastro/edição de pacientes, perfil, prescrição/cardápio, acesso, segurança, licenciamento e recuperação.
- **Invariantes:** não cria nem remove campo obrigatório, regra clínica, de domínio ou de autenticação; não substitui validação do backend; não revela valores digitados; permite corrigir campos individualmente sem perder o restante do formulário.
- **Campos de data:** todos usam `DateField`; datas simples têm edição `DD/MM/AAAA`, seletor de calendário e valores civis ISO, enquanto data e hora usam o modo nativo `datetime-local` do componente.
- **Critérios:** TA-UX-FORM-001 em `docs/requirements/acceptance-criteria.md`.
- **Prioridade:** refinamento solicitado por Maycon em 2026-10-09, sem alterar prioridade do backlog.
- **Status:** aprovado por Maycon para implementação e adoção como padrão de formulários futuros em 2026-10-09; aceite final/Windows pendentes.
- **Rastreabilidade:** WEBFIT-15 / `specs/WEBFIT-15/task.md`.

## WEBFIT-17 — Dashboard geral (2026-10-09)

### RF-UX-008 — Dashboard como home do Consultório

- **Status:** aprovado para implementação pelo pedido explícito de Maycon em 2026-10-09; seleção dos indicadores D-DASH-001/002 provisória, validável no aceite. Sem regra clínica nova/aceite de Amanda presumido.
- **Prioridade:** incremento atual, sem prioridade humana inventada.
- **Descrição:** Dashboard acima de Pacientes, inicial após autenticação e destino do ícone WebFit. Indicadores agregados dos módulos existentes e gráficos úteis, ampliados por requisitos próprios conforme novas funcionalidades.
- **Aceite:** TA-DASH-001..005; fonte e decisões em [registro único](../../specs/WEBFIT-17/task.md). Preservar senha obrigatória, licença/legado, rascunhos, atualização, acessibilidade e dados locais. Não exibir agenda/financeiro inexistentes ou indicadores demonstrativos em produto.

### RF-UX-008 — complemento: histórico anual de consultas

Aprovado para preparação visual por Maycon em 2026-10-09 após escolha explícita: histórico de consultas realizadas por ano, com estado vazio até existir o módulo de consultas. TA-DASH-006..008; [registro único](../../specs/WEBFIT-17/task.md). O recurso não consulta pacientes/prescrições como se fossem atendimentos e não cria RF-AGE-001, schema, regras clínicas ou valores demonstrativos. Prioridade do backlog preservada; aceite funcional pendente.

## RF-UPD-002 — Novidades da versão instalada após login

- **Status:** aprovado para implementação por Maycon em 2026-10-09: pedido de notas resumidas sem dados técnicos e confirmação de uma vez por atualização, com consulta posterior.
- **Descrição:** após autenticação, nutricionista e administrador veem um resumo curto das novidades da versão instalada, uma vez por usuário/versão. Podem consultar novamente em Ver novidades, no menu da conta. Funciona offline; não mostra IDs internos, hashes, bibliotecas, logs ou dados clínicos.
- **Comportamento:** troca obrigatória de senha precede o aviso; Fechar/Entendi/Escape confirmam leitura no backend para o próprio usuário/versão instalada. Falha de consulta/gravação não bloqueia trabalho e não simula confirmação; retry e fechamento temporário preservam pendência. Não alterar instalação/backup/assinatura do updater.
- **Prioridade:** incremento atual, sem prioridade Plane inventada.
- **Aceite:** TA-UPD-NEWS-001..008. [Plan/registro](../../specs/WEBFIT-21/task.md).

## RF-UX-009 — Personalização e tema escuro

- **Status:** aprovado para implementação por Maycon, pedido explícito em 2026-10-09; aceite funcional separado.
- **Prioridade:** pedido atual; Plane neutro.
- **Descrição:** disponibilizar Personalização nas Configurações, com escolha Claro/Escuro e aplicação imediata em toda a interface.
- **Critérios:** TA-UX-THEME-001..005.
- **Rastreabilidade:** WEBFIT-22 / specs/WEBFIT-22/task.md. Preferência local puramente visual; não altera domínio, autorização, dados ou backup. D-THEME-001 provisória documenta padrão claro/persistência por computador.
