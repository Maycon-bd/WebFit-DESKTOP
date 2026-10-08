# WEBFIT-6 — Guia de validação

Pré-requisitos: plano aprovado e ferramentas/dependências presentes; somente dados fictícios. Sem instalar dependências ou gerar instalador local nesta demanda.

1. Executar `npm run format:check` e `npm run check` na raiz.
2. Executar checks Rust/SQLite, formatação e Clippy disponíveis no ambiente de build Windows existente; build Tauri sem bundle quando aplicável. Registrar impedimentos reais.
3. Abrir aplicação pelo fluxo de teste existente. No login, clicar/tabular até (i); conferir nome/versão/crédito; Escape/Fechar devolvem foco. Preservar acesso administrativo/preparação conforme TA-UX-002.
4. Entrar e repetir em Pacientes, cadastro/edição, prescrição/energia, Perfil, Acesso, Configurações, Auditoria, Backup/restauração e troca obrigatória de senha. Não executar restauração para ensaiar informações.
5. Preencher formulário fictício sem salvar, abrir/fechar e conferir campos/sessão. Recolher lateral e navegar: ícone permanece único.
6. Conferir zoom 200%, janela estreita e formulário longo: ícone e último controle alcançáveis com teclado/rolagem sem sobreposição impeditiva. Abrir tutorial/outro diálogo: informações não interceptam ações/foco.
7. Conferir seção administrativa só no login conforme proposta D-INFO-001; ensaiar falha de versão em simulação controlada ou registrar limite.

Resultado esperado: TA-INFO-001..006 e regressão TA-UX-002 satisfeitos. Preview não comprova versão instalada Tauri; registrar separadamente frontend e Windows. Consolidar Verification/Review/UI/Evidence com limitações e aceite humano.
