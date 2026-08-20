# Backup e restauração

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
