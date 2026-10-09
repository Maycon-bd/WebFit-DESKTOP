# Painel administrativo — WEBFIT-16

Implementação local 0.1.10, DEC-059/ADR-0004; aceite Windows e publicação separados. Suporte via AnyDesk ocorre na máquina da nutricionista; banco permanece local. Importação da planilha de pacientes não integra esta demanda.

## Distinção dos termos

| Termo | Função |
|---|---|
| Senha mestra | Entrar no painel e autorizar todas as ferramentas, inclusive emissor |
| `.webfit-license` | Autorização assinada: inicial, transferência, suporte, recuperação ou reset |
| Código de ativação | Acompanha a inicial por código, para importar em destino vazio |
| Chave interna de emissão | Segredo Ed25519 interno do emissor, diferente do código e da senha mestra |
| Dados do emissor de licenças | Armazenamento protegido da chave interna e do histórico de licenças |
| `.webfit-issuer-backup` | Backup do emissor de licenças, para configurar o emissor atual no painel |
| `.webfit-backup` | Backup clínico, diferente do backup do emissor |
| Chave SQLCipher hexadecimal | 32 bytes atuais do banco, mostrados como 64 caracteres hex |

A licença e o código utilizados ontem não contêm a chave privada. Exportar o backup na ferramenta histórica e importar na aba Emissor de licenças. A senha desse arquivo serve para desencriptá-lo durante a importação; não é outro login do painel.

## Preparação para o próximo build

Maycon executa na raiz, no seu ambiente nativo de build:

```powershell
./scripts/configure-admin-access.ps1
```

O script pede senha mascarada, transmite somente por stdin ao binário local `admin-verifier` e grava seu verificador Argon2id em `src-tauri/admin-access.json`. Não grava/imprime a senha nem a coloca em argumentos. Requer Rust/Cargo e ambiente Perl/OpenSSL existente do projeto; não instala ferramentas. O instalador resultante não exige ferramentas de desenvolvimento.

Pede também confirmação mascarada. Se as duas entradas forem diferentes, interrompe antes de gerar/gravar o verificador e preserva a configuração anterior. Execute novamente para corrigir. O script usa UTF-8 com BOM para exibir acentos corretamente no Windows PowerShell 5.1.

O padrão deste incremento é `verifier: null`: Maycon deve preparar a senha real fora do chat antes do build da atualização. Ausente/inválida, a configuração recusa painel e preserva login clínico. O script não gera instalador/publicação. Trocar a senha exige repetir preparação e gerar nova atualização; não muda banco, chave SQLCipher, assinatura ou backups. Grants antigos conservam seus verificadores; o painel atualizado usa o novo verificador. Não enviar senhas/backups reais do emissor ao agente. Git/distribuição permanecem com Maycon.

## Acesso e importação do emissor

O painel tem uma única ação de saída no topo: **Sair do painel** quando autenticado, encerrando sessão e fechando janela; antes do login, **Fechar painel**. O rodapé mantém somente a orientação sobre proteção da sessão.

1. No login: informações → Acesso do administrador. Na sessão: Configurações → Painel administrativo.
2. Entrar com senha mestra. Tokens clínicos não autorizam operações do painel.
3. Emissor de licenças → senha do backup exportado → selecionar `.webfit-issuer-backup` → confirmar.
4. Identidade deve corresponder a uma raiz já confiável em `license-trust.json`. Mismatch é recusado antes de substituir; não se cria nova identidade automaticamente.
5. Emissões passam a usar a sessão mestra, sem segundo login. Pode exportar novo backup do emissor de licenças.

Os dados do emissor integrado usam `admin-issuer/`, SQLCipher/DPAPI do usuário Windows, separado de `health.db`. Código do emissor/verificador integram build; chave privada real é importada localmente e não embutida no instalador/repositório.

## Licenças

Emitir para este computador gera arquivo e importa autorização vinculada ao destino; confirmar efeito separadamente. Emissão/importação são etapas em bancos distintos: se importar falhar, o painel informa o caminho já emitido para tentar importar o mesmo arquivo.

Auditoria de início é obrigatória antes de emitir. Se somente o registro final falhar após emissão concluída, o painel conserva arquivo/código/resultado e apresenta aviso explícito; guardar o material e corrigir a auditoria antes de novas operações. Não tratar essa falha como licença inexistente.

- INITIAL: somente destino vazio, acesso profissional e senha de backup próprios; ADMIN vem da autorização.
- TRANSFER_RECOVERY: destino vazio, origem indicada e backup validado, acessos próprios; preserva autores históricos inativos.
- TEMPORARY_SUPPORT: consumo único, sessão ADMIN até quatro horas; painel usa mestra, protocolo antigo preservado.
- ADMIN_RECOVERY: confirmação, conserva dados/licença e encerra sessões.
- RESET_CLINIC: backup consistente validado e confirmação; limpa pacientes/prescrições/tags/rascunhos clínicos, preserva licença/acessos/perfil/auditoria/backups. Não é reset de fábrica.

Pode emitir inicial por arquivo+código ou por `.webfit-request` de outro destino. Inicial por código admite reutilização offline em destinos vazios; distribuir conscientemente. Não limpa instalação em uso. Código exibido é descartado da UI ao trocar de aba/sair; guardar privadamente.

## Banco e manutenção

Habilitar acesso técnico exige confirmação, backup consistente em banco preparado e integridade. Falha mantém bloqueio. Mostrar chave exige mestra e auditoria antes do retorno; chave fixa existente é preservada, sem rekey. Usar gerenciador compatível com SQLCipher em modo de chave hexadecimal bruta de 64 caracteres; SQLite comum não basta. [Referência SQLCipher](https://www.zetetic.net/sqlcipher/sqlcipher-api/).

Guardar chave privadamente e fechar WebFit antes de editar externamente. SQL externo não gera auditoria funcional; logout/troca mestra não revogam chave já conhecida. Painel verifica integridade, cria/restaura `.webfit-backup`; restore exige senha de recuperação do arquivo, confirmação, cópia de segurança e validações existentes, conserva chave/licença/consumos do destino e encerra sessões. Entrar no Saúde como administrador dá acesso a pacientes/perfil/usuários/prescrição/auditoria sem modificar contas.

Sair/fechar painel, bloqueio Windows, reinício ou uma hora sem operações encerram acesso. Chave/código/senhas de arquivos são descartados da interface. Sem SQL genérico pela WebView.

## Gerenciador incluído no instalador

O próximo instalador e suas atualizações incluem o pacote oficial DB Browser 3.13.1 win64 completo em `GerenciadorBanco/`, ao lado do executável WebFit. DLLs, plugins e licenças acompanham os dois executáveis. Para o banco WebFit, abrir **DB Browser for SQLCipher.exe**. Fechar o gerenciador antes de atualizar o WebFit.

Ao abrir `health.db`, o diálogo pede a chave: selecionar **Raw key**, **SQLCipher 4 defaults** e preencher `0x` seguido dos 64 caracteres hex exibidos em Banco e manutenção → Mostrar chave hexadecimal. Não usar a senha mestra nesse campo. O prefixo `0x` é exigido pelo [diálogo oficial desta versão](https://github.com/sqlitebrowser/sqlitebrowser/blob/v3.13.1/src/CipherDialog.cpp). O banco permanece no diretório de dados da instalação, separado dos executáveis; não copiá-lo para a pasta do gerenciador.

Preparação local com o ZIP fornecido, sem rede:

```powershell
./scripts/prepare-db-browser.ps1 -ArchivePath 'C:/Users/Maycon Garcia Silva/Downloads/DB.Browser.for.SQLite-v3.13.1-win64.zip' -Offline
```

Build/dev Tauri e CI preparam o recurso automaticamente. Sem cache, baixam somente a versão fixada em `tools/db-browser/bundle.json`; validam SHA256 antes de extrair e conferem cada arquivo antes de empacotar. O cache `.tools/db-browser/` é ignorado pelo Git. Builds Rust diretos devem executar `npm run prepare:db-browser` antes da compilação. Nenhuma chave, senha ou banco acompanha esse recurso.

[Checks/revisão](../../specs/WEBFIT-16/task.md) usam fixtures isoladas; browser mock não prova Rust/DPAPI/WebView2. Gerenciador SQLCipher, atualização/provisionamento reais e aceite funcional continuam ações de Maycon, não executadas pelo agente. G5/G6/G7 preservados.
