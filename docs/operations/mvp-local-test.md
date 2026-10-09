# Teste local do MVP — WebFit Desktop 0.1.8

**Autoridade:** DEC-044 e DEC-045, Maycon, 2026-10-06. Instalação manual, Windows 10 x64, somente dados fictícios. Este ensaio não conclui G5/G6/G7.

DEC-050 retoma preparação local do atualizador. O candidato 0.1.5 inclui catálogo/busca, informações do login e painel Atualizações. A publicação automática ainda está desativada: instalar este candidato manualmente com **Atualizar mantendo os dados**, usando o mesmo usuário Windows. Uma consulta sem release disponível pode falhar sem impedir o trabalho offline. O ensaio conectado depende da primeira publicação aprovada.

1. Copie o instalador `.exe` fornecido para o computador de Amanda e execute-o com o usuário habitual do Windows.
2. No primeiro acesso, crie dois nomes de acesso diferentes, suas senhas e uma senha de recuperação dos backups. Guarde a recuperação no cofre já preparado.
3. Entre com a nutricionista, preencha o perfil e cadastre um paciente fictício. CPF de fixture: `529.982.247-25`; nome e contato também devem ser fictícios, sem associar esse número a uma pessoa real.
4. Salve, feche e reabra. Confira o cadastro, a pesquisa por nome/CPF/telefone e a recuperação de edição interrompida.
5. Monte uma prescrição, calcule as metas, inclua refeições/alimentos, salve e finalize. Consulte a versão e faça uma nova versão para testar o histórico.
6. Em Backup, crie uma cópia manual. Com os dados ainda fictícios, restaure-a usando a senha de recuperação e entre novamente.
7. Informe o passo que falhou e a mensagem exibida. Não envie senhas nem conteúdo clínico.

O banco fica no diretório local do aplicativo do usuário do Windows, protegido por SQLCipher e DPAPI. Fechar/reabrir e atualizar manualmente o executável não deve apagar o banco. Não copie o banco ativo diretamente; use Backup. Não guarde o banco em pasta de rede ou de sincronização.

## Limites desta construção

- Catálogo offline do inventário TBCA 7.3: 5.874 registros coletados em 2026-10-09; 5 indisponíveis para inclusão por inconsistência/página vazia da fonte. Um fallback TACO qualificado para chantilly em spray com gordura vegetal. Fonte, código, preparação, medidas, composição por 100 g e hashes preservados. Outros candidatos TACO não foram automaticamente tratados como equivalentes.
- Dados ausentes/traços de micronutrientes aparecem como indisponíveis, preservando os valores de origem.
- Sem PDF, impressão, agenda, financeiro, nuvem ou atualização automática, conforme escopo/DEC-044.
- Instalador sem assinatura Authenticode; assinatura de updater não corresponde à assinatura de executável. O comportamento do Windows e a instalação no computador-alvo precisam de ensaio manual.
- Cobertura integral dos critérios, desempenho, acessibilidade e revisão independente ainda devem ser concluídos antes de qualquer liberação para dados reais.

## Compilação local

Dependências da interface: `npm ci`. Verificações: `npm run check`, `cargo fmt --manifest-path src-tauri/Cargo.toml --check` e testes Rust com o Perl portátil no PATH. Instalador: `scripts/build-installer.ps1`, que usa o Perl apenas no processo de compilação e não altera o PATH global.

## Fontes da composição e energia

- [TBCA, USP/FoRC, versão 7.3, São Paulo, 2025](https://www.tbca.net.br/): inventário completo obtido por `scripts/tbca-index.py`, coleta finita por `scripts/collect-tbca.py` e importação offline por `scripts/import-food-catalog.py`; hashes e lacunas em `src/data/tbca-import-manifest.json`. [TACO, NEPA/UNICAMP, 4ª edição](https://nepa.unicamp.br/publicacoes/): 597 linhas comparadas; evidência e candidatos em `src/data/taco-coverage.json`. Não há consultas à internet no aplicativo. A completude do inventário não significa que todas as composições são quantitativas/consistentes.
- [Roza e Shizgal, 1984](https://pubmed.ncbi.nlm.nih.gov/6741850/): protocolo aprovado no registro clínico do projeto.
- [NASEM, Dietary Reference Intakes for Energy, 2023](https://www.nationalacademies.org/read/26818/chapter/7): equações/tabelas 5-15 a 5-19, conforme baseline aprovada.
- Fibras e demais regras seguem `docs/project/energy-planning-decisions-2026-08-21.md`; ensaio técnico não representa validação clínica nova.


## Tutorial das telas — RF-UX-001

No primeiro acesso de cada usuário, as telas Pacientes, Novo paciente, Cadastro existente, Perfil profissional, Prescrição, Auditoria, Backup e Acesso mostram um tour curto com destaque e explicação. A instalação/login já têm instruções no próprio formulário. A troca obrigatória de senha acontece antes dos tours.

1. Avance com Próximo, volte com Voltar e termine com Concluir. Confira se o destaque acompanha o controle descrito e se o texto permanece visível em 1366×768, inclusive com ampliação de 200%.
2. Em outra tela, clique Pular ou pressione Escape. Você pode usar os controles da tela sem concluir o tour.
3. Feche e reabra o aplicativo: os tours concluídos ou pulados não devem abrir sozinhos para esse usuário. Ver tutorial deve permitir repetir desde o começo.
4. Entre com o outro usuário: as preferências de tutorial devem ser independentes.
5. Confira navegação por Tab, foco visível, rolagem e redimensionamento. Pular/Concluir não devem salvar cadastro, calcular metas, criar backup ou restaurar dados.

Se já instalou 0.1.0, feche o aplicativo e execute o novo instalador com o mesmo usuário do Windows, sem desinstalar nem apagar arquivos. O banco permanece na mesma pasta e na mesma versão de schema. Esta atualização manual também precisa ser confirmada no computador-alvo.


## Senhas — versão 0.1.2 (DEC-047)

Senhas de acesso: mínimo de seis caracteres para criação, troca e redefinição temporária. Senha de recuperação dos backups: mínimo de doze caracteres. Senhas já cadastradas continuam válidas; atualizar o aplicativo não altera a senha automaticamente. No ensaio fictício, confirme aceitação de seis e rejeição de cinco caracteres, inclusive na troca/redefinição. Atualização manual sobre 0.1.0/0.1.1 com mesmo usuário Windows, aplicativo fechado e sem apagar o banco.


## Atualização manual — versão 0.1.3 (RF-DIS-001)

Não desinstale antes de atualizar. Feche o aplicativo e execute o novo instalador com o mesmo usuário do Windows. Se encontrar a versão anterior, o instalador mostra Instalação encontrada: selecione **Atualizar mantendo os dados** e avance. A alternativa Remover versão anterior e reinstalar é outra operação; a escolha padrão ainda é a do NSIS, por isso confira a seleção. O mesmo número de versão oferece Reparar arquivos. Sem instalação existente, o assistente segue a instalação normal.

Ensaio de aceite: crie/salve um paciente fictício na versão instalada, conclua/pule um tutorial e crie um backup pelo aplicativo; execute a nova versão escolhendo Atualizar mantendo os dados; entre com a mesma senha e confira cadastro, perfil, prescrições e preferências do tutorial. Confira também que permanece uma única instalação/atalho e que a versão exibida no Windows é a nova. Não marque Apagar também os dados do aplicativo em uma desinstalação. A atualização manual não exige criar os acessos novamente quando o banco existente é preservado.

## Catálogo e busca — versão 0.1.4 (RF-PRE-002)

Na prescrição, abra Buscar alimento nas tabelas oficiais. Pesquise `feijao cozido`, `cozido feijão` e `BRC0208A`; confira a preparação e o código antes de incluir. A busca combina todas as palavras e ignora acentos/maiúsculas. Mostrar mais alimentos amplia a lista em grupos de 24. Uma busca sem resultados orienta a refinar os termos ou preencher a composição personalizada com origem explícita. O catálogo carrega ao abrir o seletor, com estados de carregamento/erro. Confira o bloqueio de `BRC0004A` e `BRC0293T`, a fibra indisponível de `BRC0001F` e a origem TACO de `TACO4-522`. Salve/reabra uma prescrição fictícia e confira porção/medida/valores ausentes. Ensaio nativo WebView2 e aceite Amanda seguem pendentes.

Inclua BRC0006C (banana, média de variedades), selecione 50 g e confira 54,5 kcal antes da apresentação arredondada, proteína 0,635 g, carboidratos 13,35 g, lipídios 0,095 g, fibras 1,12 g e potássio 173 mg. Os valores exibidos seguem o arredondamento aprovado; o cálculo mantém precisão. Confira também conversão da unidade de 65 g disponível para esse alimento. Salve/reabra a prescrição e confirme alimento/porção preservados. O aplicativo não precisa de internet para isso.

Atualize pelo instalador 0.1.4 com o mesmo usuário Windows, usando Atualizar mantendo os dados. Esta versão não altera o schema nem os cinco registros anteriores. O retorno geral de Maycon em 2026-10-07 foi positivo, sem roteiro/versão detalhados; os critérios específicos de interface, atualização, senha e tours continuam pendentes de evidência.

## Informações no login — TA-UX-002 (próximo candidato)

- Abrir o botão de informações no canto inferior direito com mouse e teclado; conferir WebFit Desktop, versão instalada e Desenvolvido por Eng. Maycon Garcia Silva.
- Fechar por Fechar e Escape, conferir retorno do foco e zoom 200%.
- Instalação vazia: preparação aparece somente via Acesso do administrador; definir as credenciais fictícias e recuperação; reiniciar e conferir login.
- Atualização: abrir acesso administrativo, usar nome anterior se diferente de admin, conferir sucesso com senha correta e rejeição da incorreta. Dados e credenciais devem persistir.
- O candidato anterior de catálogo 0.1.4 não inclui este fluxo; aguardar pacote novo.

## Modal de atualizações — DEC-051 / TA-UPD-UI-001

Na versão 0.1.6, Atualizações abre modal central com fundo desfocado. Conferir teclado/Tab, Escape e retorno de foco; Verificar atualização apresenta resultado dentro do modal; Continuar trabalhando fecha e permite usar pacientes. Durante instalação, fechamento indisponível. Não há publicação automática ativa; erro de consulta ainda pode ocorrer sem manifesto publicado. Atualizar manualmente mantendo os dados para receber este refinamento.

## Nome lembrado — TA-AUT-005 / candidato 0.1.7

Entrar com dados fictícios e Lembrar de mim marcado; fechar/reabrir e conferir nome preenchido e senha vazia. Tentar senha errada e confirmar que o nome lembrado não muda. Entrar desmarcado; fechar/reabrir e conferir remoção. Administrador e nutricionista possuem preferências separadas. Logout/bloqueio continuam exigindo senha; checkbox não cria login automático.

## Faixa e consulta por login — DEC-053 / TA-UPD-UI-002

O modal/ícone de atualização foi retirado. A versão 0.1.8 consulta atualizações a cada login e só mostra faixa superior se detectar versão mais nova. Mais tarde oculta a faixa até a sessão seguinte; Atualizar agora exige edição encerrada e usa backup/assinatura. Offline ou sem nova versão, não há aviso e o trabalho continua. Workflow habilitado no arquivo local; só atua depois da integração Git pelo usuário e publicação assinada. Testar primeiro login, logout/login, adiar, backup e persistência, usando dados fictícios.
