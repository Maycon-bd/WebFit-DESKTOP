# Instalação

## Evolução vigente — WEBFIT-16, painel integrado

RF-ADM-007: o candidato passa a levar DB Browser 3.13.1 win64 completo em `GerenciadorBanco/`, junto do WebFit, usando os mesmos recursos na instalação e atualização. Preparação por ZIP/hash oficial, plugins/licenças preservados. Para `health.db`, usar **DB Browser for SQLCipher.exe**, **Raw key**, **SQLCipher 4** e `0x` + chave hex do painel. Fechar o gerenciador antes de atualizar. [Preparação e acesso](admin-panel.md#gerenciador-incluído-no-instalador); ensaio de update no destino ainda pendente.

DEC-059/ADR-0004 substituem, no novo candidato pessoal, orientações abaixo que adiam painel/exigem emissor separado. Painel pelo ícone de informações e Configurações, uma senha mestra, código de emissão integrado e cofre atual importado uma vez por `.webfit-issuer-backup`. Preparar verificador antes do build; padrão nulo recusa painel. Chave privada não embutida; raízes públicas mantidas. Atualização/instalação/aceite no destino pendentes. [Manual/glossário](admin-panel.md), [registro](../../specs/WEBFIT-16/task.md). Histórico preservado; não apagar/desinstalar para ativar.

**Teste WEBFIT-10 / D-LIC-009:** candidato clínico 0.1.10 permite selecionar licença inicial recebida e informar código sem request prévio. Maycon gera ambos no emissor separado 0.1.1; enviar só instalador/licença/código, mantendo senha administrativa/cofre/backup privado. Usar destino vazio e dados fictícios. Banco preparado recusa INITIAL sem apagar dados; não desinstalar/apagar para ativar. Fluxo/limite offline no [manual do emissor](../../tools/license-issuer/README.md). Updates mantêm licença/acessos/consumo. Painel/serviço online adiados; sem publicação/aceite final inferidos.

Pré-requisito do instalador preservado: a configuração efetiva do produto usa `webviewInstallMode: offlineInstaller`, incluindo o instalador offline WebView2 no NSIS. A máquina de build obtém esse artefato Microsoft quando o cache está ausente; não é serviço de ativação. A ativação e o uso permanecem offline. Esta mudança não altera a distribuição do runtime.

## Ativação offline — WEBFIT-10 (implementação local, aceite pendente)

Instalação vazia aguarda ativação; gerar `.webfit-request`, enviar manualmente a Maycon, emitir `.webfit-license` na ferramenta separada, importar e preparar somente o acesso profissional e senha de backup. O administrador vem da autorização. Protocolo/dependências/schema/efeitos aprovados por Maycon em 2026-10-08 (“Aprovo a implementação”). A configuração pública `src-tauri/license-trust.json` começa vazia e deve receber a pública exportada pelo emissor pelo fluxo build/Git humano **antes do instalador distribuível**. Não colocar cofre/executável/chave privada do emissor no instalador clínico.

Banco antigo de testes não é apagado por update/importação: seu login permite backup, com clínica bloqueada. Ativação inicial e transferência exigem destino vazio. Suporte usa senha temporária para uma sessão de até quatro horas. Reinicialização requer autorização, administrador, backup e confirmação e preserva licença/acessos/perfil/auditoria/backups. Pacote por cópia RF-LIC-006 adiado. Atualizar/reparar não emite licença nem cadastra ADMIN.

Pode guardar a credencial exclusiva em um item Login ou nota segura do Bitwarden, com UUID da instalação nas notas, sem dados clínicos. Custódia manual, sem integração/envio ao agente. [Procedimento do emissor e recuperação](../../tools/license-issuer/README.md), [verificação e limites](../../specs/WEBFIT-10/task.md). Build não representa aceite funcional ou distribuição; dados reais continuam condicionados ao G7.

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
