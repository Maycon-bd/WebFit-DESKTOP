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

O harness usa exatamente quatro fases: Discovery, Plan, Execução e Code Review (DEC-057). Use `$webfit-task` como entrypoint; a invocação explícita autoriza as quatro fases no escopo informado, sem gate genérico entre Plan e Execução. Plan Scope Check identifica decisões materiais e ações sensíveis não autorizadas. Spec Kit mantém Constitution e ferramentas oficiais opcionais dentro das fases, conforme `.harness/integrations/spec-kit.md`. Prefira registro persistente único em `specs/WEBFIT-XX/task.md` quando necessário, reutilizando artefatos históricos; não crie specs concorrentes no harness.

Skills locais auxiliares: `$webfit-checkpoint` para retomar/salvar o checkpoint entre chats e máquinas; `$webfit-verificar` para checks proporcionais e evidência. Não adicionam gates nem substituem review independente. O nome anterior do entrypoint era `project-task`; registros históricos preservam esse nome.

## Colaboração e comunicação

- Comunique-se com Maycon em português brasileiro. Preserve identificadores, convenções do código e termos técnicos quando a tradução prejudicar a precisão.
- Atue como parceiro técnico: apresente opiniões diretas e fundamentadas, exponha trade-offs e recomende uma opção quando houver base. Não concorde apenas para agradar.
- Aplique o contrato de interação em `.harness/HUMAN-INTERACTION-CONTRACT.md`. Maycon mantém as autoridades técnicas e de produto; Amanda mantém a aprovação de domínio e aceite funcional definidos na governança.
- Antes de trabalho não trivial, resuma objetivo, escopo, arquivos afetados e abordagem usando o planejamento existente. Reutilize planos e aprovações válidos; aguarde somente gates ou decisões materiais ainda pendentes.
- Reaproveite autorizações suficientes e continue o trabalho necessário dentro do escopo. Não peça confirmação por arquivo, teste, comando permitido ou transição de fase.
- Resolva escolhas internas pequenas e reversíveis pela política de autonomia. Pergunte quando faltar informação material, houver conflito concreto ou condição ASK-FIRST; bloqueie somente o trabalho dependente e continue o independente permitido.
- Aplique Phase Summary do contrato de interação: ao concluir cada fase STANDARD/STRICT, apresente resumo verificável no chat antes de avançar, com ID Plane quando houver, resultado, riscos/checks e documentação realmente criada/modificada. LIGHT breve pode agrupar alteração/revisão; bloqueios recebem resumo parcial. Os resumos não criam gate, fase, arquivo ou escrita Plane adicional.
- Informe progresso, achados e incertezas de forma breve. Ao concluir, distinga proposto, implementado e verificado; indique evidências, limites da verificação, pendências e próxima ação quando houver.
- Não afirme que algo funciona sem evidência adequada. Resultado relatado pelo humano deve ser identificado como tal; revisão e checks locais não comprovam por si só aceite funcional, distribuição ou comportamento no Windows.

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
- Siga as quatro fases de .harness/README.md; LIGHT, STANDARD e STRICT definem profundidade, sem pipelines separados. Reuse aprovações específicas suficientes e avance automaticamente no escopo; dados reais, segurança sensível, domínio e gates de produto mantêm sua autoridade.
- Git é controlado por Maycon (DEC-054): execute todas as demandas na branch atualmente ativa, inclusive STANDARD/STRICT. Não crie/troque branches nem exija branch exclusiva, base `develop` ou árvore limpa. Inspeção somente leitura serve para preservar alterações e rastrear a entrega; conflito concreto no conteúdo deve ser esclarecido.
- Use skills oficiais do Spec Kit quando úteis ou explicitamente solicitadas, sem impor a cadeia completa nem modificá-las; customizações do projeto pertencem à Constitution, ao harness e à skill local `webfit-task`.
- Siga .harness/AUTONOMY-POLICY.md para decidir, registrar e validar escolhas; nunca represente `AGENT-PROVISIONAL` como aprovação humana.
- Não ative loops persistentes ou scheduler. Autocorreção dentro do Plan é permitida, até três ciclos sem convergência por problema; depois registre causa/tentativas e decisão necessária.

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

### Implementação e manutenção

- Faça a menor mudança que atende ao requisito aprovado. Sinalize problemas adjacentes sem ampliar o escopo; evite refatorações não relacionadas.
- Leia o código e as convenções afetadas antes de editar. Use TypeScript e tipos precisos; preserve os padrões aprovados de React/Rust e as configurações existentes de lint e formatação.
- Organize funções e módulos por responsabilidade, sem limites mecânicos de linhas. Extraia abstrações quando houver responsabilidade comum ou duplicação real; evite generalizações e pontos de extensão especulativos.
- Separe domínio de interface e I/O conforme a arquitetura aprovada. Torne contratos, unidades, invariantes e efeitos colaterais explícitos; não introduza padrões ou camadas sem necessidade.
- Trate erros esperados e inesperados explicitamente, preserve a causa técnica quando seguro e libere recursos de forma determinística. Mensagens e logs devem respeitar a proteção de dados sensíveis, sem incluir valores clínicos ou credenciais.
- Comente intenção, restrições e motivos não óbvios. Preserve comentários relevantes em refatorações; atualize documentação afetada e registre descobertas na fonte apropriada, sem transformar AGENTS.md em histórico de incidentes.
- Verifique APIs e comportamentos incertos na documentação oficial compatível com a versão usada. Não invente contratos de bibliotecas; prefira dependências existentes e mantenha aprovação prévia para novas dependências.
- Corrija primeiro o comportamento; otimize com evidência de necessidade e medição. Não acrescente cache, concorrência ou instrumentação sem motivo no escopo aprovado.
- Em interfaces, cubra carregamento, vazio, erro e recuperação previstos nos requisitos, além de semântica, rótulos, teclado, foco e contraste. Lacunas relevantes de comportamento seguem o discovery vigente.

### Testes, diagnóstico e revisão

- Teste comportamento observável e critérios de aceite, incluindo erros e bordas relevantes ao risco. Não exija um teste por função nem metas mecânicas de quantidade de testes.
- Para bugs, reproduza, identifique a causa e acrescente teste de regressão que demonstre a falha antes da correção quando tecnicamente viável; registre quando a reprodução não for possível.
- Use testes unitários, de integração e ponta a ponta conforme a fronteira afetada. Mantenha testes repetíveis, independentes e sem dependência de dados reais, rede externa ou credenciais.
- Controle relógio e aleatoriedade quando afetarem o resultado. Use fakes nas fronteiras pertinentes sem substituir os testes reais de integração SQLite, migração, backup e restauração exigidos pelo projeto.
- Refatore em passos pequenos, preservando comportamento e testes. Em código arriscado sem cobertura, caracterize o comportamento antes de alterá-lo; mantenha refatoração e mudança funcional distinguíveis no diff.
- Não enfraqueça nem remova testes apenas para obter sucesso. Corrija testes incorretos com justificativa; se correções acumularem exceções ou revelarem falha arquitetural, reavalie a abordagem pela governança.
- Revise o código e o diff efetivos, além da descrição. Registre o que foi verificado, o que não foi coberto e os riscos residuais; a autorrevisão não substitui a revisão independente exigida pelo harness.
- Escolha checks proporcionais ao tipo de mudança, preservando os obrigatórios da DoD. Documentação pura requer consistência, links e diff; não exige testes ou build do produto sem alteração relevante. Reexecute checks quando entradas mudarem, houver falha pendente ou o resultado não corresponder ao estado final.

## Política de ferramentas

- ALLOW: leitura, pesquisa, análise, criação de artefatos do harness e checks locais não destrutivos. Git somente leitura para contexto e preservação; operações que alteram Git ficam sob controle de Maycon (DEC-054).
- Execute ações ALLOW dentro do escopo autorizado sem novo pedido por comando, incluindo testes e demais checks aplicáveis. Isso não autoriza instalação de dependências, alteração de schema, escrita externa, Git mutável ou publicação.
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
- Acumule decisões provisórias relacionadas para validação humana em lote; as não bloqueantes podem seguir ao aceite final, sem interrupção extra entre fases. ASK-FIRST e decisão material pendente bloqueiam somente a operação dependente.
- Não instale dependências sem aprovação.
- Não altere banco de forma destrutiva, não acesse produção e não revele secrets.
- Não faça commit, push ou deploy automaticamente.
- Não faça criação/troca de branch, worktree, fetch/pull, stash/reset/clean, commit/push/merge, PR, tag ou release por iniciativa própria. Maycon controla Git; uma instrução explícita posterior pode autorizar uma operação específica. Trabalhar na branch atual não substitui nenhum gate de produto.
- Preserve o trabalho preexistente e confira git status antes e depois.
