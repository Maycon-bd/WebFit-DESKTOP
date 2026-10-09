# WEBFIT-15 — Feedback visual de validação em formulários

Data / nível / responsável / branch / HEAD: 2026-10-09 / STRICT / Maycon / `feature/pbi-001-primeiro-incremento-saude` / `88387e46266dbfc6e1e47363da595db545695ddd`.
Plane ID e estado / sincronização: WEBFIT-15 / Verification / ativo.
Fontes canônicas / autorização: `docs/requirements/functional-requirements.md`, `docs/requirements/acceptance-criteria.md`, `docs/requirements/business-rules.md`, `DESIGN.md`; pedido explícito de Maycon com imagem de referência, abrangência “Todos, incluindo acesso e segurança” e confirmação do padrão para formulários futuros.
Fase atual / primeira atividade pendente: implementação concluída; review independente e ensaio no WebView2 do Windows pendentes.

## 1. Discovery

**Problema:** ao enviar formulários com campos obrigatórios ausentes, vários fluxos dependem apenas do aviso nativo do navegador. A referência mostra todos os campos inválidos realçados em vermelho e a explicação ao lado do rótulo.

**Atual/esperado:** cadastro de pacientes já mostra erros próprios após tentativa; campos obrigatórios em login, preparação, perfil, prescrição, credenciais e licença usam validações HTML ou mensagens separadas. Aplicar o mesmo padrão após tentativa inválida, cobrindo todos os formulários de envio, sem mudar obrigatoriedade, regras de autenticação, validações de domínio ou persistência.

**Abrangência confirmada por Maycon:** cadastro/edição de pacientes, perfil profissional, prescrição/cardápio, primeiro acesso, login, ativação/licença, backup/recuperação, suporte temporário, troca e redefinição de senhas, além de todos os formulários criados futuramente. Formulários de consulta/filtro sem campos inválidos obrigatórios não ganham validação nova. Controles não pertencentes a formulários de envio permanecem fora.

**Requisitos e aceite:** RF-UX-007 / TA-UX-FORM-001, aprovados por Maycon em 2026-10-09 para implementação e adoção como padrão sistêmico futuro. Requisitos de domínio que determinam os campos obrigatórios permanecem os existentes (RF-AUT-001..004, RF-LIC-001..005, RF-CLI-001, RF-PAT-001/003/007, RF-PRE-001..005). Pacientes preservam TA-PAT-018; segurança mantém as regras de senha e credenciais atuais.

**Risco e dúvidas materiais:** feedback de senha não pode revelar valor digitado; mensagens usam apenas rótulo e estado de validade. Segurança/saúde tornam a classificação STRICT. Sem schema, banco, backend, dependência, integração ou regra clínica nova. Acesso, estado digitado, prevenção do envio, foco e rascunhos devem ser preservados.

**Plane:** buscas por validação inline ampla não encontraram demanda correspondente; WEBFIT-5 é específico a cadastro de pacientes. Criado um Work Item único em Planning no módulo Incremento 1. A lista de tipos não está disponível no plano deste workspace; o item foi criado com os campos suportados pelo Plane.

**Resultado: DISCOVERY COMPLETE.**

## 2. Plan

**Abordagem:** padronizar a validação na fronteira comum dos campos. Após tentativa de envio rejeitada por restrição já existente, mostrar `*` nos rótulos obrigatórios e destacar rótulo/controle em vermelho. Campo obrigatório vazio recebe mensagem inline “— <rótulo> é obrigatório”; outra restrição HTML já existente recebe mensagem segura e genérica. Não mostrar erro antes da tentativa; limpar por campo ao corrigir. A validação nativa continua bloqueando o envio.

**Arquivos previstos:** `src/FormField.tsx`, `src/PatientSexField.tsx`, `src/LicensePanel.tsx`, `src/App.tsx`, `src/style.css`; testes de regressão em `tests/unit/` e cenários visuais em `tests/visual/`; requisitos/aceite/rastreabilidade e esta tarefa.

**Tarefas proporcionais:**

1. Acrescentar RF-UX-007/TA-UX-FORM-001 e rastreabilidade, sem duplicar critérios de domínio.
2. Implementar estado de erro inline acessível e reutilizável nos campos com validação nativa; manter indicação específica de sexo obrigatório no cadastro de pacientes.
3. Aplicar o componente a todos os formulários de envio existentes, inclusive ativação/licença e acesso/segurança; não alterar filtros de consulta nem tornar campos opcionais obrigatórios.
4. Cobrir formulário inicialmente limpo, tentativa inválida, múltiplos erros, foco/prevenção de envio e correção dos campos em testes automatizados/visuais.

**Checks:** `npm run check`, `npm run format:check`, typecheck e ensaio visual mock nos formulários representativos de saúde, acesso e licença; `git diff --check`. Rust/SQLite/Tauri não aplicáveis se não houver mudança backend.

**Riscos/controles:** nenhum valor digitado será incluído em mensagens, logs ou evidências. Erros de autenticação/backend permanecem gerais e iguais. Mensagem de obrigatoriedade usa somente o rótulo; falha de formato usa texto genérico seguro, sem substituir validação do browser/backend. Testar teclado, leitura acessível, erro em múltiplos campos e limpeza individual.

**Decisão AGENT-PROVISIONAL D-UX-FORM-001:** usar `aria-invalid`/`aria-describedby` para relacionar o erro inline ao controle e retirá-los quando corrigido; confiança alta, impacto baixo, reversível, sem regra de domínio.

**Plan Scope Check:** escopo cobre a seleção explícita de Maycon e o padrão para formulários futuros; aceite preserva campos obrigatórios e validações existentes; proporção adequada a tarefa STRICT; nenhum schema/secret/exposição/dependência/integração/arquitetura/produção; trabalho preexistente será preservado. **PLAN APPROVED BY SCOPE.**

## 3. Execution

**Resultado: EXECUTION COMPLETE.**

- `src/FormField.tsx`: estado inline reutilizável; remove sufixos “(opcional)”/“(obrigatório)” dos rótulos e acrescenta `*` somente quando o controle já declara `required`; erros após tentativa inválida realçam rótulo/controle e associam mensagem por `aria-describedby`/`aria-invalid`. A atualização é diferida para registrar todos os controles inválidos no mesmo envio e a limpeza é por campo, após a correção. O envio continua bloqueado pela validade existente.
- `src/PatientSexField.tsx`: erro do grupo obrigatório junto ao rótulo, incluindo prevenção do balão nativo. `src/LicensePanel.tsx`: ativação, suporte temporário e transferência/recuperação passam pelo componente compartilhado. `src/App.tsx`: paciente e perfil usam rótulos limpos; demais formulários já usam o componente comum. `src/style.css`: estado vermelho usa token semântico existente.
- `tests/unit/patient-sex.test.ts`, `tests/unit/shared-components.test.ts`, `scripts/visual-smoke.mjs`, `tests/visual/`: regressões para rótulo obrigatório/opcional, estado inválido e correção, login e paciente; valida que uma tentativa inválida não invoca `save_patient`, que a relação acessível existe e que texto de senha nunca entra na mensagem. Testes visuais usam serviço e dados fictícios em memória.
- `docs/requirements/functional-requirements.md`, `docs/requirements/acceptance-criteria.md`, `docs/requirements/traceability.md`, `specs/003-webfit-5-cadastro-paciente/spec.md`: requisito, aceite, rastreabilidade e preservação do aceite de paciente atualizados.
- `DESIGN.md`: padrão sistêmico para formulários futuros documentado; novas telas devem reutilizar `FormField` e acrescentar regressões de erro/correção.

**Checks finais:** PASS — `npm run check` (lint, TypeScript, 53 testes Node e build Vite); `npm run format:check`; `node node_modules/typescript/bin/tsc --project tests/visual/tsconfig.json --noEmit`; `node scripts/visual-smoke.mjs` (4 cenários PASS: pronto, vazio, erro e lento, Chrome headless 154.0.8037.98, mock sem rede/servidor); `git diff --check`. Build reporta aviso de bundle frontend 557.25 kB > 500 kB; não foi introduzida dependência ou refatoração de bundle.

**Evidência visual:** `.artifacts/visual-test/WEBFIT-15/headless/login-invalid.png` e `new-patient-invalid.png` mostram os erros simultâneos; `results.json` registra operações por nome, sem payload, valores clínicos ou credenciais. Capturas são headless em Chrome no Windows; não comprovam WebView2/Tauri.

**Segurança e domínio:** nenhuma mudança em backend, autenticação, autorização, regras clínicas, schema, banco, backup ou integração; valores digitados não são concatenados às mensagens, e os erros de credencial/backend existentes permanecem gerais. Nenhum dado real usado. O cálculo energético é uma seção de cálculo com validação de domínio própria e sem controles `required`; não teve as suas regras ou mensagens globais alteradas.

## 4. Code Review

**Revisão técnica própria:** sem finding bloqueador observado no diff; revisão manual das capturas e dos caminhos de correção conferiu consistência visual, identificação de obrigatoriedade, associação dos erros e preservação do envio bloqueado. Erros inicialmente encontrados pelos testes (apenas o primeiro controle, estado controlado interrompido ao limpar e aviso nativo do sexo) foram corrigidos e os checks afetados repetidos.

- Correctness: PASS — 53 testes Node; ensaio de login e cadastro com tentativa vazia, correção e envio subsequente; erro individual e envio mock bloqueado.
- Formatação/lint/TypeScript/build: PASS — comandos registrados na execução; build mantém aviso de bundle 557.25 kB.
- Security: PASS na fronteira alterada — teste verifica não exposição de senha; sem mudanças no backend/credenciais. NOT RUN: Mantis/ferramenta de segurança especializada, indisponível/não instalada e fora de necessidade para este refinamento.
- UI/a11y: PASS na captura headless para estados de erro; contraste usa `--error-text` existente, rótulo contém `*` apenas se `required`, mensagem tem `aria-describedby` e corrigir remove o erro. NOT RUN: leitor de tela, zoom 200%, reflow estreito e WebView2/Tauri no Windows.
- Impeccable: launcher/context NOT RUN — engine 0.1.12 não instalado; o launcher informou que precisaria criar cache fora das raízes graváveis e de acesso à rede. Segui a avaliação manual read-only usando `PRODUCT.md`, `DESIGN.md`, o playbook Operate e as referências de UI do harness.
- Revisão independente: PENDENTE — indisponível nesta execução; revisão própria não a substitui.

**Resultado: CODE REVIEW INCOMPLETE.** Não marcar READY TO SHIP nem Done até revisão independente e ensaio/aceite funcional pendentes. O Plane permanece em Verification.

## Extensão — campo de data com máscara e calendário, 2026-10-09

### Discovery

Pedido explícito de Maycon para portar o `DateField` de `components.rar` e usá-lo nos campos de data simples. O Desktop tinha `DateInput` nativo no nascimento do paciente e nos filtros `datetime-local` da auditoria. O componente legado inclui máscara `DD/MM/AAAA` e calendário, mas importa ToastContext/lucide e estilos Tailwind que não fazem parte do produto; somente o comportamento de data simples foi curado, sem copiar essas dependências/arquitetura. Em pedido subsequente, Maycon determinou remover `DateInput.tsx` e usar somente `DateField`; datas e horários de auditoria permanecem locais e nativos dentro do modo `datetime-local` do componente. RF-UX-007/TA-UX-DATE-001 aprovados pelo pedido explícito. Sem alteração de regra de saúde, backend, banco, autenticação ou dependência.

### Plan

Criar `src/DateField.tsx` com entrada numérica `DD/MM/AAAA`, normalização civil para ISO `AAAA-MM-DD`, validação de datas reais/range, calendário com mudança de mês e botões nomeados/focados, Escape para fechar, integração com `FormField`/HTML validity e modo nativo `datetime-local`. Aplicar nos campos de data e data/hora; remover `src/DateInput.tsx`. Atualizar DESIGN, RF, aceite, rastreabilidade, regressões unitárias e roteiro visual existente. Plan Scope Check: escopo e comportamento foram solicitados por Maycon; sem operação sensível, schema, domínio novo ou dependência; aprovado para execução.

### Execution

`src/DateField.tsx` portado com helpers testáveis, input controlado, emissão ISO somente em datas válidas, `setCustomValidity` seguro e calendário sem pacote externo. O botão e o popup têm nomes acessíveis, dias selecionados/indisponíveis marcados, estrutura de tabela semântica, setas movem o foco por dias/semanas e Escape retorna foco ao botão; selecionar data retorna foco ao campo. `src/App.tsx` usa `DateField` para nascimento e filtros de auditoria; o modo `datetime-local` preserva o controle e valor local nativos. `src/DateInput.tsx` foi removido conforme pedido explícito. `src/style.css` estiliza a máscara/calendário com tokens aprovados. Regressões adicionadas em `tests/unit/shared-components.test.ts` e no runner `scripts/visual-smoke.mjs`, incluindo rejeição de data incompleta e 31/02/2001 com texto preservado, correção, seleção no calendário e reabertura mantendo `15/01/1992`, setas e Escape.

**Checks:** `npm run check` PASS (lint, TypeScript, 57 testes e build); `npm run format:check` PASS; `node scripts/visual-smoke.mjs` PASS (quatro cenários, incluindo máscara, data incompleta/impossível preservada para correção, calendário, semântica de tabela, quatro setas, transição de mês, Escape/foco e reabertura mantendo a data); `git diff --check` PASS com avisos preexistentes de conversão CRLF/LF em arquivos da branch. Build mantém o aviso de bundle acima de 500 kB.

### Code Review da extensão

Revisão independente read-only confirmou integração ISO/local, alcance restrito ao date-only, compatibilidade com `FormField` e critérios/rastreabilidade. Finding P2 inicial sobre grade ARIA e navegação foi corrigido com tabela semântica e setas esquerda/direita/cima/baixo; revisão posterior confirmou a resolução e não encontrou findings remanescentes. SECURITY: fronteiras de autenticação, IPC, banco, segredo e persistência não foram tocadas; risco de exposição do valor da data não observado em UI/runner mock. UI: runner Chrome headless confirma fluxo e interações, mas leitor de tela, zoom 200%, reflow e WebView2/Tauri do Windows seguem NOT RUN. Impeccable launcher/context indisponível por engine ausente e cache/rede fora das raízes graváveis; avaliação manual e revisão independente usadas. Mantis não disponível, sem superfície de segurança alterada. Resultado: **REVIEW PASSED WITH WARNINGS**; não READY TO SHIP, pois aceite/ensaio nativo da WEBFIT-15 seguem pendentes. Plane continua Verification; sem sincronização remota neste ambiente.
