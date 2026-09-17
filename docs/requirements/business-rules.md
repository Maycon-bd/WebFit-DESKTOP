# Regras de negócio

**Status:** regras do primeiro incremento aprovadas em 2026-08-20.

## Autenticação

| ID | Regra | Status |
|---|---|---|
| RN-AUT-001 | senha deve possuir no mínimo 8 caracteres; frases-senha são aceitas; senha nunca é armazenada ou registrada em texto claro | aprovado |
| RN-AUT-002 | existem os papéis nutricionista e administrador; ambos possuem acesso total por decisão dos aprovadores | aprovado |
| RN-AUT-003 | após 4 falhas, aplicar esperas de 30 s, 1 min, 5 min e 15 min nas falhas subsequentes; não bloquear permanentemente | aprovado |
| RN-AUT-004 | bloquear a sessão após 1 hora de inatividade e quando o Windows for bloqueado | aprovado |
| RN-AUT-005 | reset administrativo gera senha temporária, exige troca no primeiro acesso, não revela a anterior e é auditado | aprovado |

## Perfil e espaços

| ID | Regra | Status |
|---|---|---|
| RN-CLI-001 | perfil profissional pertence ao usuário e pode ser usado nos espaços autorizados | aprovado |
| RN-CLI-002 | Saúde é o único espaço implementado no MVP; Educação permanece isolada e futura | aprovado |
| RN-CLI-003 | logotipo e assinatura são privados, autorizados pelo backend e auditados quando alterados | aprovado |

## Pacientes

| ID | Regra | Status |
|---|---|---|
| RN-PAT-001 | nome completo, CPF, telefone, nascimento, e-mail e endereço são obrigatórios | aprovado |
| RN-PAT-002 | CPF é normalizado para dígitos, validado e único no espaço Saúde, inclusive para paciente arquivado | aprovado |
| RN-PAT-003 | no MVP, cadastro sem CPF válido é rejeitado; exceções exigem novo requisito | aprovado |
| RN-PAT-004 | nome social é opcional e preferido na interface quando informado, preservando nome civil | aprovado |
| RN-PAT-005 | sexo e gênero são campos separados; gênero é opcional | aprovado |
| RN-PAT-006 | responsável legal é informado quando aplicável, com nome, CPF, vínculo, telefone e e-mail | aprovado |
| RN-PAT-007 | pesquisa ignora caixa, acentos e formatação de CPF/telefone; CPF é mascarado na lista | aprovado |
| RN-PAT-008 | arquivar nunca exclui dados nem histórico | aprovado |
| RN-PAT-009 | paciente arquivado deve ser restaurado antes de receber novos registros | aprovado |
| RN-PAT-010 | tags usadas podem ser renomeadas ou desativadas, mas não removidas do histórico | aprovado |

## Rascunhos

| ID | Regra | Status |
|---|---|---|
| RN-DRF-001 | rascunhos automáticos aplicam-se a todo formulário explicitamente classificado como longo; nunca a senha, login, administração, confirmação ou backup | aprovado por Maycon em 2026-09-10 |
| RN-DRF-002 | salvar aproximadamente a cada 30 segundos e antes de navegação segura; falha informa estado real e preserva a última versão válida | aprovado por Maycon em 2026-09-10 |
| RN-DRF-003 | rascunho pertence ao usuário e espaço, só aparece autenticado e é removido ao concluir ou descartar | aprovado por Maycon em 2026-09-10 |
| RN-DRF-004 | rascunhos automáticos abandonados são removidos após 30 dias; múltiplos rascunhos usam identificadores próprios | aprovado por Maycon em 2026-09-10 |
| RN-DRF-005 | rascunho automático de formulário é temporário e não integra o histórico clínico; prescrição explicitamente salva em estado rascunho é persistente, versionável e não expira pela regra de 30 dias | aprovado por Maycon em 2026-09-10 |

## Prescrição e cardápio

| ID | Regra | Status |
|---|---|---|
| RN-PRE-001 | TBCA versão 7.3 é a fonte principal; cada alimento registra código, fonte e versão | aprovado por Amanda |
| RN-PRE-002 | TACO é fallback quando o alimento não existir na TBCA; não mesclar valores silenciosamente | aprovado por Amanda |
| RN-PRE-003 | composição é armazenada por 100 g de parte comestível e mantém unidade original do nutriente | aprovado por Amanda |
| RN-PRE-004 | grama é a quantidade canônica; medida caseira só calcula após conversão explícita para gramas | aprovado por Amanda |
| RN-PRE-005 | alimento personalizado não altera alimento oficial e exige nome, porção, composição por 100 g e origem, como rótulo | aprovado por Amanda |
| RN-PRE-006 | calcular item por proporção da quantidade em gramas e somar por refeição e cardápio, preservando precisão interna | aprovado por Amanda |
| RN-PRE-007 | exibir kcal inteira; macro e fibras com 1 casa decimal; micronutrientes com 1 ou 2 conforme unidade; arredondar apenas na apresentação | aprovado por Amanda |
| RN-PRE-008 | prescrição finalizada é imutável; correção cria nova versão ligada à anterior | aprovado por Amanda |
| RN-PRE-009 | ao finalizar nova versão, a anterior permanece no histórico como substituída | aprovado por Amanda |
| RN-PRE-010 | cancelamento exige motivo, preserva a versão e é auditado | aprovado por Amanda |
| RN-PRE-011 | todo cálculo energético registra método, referência, versão, entradas e origem automática ou manual | aprovado por Amanda em 2026-09-10 |
| RN-PRE-012 | Harris-Benedict usa as equações revisadas de Roza e Shizgal (1984); GET é TMB multiplicada pelo fator de atividade selecionado | aprovado por Amanda em 2026-09-10 |
| RN-PRE-013 | EER/DRI 2023 atende inicialmente pessoas de 3 a 18,99 anos por sexo, faixa etária e categoria de atividade; a atividade já integra a equação e não recebe fator adicional | aprovado por Amanda em 2026-09-10 |
| RN-PRE-014 | gestação usa a equação não gestante no primeiro trimestre e as equações DRI 2023 no segundo e terceiro, com idade, altura, peso atual, atividade, semana e depósito energético de +300, +200, +150 ou -50 kcal/dia conforme IMC pré-gestacional | aprovado por Amanda em 2026-09-10 |
| RN-PRE-015 | lactação usa DRI 2023: aleitamento exclusivo de 0 a 6 meses soma 540 e subtrai 140 kcal/dia; aleitamento parcial de 7 a 12 meses soma 380 kcal/dia; outros padrões exigem ajuste manual | aprovado por Amanda em 2026-09-10 |
| RN-PRE-016 | a projeção de perda ou ganho usa, por padrão, ajuste diário = variação desejada em kg × 7.800 kcal/kg ÷ prazo em dias, com sinal conforme o objetivo; o coeficiente é configurável e o resultado é identificado como estimativa | aprovado por Amanda em 2026-09-10 |
| RN-PRE-017 | meta inferior à TMB não é bloqueada, mas exige alerta e confirmação; o histórico registra valor, confirmação, usuário e instante | aprovado por Amanda em 2026-09-10 |
| RN-PRE-018 | em condição clínica especial, o cálculo é estimativa teórica com alerta, aceita ajuste manual e não se torna prescrição definitiva automaticamente | aprovado por Amanda em 2026-09-10 |
| RN-PRE-019 | carboidratos e proteínas convertem a 4 kcal/g e gorduras a 9 kcal/g; quando informados em percentuais, os três percentuais devem totalizar 100% | aprovado por Amanda em 2026-09-10 |
| RN-PRE-020 | proteína em g/kg tem prioridade; o sistema calcula proteína, preserva o percentual de carboidratos informado e usa gordura como variável de fechamento | aprovado por Amanda em 2026-09-10 |
| RN-PRE-021 | proteína mais carboidrato acima da energia total gera erro; igualdade, que produziria gordura zero, exige ajuste antes de concluir | aprovado por Amanda em 2026-09-10 |
| RN-PRE-022 | fibras usam a meta aplicável por idade e sexo; em diabetes prevalece o maior valor entre essa meta e 14 g/1.000 kcal; gestação e lactação têm prioridade com 28 e 29 g/dia | aprovado por Amanda em 2026-09-10 |
| RN-PRE-023 | energia é exibida sem casas decimais e macronutrientes e fibras com uma; cálculos intermediários preservam precisão e só a apresentação arredonda | aprovado por Amanda em 2026-09-10 |
| RN-PRE-024 | a faixa de adequação do cardápio é inclusiva entre 95% e 105%; substituição manual preserva valor calculado, valor final, usuário, UTC, origem manual e observação opcional | aprovado por Amanda em 2026-09-10 |

## Auditoria

| ID | Regra | Status |
|---|---|---|
| RN-AUD-001 | auditar login, falha, reset, alteração de perfil, criação/edição/consulta/arquivamento/restauração de paciente, tags, backup, restauração, arquivos, documentos e exportações | aprovado |
| RN-AUD-002 | auditoria registra metadados mínimos e resultado, nunca senha, CPF completo ou conteúdo clínico | aprovado |
| RN-AUD-003 | eventos de auditoria são imutáveis e permanecem por tempo indeterminado no MVP, sem edição ou exclusão automática, até aprovação de política legal de retenção | aprovado por Maycon em 2026-09-10 |
| RN-AUD-004 | operação crítica e autenticação bem-sucedida só concluem com o evento obrigatório persistido; falha de auditoria desfaz ou impede a mudança, enquanto operação ou login já rejeitado permanece rejeitado e emite diagnóstico técnico seguro | aprovado por Maycon em 2026-09-10 |
| RN-AUD-005 | somente usuário autenticado e autorizado consulta eventos do escopo permitido; o modelo definitivo de capacidades por papel permanece decisão separada | aprovado por Maycon em 2026-09-10 |
| RN-AUD-006 | filtros combináveis usam AND e abrangem período, usuário, ação, tipo de entidade e resultado; módulo, origem, ID específico e texto livre ficam fora do incremento 1 | aprovado por Maycon em 2026-09-10 |
| RN-AUD-007 | a ordenação do incremento 1 é fixa do evento mais recente para o mais antigo | aprovado por Maycon em 2026-09-10 |
| RN-AUD-008 | a consulta é paginada no backend em páginas de 50 registros e não carrega toda a trilha na memória da interface | aprovado por Maycon em 2026-09-10 |
| RN-AUD-009 | a consulta inicial cobre os últimos 30 dias; o período pode ser alterado, os instantes permanecem em UTC e a semântica de fronteira deve ser determinística, documentada no plano e estável entre páginas | aprovado por Maycon em 2026-09-10 |
| RN-AUD-010 | ação, tipo de entidade e resultado usam catálogos controlados; resultados iniciais são SUCCESS, FAILURE e DENIED | aprovado por Maycon em 2026-09-10 |
| RN-AUD-011 | o evento persiste somente tipo e ID da entidade; a interface pode resolver rótulo atual sob autorização e usa tipo + ID como fallback sem perder o evento histórico | aprovado por Maycon em 2026-09-10 |
| RN-AUD-012 | eventos não armazenam snapshots nem diferenças before/after; históricos específicos pertencem aos respectivos domínios | aprovado por Maycon em 2026-09-10 |
| RN-AUD-013 | a interface oferece lista, filtros, paginação e detalhe de metadados permitidos; não oferece edição, exclusão ou exportação no incremento 1 | aprovado por Maycon em 2026-09-10 |
| RN-AUD-014 | abertura do módulo e abertura do detalhe geram auditoria sem conteúdo visualizado; página, filtro, limpeza e ordenação não geram evento, e persistir esses eventos de acesso não dispara nova auditoria | aprovado por Maycon em 2026-09-10 |
| RN-AUD-015 | ausência de eventos, ausência de resultados e falha de consulta são estados distintos; falha nunca aparece como lista vazia e permite nova tentativa quando recuperável | aprovado por Maycon em 2026-09-10 |
| RN-AUD-016 | conforme D-AUTO-001, o ator apresentado usa tipo controlado USER, SYSTEM ou UNAUTHENTICATED; referência de usuário existe somente para USER, tentativas pré-autenticação não persistem identificador/credencial fornecido e o filtro de usuário alcança somente USER | aprovado por Amanda e Maycon em 2026-09-17 |
| RN-AUD-017 | conforme D-AUTO-002, cada consulta captura query_as_of_utc, usa intervalo semiaberto [from_utc, to_utc), com default entre query_as_of_utc − 30 × 24 h e query_as_of_utc, ordem total por instante UTC e ID decrescentes e cursor opaco vinculado ao snapshot, intervalo e filtros | aprovado por Amanda e Maycon em 2026-09-17 |

### Catálogos iniciais da auditoria no incremento 1

- **Ações:** LOGIN, PASSWORD_RESET, PROFILE_UPDATE, PATIENT_CREATE, PATIENT_VIEW, PATIENT_UPDATE, PATIENT_ARCHIVE, PATIENT_RESTORE, TAG_CREATE, TAG_ASSIGN, TAG_RENAME, TAG_DISABLE, PRESCRIPTION_CANCEL, BACKUP_CREATE, BACKUP_RESTORE, AUDIT_MODULE_OPEN e AUDIT_EVENT_DETAIL_VIEW.
- **Tipos de entidade:** USER, PROFESSIONAL_PROFILE, WORKSPACE, PATIENT, TAG, PRESCRIPTION, BACKUP e AUDIT_EVENT.
- **Resultados:** SUCCESS quando a operação conclui; FAILURE quando falha por credencial inválida, validação ou erro técnico; DENIED quando é impedida por autenticação, autorização ou regra de acesso.
- **Ator aprovado (D-AUTO-001):** USER mostra rótulo autorizado do usuário; SYSTEM mostra “Sistema”; UNAUTHENTICATED mostra “Não autenticado”. O filtro de usuário alcança somente eventos USER. A representação física deve aplicar os invariantes aprovados após o spike.

## Backup

| ID | Regra | Status |
|---|---|---|
| RN-BKP-001 | realizar backup automático no primeiro uso diário e permitir backup manual | aprovado |
| RN-BKP-002 | RPO máximo é 24 horas e RTO é até o próximo dia útil | aprovado |
| RN-BKP-003 | manter backups válidos dos últimos 60 dias | aprovado |
| RN-BKP-004 | só rotacionar arquivo antigo após o novo backup passar por checksum e integridade | aprovado |
| RN-BKP-005 | nunca copiar diretamente banco ativo; usar snapshot consistente | aprovado |
| RN-BKP-006 | restauração valida versão, manifesto, checksums, banco e arquivos em área temporária | aprovado |
| RN-BKP-007 | preservar estado atual e exigir confirmação antes da troca | aprovado |
