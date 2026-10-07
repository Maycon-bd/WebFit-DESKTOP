# AGENTS.md — WebFit Desktop

## Projeto

- Nome: WebFit Desktop.
- Objetivo: gestão local e offline de consultório e acompanhamento nutricional.
- Estágio: PROJECT STAGE: IMPLEMENTING; G1, G2, G3 e G4 aprovados; G5 em execução autorizada pela DEC-045 em 2026-10-06, com dados fictícios.
- Domínio: Saúde no MVP; Educação é um espaço futuro.
- Usuários aprovados no MVP: nutricionista e administrador, ambos com acesso total.
- Operação: Windows-first, um computador por instalação, sem hospedagem ou mensalidade obrigatória.

A aplicação de produto está em construção na raiz (`src/` e `src-tauri/`), autorizada pela DEC-045. O spike técnico descartável do G4 em `spikes/g4-tauri-foundation/` continua separado e não deve ser promovido a produto. O ADR-0001 foi aceito em 2026-09-21. G5, G6 e G7 ainda não foram concluídos; somente dados fictícios estão autorizados.

## Fonte de verdade

Leia antes de planejar ou alterar o produto:

1. docs/project/status.md;
2. docs/project/context.md;
3. docs/project/development-lifecycle.md;
4. docs/project/functional-candidates.md durante descoberta;
5. docs/product/scope.md;
6. requisitos, regras, casos de uso, matriz e ADRs relacionados ao domínio.

Hierarquia operacional detalhada: .harness/GOVERNANCE.md. Documentos legados são fontes de descoberta, não requisitos aprovados.

O Spec Kit é a fonte operacional para Constitution, Specification, Clarify, Plan, Checklist, Tasks, Analyze, Implement e Converge. O harness mantém intake, investigação, decisões, gates, Verification, Review e Evidence. Use `$webfit-task` como entrypoint de novas demandas e consulte `.harness/integrations/spec-kit.md`; não crie specifications concorrentes dentro do harness.

Skills locais auxiliares: `$webfit-checkpoint` para retomar/salvar o checkpoint entre chats e máquinas; `$webfit-verificar` para checks proporcionais e evidência. Não adicionam gates nem substituem review independente. O nome anterior do entrypoint era `project-task`; registros históricos preservam esse nome.

## Retomada obrigatória entre máquinas e chats

Quando uma solicitação contiver a frase “Vamos continuar onde paramos”, independentemente de maiúsculas, minúsculas ou pontuação:

1. leia integralmente docs/project/status.md;
2. confira git status --short --branch e o commit atual;
3. compare o estado local com branch, commit-base e sincronização registrados;
4. informe divergências antes de editar;
5. retome pela seção Próxima ação exata;
6. antes de encerrar trabalho material, atualize data, branch, commit-base, sincronização, última etapa concluída, próxima ação e checklist do Gate no mesmo arquivo.

## Arquitetura aprovada para a fundação

Tauri 2, React + TypeScript + Vite, Rust, SQLite/SQLCipher Community e DPAPI são a direção de fundação aceita no ADR-0001 após o G4. A implementação deve seguir os requisitos, o plano e as tarefas aprovadas do G5, sem reutilizar o spike descartável como código de produto.

Não importe a arquitetura do WebFit Web. Não introduza Supabase, Firebase, backend remoto, localStorage de domínio, acesso SQL genérico pela WebView ou atualização conectada sem nova decisão arquitetural aprovada. O ADR-0002 de atualizações foi aceito em 2026-09-21; sua aceitação não substitui os gates específicos de execução, publicação ou implementação.

## Processo obrigatório

- Não implemente requisito sem ID, critérios de aceite e status aprovado.
- Mantenha rastreabilidade entre requisito, tarefa, teste e versão.
- Registre decisões significativas em ADR.
- Faça incrementos verticais: interface, domínio, persistência, erro e teste juntos.
- Atualize documentação na mesma mudança que altera comportamento.
- Preserve alterações preexistentes e não faça ações destrutivas sem autorização explícita.
- Siga o fluxo em .harness/README.md e use LIGHT, STANDARD ou STRICT.
- Git é controlado por Maycon (DEC-054): execute todas as demandas na branch atualmente ativa, inclusive STANDARD/STRICT. Não crie/troque branches nem exija branch exclusiva, base `develop` ou árvore limpa. Inspeção somente leitura serve para preservar alterações e rastrear a entrega; conflito concreto no conteúdo deve ser esclarecido.
- Orquestre as skills oficiais do Spec Kit sem modificá-las; customizações do projeto pertencem à Constitution, ao harness e à skill local `webfit-task`.
- Siga .harness/AUTONOMY-POLICY.md para decidir, registrar e validar escolhas; nunca represente `AGENT-PROVISIONAL` como aprovação humana.
- Não ative loops autônomos; o harness atual é preparatório.

## Dados e segurança

- Trate dados de saúde como sensíveis.
- Nunca registre senha, chave, CPF, prontuário, mensagem ou documento clínico em logs.
- Nunca coloque segredo no frontend ou no repositório.
- Autorize toda operação no backend Tauri quando houver aplicação; ocultar botão não é autorização.
- Use consultas parametrizadas e transações; ative foreign keys em toda conexão SQLite.
- Valores monetários são inteiros em centavos.
- Datas e horários instantâneos são persistidos em UTC.
- Arquivos físicos usam UUID, não nome ou CPF do paciente.
- Mudanças em dados exigem avaliação de migração, backup e restauração.

## SQLite

- Migrações devem ser numeradas, transacionais e testadas.
- Teste banco vazio e atualização da versão anterior.
- Não use SQLite em pasta de rede ou sincronizada como colaboração.
- Não copie diretamente um banco ativo para backup; use snapshot consistente.
- Execute verificações de integridade na restauração.

## Qualidade

Antes de concluir uma entrega, execute os comandos disponíveis para formatação, lint, TypeScript, testes frontend, testes Rust, testes de integração SQLite e build Tauri aplicável. Se algum comando ainda não existir, registre isso no handoff e crie-o somente quando fizer parte do escopo da fundação.

## Política de ferramentas

- ALLOW: leitura, pesquisa, análise, criação de artefatos do harness e checks locais não destrutivos. Git somente leitura para contexto e preservação; operações que alteram Git ficam sob controle de Maycon (DEC-054).
- ASK: dependências, inicializações com risco de sobrescrita, migrações/schema, autenticação, integrações externas, infraestrutura, operações Plane/GitHub fora do contrato controlado de `$webfit-task` e mudanças arquiteturais materiais.
- DENY sem autorização explícita e ambiente apropriado: produção, resets destrutivos, apagar trabalho, revelar secrets, bypass de segurança, pentest não autorizado, reproducer no host e deploy automático.
- Nunca imprimir, versionar ou solicitar secrets em texto claro.

## Convenções documentais

- Requisitos têm ID, critérios de aceite, prioridade, status e rastreabilidade.
- Decisões arquiteturais materiais usam ADR; não crie ADR retroativo sem evidência suficiente.
- Hipóteses, propostas, decisões `AGENT-PROVISIONAL` e questões `NEEDS-HUMAN-DECISION` devem ser marcadas como tais.
- Atualize documentação, evidência e status na mesma mudança que alterar comportamento.

## Definition of Done por tipo

- Documentação: fonte, status, links, revisão de consistência e questões abertas registradas.
- Feature: requisito aprovado, implementação, erros, testes, rastreabilidade, revisão e evidência.
- Arquitetura: alternativas, ADR, spike/evidência, riscos e aprovação humana.
- Implementação: DoD de docs/quality/definition-of-done.md, incluindo migração/backup quando aplicável.

## Regras para agentes

- Não invente requisitos, arquitetura, stack, métricas ou decisões sem base.
- Use contexto, evidência, requisitos, restrições e comparação de alternativas. Se houver opção claramente superior e a matriz permitir, registre `AGENT-PROVISIONAL` e continue; se faltar informação essencial, houver alternativas equilibradas ou condição ASK-FIRST, registre `NEEDS-HUMAN-DECISION` e pergunte.
- Acumule decisões provisórias relacionadas e solicite validação humana em lote ao final da fase relevante.
- Não instale dependências sem aprovação.
- Não altere banco de forma destrutiva, não acesse produção e não revele secrets.
- Não faça commit, push ou deploy automaticamente.
- Não faça criação/troca de branch, worktree, fetch/pull, stash/reset/clean, commit/push/merge, PR, tag ou release por iniciativa própria. Maycon controla Git; uma instrução explícita posterior pode autorizar uma operação específica. Trabalhar na branch atual não substitui nenhum gate de produto.
- Preserve o trabalho preexistente e confira git status antes e depois.
