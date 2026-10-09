# P01 — Ambiente isolado e automação da interface

- Data: 2026-10-09.
- Status: **EM EXECUÇÃO — WEBFIT-14; ambiente headless mock funcional, ensaios nativos/review pendentes**, autorização de Maycon em 2026-10-09.
- ID local de pendência; não é ID Plane, requisito aprovado ou tarefa formal de infraestrutura.
- Tipo: spec documental de retomada solicitada por Maycon; execução futura segue o registro canônico existente e webfit-task.

## Origem e estado atual

### Ambiente autônomo headless — 2026-10-09

Maycon pediu acesso repetível sem precisar fazer login para o agente e sem impedir seu uso simultâneo da máquina; autorizou continuar até esse ponto. Discovery/Plan anteriores reutilizados. PLAN APPROVED BY SCOPE: entrypoint somente de teste com mocks oficiais Tauri, interface real React, memória fictícia, sem mudança de produto, licença, backend ou schema. Nenhuma dependência instalada; reutilizados Playwright do runtime Codex e Chrome existente. Decisão interna AGENT-PROVISIONAL: fornecer recursos compilados diretamente ao navegador por interceptação, eliminando servidor/porta após três tentativas de conexão local sem convergência por bloqueio de rede da sandbox. A execução final funciona com permissões padrão.

Implementado [runner headless](../../scripts/visual-smoke.mjs) e [ambiente/instruções](../../tests/visual/README.md), com HTML/entrypoint próprio, mock em memória e tsconfig próprio. Contextos separados para ready/empty/error/slow; navegador sem janela, sem uso de foco/input físico. Login público fictício preenchido automaticamente. Operações não simuladas falham explicitamente; logs incluem somente nomes das operações. Capturas trazem marca “backend simulado”. Não há scheduler nem processo permanente.

Evidência: quatro cenários PASS, login/lista/pesquisa/vazio/erro e recuperação, cadastro completo obrigatório e reabertura fictícios. Capturas e results.json em `.artifacts/visual-test/WEBFIT-14/headless/`. Inspeção visual das capturas pacientes/cadastro realizada; nome longo do usuário quebra na lateral, achado de apresentação para ensaio P05, sem correção fora do escopo. TypeScript próprio e build do entrypoint PASS. Checks finais do produto registrados no checkpoint. Rust/SQLite/Tauri não reexecutados neste incremento exclusivo de harness/frontend mock; build nativo anterior continua evidência histórica.

Limites: mock não comprova regras/persistência reais, licença/DPAPI/backups/update/WebView2; serviço tem cobertura inicial, sem simulação completa dos módulos. Review independente indisponível nesta execução, pendente; autorrevisão não equivale a aprovação. P01-C01/C04 cobertos na camada mock; C02/C05 nativos continuam pendentes. Próxima ação: ampliar cenários conforme P05 e pendências autorizadas, mantendo ensaios reais Tauri separados. Maycon não precisa logar para esses ensaios mock; ativação/login válidos ainda se aplicam à camada nativa histórica abaixo.

### Retomada autorizada — WEBFIT-14, 2026-10-09

Maycon pediu começar P01 para preparar acesso ao sistema e enxergar as telas. Plane disponível nesta sessão; busca no projeto confirmou ausência de item correspondente, criado WEBFIT-14 (`12fc17f4-a724-4517-a6ad-fd8bbb7b3850`), prioridade neutra. O bloqueio histórico PLANE ID REQUIRED foi resolvido. Registro de execução/Plan/Evidence permanece nesta spec, sem arquivo concorrente.

Discovery: plugin computer-use importou `@oai/sky` e listou janelas reais com sucesso, sem captura de aplicação de uso. Diagnóstico anterior de WebView2 reutilizado. Controle nativo do CUA e plugin Computer Use são superfícies diferentes; indisponibilidade histórica não descreve este plugin funcionando. Drivers WebDriver ainda não preparados.

Plan Scope Check: PLAN APPROVED BY SCOPE para preparação local e captura do candidato isolado solicitadas por Maycon. Configuração de build específica usa identifier `br.webfit.desktop.visualtest.webfit14`, título próprio, sem bundle e endpoints de updater vazios. `src-tauri/src/lib.rs` usa `app_local_data_dir`, isolando serviço e perfil WebView pelo identifier. Nenhuma alteração de backend/schema/credencial/trust root ou instalação nova. Ferramentas existentes serão reutilizadas; ativação/autenticação válidas continuam necessárias.

Alvos: [preparador do ambiente](../../scripts/prepare-visual-environment.ps1), artefatos ignorados `.artifacts/visual-test/WEBFIT-14/`, esta spec e checkpoint. Checks: build Tauri debug offline/locked, config/manifest/hash/paths distintos, abertura/captura real e encerramento/reabertura pertinentes; review independente e E2E completo permanecem separados.

Decisão técnica AGENT-PROVISIONAL: usar plugin Computer Use já disponível para obter acesso visual imediato; tauri-driver continua alternativa para suíte E2E futura. Nenhuma dependência é instalada nesta escolha. Identificador separado é detalhe reversível do ambiente de teste, não nova identidade de distribuição do produto.

Fontes técnicas verificadas: [CLI Tauri --config](https://v2.tauri.app/reference/cli/), [PathResolver app_local_data_dir](https://docs.rs/tauri/2.12.1/tauri/path/struct.PathResolver.html). O schema local do CLI confirma os campos usados; não usar appDirectoriesOverride das docs latest porque não consta no schema local. `dataDirectory` no schema é relativa, portanto o isolamento usa o identifier em vez de path absoluto inventado.

O texto abaixo descreve a pendência original; a autorização atual supera seu limite de criação documental somente no escopo de P01.

### Acesso visual autorizado e comprovado — continuação 2026-10-09

Maycon respondeu “autorizado”. A nova chamada launch_app abriu o candidato isolado; seleção confirmou uma única janela com caminho exato do executável e título `WebFit — TESTE ISOLADO WEBFIT-14`. Captura inicial não representou corretamente a janela (render/captura transitório); ativação da janela e observação nova recuperaram a tela real e árvore de acessibilidade do WebView. Nenhuma coordenada transitória foi usada para agir.

- **PASS:** abertura nativa, captura real de ativação e identificação de botões/árvore de acessibilidade; o assistente consegue enxergar a interface do candidato.
- **PASS:** pasta isolada criada no desktop com `health.db`, `installation.key.dpapi` e `license.identity.dpapi`; manifesto atualizado com observação runtime. Conteúdo de banco/DPAPI não foi lido.
- Captura válida salva em `.artifacts/visual-test/WEBFIT-14/activation-screen.png`, somente tela inicial fictícia, sem senha/código informados. A imagem transitória de outro contexto não foi salva como evidência do aplicativo.
- Ensaio de botão Sobre interrompido pela ferramenta ao detectar interação humana; clique não foi declarado executado. Nova observação feita sem screenshot e com saída limitada a títulos/botões, sem imprimir campos potencialmente sensíveis. Preparação de acessos apareceu na árvore; isso não prova ativação concluída.
- **P01-C01 parcial:** abertura/isolamento PASS, preparar/autenticar ainda NOT RUN. **P01-C02/C05 NOT RUN:** persistência após reinício/encerramento ainda não ensaiada. **P01-C04 parcial:** captura real salva, diagnóstico de falha de cenário ainda não exercitado. Expiração de aprovação anterior resolvida; não há bloqueio atual de permissão do plugin.

Próxima ação: Maycon concluir ativação/preparação/login diretamente na janela isolada usando o fluxo válido, sem secrets no chat; avisar quando estiver na tela de pacientes para retomar captura/navegação fictícia. Não automatizar diálogos de autenticação conforme orientação do plugin. Ambiente deixado aberto para esse handoff, não processo abandonado. Sem ensaio clínico, E2E completo, review independente ou aceite final inferidos.

### Execução e evidência parcial inicial — histórico antes da autorização de acesso

- Criado preparador PowerShell, sem instalação automática e sem abertura automática. `pwsh -NoProfile -File scripts/prepare-visual-environment.ps1 -Build` gerou configuração específica, executável e manifest/hash. Executar sem `-Build` apenas prepara/confere o endereço da configuração; não altera o binário nem abre o sistema.
- Build Tauri debug offline/locked sem bundle **PASS**: TypeScript/Vite e Rust nativo, perfil dev concluído em 1m17s. Node22.21.0, Rust/Cargo1.98.1, CLI2.11.3, Windows reportado 10.0.26300.0. Avisos existentes: bundle556,61kB, PDB OpenSSL ausente, colisão bin/lib, hard-link de cache e STATIC_VCRUNTIME. Isso não é ensaio Windows10 do produto.
- Candidato: `.artifacts/visual-test/WEBFIT-14/WebFit-Visual-WEBFIT-14.exe`; SHA256 `6DFC4877D5A027B5125ED1556C0DEF0B230DFEE4F596E495E09CD61ECAE61534`. Arquivos auxiliares `tauri.visual-test.json`, `manifest.json` e `tool-versions.json` ignorados pelo Git. Copiar/preservar ou recompilar ao trocar de máquina.
- Config/manifest/hash do candidato e configuração **PASS**; identifier isolado, bundle=false e endpoints=[] conferidos. Parser PowerShell e diff/whitespace **PASS**. `src/`, `src-tauri/` e manifests/locks de produto não alterados.
- Atenção ao ambiente: shell Codex redireciona LocalApplicationData para sandbox por chamada, enquanto plugin visual atua no desktop. Preparador registra separadamente `buildProcessLocalDataPath` e caminhos esperados de desktop; `-DesktopLocalDataRoot` permite diretório redirecionado do usuário Windows. O manifesto foi corrigido antes da tentativa de abertura, sem rebuild funcional, porque identifier estático não mudou.
- Armazenamento esperado no desktop: `%USERPROFILE%/AppData/Local/br.webfit.desktop.visualtest.webfit14`, distinto de `br.webfit.desktop`. Pasta de teste ausente antes e após tentativa de abertura. Separação estática/configurada **PASS**, prova de criação runtime **NOT RUN**. Metadados da pasta de uso (sem leitura de conteúdo) foram registrados, sem afirmar prova integral de invariância.
- Plugin `computer-use`: import e list_windows **PASS**; launch_app retornou **Computer Use app approval timed out**. Listagem posterior não encontrou janela do candidato. Não houve captura de tela ou login. Não substituir a abertura por outro mecanismo para contornar a autorização do plugin.
- P01-C01/C02/C04/C05 **NOT RUN**: candidato não abriu; P01-C03 **WARNING**: expiração de aprovação da ferramenta, sem falha funcional demonstrada. Drivers WebDriver/E2E contínuo e review independente **NOT RUN**. Autorrevisão: risco de paths sandbox corrigido; nenhuma licença/credencial/trust/schema adulterados.

**Próxima ação concreta:** autorizar acesso do plugin ao executável isolado quando o prompt aparecer; retentar launch_app uma vez autorizado, selecionar exatamente a janela retornada, capturar ativação inicial e conferir criação dos dados no path isolado. Depois ativação/autenticação válidas pelo responsável para acesso às telas clínicas, sem senha/código no chat. A [orientação do plugin](C:/Users/Maycon%20Garcia%20Silva/.codex/plugins/cache/openai-bundled/computer-use/26.1002.52244/docs/guidance.md) restringe automação de diálogos de autenticação; fazer handoff quando chegar nessa etapa, sem alterar controles do produto.

Code Review: autorrevisão estática e checks de preparação concluídos; independente e verificação visual/runtime pendentes. **CODE REVIEW INCOMPLETE; sem READY TO SHIP**. Estado operacional impedido pelo acesso do plugin, não por ausência de ID Plane. Aceite humano, G5/G6/G7 preservados.

O checkpoint registra WebView2 disponível; drivers, isolamento e E2E não foram preparados. O pedido atual autoriza documentar a pendência; não supre o ID ou a exceção de infraestrutura.

Fonte operacional: [checkpoint](../../docs/project/status.md). Esta spec detalha a pendência e não substitui o checkpoint ou os artefatos de execução.

## Resultado e escopo pendente

Preparar candidato Tauri Windows em armazenamento separado, automatizar com tauri-driver/Edge WebDriver compatíveis, executar cenários fictícios e capturar resultados.

## Restrições e decisões

Nenhuma base instalada ou real pode ser aberta, alterada ou apagada. Instalações/dependências exigem autorização suficiente; preservar licença, autenticação e autorização.

Somente dados fictícios. Sem instalação, migração, Git mutável, publicação ou mudança de produto nesta entrega documental. A profundidade STANDARD/STRICT da retomada é definida pelo risco; vínculo Plane obrigatório antes de artefatos formais novos quando aplicável.

## Critérios de conclusão da pendência

- [ ] Armazenamento de teste comprovadamente separado do uso.
- [ ] drivers e versões registrados.
- [ ] cenários reais executados com dados fictícios.
- [ ] capturas sem dados sensíveis.
- [ ] comandos repetíveis incorporados à verificação antes do commit humano.
- [ ] Evidência identifica versão/commit, ambiente, cenário, resultado PASS/FAIL/NOT RUN e limites.
- [ ] Revisão e aceite pertinentes registrados sem inferir G5/G6/G7.

Estes critérios organizam verificação/propostas; não alteram critérios de produto aprovados nas fontes abaixo. Critérios propostos de N01–N05 precisam validação no Discovery/Plan pertinente.

## Próxima ação

Resolver vínculo Plane ou exceção explícita; conferir ferramentas atuais e recuperar diagnóstico válido antes de preparar ambiente.

## Detalhamento para retomada

### Objetivo, atores e entradas

Permitir repetir jornadas reais no Tauri/WebView2 e distinguir falha do produto, do driver e do ambiente. Ator principal: responsável técnico; usuário de teste: nutricionista ou administrador fictício, conforme o cenário.

Candidato identificado por commit/versão/hash; máquina/VM/usuário Windows de teste; diretórios de dados explicitamente separados; licença de fixture válida pelo fluxo autorizado; inventário de ferramentas disponíveis. O mecanismo concreto de isolamento ainda precisa ser definido e comprovado; não se presume que variável de ambiente ou flag já exista.

### Fluxo de trabalho previsto

1. Resolver registro Plane/exceção e recuperar autorizações de ferramentas necessárias.
2. Escolher isolamento por ambiente Windows vazio ou mecanismo de configuração já suportado; inspecionar caminho efetivo antes de abrir o candidato.
3. Registrar versões de Windows, WebView2, candidato e drivers; conferir compatibilidade em documentação oficial na implementação.
4. Preparar fixtures e ativação sem atalhos de autorização; iniciar candidato de teste e comprovar o caminho de armazenamento.
5. Executar smoke test de abertura, login, navegação e encerramento; depois cenários P03–P07.
6. Salvar resultado/capturas e encerrar processos de teste de forma controlada, preservando artefatos úteis.

Passos de execução acima são planejamento de retomada, ainda não executados nesta entrega. Operações dependentes seguem as autorizações e o status do início desta spec.

### Cenários verificáveis

IDs abaixo são locais de cenário; não substituem IDs TA/RF aprovados. Resultados que detalham uma proposta N permanecem propostos até validação pertinente.

| Cenário | Dado | Quando | Resultado a verificar |
| --- | --- | --- | --- |
| P01-C01 | Destino vazio isolado | Abrir, preparar e autenticar | Dados somente no destino de teste; instalação de uso intacta |
| P01-C02 | Dados fictícios persistidos | Reiniciar candidato | Registros reaparecem no mesmo armazenamento de teste |
| P01-C03 | Driver incompatível ou ausente | Iniciar automação | Falha de infraestrutura identificada, sem atribuir FAIL funcional ao produto |
| P01-C04 | Falha de cenário | Capturar diagnóstico | Erro, screenshot e passo registrados sem credenciais |
| P01-C05 | Teste encerrado | Finalizar driver/candidato | Sem processo/porta de teste abandonado; evidência preservada |

### Fronteiras técnicas e verificação

Alvos de inspeção: configuração Tauri, inicialização/storage no backend e fronteira de automação. Reutilizar build nativo existente quando válido; fixture browser isolada não substitui IPC e janela reais. Não definir ferramenta nova como dependência instalada nesta spec.

Na retomada, primeiro mapear cenário para critério aprovado e teste existente. Executar checks proporcionais ao diff final conforme [Definition of Done](../../docs/quality/definition-of-done.md). Para documentação desta sessão, testes frontend/Rust/build/Windows são NOT RUN por ausência de mudança de comportamento.

### Dependências, riscos e decisões abertas

Principal risco: candidato usar o mesmo identifier/usuário e alcançar dados da instalação de uso. A prova de isolamento é pré-condição de execução. Se não houver isolamento demonstrável, parar somente a abertura do candidato. Permissão de instalação, compatibilidade e disponibilidade de driver são decisões separadas.

### Entrega e evidência esperadas

Entregar roteiro repetível, inventário de versões, prova dos diretórios isolados, smoke test real, capturas e lista de limitações. Sem promessa de cobertura integral ou remoção automática de ambientes.

Registrar por cenário: requisito de origem, versão/commit/hash quando pertinente, ambiente, pré-condições, passos, resultado esperado/observado, PASS/FAIL/NOT RUN, evidência e limite. Credenciais e conteúdos reais sensíveis não integram a evidência. Falha impede somente a conclusão dos critérios dependentes; critérios restantes podem seguir quando autorizados.

### Sequência de conclusão

- [ ] Reconciliar estado atual, fonte canônica e autorizações sem repetir aprovação suficiente.
- [ ] Validar decisões materiais e vínculo Plane quando obrigatório à retomada.
- [ ] Relacionar cenários aos critérios/testes existentes e executar trabalho pendente autorizado.
- [ ] Corrigir findings cobertos e repetir apenas checks/cenários afetados.
- [ ] Obter revisão independente e aceite pertinentes; registrar pendências residuais.
- [ ] Atualizar o checkpoint único, sem Git mutável automático ou inferência de gate final.

## Artefatos canônicos a reutilizar

- [project/status.md](../../docs/project/status.md).

