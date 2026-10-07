# Instalação

**Status:** instalador de teste 0.1.4 disponível, com catálogo ampliado; distribuição manual vigente, somente dados fictícios. Ensaio Windows 10/aceite completo pendentes.

## Procedimento vigente até a atualização automática

**Aprovado por Maycon em 2026-10-07, como complemento da DEC-044/DEC-048.** Até o pipeline com runner Windows e o atualizador do aplicativo estarem implementados, validados e ativados, toda nova versão será distribuída por instalador e atualizada manualmente:

1. Receber o instalador da nova versão e fechar o WebFit.
2. Executar o instalador com o mesmo usuário do Windows da instalação existente.
3. Na tela Instalação encontrada, selecionar **Atualizar mantendo os dados** e continuar. Não é necessário desinstalar manualmente.
4. Reabrir o aplicativo e conferir os cadastros, senhas, prescrições e preferências existentes.

Na mesma versão, usar **Reparar arquivos (manter os dados)** quando necessário. O objetivo da atualização é preservar os dados; o ensaio de atualização no computador-alvo continua necessário para aceite. Não apagar os dados do aplicativo. O teste atual permanece restrito a dados fictícios.

A instalação do runner, por si só, não encerra este procedimento. A substituição pelo fluxo automático exige conclusão e ativação do pipeline e do updater conforme o [ADR-0002](../architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md), com os gates aplicáveis. Esta orientação não autoriza sua ativação antecipada.

## Ambiente-alvo

- Windows 10 x64 no primeiro computador de uso.
- Instalação sem Node, Rust ou ferramentas de desenvolvimento.
- Conta Windows exclusiva da nutricionista.
- Dados e backups locais em diretórios definidos pelo aplicativo e validados no spike.

## Critérios do spike

- instalar, iniciar e desinstalar em ambiente limpo;
- preservar dados durante atualização de teste;
- usar diretório correto por usuário/aplicação;
- funcionar sem internet após instalação;
- testar caminho com espaços e acentos;
- registrar versão, tamanho, permissões e limitações.

O fluxo automático futuro, atualmente adiado pela DEC-044, prevê que merges revisados na `main` publiquem versões piloto assinadas após sua implementação, validação e ativação. O aplicativo mostrará um ícone e solicitará confirmação; após a confirmação, backup, download, validação, instalação e reinício serão automáticos. O uso piloto permanecerá em perfil/diretório separado e com dados fictícios ou controlados até o G7. O canal estável será ativado posteriormente. A estratégia está em [update-release-strategy.md](update-release-strategy.md) e no [ADR-0002](../architecture/adr/ADR-0002-atualizacoes-e-distribuicao.md).

## Preparação administrativa — RF-UX-002 (código local, pacote pendente)

Na primeira abertura, selecionar o botão de informações no canto inferior direito e Acesso do administrador. Maycon define a senha do usuário admin, prepara o acesso da nutricionista e a senha de recuperação dos backups antes de entregar o aplicativo. Nenhuma senha é fornecida pelo instalador ou embutida no código. A nutricionista passa a usar o login normal.

Em instalação já preparada, o mesmo botão apresenta as informações e permite abrir o login administrativo. Se o administrador possuir outro nome de acesso, utilizar o nome original; a atualização não renomeia contas nem modifica senhas. O instalador de catálogo 0.1.4 gerado anteriormente não contém essa alteração; aguardar novo candidato verificado.

RF-AUT-004 / DEC-052: Lembrar de mim salva somente o nome após login válido. Ao desmarcar e entrar, remove o nome lembrado daquele papel. Senha permanece obrigatória; a preferência não é login automático. Refinamento do candidato 0.1.7, sujeito ao ensaio TA-AUT-005.
