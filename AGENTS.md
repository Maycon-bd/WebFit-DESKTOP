# AGENTS.md — WebFit Desktop

## Projeto

- Nome: WebFit Desktop.
- Objetivo: gestão local e offline de consultório e acompanhamento nutricional.
- Estágio: PROJECT STAGE: PLANNING; G1 aprovado e G2 em revisão.
- Domínio: Saúde no MVP; Educação é um espaço futuro.
- Usuários aprovados no MVP: nutricionista e administrador, ambos com acesso total.
- Operação: Windows-first, um computador por instalação, sem hospedagem ou mensalidade obrigatória.

Ainda não existe aplicação, dependência, banco, teste executável ou instalador neste repositório.

## Fonte de verdade

Leia antes de planejar ou alterar o produto:

1. docs/project/status.md;
2. docs/project/context.md;
3. docs/project/development-lifecycle.md;
4. docs/project/functional-candidates.md durante descoberta;
5. docs/product/scope.md;
6. requisitos, regras, casos de uso, matriz e ADRs relacionados ao domínio.

Hierarquia operacional detalhada: .harness/GOVERNANCE.md. Documentos legados são fontes de descoberta, não requisitos aprovados.

O Spec Kit é a fonte operacional para Constitution, Specification, Clarify, Plan, Checklist, Tasks, Analyze, Implement e Converge. O harness mantém intake, investigação, decisões, gates, Verification, Review e Evidence. Use `$project-task` como entrypoint de novas demandas e consulte `.harness/integrations/spec-kit.md`; não crie specifications concorrentes dentro do harness.

## Retomada obrigatória entre máquinas e chats

Quando uma solicitação contiver a frase “Vamos continuar onde paramos”, independentemente de maiúsculas, minúsculas ou pontuação:

1. leia integralmente docs/project/status.md;
2. confira git status --short --branch e o commit atual;
3. compare o estado local com branch, commit-base e sincronização registrados;
4. informe divergências antes de editar;
5. retome pela seção Próxima ação exata;
6. antes de encerrar trabalho material, atualize data, branch, commit-base, sincronização, última etapa concluída, próxima ação e checklist do Gate no mesmo arquivo.

## Arquitetura em validação

Tauri 2, React + TypeScript + Vite, Rust e SQLite são a composição proposta no ADR-0001, aprovada somente para spike. O spike deve validar shell, persistência, migrações, autorização, proteção local, arquivos, backup e restauração antes de qualquer implementação.

Não trate a proposta como decisão de produção nem importe a arquitetura do WebFit Web. Não introduza Supabase, Firebase, backend remoto, localStorage de domínio ou acesso SQL genérico pela WebView sem nova decisão arquitetural aprovada.

## Processo obrigatório

- Não implemente requisito sem ID, critérios de aceite e status aprovado.
- Mantenha rastreabilidade entre requisito, tarefa, teste e versão.
- Registre decisões significativas em ADR.
- Faça incrementos verticais: interface, domínio, persistência, erro e teste juntos.
- Atualize documentação na mesma mudança que altera comportamento.
- Preserve alterações preexistentes e não faça ações destrutivas sem autorização explícita.
- Siga o fluxo em .harness/README.md e use LIGHT, STANDARD ou STRICT.
- Orquestre as skills oficiais do Spec Kit sem modificá-las; customizações do projeto pertencem à Constitution, ao harness e à skill local `project-task`.
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

- ALLOW: leitura, pesquisa, análise, criação de artefatos do harness e checks locais não destrutivos.
- ASK: dependências, inicializações com risco de sobrescrita, migrações/schema, autenticação, integrações externas, infraestrutura, Plane/GitHub e mudanças arquiteturais materiais.
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
- Preserve o trabalho preexistente e confira git status antes e depois.
