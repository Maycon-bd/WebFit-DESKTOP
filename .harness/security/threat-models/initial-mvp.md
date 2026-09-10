# Threat model inicial — MVP Saúde

Status: inicial / TBD
Data: 2026-09-10

Este modelo registra somente o que já é conhecido no planejamento. Não é finding de segurança nem aprovação arquitetural.

## Atores conhecidos

- Nutricionista local.
- Administrador local.
- Paciente como entidade atendida, sem acesso ao aplicativo no MVP.
- Pessoa com acesso físico ao computador: risco conhecido, controles ainda dependentes do spike.

## Ativos conhecidos

- Credenciais e sessão local.
- Dados de pacientes e dados clínicos.
- Auditoria.
- Banco local, arquivos privados e backups.
- Chaves e material de proteção local.

## Fronteiras de confiança

- Usuário e aplicação desktop local.
- Frontend/WebView e fronteira backend/comandos, prevista no ADR-0001.
- Aplicação e filesystem privado.
- Aplicação e banco SQLite.
- Estado atual e destino externo de backup.

## Dados e integrações conhecidas

- Dados de saúde, CPF, credenciais, documentos clínicos e eventos de auditoria.
- Integrações externas de Plane, GitHub ou MCP não estão ativas.
- Atualização conectada, nuvem, sincronização e recuperação remota estão fora do MVP.

## Superfícies previstas

- Primeiro acesso, login, bloqueio e troca de senha.
- Comandos tipados de domínio.
- Persistência, migração, backup, restauração e verificação de integridade.
- Arquivos clínicos em incremento posterior.

## Riscos conhecidos

- Proteção local, armazenamento de chaves e criptografia ainda dependem do spike.
- Acesso administrativo total aumenta o impacto de comprometimento.
- Restauração, integridade e retenção legal precisam de validação antes de dados reais.

## TBD

- Modelo de ameaça detalhado por incremento.
- Controles contra acesso físico e recuperação de acesso.
- Proteção definitiva de banco, arquivos e backups.
- Threat model para arquivos clínicos e documentos A4.