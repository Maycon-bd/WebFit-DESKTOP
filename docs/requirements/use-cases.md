# Casos de uso

**Status:** casos de uso do primeiro incremento aprovados.

| ID | Título | Ator principal | Resultado | Requisitos | Status |
|---|---|---|---|---|---|
| UC-AUT-001 | autenticar e entrar no Saúde | nutricionista/administrador | sessão autorizada e espaço ativo | RF-AUT-002, RF-CLI-002 | aprovado |
| UC-AUT-002 | redefinir senha | administrador | senha temporária e troca obrigatória | RF-AUT-003 | aprovado |
| UC-CLI-001 | manter perfil profissional | nutricionista/administrador | perfil validado e persistido | RF-CLI-001 | aprovado |
| UC-PAT-001 | cadastrar paciente | nutricionista/administrador | paciente ativo criado sem CPF duplicado | RF-PAT-001, RF-PAT-006 | aprovado |
| UC-PAT-002 | localizar e editar paciente | nutricionista/administrador | paciente localizado e alteração confirmada | RF-PAT-002, RF-PAT-003 | aprovado |
| UC-PAT-003 | arquivar e restaurar paciente | nutricionista/administrador | estado alterado sem perda de histórico | RF-PAT-004 | aprovado |
| UC-BKP-001 | criar backup | nutricionista/administrador/sistema | pacote válido criado e estado atualizado | RF-BKP-001, RF-BKP-003 | aprovado |
| UC-BKP-002 | restaurar backup | nutricionista/administrador | pacote validado e dados restaurados | RF-BKP-002 | aprovado |

## Fluxos e erros obrigatórios

- Credencial inválida mantém sessão fechada e aplica a espera correspondente.
- CPF inválido ou duplicado impede conclusão e preserva o formulário.
- Cancelar edição não persiste alterações.
- Arquivado não recebe novo registro até restauração.
- Falha de backup mantém dados atuais e informa erro acionável.
- Backup inválido nunca substitui o estado atual.
- Toda falha relevante registra apenas metadados seguros na auditoria.
