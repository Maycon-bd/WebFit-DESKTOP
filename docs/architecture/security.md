# Segurança e privacidade

## Painel mestra integrado — WEBFIT-16

DEC-059/ADR-0004, autorização de Maycon em 2026-10-09, evoluem o modelo separado abaixo. Painel pessoal autorizado no Rust por sessão mestra distinta da clínica; Argon2id compilado, sem senha clara/default, espera progressiva e bloqueio/inatividade. Configuração inválida recusa acesso. Cofre Ed25519 atual importado uma vez em subdiretório SQLCipher/DPAPI; identidade validada contra raízes fixas antes de substituir. Código de emissão integra produto; chave privada não integra instalador. [Procedimento/glossário](../operations/admin-panel.md).

Revelação explícita da chave SQLCipher fixa após habilitação/backup/integridade e auditoria; flag+auditoria transacionais. Status público sem chave. SQL externo não garante auditoria funcional; chave já conhecida não é revogada ao trocar mestra. Senha mestra/PHC/chave SQLCipher/seed/código/senhas de arquivos têm funções distintas. Efeitos clínicos/consumo/backup/reset preservam contratos anteriores. Fixtures apenas; sem G7/publicação inferidos.

## Ativação offline — WEBFIT-10

DEC-058 e ADR-0003 v1 ACCEPTED por Maycon (“Aprovo a implementação”, 2026-10-08). Backend valida Ed25519 estrito com confiança pública fixa no build, payload sealed box por destinatário e verificador Argon2 com limites de recursos. Cofre separado SQLCipher/DPAPI com backup AES-GCM/Argon2; sem chave privada global no produto/frontend. Identidade de instalação DPAPI fora do banco. Consumo e efeitos SQLite são transacionais; restore preserva licença/consumo/credenciais do destino e não reativa autores históricos. Suporte consome no login e usa deadline monotônico de quatro horas; auditoria diferencia ações de suporte. Schema 002 aditivo aprovado, apenas fixtures nesta execução.

Sem garantia de consumo global/revogação remota offline; clone/rollback integral e controle do Windows são limites do threat model. Licença não desencripta banco recebido nem autoriza diagnóstico de dados reais. Chaves públicas de fixture somente nos testes; configuração de release vazia recusa ativação até provisionamento humano. Evidência de checks e revisão pendente em [WEBFIT-10](../../specs/WEBFIT-10/task.md).

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
- Recuperação pela rede é futura; suporte local via AnyDesk usa painel mestra DEC-059/ADR-0004. Somente verificador compilado, não senha clara.

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
