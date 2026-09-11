# Audit Decision Review — UC-AUD-001

Data: 2026-09-11
Política: DEC-038 — AUTONOMOUS DECISION WITH HUMAN VALIDATION
Escopo: reavaliação da consulta de auditoria para o Gate G2
Status: READY FOR HUMAN DECISION REVIEW

## Resultado executivo

UC-AUD-001 já estava funcionalmente completo por decisões humanas `ACCEPTED` DEC-028 a DEC-037. A reavaliação não substitui essas decisões. Ela fecha duas lacunas técnicas com decisões `AGENT-PROVISIONAL`: representação de atores não humanos/não autenticados e semântica determinística de janela, desempate e continuação da paginação.

Não existe `NEEDS-HUMAN-DECISION` materialmente bloqueante para especificar ou planejar a consulta. Retenção legal e modelo futuro de capacidades são ASK-FIRST, mas estão desacoplados: a retenção provisória já é governada por DEC-025 até G7, e UC-AUD-001 exige abstratamente usuário autenticado e autorizado conforme DEC-016 vigente.

## Reavaliação ponto a ponto

| Ponto | Alternativas e comparação | Evidência e escolha | Confiança | Impacto | Reversibilidade | Resultado |
|---|---|---|---|---|---|---|
| Filtros | cinco filtros controlados; conjunto ampliado; texto livre. O conjunto ampliado aumenta exposição e custo sem requisito | RF-AUD-001, RN-AUD-006 e DEC-028 sustentam período, usuário, ação, tipo de entidade e resultado com AND | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-028 |
| Ordenação | recente primeiro; antigo primeiro; configurável. Recente primeiro atende investigação com menor UX | RN-AUD-007 e DEC-029 | ALTA | BAIXO | FÁCIL | `ACCEPTED` — DEC-029; desempate técnico em D-AUTO-002 |
| Paginação/carregamento | página backend; infinite scroll; carga total. Página backend limita memória, é testável e já aprovada | RN-AUD-008, DEC-030 e volume crescente | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-030; cursor estável em D-AUTO-002 |
| Período inicial | sem limite; 7 dias; 30 dias; período manual. Trinta dias equilibra utilidade e volume | RN-AUD-009 e DEC-031 | ALTA | BAIXO | FÁCIL | `ACCEPTED` — DEC-031; limites em D-AUTO-002 |
| Tamanho da página | 25, 50, 100 ou configurável. 50 reduz round-trips sem carga excessiva e já foi validado | RN-AUD-008 e DEC-030 | ALTA | BAIXO | FÁCIL | `ACCEPTED` — DEC-030 |
| Vocabulário de ação | texto livre; catálogo fechado evolutivo; eventos genéricos. Catálogo controlado melhora integridade e testes | RN-AUD-010, catálogo inicial e DEC-032 | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-032 |
| Vocabulário de resultado | booleano; SUCCESS/FAILURE/DENIED; códigos livres. Três estados distinguem falha técnica de negação | RN-AUD-010 e DEC-032 | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-032 |
| Operações automáticas | usuário sintético; user_id nulo sem tipo; texto livre; tipo controlado + user_id opcional. O tipo controlado preserva semântica e integridade sem poluir usuários | UC-BKP-001 inclui sistema; login falho pode não ter usuário; proibição de credencial em logs | ALTA | MÉDIO | MODERADA | `AGENT-PROVISIONAL` — D-AUTO-001 |
| Rótulo da entidade | snapshot persistido; resolução atual autorizada; nunca resolver. Resolução autorizada evita duplicação sensível e melhora UX | RN-AUD-011 e DEC-033 | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-033 |
| Entidade inexistente | ocultar evento; erro; tipo + ID. Fallback preserva trilha e independência referencial | RN-AUD-011 e DEC-033 | ALTA | BAIXO | FÁCIL | `ACCEPTED` — DEC-033 |
| Dados anteriores/posteriores | snapshot completo; diff; nenhum. Ausência reduz exposição; histórico pertence ao domínio | RN-AUD-012 e DEC-034 | ALTA | ALTO | DIFÍCIL | `ACCEPTED` — DEC-034 |
| Detalhe do evento | somente lista; detalhe de metadados; conteúdo completo. Metadados permitidos dão investigação sem expor conteúdo clínico | RN-AUD-013 e DEC-035 | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-035 |
| Ações disponíveis | leitura; edição/exclusão; manutenção administrativa. Imutabilidade exige somente leitura | RN-AUD-003/013 e DEC-035 | ALTA | ALTO | DIFÍCIL | `ACCEPTED` — DEC-035 |
| Exportação | disponível; indisponível no incremento 1; sempre proibida. Adiar evita saída sensível sem requisito e não impede evolução | escopo, RN-AUD-013 e DEC-035 | ALTA | MÉDIO | FÁCIL | `ACCEPTED` — DEC-035 |
| Auditoria da auditoria | não auditar; auditar tudo; auditar módulo/detalhe sem recursão. A terceira opção equilibra prestação de contas e volume | RN-AUD-014 e DEC-036 | ALTA | MÉDIO | MODERADA | `ACCEPTED` — DEC-036 |
| Estado vazio | um estado genérico; distinguir base vazia e nenhum resultado. Distinção explica a próxima ação sem inventar dados | RN-AUD-015 e DEC-037 | ALTA | BAIXO | FÁCIL | `ACCEPTED` — DEC-037 |
| Erro e recuperação | lista vazia; erro terminal; erro seguro com retry recuperável. O último evita falso sucesso e permite recuperação | RN-AUD-015 e DEC-037 | ALTA | MÉDIO | FÁCIL | `ACCEPTED` — DEC-037 |
| Isolamento | filtro apenas na UI; autorização backend por escopo; acesso global. Backend por escopo é exigido pelos RNFs | RN-AUD-005, RNF-SEG-002/003 e TA-AUD-009 | ALTA | ALTO | DIFÍCIL | `ACCEPTED` — DEC-028/DEC-033 e regra vigente de autorização |

## D-AUTO-001 — representação do ator

- **Status:** `AGENT-PROVISIONAL`
- **Problema:** representar de forma verdadeira e segura ação de usuário, rotina automática e tentativa anterior à autenticação.
- **Alternativas:** usuário sintético; user_id nulo sem tipo; ator textual livre; `actor_kind` controlado com `actor_user_id` opcional.
- **Escolha:** `actor_kind = USER | SYSTEM | UNAUTHENTICATED`; `actor_user_id` obrigatório somente para USER e ausente nos demais. Falha pré-autenticação não persiste login, credencial tentada ou outro identificador fornecido. A apresentação usa “Sistema” e “Não autenticado”; o filtro de usuário alcança somente eventos USER.
- **Justificativa:** evita identidade falsa em users, elimina ambiguidade do nulo, impede texto livre sensível e mantém integridade verificável.
- **Evidências:** UC-BKP-001 possui ator sistema; falha de login ocorre antes de identidade confiável; RN-AUD-002 e RNF-SEG-003 proíbem conteúdo sensível.
- **Confiança:** ALTA.
- **Impacto:** MÉDIO.
- **Reversibilidade:** MODERADA; a validação deve ocorrer antes de cristalizar o schema.
- **Risco:** catálogo pode precisar de novo tipo futuro; evolução deve ser versionada.
- **Validação humana:** PENDENTE.

## D-AUTO-002 — janela e paginação determinísticas

- **Status:** `AGENT-PROVISIONAL`
- **Problema:** tornar período, empate de ordenação e páginas reproduzíveis sem duplicidade ou perda.
- **Alternativas:** offset sobre conjunto mutável; carga total; cursor opaco sobre conjunto congelado; ordenação somente por instante.
- **Escolha:** ao iniciar ou alterar consulta, capturar `query_as_of_utc`; consultar o intervalo UTC semiaberto `[from_utc, to_utc)`, com default `from_utc = query_as_of_utc − 30 × 24 h` e `to_utc = query_as_of_utc`; ordenar por `(occurred_at_utc DESC, event_id DESC)`; navegar por cursor opaco vinculado ao snapshot, intervalo e filtros, em páginas de 50. Mudar ou limpar filtros inicia nova consulta.
- **Justificativa:** intervalo semiaberto evita sobreposição; desempate por ID torna a ordem total; cursor evita deslocamento por novos eventos e não exige carregar a trilha.
- **Evidências:** DEC-029/030/031, RN-AUD-008/009 e TA-AUD-006 exigem ordem e conjunto estáveis.
- **Confiança:** ALTA.
- **Impacto:** MÉDIO.
- **Reversibilidade:** MODERADA.
- **Risco:** o cursor vira contrato técnico e deve ser opaco/versionável; eventos retroativos exigem regra no projeto físico.
- **Validação humana:** PENDENTE.

## NEEDS-HUMAN-DECISION

Nenhuma decisão humana bloqueante para UC-AUD-001.

Itens ASK-FIRST desacoplados:

- política legal definitiva de retenção: exigida antes de G7, não para completar a consulta no G2;
- revisão futura das capacidades por papel: não altera a especificação abstrata “usuário autenticado e autorizado” nem DEC-016 vigente.

## Contradições

- RQ-001 e o risco “consulta de auditoria crítica ainda não está fechada” no Planning Review são históricos e foram superados por DEC-028 a DEC-037.
- A relação conceitual obrigatória USERS → AUDIT_EVENTS não representa SYSTEM/UNAUTHENTICATED; D-AUTO-001 resolve provisoriamente a lacuna sem autorizar schema.
- O checkpoint apontava commit `dfc4098` não sincronizado, mas o repositório está limpo e sincronizado em `eb832bd`; o checkpoint deve ser atualizado.

## Gate

**Consulta de auditoria: G2 READY FOR HUMAN DECISION REVIEW.**

UC-AUD-001 está completa e os testes são determinísticos. D-AUTO-001 e D-AUTO-002 não são sensíveis, têm confiança alta, são reversíveis antes da implementação e não conflitam com decisões aceitas. O Gate G2 global continua em revisão por seções posteriores, especialmente backup/restauração e fechamento global.
