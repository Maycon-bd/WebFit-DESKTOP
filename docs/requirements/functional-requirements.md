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

- **Descrição:** registrar ator, instante, espaço, ação, entidade e resultado de eventos críticos e permitir consulta paginada pelos usuários autenticados e autorizados.
- **Consulta:** abrir com os últimos 30 dias, 50 registros por página e ordenação fixa do mais recente para o mais antigo; permitir filtros combinados com AND por período, usuário, ação, tipo de entidade e resultado.
- **Detalhe:** apresentar somente metadados autorizados; resolver o rótulo atual da entidade quando permitido e usar tipo/ID como fallback.
- **Ações:** listar, filtrar, paginar e abrir detalhe; não editar, excluir ou exportar no incremento 1.
- **Retenção:** manter os eventos por tempo indeterminado no MVP, sem exclusão automática, até existir política legal aprovada.
- **Erro:** operação crítica ou autenticação bem-sucedida não é concluída se seu evento obrigatório não puder ser persistido; operação ou login já rejeitado permanece rejeitado e produz somente diagnóstico técnico seguro. Falha de consulta aparece como erro seguro, nunca como lista vazia, e permite nova tentativa quando recuperável.
- **Restrição:** não registrar senha, CPF completo, conteúdo clínico, nome de arquivo, snapshots ou dados anteriores/posteriores.
- **Regras:** RN-AUD-001 a RN-AUD-015.
- **Critérios:** TA-AUD-001 a TA-AUD-013.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** aprovado por Maycon em 2026-09-10 para a baseline do G2.
- **Fonte:** entrevista 01, DEC-016, DEC-025, DEC-026 e DEC-028 a DEC-037.
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
| RF-ARQ-001 | importar, pesquisar, visualizar, exportar, arquivar e restaurar arquivo clínico vinculado a paciente | tipos, limites, integridade e retenção | proposto — incremento 4A |
| RF-ARQ-002 | manter biblioteca profissional de documentos e imagens sem vínculo obrigatório com paciente | acesso, categorias, limites e retenção | proposto — evolução posterior |
| RF-ARQ-003 | pesquisar arquivos clínicos e profissionais por nome, vínculo, categoria, tags, tipo e data | RF-ARQ-001/002 e índice de metadados | proposto |
| RF-REL-001 | gerar documentos A4 e exportações PDF, XLSX e CSV | modelos e campos obrigatórios | proposto |
| RF-FIN-001 | registrar recebimentos e estados financeiros em centavos | regras de cobrança e relatórios | proposto |
| RF-PLN-001 | criar, concluir e reabrir tarefas administrativas | prioridade e recorrência | proposto |

Esses itens não podem ser implementados até receberem detalhamento, critérios de aceite e status aprovado.
