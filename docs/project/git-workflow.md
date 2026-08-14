# Fluxo Git

O repositório adota Git Flow a partir de 2026-08-13. Esta convenção organiza a entrega incremental; ela não substitui os gates, a rastreabilidade ou a aprovação de requisitos.

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
