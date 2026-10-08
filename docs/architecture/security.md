# Segurança e privacidade

## Ativação offline — WEBFIT-10

DEC-058 aprova direção funcional, sem implementação ainda: administrador de Maycon por instalação, emissão offline controlada, cinco tipos de autorização, emissor separado com interface e suporte temporário até 4 h por sessão. Toda autorização é validada no backend; instalador não recebe senha mestra ou chave privada de emissão. Ambos os papéis continuam com acesso total ao Saúde conforme baseline.

[ADR-0003](adr/ADR-0003-ativacao-offline-e-suporte.md) é **proposto**: assinatura de licença separada do updater, credenciais Argon2 específicas, vínculo por instalação e envelope protegido a detalhar. Algoritmo/biblioteca/custódia/rotação/recuperação/consumo em restauração ainda não aprovados. Sem garantia de resgate global ou revogação remota offline; clone/rollback/relógio alterado e controle do Windows são limites do threat model. Licença não descriptografa automaticamente banco/copias nem autoriza diagnóstico de dados reais.


**Status:** baseline aprovada; controles criptográficos dependem do spike.

## Atores e acesso

| Papel | Acesso aprovado |
|---|---|
| Nutricionista | acesso total aos dados e funções do espaço Saúde |
| Administrador | acesso total por decisão do produto, incluindo funções administrativas e clínicas |

O acesso total do administrador é uma decisão consciente de simplificação do MVP e aumenta o impacto de comprometimento da conta. Toda operação continua autorizada no backend e ações críticas são auditadas.

## Autenticação

- Senha de acesso mínima de 6 caracteres (DEC-047, Maycon, 2026-10-07); recomendar frases-senha.
- Hash forte com salt individual e parâmetros versionados; nunca criptografia reversível de senha.
- Espera progressiva após falhas; sem bloqueio permanente automático.
- Bloqueio após 1 hora de inatividade e ao bloquear o Windows.
- Reset gera senha temporária, força troca e não revela senha anterior.
- Recuperação remota é futura e exige desenho separado; nenhuma senha mestra embutida.

## Dados sensíveis

- Senhas, chaves, CPF, prontuário, mensagem e documento clínico são proibidos em logs.
- Segredos não entram no frontend ou repositório.
- Banco, arquivos, assinatura, rascunhos e backups precisam de proteção coerente.
- Arquivos são privados, nomeados por UUID e acessados por comando autorizado.
- Exportação futura exige ação explícita e auditoria de destinatário/finalidade.

## Auditoria mínima

Registrar ator, instante UTC, espaço, ação, tipo/ID da entidade, resultado e motivo quando aplicável. Auditar login, falha, reset, perfil, consulta e alteração de paciente, arquivamento/restauração, tags, documentos, exportações, backup e restauração. Não duplicar conteúdo clínico no evento.

A consulta exige usuário autenticado e autorizado, é limitada ao escopo permitido e não expõe snapshots, diferenças before/after ou rótulo sem autorização. Abertura do módulo e de detalhe é auditada sem conteúdo visualizado e sem recursão automática.

## Bloqueios antes de dados reais

- provar proteção local e armazenamento de chave;
- testar backup/restauração criptografados;
- definir retenção legal definitiva;
- exercitar resposta a incidente;
- aceitar formalmente o risco do acesso administrativo total;
- concluir Gate G7.
