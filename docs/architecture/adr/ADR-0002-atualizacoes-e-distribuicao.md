# ADR-0002 — Atualizações e distribuição do aplicativo

## Revisão vigente — 2026-10-06 (DEC-044)

Maycon aprovou priorizar o MVP útil para Amanda, com instalação e atualização manuais. Atualizações automáticas, runner e primeira publicação piloto estão ADIADOS e não bloqueiam o primeiro incremento. Preparação existente preservada, sem ativação. SQLCipher/DPAPI e backup/restauração permanecem aprovados. Os detalhes de atualização automática abaixo descrevem a estratégia futura suspensa; DEC-044 prevalece quanto ao momento de execução. Nenhuma publicação ou implementação G5 foi autorizada por esta revisão.

- **Status:** aceito — `ACCEPTED`
- **Data:** 2026-09-21
- **Decisor técnico:** Maycon
- **Decisora de comportamento e operação:** Amanda
- **Decisões relacionadas:** DEC-010, DEC-020, DEC-042 e DEC-043

## Contexto

A nutricionista participará do desenvolvimento usando versões piloto frequentes. O produto continuará local/offline, em uma única máquina e sem mensalidade obrigatória. Atualizações podem alterar executável, dependências, schema e dados persistidos; publicar diretamente a cada commit amplia o risco de interrupção do atendimento e corrupção/incompatibilidade de dados. Maycon aprovou que um merge revisado na `main` publique automaticamente o canal piloto, desde que a instalação na máquina da nutricionista permaneça confirmada pela usuária.

## Opções

1. Atualização manual por NSIS em todas as fases.
2. Publicação automática do canal piloto após merge revisado na `main`, com updater assinado e confirmação da usuária.
3. Atualização automática e silenciosa após cada commit/merge em `main`.
4. Servidor dinâmico próprio de atualizações.

## Recomendação

Adotar a opção 2:

- merge revisado na `main` publica automaticamente uma versão do canal piloto;
- o aplicativo verifica atualizações, mostra um ícone e solicita confirmação antes da instalação;
- backup, download, validação da assinatura, instalação e reinício são automáticos após a confirmação;
- não há atualização forçada durante o uso;
- o build usa runner Windows auto-hospedado para preservar custo recorrente de R$ 0;
- um repositório público separado contém somente instaladores, `latest.json`, assinaturas, checksums e notas, sem código-fonte ou segredos;
- o canal estável será ativado posteriormente mediante release aprovada, com dados reais somente após os gates aplicáveis.

## Razões

- separa integração de código de distribuição para uso;
- mantém feedback frequente sem transformar a máquina clínica em ambiente de desenvolvimento;
- permite validar migração, backup e restauração antes da instalação;
- preserva operação offline quando não houver internet;
- evita credencial GitHub dentro do aplicativo;
- mantém caminho para melhor experiência futura sem impor infraestrutura paga.

## Consequências

- merges em `main` precisam passar pelas checagens do pipeline e geram versões piloto SemVer pré-release, notas, assinatura e checksum;
- releases estáveis precisam de SemVer, notas, checklist e aprovação de promoção;
- piloto e estável precisam de identificadores/diretórios de dados distintos;
- a chave privada do updater vira ativo crítico e exige custódia e recuperação;
- GitHub Actions privado não garante custo zero além da franquia; pipeline hospedado não é requisito;
- rollback exige considerar binário e schema, não apenas reinstalação do executável.

## Critérios para aceitar o ADR

- canais desenvolvimento, piloto e estável aprovados;
- merge revisado na `main` aprovado como gatilho de publicação do canal piloto;
- confirmação da usuária aprovada como requisito antes da instalação;
- runner Windows auto-hospedado e repositório público separado de artefatos aprovados;
- assinatura Tauri, backup pré-atualização, falha de rede, chave inválida, migração e retorno cobertos pelo spike do updater antes do uso real;
- canal estável condicionado a promoção posterior e aos gates de release.

## Aprovação humana

Maycon aprovou integralmente esta decisão em 2026-09-21. A aprovação cobre a direção arquitetural e operacional; não autoriza ainda instalar dependências, criar credenciais, configurar o runner, publicar releases ou iniciar a implementação sem o gate específico do G5.

Detalhamento operacional: [update-release-strategy.md](../../operations/update-release-strategy.md).
