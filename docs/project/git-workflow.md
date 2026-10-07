# Fluxo Git

O repositório adotou Git Flow em 2026-08-13 (DEC-010). **A DEC-054, aceita por Maycon em 2026-10-07, transfere o controle de Git ao humano e substitui as exigências de branch por demanda para o agente.** Toda demanda será feita na branch atualmente ativa, sem exigir criação/troca, base `develop` ou árvore limpa. Inspeção somente leitura continua permitida para preservar trabalho e registrar evidências. Os gates de produto e rastreabilidade permanecem.

O agente não executa operações que alteram Git por iniciativa própria; autorização posterior precisa descrever a operação específica. As convenções, proteções remotas e comandos abaixo são referência para Maycon administrar integração e releases, não instruções automáticas nem bloqueios de edição local.

## Ramos permanentes

| Ramo | Finalidade | Regra |
|---|---|---|
| `main` | histórico de versões liberadas ou prontas para liberação | não recebe trabalho direto; recebe finalização de release ou hotfix |
| `develop` | integração do próximo incremento ou release | recebe finalização de features e integrações aprovadas |

## Ramos temporários

| Tipo | Origem | Destino | Nome | Quando usar |
|---|---|---|---|---|
| Feature | `develop` | `develop` | `feature/<id>-<resumo>` | requisito ou tarefa aprovada |
| Release | `develop` | `main` e `develop` | `release/<versão>` | preparação e estabilização de uma versão |
| Hotfix | `main` | `main` e `develop` | `hotfix/<id>-<resumo>` | correção urgente de uma versão liberada |
| Support | `main` ou release aplicável | conforme necessidade | `support/<versão>` | manutenção excepcional de versão anterior |

Use nomes em minúsculas, com hífens. O ID deve ser de requisito, risco, ADR ou tarefa rastreável; exemplos: `feature/rf-pat-001-cadastro-minimo` e `hotfix/rsk-004-restauracao-backup`.

## Regras operacionais

1. Não iniciar `feature/` sem requisito com ID, critérios de aceite e status `aprovado`.
2. Criar `feature/` a partir de `develop`; criar `release/` a partir de `develop`; criar `hotfix/` a partir de `main`.
3. Vincular commits, pull requests, testes e versão aos IDs da [matriz de rastreabilidade](../requirements/traceability.md).
4. Antes de integrar, executar os controles de qualidade disponíveis e atualizar documentação, testes e rastreabilidade.
5. Integrar uma release em `main` e de volta em `develop`; integrar um hotfix em ambos para evitar divergência.
6. Criar tag anotada `v<versão>` somente para uma release aprovada. Não há versão liberada nesta etapa.
7. Proteger `main` e `develop` no GitHub com revisão obrigatória e checagens requeridas quando esses controles estiverem disponíveis.

## Relação entre Git e atualização instalada

- Commit ou merge em `feature/*` e `develop` nunca atualiza a máquina da stakeholder.
- Merge revisado em `main` publica automaticamente o canal piloto por meio do pipeline aprovado; isso não instala sozinho na máquina da stakeholder.
- Commit direto em `main` continua proibido.
- A distribuição exige versão SemVer, tag `v<versão>`, artefato NSIS, verificações, notas e autorização humana específica.
- Durante G5/G6, a publicação piloto é automática após o merge revisado; a instalação é semiautomática, com ícone e confirmação da nutricionista.
- O updater consulta somente artefatos assinados no repositório público separado; não há instalação forçada durante uso clínico.
- A estratégia completa está em [update-release-strategy.md](../operations/update-release-strategy.md) e depende do ADR-0002.

## Comandos usuais

O utilitário `git-flow` não é necessário; a convenção usa Git nativo.

```powershell
# Iniciar uma feature
git switch develop
git pull --ff-only
git switch -c feature/rf-dom-001-resumo

# Finalizar uma feature após revisão e verificações
git switch develop
git merge --no-ff feature/rf-dom-001-resumo
git push origin develop

# Preparar uma release
git switch develop
git switch -c release/0.1.0

# Finalizar uma release aprovada
git switch main
git merge --no-ff release/0.1.0
git tag -a v0.1.0 -m "WebFit Desktop 0.1.0"
git switch develop
git merge --no-ff release/0.1.0
git push origin main develop --follow-tags
```

Use pull request em vez de merge local quando a proteção de ramos estiver habilitada. Não faça release, tag ou hotfix enquanto os gates pertinentes permanecerem pendentes.
