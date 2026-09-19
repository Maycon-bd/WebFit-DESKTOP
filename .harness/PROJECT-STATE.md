# Estado do projeto

## Stage
PLANNING

G1 foi aprovado em 2026-08-20. G2 e G3 foram aprovados em 2026-09-17 no escopo registrado no checkpoint. A execução técnica do G4 foi concluída com recomendação REVISAR e aguarda decisão humana. A baseline da auditoria foi concluída e reavaliada sob DEC-038; D-AUTO-001/002 foram aceitos por Amanda e Maycon em 2026-09-17. O Spec Kit e o entrypoint `$project-task` estão integrados e prontos para smoke test posterior. Não há implementação de produto.

## Confirmed

- Produto local, offline, Windows-first e um computador por instalação.
- MVP Saúde; Educação está fora do MVP.
- Amanda aprova domínio/aceite; Maycon é PO e responsável técnico.
- O harness usa `AUTONOMOUS DECISION WITH HUMAN VALIDATION`: escolhas justificáveis podem avançar como `AGENT-PROVISIONAL`; condições ASK-FIRST permanecem humanas.
- Spec Kit é a fonte operacional SDD; harness, documentos canônicos, Decisions Register/ADRs e AGENTS.md mantêm responsabilidades distintas conforme DEC-039.
- Plane está ACTIVE como camada controlada de gestão do trabalho: MCP ACTIVE, OAuth e leitura/escrita validadas no projeto `WEBFIT`; `WEBFIT-3` acompanha o spike G4 e mantém vínculo externo com `PBI-001`.
- Obsidian está ACTIVE como camada de navegação e conhecimento sobre o Vault na raiz do repositório; `README.md` é o entrypoint humano, `docs/` e `specs/` são navegáveis, e Codex e Obsidian editam os mesmos arquivos locais. Não há cópia documental, MCP, plugin comunitário ou Sync ativado por esta integração.
- A Constitution 1.0.0 e a skill `$project-task` estão prontas; nenhuma feature Spec Kit foi criada.
- Primeiro incremento: autenticação, perfil, Saúde, pacientes, prescrição/cardápio, auditoria, backup/restauração mínima e persistência.
- Requisitos, regras, critérios de aceite e rastreabilidade do primeiro incremento já existem em docs/requirements/.
- A auditoria tem retenção indeterminada no MVP e falha de auditoria bloqueia operação crítica/autenticação bem-sucedida.
- A consulta de auditoria usa usuário autenticado e autorizado, período padrão de 30 dias, filtros AND, ordem decrescente fixa e paginação de 50 registros.

- Arquivos clínicos ficam planejados para incremento posterior; biblioteca profissional vem depois do núcleo do MVP.
- Tauri 2/React/TypeScript/Vite/Rust/SQLite são composição proposta para spike no ADR-0001, não decisão de produção.
- A política de operação sem custo recorrente foi detalhada em `docs/operations/cost-free-operation.md`: instalação local/offline, SQLCipher Community com avisos de licença, backup local com cópia externa opcional, credencial de recuperação offline, NSIS, manutenção manual e ausência de nuvem/telemetria; ainda pendente de aprovação humana.

## Accepted decisions

- D-AUTO-001 — ator USER, SYSTEM ou UNAUTHENTICATED, sem credencial tentada; aceito por Amanda e Maycon em 2026-09-17.
- D-AUTO-002 — janela UTC semiaberta congelada, ordem total e cursor opaco estável; aceito por Amanda e Maycon em 2026-09-17.

Ambas têm confiança ALTA, impacto MÉDIO e reversibilidade MODERADA antes da implementação. A aceitação cobre o comportamento e o uso no spike; não aprova schema físico ou implementação de produção.

## Proposed

- Executar o spike do ADR-0001 somente depois dos gates documentais aplicáveis.
- Usar Plane apenas nos papéis descritos em `.harness/integrations/plane.md`; Obsidian permanece restrito à navegação e conhecimento conforme `.harness/integrations/obsidian.md`; Mantis, Impeccable e loops permanecem nos estados definidos para cada integração.

Estas são propostas de processo, não decisões do produto.

## Unknown

- Aprovação da política sem custo recorrente, licenciamento do SQLCipher Community e política operacional final do SQLCipher/DPAPI; credencial administrativa, rotação e recuperação de chaves/backups.
- Política legal definitiva de retenção clínica.
- Destino externo de backup e rotina operacional definitiva.
- Limites, categorias, duplicidade, miniaturas e retenção de arquivos.
- Documentos A4 prioritários, assinaturas e campos obrigatórios.
- Política de atualização da base alimentar no G4.
- Migração dos aproximadamente 80 pacientes.

## Blockers

- A execução técnica do G4 terminou; sua aprovação bloqueia em decisão humana sobre criptografia, recuperação de chaves/backups e riscos residuais.
- ADR-0001 ainda é proposta para spike e não autoriza implementação do produto.
- Não há código executável para Mantis/Impeccable; ambos permanecem PREPARED — NOT ACTIVE.
- Plane/MCP está configurado e validado em leitura; Mantis, Impeccable e demais integrações externas continuam sem ativação. Obsidian está ACTIVE somente como camada local de navegação e conhecimento.

## Next Decisions

1. Aprovar ou ajustar a política sem custo recorrente registrada em `docs/operations/cost-free-operation.md`.
2. Confirmar licenciamento/suporte e política operacional final do SQLCipher/DPAPI, incluindo credencial administrativa, rotação, recuperação e portabilidade de chaves/backups.

3. Aceitar a recomendação REVISAR ou solicitar mitigação/repetição dos riscos residuais antes do G5.


## Existing Documentation

- Produto: docs/product/
- Requisitos: docs/requirements/
- Arquitetura e segurança: docs/architecture/
- Qualidade: docs/quality/
- Operações: docs/operations/
- Projeto, riscos e backlog: docs/project/
- UX: docs/ux/

## Existing ADRs

- docs/architecture/adr/ADR-0001-desktop-tauri-sqlite.md — proposto para validação por spike.

## Open Questions

O catálogo consolidado está em knowledge/OPEN-QUESTIONS.md e o registro em knowledge/DECISIONS-REGISTER.md.

## Recommended Next Step

Submeter a recomendação REVISAR do G4 e a política sem custo recorrente à decisão humana, sem iniciar implementação do produto. O smoke test de `$project-task` permanece tarefa posterior e separada.
