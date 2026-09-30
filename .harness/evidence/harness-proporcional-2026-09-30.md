# Simplificação da condução do harness — 2026-09-30

## Escopo e fonte

Solicitação humana: tornar o harness menos burocrático e lento usando a análise better-harness desta conversa. Classificação LIGHT: alteração local de instruções/documentação, sem mudança de produto, arquitetura, dados, integração ativa ou autoridade dos gates. Branch atual `feature/pbi-001-primeiro-incremento-saude`; HEAD `0de267bc5cd1e6965f464420e8223c48df909bc8`; alterações preexistentes preservadas. Nenhum commit, push, PR ou publicação.

Fontes: [Governance](../GOVERNANCE.md), [autonomia](../AUTONOMY-POLICY.md), [interação humana](../HUMAN-INTERACTION-CONTRACT.md), [Spec Kit](../integrations/spec-kit.md), [checkpoint](../../docs/project/status.md) e [ADR-0002 aceito](../../docs/architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md). O relatório better-harness em `.codex/better-harness/2026-09-30-review/report.html` permanece baseline e não recebeu atualização de score ou Repair Progress.

## Mudança e fundamento

- Contexto por fase: retirar a exigência da skill local de carregar todos os registros antes da classificação. Leituras obrigatórias de produto, autoridade, Git e gates continuam válidas; leituras já atuais no mesmo chat podem ser reutilizadas.
- Retomar na primeira etapa pendente e atualizar artefatos afetados, em vez de reiniciar a cadeia SDD a cada turno. Revalidar ao mudar entrada, escopo, branch ou aprovação.
- Executar o procedimento de skills oficiais disponíveis no mesmo chat. A antiga exigência de despacho por API podia gerar handoff desnecessário. Ferramenta, ambiente ou autorização ausentes continuam impedimentos reais.
- LIGHT documental usa fonte, alteração, revisão e evidência breve; decisões humanas relacionadas podem ser agrupadas com escopos explícitos. Nenhum gate de produto ou ação sensível foi removido.
- Referenciar comandos/evidências entre Verification, Review e Evidence; manter responsabilidades, independência e validação do estado final. Não reutilizar resultados sem correspondência com as entradas finais.
- Corrigir o checkpoint, AGENTS.md e PROJECT-STATE que ainda pediam decisão sobre ADR-0002 já aceito. Preparação aprovada/executada é informação do registro existente, não nova autorização ou verificação externa nesta sessão.
- A `project-task` local passou de 236 para 169 linhas, referenciando os contratos canônicos de Plane, branches e comunicação. Tamanho menor comprova redução de instruções duplicadas; não mede velocidade de execução.

## Validação

- `python -X utf8 .../skill-creator/scripts/quick_validate.py .agents/skills/project-task`: **PASS**, `Skill is valid!`. A primeira tentativa sem UTF-8 falhou por leitura cp1252 no Windows; o rerun usou UTF-8, sem alterar o validador ou instalar dependência.
- Verificação dos destinos Markdown locais dos nove arquivos desta mudança: **PASS**, 38 links resolvidos. Fragmentos não foram validados automaticamente; os dois anchors novos correspondem aos títulos inspecionados da governança.
- `git -c core.safecrlf=false diff --check -- <arquivos alterados>`: **PASS**, sem erros de whitespace nos arquivos rastreados. O arquivo novo de evidência foi revisado como Markdown local.
- Revisão de consistência: LIGHT documental não requer Plane/SDD; retomada STANDARD continua exigindo ID, artefatos válidos, Branch Safety e aprovação de implementação; ações sensíveis permanecem ASK-FIRST; disponibilidade de SKILL.md não equivale a resultado da skill. Trata-se de revisão documental, não execução de smoke test.
- `git status --short --branch` antes/depois: branch e HEAD preservados; alterações adicionais restritas aos owners documentais e à skill local desta entrega. As skills oficiais Spec Kit não têm alterações; o workflow continua não rastreado como antes. Nenhuma ação remota.
- Build, lint/TypeScript, testes frontend/Rust/SQLite e build Tauri não executados: não houve mudança de código, schema, dependência ou configuração de produto/spike. A validação aplicável nesta entrega é documental e da skill.

## Limites e próximos passos

Os três achados do workflow permanecem pendentes: testes antes da publicação, origem do disparo manual e verificação pós-publicação. Exigem demanda/escopo específico conforme a classificação de infraestrutura; esta correção documental não altera o YAML nem ativa pipeline/runner.

A análise não comprovou que duração de sessões representa burocracia ou falha de skill. As melhorias decorrem da solicitação humana e de cláusulas diretamente inspecionadas. Não há medição de ganho de tempo, teste de execução completo de Spec Kit ou efeito posterior comparável. Um futuro uso de LIGHT e uma retomada STANDARD com artefatos aprovados poderão verificar que o fluxo é aplicado sem reabrir decisões, sem handoff desnecessário e sem perder gates.

## Agent Decisions

Escolhas técnicas locais AUTO, registradas proporcionalmente: manter referências existentes em vez de criar outro manual; preservar a classificação e os gates; restringir esta etapa à documentação. Nenhuma nova decisão de produto/arquitetura `ACCEPTED` foi criada; nenhuma aprovação de G5, dependência, release ou operação externa foi inferida.
