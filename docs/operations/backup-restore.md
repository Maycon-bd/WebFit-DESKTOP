# Backup e restauração

## Continuação operacional — 2026-10-08

No candidato em desenvolvimento, falhas automáticas são auditadas como Sistema e manuais como usuário autenticado, sem nome de arquivo ou conteúdo clínico. O estado de backup aparece como alerta na sessão quando falha ou ultrapassa 24h, com acesso à recuperação; erro de consulta do estado não aparece como sucesso. Após tentativa manual ou de restauração, a interface consulta novamente o estado, inclusive na falha da cópia de segurança. O automático ocorre no primeiro login diário, sem duplicar cópia válida do mesmo dia UTC. Só cópias do diretório gerenciado são rotacionadas após novo backup validado; cópia manual externa não é removida por essa rotina.

Temporários têm limpeza ao falhar e o novo pacote é removido se não puder persistir seu evento obrigatório; pacotes existentes não são sobrescritos. Restauração ainda exige confirmação, validação, cópia de segurança e mantém as regras de licença abaixo. [Implementação, testes e limites](../../.harness/evidence/health-increment/2026-10-08-audit-recovery.md). Esse registro não declara aceite Windows/G5 nem amplia autorização para dados reais.

## Licenciamento e suporte — WEBFIT-10

ADR-0003 v1 aprovado para implementação. Restore valida DB schema 1/2/3 em staging (WEBFIT-5), migra staging legado e verifica integridade novamente; exige mesma licença de origem para restore comum. Destino vazio exige transferência autorizada por licença de origem ou SHA-256 do arquivo legado. Não importa tabelas license_*, identidade, preferências de login ou senha antiga. Mantém contas/senhas atuais do destino e autores históricos inativos, sem login. Destino preparado faz backup de segurança antes do efeito; destino vazio não exige backup de configuração inexistente. Falha preserva estado e grant pendente.

WEBFIT-5: backup schema3 conserva UUID e número do paciente. Restore mantém o maior contador origem/destino, sem reutilizar números posteriores ao backup. Em backups 1/2 sem números, UUIDs conhecidos mantêm os números do destino; desconhecidos recebem novos números acima do contador local. Snapshot pré-migração instalado fica em `migration-snapshots/<UUID>.db`, cifrado pela chave local DPAPI; não é `.webfit-backup` portátil e requer a chave local original para recuperação técnica. Não copiar banco ativo nem substituir banco instalado automaticamente. Implementação local; roundtrips SQLCipher/DPAPI e ensaio Windows permanecem pendentes de execução no ambiente adequado.

Reinicialização exige administrador, autorização, backup consistente validado e confirmação; preserva licença/acessos/perfil/auditoria/backups/consumo. Limpa apenas pacientes/prescrições/tags/vínculos e drafts clínicos. Não apagar banco real nesta sessão. `.webfit-backup` continua snapshot consistente cifrado e recuperável por senha; copiar somente `.db` não fornece chave DPAPI. Pacote para suporte por cópia RF-LIC-006 adiado. Cofre do emissor usa `.webfit-issuer-backup`, distinto do clínico. [Operação do emissor](../../tools/license-issuer/README.md), [registro/evidência](../../specs/WEBFIT-10/task.md).

**Status:** política do MVP aprovada; implementação e criptografia dependem do spike.

## Objetivos

- RPO máximo: 24 horas.
- RTO: até o próximo dia útil.
- Backup automático no primeiro uso diário e botão **Fazer backup agora**.
- Retenção: backups válidos dos últimos 60 dias.
- Cópia para mídia externa no mínimo mensal, com destino definitivo ainda pendente.

## Pacote

- snapshot consistente do SQLite;
- arquivos privados;
- manifesto versionado;
- checksums;
- metadados mínimos de versão e criação;
- proteção criptográfica a validar no spike.

## Criação

1. Verificar destino e espaço livre.
2. Criar snapshot consistente, nunca cópia direta do banco ativo.
3. Montar pacote em área temporária.
4. Calcular checksums e validar integridade.
5. Publicar atomicamente no destino.
6. Registrar resultado sem conteúdo sensível.
7. Só então remover backups fora da retenção.

Se o aplicativo estiver fechado, o automático ocorre na próxima abertura. Falha é exibida imediatamente; mais de 24 horas sem backup válido gera alerta persistente.

## Restauração

1. Selecionar pacote.
2. Validar versão, manifesto, checksums, espaço, banco e arquivos em área temporária.
3. Rejeitar pacote inválido sem alterar o estado atual.
4. Solicitar confirmação explícita.
5. Criar backup de segurança do estado atual.
6. Aplicar a restauração de forma controlada.
7. Reabrir, verificar integridade e registrar o resultado.

## Destinos

O diretório padrão definitivo será escolhido no spike conforme permissões e isolamento do Windows; o caminho deve ser configurável. `C:\ProgramData\WebFit\Backups` é candidato, não fato aprovado. Pen drive ou SSD externo permanece decisão operacional pendente. Nuvem está fora do MVP e exige ADR.
