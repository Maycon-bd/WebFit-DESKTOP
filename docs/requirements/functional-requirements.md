# Requisitos funcionais

**Status:** baseline aprovada do primeiro incremento; demais itens do MVP Saúde permanecem propostos.

## Autenticação

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

### RF-PAT-001 — Cadastrar paciente

- **Descrição:** permitir abrir a área de pacientes, acionar **Novo**, preencher os dados em um único formulário e salvar o paciente.
- **Obrigatórios:** nome completo, CPF, telefone, data de nascimento, e-mail e endereço.
- **Opcionais:** nome social, gênero, tags e observações; sexo é campo separado; responsável legal aparece quando aplicável.
- **Regras:** RN-PAT-001 a RN-PAT-006.
- **Critérios:** TA-PAT-001 e TA-PAT-002.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01.

### RF-PAT-002 — Pesquisar e abrir paciente

- **Descrição:** listar e localizar por nome, nome social, CPF ou telefone e abrir o cadastro.
- **Listagem:** nome, nome social, CPF mascarado, nascimento, idade, sexo, telefone e situação.
- **Regras:** RN-PAT-007.
- **Critérios:** TA-PAT-003.
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
- **Regras:** RN-DRF-001 a RN-DRF-004.
- **Critérios:** TA-PAT-007.
- **Prioridade:** alta — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01 e decisão de projeto.

## Prescrições e cardápios

### RF-PRE-001 — Criar prescrição individual

- **Descrição:** criar prescrição vinculada a paciente ativo, autor e espaço Saúde.
- **Conteúdo mínimo:** identificação, objetivo, orientações e refeições.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** em revisão no G2.
- **Fonte:** entrevista 01 e aprovação de escopo posterior.

### RF-PRE-002 — Montar refeições, alimentos e porções

- **Descrição:** organizar refeições e incluir alimentos da base nutricional ou alimentos personalizados, com quantidade e unidade.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** em revisão no G2.
- **Dependências:** fonte nutricional, medidas caseiras e regras de alimentos personalizados.

### RF-PRE-003 — Calcular composição nutricional

- **Descrição:** calcular energia, macronutrientes e micronutrientes do item, refeição e cardápio usando dados e fórmulas aprovados.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** em revisão no G2.
- **Dependências:** fonte oficial, unidades, arredondamentos e critérios clínicos aprovados por Amanda.

### RF-PRE-004 — Manter rascunho, versões e histórico

- **Descrição:** salvar rascunho, criar versão final imutável, permitir nova versão derivada e consultar histórico sem sobrescrever versão emitida.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** em revisão no G2.
- **Dependências:** estados, transições e regras de correção/cancelamento.

PDF, impressão e exportação não pertencem ao incremento 1.

## Auditoria

### RF-AUD-001 — Registrar e consultar auditoria

- **Descrição:** registrar ator, instante, espaço, ação, entidade e resultado de eventos críticos e permitir consulta pelos usuários autorizados.
- **Restrição:** não registrar senha, CPF completo ou conteúdo clínico.
- **Regras:** RN-AUD-001 e RN-AUD-002.
- **Critérios:** TA-AUD-001.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado.
- **Fonte:** entrevista 01 e DEC-016.

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

| ID | Requisito resumido | Dependência | Status |
|---|---|---|---|
| RF-AGE-001 | criar, reagendar, cancelar e concluir atendimento vinculado a paciente | estados e conflitos | proposto |
| RF-ANA-001 | registrar anamnese e histórico clínico | campos e política de correção | proposto |
| RF-ANT-001 | registrar antropometria e apresentar evolução | protocolos e fórmulas | proposto |
| RF-ARQ-001 | importar, visualizar, exportar e arquivar arquivo clínico | tipos, limites e retenção | proposto |
| RF-REL-001 | gerar documentos A4 e exportações PDF, XLSX e CSV | modelos e campos obrigatórios | proposto |
| RF-FIN-001 | registrar recebimentos e estados financeiros em centavos | regras de cobrança e relatórios | proposto |
| RF-PLN-001 | criar, concluir e reabrir tarefas administrativas | prioridade e recorrência | proposto |

Esses itens não podem ser implementados até receberem detalhamento, critérios de aceite e status aprovado.
