# Estado do projeto

## Stage
PLANNING

G1 foi aprovado em 2026-08-20. G2 permanece em revisão. A baseline da auditoria foi concluída; backup e restauração são a próxima seção. Não há implementação.

## Confirmed

- Produto local, offline, Windows-first e um computador por instalação.
- MVP Saúde; Educação está fora do MVP.
- Amanda aprova domínio/aceite; Maycon é PO e responsável técnico.
- O harness usa `AUTONOMOUS DECISION WITH HUMAN VALIDATION`: escolhas justificáveis podem avançar como `AGENT-PROVISIONAL`; condições ASK-FIRST permanecem humanas.
- Primeiro incremento: autenticação, perfil, Saúde, pacientes, prescrição/cardápio, auditoria, backup/restauração mínima e persistência.
- Requisitos, regras, critérios de aceite e rastreabilidade do primeiro incremento já existem em docs/requirements/.
- A auditoria tem retenção indeterminada no MVP e falha de auditoria bloqueia operação crítica/autenticação bem-sucedida.
- A consulta de auditoria usa usuário autenticado e autorizado, período padrão de 30 dias, filtros AND, ordem decrescente fixa e paginação de 50 registros.
- Arquivos clínicos ficam planejados para incremento posterior; biblioteca profissional vem depois do núcleo do MVP.
- Tauri 2/React/TypeScript/Vite/Rust/SQLite são composição proposta para spike no ADR-0001, não decisão de produção.

## Proposed

- Executar o spike do ADR-0001 somente depois dos gates documentais aplicáveis.
- Usar Spec Kit como núcleo SDD quando o CLI estiver disponível e sua inicialização puder ocorrer sem sobrescrever documentos.
- Usar Plane, Obsidian, MCP, Mantis, Impeccable e loops apenas nos papéis descritos no harness.

Estas são propostas de processo, não decisões do produto.

## Unknown

- Representação física de atores automáticos e tentativas sem usuário autenticado na auditoria.
- Proteção local, SQLCipher, chaves e proteção de backups.
- Política legal definitiva de retenção clínica.
- Destino externo de backup e rotina operacional definitiva.
- Limites, categorias, duplicidade, miniaturas e retenção de arquivos.
- Documentos A4 prioritários, assinaturas e campos obrigatórios.
- Política de atualização da base alimentar no G4.
- Migração dos aproximadamente 80 pacientes.

## Blockers

- G2 não está concluído.
- ADR-0001 ainda é proposta para spike e não autoriza gerar aplicação.
- Não há CLI specify detectável nem código executável para Mantis/Impeccable.
- Não há configuração local detectável de MCP, Plane ou Obsidian.

## Next Decisions

1. Completar a baseline de backup e restauração.
2. Concluir os RNFs e a rastreabilidade restantes do primeiro incremento.
3. Obter a aprovação final do G2.
4. Só então preparar o plano executável e o spike do ADR-0001.

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

Completar a baseline de backup e restauração sem iniciar implementação.