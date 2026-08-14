# Segurança e privacidade

**Status:** requisitos e desenho pendentes.

## Princípios vigentes

- Dados de saúde são sensíveis.
- Senhas, chaves, CPF, prontuários, mensagens e documentos clínicos não entram em logs.
- Segredos não entram no frontend nem no repositório.
- Toda operação é autorizada no backend; ocultar controles não basta.
- Consultas são parametrizadas e operações relacionadas usam transações.
- Banco, arquivos, backups, exportações e restaurações exigem proteção coerente.

## Lacunas bloqueantes

- Modelo de ameaças e responsabilidades do operador.
- Matriz de papéis e permissões.
- Autenticação, bloqueio e recuperação de acesso.
- Proteção de chaves pelo sistema operacional.
- Viabilidade de SQLCipher ou alternativa aprovada.
- Regras de auditoria, retenção, exportação e eliminação.
- Processo de incidentes e requisitos legais/LGPD aplicáveis.

Nenhum dado clínico real deve ser usado antes da validação dos controles e da restauração de backup.
