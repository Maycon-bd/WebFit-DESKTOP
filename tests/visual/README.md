# Ambiente visual mock — WEBFIT-14

Executar na raiz: `node scripts/visual-smoke.mjs`.

Usa Playwright do runtime já fornecido pelo Codex e Chrome/Edge instalado. Não instala dependências. Em outra máquina, informe `WEBFIT_PLAYWRIGHT_MODULES` com o diretório de módulos do runtime e, se necessário, `WEBFIT_BROWSER` com o executável existente. Ausência dessas ferramentas é erro explícito.

O runner compila um entrypoint exclusivo de teste, importa os componentes reais do produto e usa `mockIPC`/`mockWindows` oficiais do Tauri. Entrega arquivos diretamente ao navegador por interceptação de requests, sem servidor, porta ou rede externa. O endereço `http://webfit.mock` é sintético, não um serviço hospedado. Nenhuma alteração de `src/main.tsx`, autenticação, licença ou banco do produto.

Chrome headless não abre janela e não usa mouse, teclado ou foco do desktop. Cada cenário ganha um contexto separado e dados exclusivamente em memória; ao encerrar, navegador/contextos são fechados. Credenciais públicas `visual`/`mock-webfit` são aceitas somente pelo mock. O runner preenche o formulário sozinho; Maycon não precisa entrar nesse ambiente.

Cenários: `ready`, `empty`, `error`, `slow`. Cobertura inicial: login fictício, pesquisa/com resultado e sem resultado, lista vazia, erro e recuperação por nova pesquisa, cadastro com nome/data/sexo e reabertura. Operações desconhecidas falham explicitamente e invalidam o resultado; o mock ainda não cobre todos os módulos. `window.webfitMock.failNext(op)` injeta uma falha única em ensaios adicionais. Logs registram nomes de operações, sem payloads.

Capturas e `results.json` ficam em `.artifacts/visual-test/WEBFIT-14/headless/`, ignorados pelo Git. O resultado é marcado RUNNING/FAIL/PASS para evitar interpretar execução anterior como sucesso atual. Build intermediário preserva arquivos existentes e usa somente `.artifacts/visual-test/WEBFIT-14/headless-build/`.

Limite: mock comprova apresentação/interação frontend nos cenários executados. Não comprova persistência SQLite, regras Rust, autorização, licença, DPAPI, backup, atualização ou WebView2. Ensaios reais Tauri continuam em P01 e nas specs correspondentes. Não há scheduler ou execução permanente: o agente pode repetir o comando durante trabalho autorizado enquanto Maycon usa a máquina.

Check de tipos: `node node_modules/typescript/bin/tsc --project tests/visual/tsconfig.json --noEmit`.
