# Estado do projeto

## Stage
IMPLEMENTING

G1 foi aprovado em 2026-08-20. G2 e G3 foram aprovados em 2026-09-17. Maycon aprovou o G4, a política sem custo recorrente e o ADR-0001 em 2026-09-21. DEC-045 autorizou a execução G5 em 2026-10-06; produto novo na raiz e instalador de teste em verificação, somente com dados fictícios. A baseline da auditoria foi concluída e reavaliada sob DEC-038; D-AUTO-001/002 foram aceitos por Amanda e Maycon em 2026-09-17. O Spec Kit e o entrypoint `$webfit-task` estão integrados e prontos para smoke test posterior. G5/G6/G7 não foram concluídos.

## Confirmed

- Produto local, offline, Windows-first e um computador por instalação.
- MVP Saúde; Educação está fora do MVP.
- Amanda aprova domínio/aceite; Maycon é PO e responsável técnico.
- O harness usa `AUTONOMOUS DECISION WITH HUMAN VALIDATION`: escolhas justificáveis podem avançar como `AGENT-PROVISIONAL`; condições ASK-FIRST permanecem humanas.
- Spec Kit é a fonte operacional SDD; harness, documentos canônicos, Decisions Register/ADRs e AGENTS.md mantêm responsabilidades distintas conforme DEC-039.
- Plane está ACTIVE como camada controlada de gestão do trabalho: MCP ACTIVE, OAuth e leitura/escrita validadas no projeto `WEBFIT`; `WEBFIT-3` concluiu o spike G4 em `Done` e mantém vínculo externo com `PBI-001`.
- Obsidian está ACTIVE como camada de navegação e conhecimento sobre o Vault na raiz do repositório; `README.md` é o entrypoint humano, `docs/` e `specs/` são navegáveis, e Codex e Obsidian editam os mesmos arquivos locais. Não há cópia documental, MCP, plugin comunitário ou Sync ativado por esta integração.
- A Constitution 1.0.0 e a skill `$webfit-task` estão prontas; a feature `001-primeiro-incremento-saude` possui Specification, Plan, Tasks e artefatos aprovados no G3.
- Primeiro incremento: autenticação, perfil, Saúde, pacientes, prescrição/cardápio, auditoria, backup/restauração mínima e persistência.
- Requisitos, regras, critérios de aceite e rastreabilidade do primeiro incremento já existem em docs/requirements/.
- A auditoria tem retenção indeterminada no MVP e falha de auditoria bloqueia operação crítica/autenticação bem-sucedida.
- A consulta de auditoria usa usuário autenticado e autorizado, período padrão de 30 dias, filtros AND, ordem decrescente fixa e paginação de 50 registros.

- Arquivos clínicos ficam planejados para incremento posterior; biblioteca profissional vem depois do núcleo do MVP.
- Tauri 2/React/TypeScript/Vite/Rust/SQLite/SQLCipher e DPAPI são a direção de fundação aceita no ADR-0001; o spike permanece descartável e não é código de produto.
- DEC-042 aprovou a política de operação sem custo recorrente: instalação local/offline, SQLCipher Community com avisos de licença, backup local com cópia externa opcional, credencial de recuperação offline, NSIS, manutenção manual e ausência de nuvem/telemetria.
- DEC-043 aprovou a direção de atualização frequente; o repositório de releases e o runner foram preparados localmente, mas a ativação conectada, endpoint e publicação ainda estão pendentes de execução.

## Accepted decisions

- D-AUTO-001 — ator USER, SYSTEM ou UNAUTHENTICATED, sem credencial tentada; aceito por Amanda e Maycon em 2026-09-17.
- D-AUTO-002 — janela UTC semiaberta congelada, ordem total e cursor opaco estável; aceito por Amanda e Maycon em 2026-09-17.
- DEC-042 — política sem custo recorrente, ADR-0001 e fechamento do G4; aceito por Maycon em 2026-09-21.
- DEC-043 — publicação do canal piloto após merge revisado na `main`, updater assinado com confirmação da usuária, runner Windows próprio e repositório público de artefatos; aceito por Maycon em 2026-09-21.
- T081 foi aprovado e preparado localmente no spike: dependências do updater, chave fora do repositório, assinatura, UI de verificação, workflow e build assinado; o repositório `webfit-desktop-releases` foi criado e o runner `DESKTOP-GEUP094` foi registrado em `C:\actions-runner`. Em 2026-10-06, a correção autorizada para `NT AUTHORITY\NetworkService` resolveu o erro 1068; o serviço foi validado após reiniciar o Windows com `RUNNING` e `Listening for Jobs`. Maycon também autorizou nova chave do piloto: chave antiga preservada, nova senha protegida por DPAPI, chave pública do spike atualizada e assinatura verificada. Cadastro dos secrets de assinatura autorizado e confirmado por Maycon e pela imagem em 2026-10-06; endpoint configurado localmente sob autorização específica; workflow corrigido e verificado localmente sob autorização específica; assinatura no pipeline, custódia portátil e publicação ponta a ponta continuam pendentes. Estado operacional e próxima ação permanecem exclusivamente em `docs/project/status.md`.

D-AUTO-001/002 têm confiança ALTA, impacto MÉDIO e reversibilidade MODERADA antes da implementação. DEC-042 aceita a direção de fundação e operação, mas não aprova por si só schema físico ou início da implementação.

## Proposed

- Concluir a custódia portátil e validar os secrets já cadastrados sem expor valores, com autorização específica da execução externa antes de configurar endpoint, workflow ou publicação; ADR-0002 já está aceito. O serviço do runner e a variável foram verificados em 2026-10-06.
- Usar Plane apenas nos papéis descritos em `.harness/integrations/plane.md`; Obsidian permanece restrito à navegação e conhecimento conforme `.harness/integrations/obsidian.md`; Mantis, Impeccable e loops permanecem nos estados definidos para cada integração.

Estas são propostas de processo, não decisões do produto.

## Unknown

- Configuração externa do updater: validade do token de publicação e dos secrets de assinatura já cadastrados, custódia portátil, manifesto final, endpoint, falha de rede, migração, backup, retorno e critérios de promoção para estável.
- Política legal definitiva de retenção clínica.
- Destino externo de backup e rotina operacional definitiva.
- Limites, categorias, duplicidade, miniaturas e retenção de arquivos.
- Documentos A4 prioritários, assinaturas e campos obrigatórios.
- Política de atualização da base alimentar no G4.
- Migração dos aproximadamente 80 pacientes.

## Blockers

- O G4 foi aprovado e não bloqueia mais o projeto. O piloto está bloqueado somente por pendências de execução do runner/configuração externa e pela validação ponta a ponta. O início da implementação do G5 continua exigindo aprovação específica.
- ADR-0001 está aceito como direção de fundação, mas não autoriza implementação sem o gate do G5.
- Não há código executável para Mantis/Impeccable; ambos permanecem PREPARED — NOT ACTIVE.
- Plane/MCP está configurado e validado em leitura; Mantis, Impeccable e demais integrações externas continuam sem ativação. Obsidian está ACTIVE somente como camada local de navegação e conhecimento.

## Next Decisions

1. Seguir a próxima ação do checkpoint canônico em `docs/project/status.md`, incluindo secrets de assinatura e custódia portátil sem registrar valores sensíveis.
2. Endpoint e workflow preparados localmente; consultar o checkpoint canônico para validações externas pendentes.
3. Executar T082/T083 e coletar evidência ponta a ponta; depois revisar a prontidão do G5.

## Existing Documentation

- Produto: docs/product/
- Requisitos: docs/requirements/
- Arquitetura e segurança: docs/architecture/
- Qualidade: docs/quality/
- Operações: docs/operations/
- Projeto, riscos e backlog: docs/project/
- UX: docs/ux/

## Existing ADRs

- docs/architecture/adr/ADR-0001-desktop-tauri-sqlite.md — aceito em 2026-09-21.
- docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md — aceito por Maycon em 2026-09-21; implementação ainda pendente.

## Open Questions

O catálogo consolidado está em knowledge/OPEN-QUESTIONS.md e o registro em knowledge/DECISIONS-REGISTER.md.

## Recommended Next Step

Usar o checkpoint operacional em [docs/project/status.md](../docs/project/status.md) para a próxima ação. ADR-0002 já está aceito; resolver as pendências do runner/configuração e a evidência do updater exige o escopo específico de autorização. A simplificação documental de 2026-09-30 não inicia implementação de produto, release ou deploy. O smoke test de `$webfit-task` permanece tarefa posterior e separada.

## Revisão de prioridade — 2026-10-06

DEC-044 aceita por Maycon: distribuição manual no MVP, updater/pipeline e T082/T083 adiados, sem bloquear G5. Preparação preservada; workflow desativado localmente. Próxima ação exclusivamente no checkpoint canônico; implementação exige aprovação específica G5.

## Execução autorizada em 2026-10-06

DEC-044 adia updater; DEC-045 concede Implementation Approval e Sensitive Change Approval previstas no plano para produto, dependências, schema/migrações e ferramentas de compilação. Sem commit/push/publicação ou dados reais. Estado e próxima ação exata em `docs/project/status.md`; evidência local em `.harness/evidence/health-increment/2026-10-06-candidate.md`.
