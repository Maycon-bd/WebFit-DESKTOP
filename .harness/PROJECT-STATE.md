# Estado do projeto

## Stage
PLANNING

G1 foi aprovado em 2026-08-20. G2 e G3 foram aprovados em 2026-09-17 no escopo registrado no checkpoint. G4 está autorizado e em preparação. A baseline da auditoria foi concluída e reavaliada sob DEC-038; D-AUTO-001/002 foram aceitos por Amanda e Maycon em 2026-09-17. O Spec Kit e o entrypoint `$project-task` estão integrados e prontos para smoke test posterior. Backup e restauração seguem como parte da validação do G4. Não há implementação.

## Confirmed

- Produto local, offline, Windows-first e um computador por instalação.
- MVP Saúde; Educação está fora do MVP.
- Amanda aprova domínio/aceite; Maycon é PO e responsável técnico.
- O harness usa `AUTONOMOUS DECISION WITH HUMAN VALIDATION`: escolhas justificáveis podem avançar como `AGENT-PROVISIONAL`; condições ASK-FIRST permanecem humanas.
- Spec Kit é a fonte operacional SDD; harness, documentos canônicos, Decisions Register/ADRs e AGENTS.md mantêm responsabilidades distintas conforme DEC-039.
- Plane está ACTIVE como camada controlada de gestão do trabalho: MCP ACTIVE, OAuth, Read VALIDATED, projeto `WEBFIT`; nenhum Work Item foi criado nesta integração.
- Obsidian está ACTIVE como camada de navegação e conhecimento sobre o Vault na raiz do repositório; `README.md` é o entrypoint humano, `docs/` e `specs/` são navegáveis, e Codex e Obsidian editam os mesmos arquivos locais. Não há cópia documental, MCP, plugin comunitário ou Sync ativado por esta integração.
- A Constitution 1.0.0 e a skill `$project-task` estão prontas; nenhuma feature Spec Kit foi criada.
- Primeiro incremento: autenticação, perfil, Saúde, pacientes, prescrição/cardápio, auditoria, backup/restauração mínima e persistência.
- Requisitos, regras, critérios de aceite e rastreabilidade do primeiro incremento já existem em docs/requirements/.
- A auditoria tem retenção indeterminada no MVP e falha de auditoria bloqueia operação crítica/autenticação bem-sucedida.
- A consulta de auditoria usa usuário autenticado e autorizado, período padrão de 30 dias, filtros AND, ordem decrescente fixa e paginação de 50 registros.

- Arquivos clínicos ficam planejados para incremento posterior; biblioteca profissional vem depois do núcleo do MVP.
- Tauri 2/React/TypeScript/Vite/Rust/SQLite são composição proposta para spike no ADR-0001, não decisão de produção.

## Accepted decisions

- D-AUTO-001 — ator USER, SYSTEM ou UNAUTHENTICATED, sem credencial tentada; aceito por Amanda e Maycon em 2026-09-17.
- D-AUTO-002 — janela UTC semiaberta congelada, ordem total e cursor opaco estável; aceito por Amanda e Maycon em 2026-09-17.

Ambas têm confiança ALTA, impacto MÉDIO e reversibilidade MODERADA antes da implementação. A aceitação cobre o comportamento e o uso no spike; não aprova schema físico ou implementação de produção.

## Proposed

- Executar o spike do ADR-0001 somente depois dos gates documentais aplicáveis.
- Usar Plane apenas nos papéis descritos em `.harness/integrations/plane.md`; Obsidian permanece restrito à navegação e conhecimento conforme `.harness/integrations/obsidian.md`; Mantis, Impeccable e loops permanecem nos estados definidos para cada integração.

Estas são propostas de processo, não decisões do produto.

## Unknown

- Proteção local, SQLCipher, chaves e proteção de backups.
- Política legal definitiva de retenção clínica.
- Destino externo de backup e rotina operacional definitiva.
- Limites, categorias, duplicidade, miniaturas e retenção de arquivos.
- Documentos A4 prioritários, assinaturas e campos obrigatórios.
- Política de atualização da base alimentar no G4.
- Migração dos aproximadamente 80 pacientes.

## Blockers

- A preparação executável do G4 depende de autorização separada para instalar/configurar ferramentas e dependências.
- ADR-0001 ainda é proposta para spike e não autoriza gerar aplicação.
- Não há código executável para Mantis/Impeccable; ambos permanecem PREPARED — NOT ACTIVE.
- Plane/MCP está configurado e validado em leitura; Mantis, Impeccable e demais integrações externas continuam sem ativação. Obsidian está ACTIVE somente como camada local de navegação e conhecimento.

## Next Decisions

1. Autorizar a preparação das ferramentas e dependências do spike G4.
2. Executar os critérios do ADR-0001 com dados fictícios.
3. Registrar resultados, riscos e decisão do spike antes do G5.


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

Completar a baseline de backup e restauração sem iniciar implementação. O smoke test de `$project-task` deve ocorrer em tarefa posterior e separada.
