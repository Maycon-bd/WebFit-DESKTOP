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
| RN-DRF-001 | rascunhos aplicam-se a formulários longos; nunca a senha, login, administração, confirmação ou backup | aprovado |
| RN-DRF-002 | salvar aproximadamente a cada 30 segundos e antes de navegação segura | aprovado |
| RN-DRF-003 | rascunho pertence ao usuário e espaço, só aparece autenticado e é removido ao concluir ou descartar | aprovado |
| RN-DRF-004 | rascunhos abandonados são removidos após 30 dias; múltiplos rascunhos usam identificadores próprios | aprovado |

## Auditoria

| ID | Regra | Status |
|---|---|---|
| RN-AUD-001 | auditar login, falha, reset, alteração de perfil, criação/edição/consulta/arquivamento/restauração de paciente, tags, backup, restauração, arquivos, documentos e exportações | aprovado |
| RN-AUD-002 | auditoria registra metadados mínimos e resultado, nunca senha, CPF completo ou conteúdo clínico | aprovado |

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
