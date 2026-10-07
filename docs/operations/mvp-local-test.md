# Teste local do MVP — WebFit Desktop 0.1.3

**Autoridade:** DEC-044 e DEC-045, Maycon, 2026-10-06. Instalação manual, Windows 10 x64, somente dados fictícios. Este ensaio não conclui G5/G6/G7.

1. Copie o instalador `.exe` fornecido para o computador de Amanda e execute-o com o usuário habitual do Windows.
2. No primeiro acesso, crie dois nomes de acesso diferentes, suas senhas e uma senha de recuperação dos backups. Guarde a recuperação no cofre já preparado.
3. Entre com a nutricionista, preencha o perfil e cadastre um paciente fictício. CPF de fixture: `529.982.247-25`; nome e contato também devem ser fictícios, sem associar esse número a uma pessoa real.
4. Salve, feche e reabra. Confira o cadastro, a pesquisa por nome/CPF/telefone e a recuperação de edição interrompida.
5. Monte uma prescrição, calcule as metas, inclua refeições/alimentos, salve e finalize. Consulte a versão e faça uma nova versão para testar o histórico.
6. Em Backup, crie uma cópia manual. Com os dados ainda fictícios, restaure-a usando a senha de recuperação e entre novamente.
7. Informe o passo que falhou e a mensagem exibida. Não envie senhas nem conteúdo clínico.

O banco fica no diretório local do aplicativo do usuário do Windows, protegido por SQLCipher e DPAPI. Fechar/reabrir e atualizar manualmente o executável não deve apagar o banco. Não copie o banco ativo diretamente; use Backup. Não guarde o banco em pasta de rede ou de sincronização.

## Limites desta construção

- Catálogo inicial offline de cinco alimentos TBCA 7.3, com fonte, código, preparação, medidas disponíveis e composição por 100 g. Base completa e fallback TACO ainda pendentes; outros itens permitem composição personalizada explícita.
- Dados ausentes/traços de micronutrientes aparecem como indisponíveis, preservando os valores de origem.
- Sem PDF, impressão, agenda, financeiro, nuvem ou atualização automática, conforme escopo/DEC-044.
- Instalador sem assinatura Authenticode; assinatura de updater não corresponde à assinatura de executável. O comportamento do Windows e a instalação no computador-alvo precisam de ensaio manual.
- Cobertura integral dos critérios, desempenho, acessibilidade e revisão independente ainda devem ser concluídos antes de qualquer liberação para dados reais.

## Compilação local

Dependências da interface: `npm ci`. Verificações: `npm run check`, `cargo fmt --manifest-path src-tauri/Cargo.toml --check` e testes Rust com o Perl portátil no PATH. Instalador: `scripts/build-installer.ps1`, que usa o Perl apenas no processo de compilação e não altera o PATH global.

## Fontes da composição e energia

- [TBCA, USP/FoRC, versão 7.3, São Paulo, 2025](https://www.tbca.net.br/): consulta em 2026-10-06, códigos BRC0208A, BRC0001T, BRC0011C, BRC0114F e BRC0041B. Cada registro preserva a URL específica. Importação explícita em `scripts/import-tbca.ps1`; o aplicativo funciona sem consultar a internet.
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
