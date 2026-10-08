# Requisitos funcionais

## Licenciamento offline — WEBFIT-10

**Fonte/status:** DEC-058, Maycon, 2026-10-08. Fluxo/tipos aprovados no escopo suficientemente definido; nenhum implementado/verificado. Prioridade humana não definida. Plan/arquitetura material pendentes no [registro único](../../specs/WEBFIT-10/task.md); detalhes técnicos não recebem aprovação por inferência.

| ID | Requisito / ator / resultado | Regras | Aceite | Status |
|---|---|---|---|---|
| RF-LIC-001 | visitante solicita/importa licença; Maycon emite para aquela instalação, definindo administrador próprio; preparação somente em banco vazio, validada no backend | RN-LIC-001..004 | TA-LIC-001..005/010/011 | fluxo aprovado; protocolo pendente |
| RF-LIC-002 | Maycon autoriza transferência/recuperação no novo destino, com backup validado antes de recuperar dados | RN-LIC-001/002/005 | TA-LIC-006 | intenção aprovada; identidade/consumo pendentes |
| RF-LIC-003 | Maycon recebe suporte administrativo temporário por uma sessão de até 4 h, encerrada também ao sair/bloquear; sem acesso permanente | RN-LIC-001/002/006 | TA-LIC-007 | intenção/duração aprovadas; protocolo pendente |
| RF-LIC-004 | Maycon autoriza recuperação de sua credencial naquela instalação sem apagar dados nem revelar senha anterior | RN-LIC-001/002/004 | TA-LIC-008 | intenção aprovada; procedimento pendente |
| RF-LIC-005 | Maycon autoriza reinicialização, mantendo licença/acessos e limpando consultório; backup validado e confirmação separados; falha/cancelamento preserva dados | RN-LIC-001/002/007 | TA-LIC-009 | comportamento aprovado; detalhes técnicos pendentes |
| RF-LIC-006 | cópia protegida para diagnóstico isolado por Maycon e retorno sem perder trabalho posterior | RN-LIC-008/RN-BKP-005..007 | TA-LIC-012 | adiado para outra demanda por Maycon, 2026-10-08 |

Emissor separado com interface, exclusivo de Maycon; sem chave privada/senha compartilhada no instalador clínico. Uso diário offline. Licença inválida/incompatível/destino errado/repetida não causa preparação, limpeza ou falso sucesso; UI preserva estado e permite recuperação. Solicitação sem credencial/CPF/conteúdo clínico. Protocolo, perda/rotação de chaves e consumo em backup/rollback no ADR proposto.

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
- **Critérios:** TA-PAT-008..016 em [spec.md](../../specs/003-webfit-5-cadastro-paciente/spec.md).
- **Prioridade:** refinamento solicitado do incremento 1; prioridade neutra no Plane.
- **Status:** solicitado por Maycon em 2026-10-07; registro/preparação com migração autorizados. Aprovação funcional conjunta e execução do plano pendentes. Não substitui ainda RF-PAT-001/003 ou RN-PAT-001/003/005/006.
- **Decisões:** D-PAT-001/002 provisórias em [decision-log.md](../project/decision-log.md); [plan.md](../../specs/003-webfit-5-cadastro-paciente/plan.md) cobre migração/backup.

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

### RF-DRF-002 — Recuperar rascunho no contexto do formulário

- **Descrição:** ao abrir novamente o formulário longo de um preenchimento automaticamente salvo, perguntar se a pessoa deseja restaurar ou descartar o rascunho correspondente. Não apresentar uma lista global de rascunhos na tela de pacientes.
- **Escopo:** perfil profissional, cadastro e edição de paciente e montagem de prescrição/cardápio, conforme RF-DRF-001; outros formulários somente após serem classificados como longos por requisito aprovado.
- **Restaurar:** preencher o formulário correspondente com os valores salvos e permitir continuar o trabalho.
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

- **Descrição:** registrar ator, instante, espaço, ação, entidade e resultado de eventos críticos e permitir consulta paginada pelos usuários autenticados e autorizados. D-AUTO-001 propõe apresentação tipada para usuário, sistema e tentativa não autenticada.
- **Consulta:** abrir com os últimos 30 dias, 50 registros por página e ordenação fixa do mais recente para o mais antigo; permitir filtros combinados com AND por período, usuário, ação, tipo de entidade e resultado. D-AUTO-002 propõe janela UTC semiaberta congelada, desempate por ID e cursor opaco para estabilidade.
- **Detalhe:** apresentar somente metadados autorizados; resolver o rótulo atual da entidade quando permitido e usar tipo/ID como fallback.
- **Ações:** listar, filtrar, paginar e abrir detalhe; não editar, excluir ou exportar no incremento 1.
- **Retenção:** manter os eventos por tempo indeterminado no MVP, sem exclusão automática, até existir política legal aprovada.
- **Erro:** operação crítica ou autenticação bem-sucedida não é concluída se seu evento obrigatório não puder ser persistido; operação ou login já rejeitado permanece rejeitado e produz somente diagnóstico técnico seguro. Falha de consulta aparece como erro seguro, nunca como lista vazia, e permite nova tentativa quando recuperável.
- **Restrição:** não registrar senha, CPF completo, conteúdo clínico, nome de arquivo, snapshots ou dados anteriores/posteriores.
- **Regras:** RN-AUD-001 a RN-AUD-017.
- **Critérios:** TA-AUD-001 a TA-AUD-015.
- **Prioridade:** obrigatória — incremento 1.
- **Status:** baseline aprovada por Maycon em 2026-09-10; refinamentos D-AUTO-001 e D-AUTO-002 estão `AGENT-PROVISIONAL`.
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

- **Descrição:** hambúrguer oculta toda a lateral e deixa somente seu botão para reabrir; menu principal contém apenas Consultório/Pacientes. Engrenagem ao lado do usuário abre tela Configurações com Auditoria e Backup e restauração. Nome clicável abre Acesso e Perfil profissional.
- **Atores:** nutricionista e administrador autenticados, com permissões existentes.
- **Prioridade:** incremento atual; ordem técnica das jornadas P1 em spec.md, sem atribuir prioridade humana alta/urgente no Plane.
- **Status:** escopo explicitamente aceito por Maycon em 2026-10-07 (DEC-055); execução do plano e D-NAV-001/002 aprovadas por Maycon em 2026-10-07. Nenhuma aprovação clínica ou de Amanda inferida.
- **Aceite:** TA-UX-NAV-001..008. Preservar rascunhos/erros, sessão/troca obrigatória, auditagem real de acesso, backup/restauração, tours e faixa de atualização. Consultório é grupo visual, Saúde continua espaço aprovado.
- **Fonte operacional:** [Specification](../../specs/002-webfit-4-navegacao-consultorio/spec.md), [Plan](../../specs/002-webfit-4-navegacao-consultorio/plan.md) e [Tasks](../../specs/002-webfit-4-navegacao-consultorio/tasks.md).

## WEBFIT-9 — complemento aprovado de RF-UPD-001

**Status:** aprovado para implementação por Maycon em 2026-10-08, após proposta nesta conversa. Consulta ao login, a cada 30 minutos e retorno à janela; faixa compacta acima de toda navegação/conteúdo com Atualizar à direita e orientação explícita para salvar antes do reinício. Consulta não interrompe edição/offline; instalação mantém backup/assinatura/autorização/bloqueios. Aceite TA-UPD-UI-003..006; spec em specs/006-webfit-9-faixa-atualizacao/. D-UPD9-001 provisória permitida: cooldown um minuto e adiamento por versão/sessão. Não aprova dados reais/publicação/aceite final.
