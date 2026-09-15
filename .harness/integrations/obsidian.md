# Obsidian

Status: **ACTIVE**.

## Papel

Obsidian é a camada de navegação e conhecimento do WebFit Desktop. Ele não é uma fonte paralela da verdade, não publica requisitos ou decisões concorrentes e não substitui o harness, o Spec Kit ou o Git.

O Vault ativo é a raiz do repositório:

`D:\MAYCON\PROJETOS\WebFit-DESKTOP`

O `README.md` da raiz é o entrypoint humano principal. A partir dele, o Obsidian pode navegar pelos documentos canônicos em `docs/` e pelos artefatos Spec Kit em `specs/`. Codex e Obsidian trabalham sobre os mesmos arquivos locais; não há cópia, exportação ou sincronização intermediária entre eles.

`.harness/`, `.specify/` e `.agents/` são infraestrutura técnica. Não precisam aparecer na navegação normal do Obsidian e não devem ser copiados para `docs/` apenas para torná-los visíveis. Também não criar nova estrutura documental enquanto a estrutura atual atender à navegação.

## Limites operacionais

- Não instalar plugins comunitários automaticamente.
- Não ativar ou configurar Obsidian Sync automaticamente.
- Não criar uma segunda versão de documentos canônicos no Vault.
- Alterações feitas pelo usuário no Obsidian são alterações reais nos arquivos do repositório e ficam sujeitas ao Git normalmente.

## `.obsidian/`

A configuração existente contém somente estado local da interface do Obsidian — preferências, favoritos, plugins nativos, gráfico e layout de workspace — sem conteúdo canônico ou decisão de compartilhamento. Recomenda-se mantê-la fora do Git. Não remover, sobrescrever ou normalizar essa configuração automaticamente. A presença do plugin nativo Sync na configuração de interface não equivale à ativação de sincronização; nenhuma conta ou sincronização deve ser configurada automaticamente.

O estado efetivo e a recomendação de versionamento devem ser revisados se houver decisão explícita futura de compartilhar uma configuração de workspace.
