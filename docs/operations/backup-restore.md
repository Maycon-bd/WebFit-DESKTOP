# Backup e restauração

## Licenciamento e suporte — WEBFIT-10 (desenho pendente)

DEC-058 aprova transferência/recuperação com destino autorizado/backup validado; licença inicial não substitui restauração. Identidade/licença/consumo do destino não podem ser sobrescritos indevidamente pelo backup da origem; protocolo/migração pendentes. Reinicialização limpa consultório mantendo licença/acessos/consumo, após backup e confirmação separados; não autoriza apagar banco real.

O código atual cria `.webfit-backup` a partir de snapshot e senha de recuperação; SQLCipher/DPAPI impedem tratar apenas o `.db` como pacote portátil. Credencial administrativa/licença não fornece a chave do banco. RF-LIC-006, cópia protegida para diagnóstico isolado, foi adiado por Maycon para outra demanda; não implementar/enviar dados reais neste escopo. Retorno de banco completo pode eliminar trabalho posterior ao snapshot: regra na demanda futura. [Registro e ADR](../../specs/WEBFIT-10/task.md).


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
