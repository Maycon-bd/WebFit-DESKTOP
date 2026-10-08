# Emissor local de licenças — WEBFIT-10

Aplicativo exclusivo de Maycon, separado do instalador clínico. Não colocar executável, banco ou chave privada do emissor no pacote da nutricionista. Mesmas versões de React/Tauri do produto, sem novas dependências npm. Identificador `br.com.webfit.licenseissuer`; cofre SQLCipher/DPAPI CurrentUser no armazenamento local próprio do aplicativo. Assinatura de licenças independente do updater.

## Compilar e preparar

Na raiz: `npm run issuer:build` verifica TypeScript e gera somente frontend. `npm run issuer:tauri -- dev` abre o emissor de desenvolvimento; `npm run issuer:tauri -- build --no-bundle -- --locked` compila seu executável Windows separado. Para SQLCipher usar o Perl portátil já preparado, como em `scripts/build-installer.ps1`; não instalar ferramentas adicionais por este fluxo. O emissor não é sidecar nem recurso do instalador clínico.

No emissor, confirmar criação de identidade. Exportar chave pública para um arquivo JSON novo. Pelo fluxo Git/build humano, integrar seu conteúdo em `src-tauri/license-trust.json` e reconstruir o produto. O arquivo versionado começa vazio: o produto **recusa ativação sem confiança configurada**. Não incluir chaves de teste. O export contém somente chaves públicas base64; fingerprint é SHA-256/base64. Fazer backup protegido do cofre antes de emitir/distribuir.

## Ativar uma instalação

1. Aplicativo clínico vazio: gerar/salvar `.webfit-request` e enviar manualmente a Maycon.
2. Maycon abre a solicitação, confere tipo, UUID da instalação e fingerprint com a pessoa destinatária. Solicitação não autentica a identidade humana do remetente.
3. Gerar senha exclusiva (mascarada por padrão). Guardar em um item **Login** ou nota segura do Bitwarden, com instalação/solicitação/tipo nas notas. Sem integração automática; não escrever credenciais no repositório ou chat. Suporte usa senha temporária diferente da permanente.
4. Confirmar e emitir para arquivo novo `.webfit-license`, enviar ao destinatário. O arquivo contém verificador Argon2 cifrado para aquela instalação, assinatura e metadados; não contém senha reversível ou chave privada de emissão.
5. Importar no clínico e preencher acesso profissional e senha de backup. Administrador é definido pela autorização, sem campo de senha administrativa no setup.

## Cinco autorizações

| Tipo | Operação | Dados |
|---|---|---|
| INITIAL | ativar destino vazio e preparar acessos | recusa banco preparado; não limpa por importação |
| TRANSFER_RECOVERY | recuperar backup autorizado no destino vazio | exige licença da origem ou SHA-256 do arquivo; autores antigos inativos, novos acessos do destino |
| TEMPORARY_SUPPORT | autenticar com senha temporária | consome no login, uma sessão de até 4 h; logout/bloqueio/inatividade/reinício encerram |
| ADMIN_RECOVERY | confirmar nova credencial administrativa | preserva dados, nutricionista e licença; encerra sessões |
| RESET_CLINIC | administrador confirma limpeza após backup | mantém licença/acessos/perfil/auditoria/backups e consumo; limpa pacientes/prescrições/tags/rascunhos clínicos |

Importação apenas prepara a operação. Emissão não comprova consumo. Reimportação não repete efeitos; autorização consumida não pode abrir outra sessão/aplicar novamente. Atualizar/reparar não faz setup/reset. Bancos antigos de teste são preservados e seu login permite backup, com clínica bloqueada; ativar um destino novo vazio. Para backup legado sem licença, obter SHA-256 do arquivo `.webfit-backup` (ex.: `Get-FileHash -Algorithm SHA256`) e informar esse valor em minúsculas na solicitação de transferência. Não copiar banco ativo nem tratar `.db` como pacote portátil.

## Recuperar o emissor

Exportar `.webfit-issuer-backup` com senha de pelo menos 12 caracteres. AES-256-GCM, salt/nonce aleatórios e Argon2; não contém dados clínicos. Guardar em mídia protegida e senha separada no cofre humano. Recuperar em outro perfil/computador pelo emissor vazio. Recuperação validada exige confirmação; se já existe identidade, conserva primeiro uma cópia protegida local antes da substituição. Senha errada/corrupção preservam estado.

Perder chave e backup exige nova identidade e distribuição de confiança pública por uma versão revisada. Comprometimento não permite revogação remota garantida de instalações desconectadas. O vínculo e consumo são locais: clone/rollback completo, adulteração do executável por administrador do Windows e resgate global continuam limites offline. A sessão ativa usa relógio monotônico para o limite de quatro horas.

RF-LIC-006, pacote para diagnóstico por cópia, está adiado para outra demanda. Licença/senha administrativa não desencriptam um banco recebido. Esta entrega não autoriza dados reais, instalação no host, publicação ou G7. Evidência e pendências no [registro único](../../specs/WEBFIT-10/task.md).
