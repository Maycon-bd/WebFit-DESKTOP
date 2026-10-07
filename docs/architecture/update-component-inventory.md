# Inventário de componentes do updater e pipeline

**Status:** T081 aprovado; DEC-050 autoriza preparação local do produto. `tauri-plugin-updater = 2.12.0` adicionado à raiz, licença MIT/Apache-2.0, origem crates.io e lockfile fixado. Operações expostas somente por comandos próprios autenticados do backend; plugin frontend e permissões genéricas de instalação não adicionados. Inventário transitivo atualizado em third-party-notices.md. Ativação externa e teste integrado pendentes.

| Componente | Finalidade | Fase | Situação |
|---|---|---|---|
| Tauri 2 updater plugin | consulta, assinatura, download e instalação | aplicativo | produto usa somente crate Rust 2.12.0; spike permanece separado |
| Tauri CLI/Bundler | build e artefatos Windows | build | build assinado do spike aprovado; versão deve ser fixada para produto |
| Node e Tauri CLI | automação do build/publicação | pipeline | scripts validam assinatura/checksums, enviam rascunho e conferem uploads; workflow habilitado localmente DEC-053, integração pelo usuário |
| GitHub Actions | execução do workflow | pipeline | serviço escolhido; custo deve permanecer dentro da política |
| Windows self-hosted runner | build controlado no computador de Maycon | pipeline | empresa registrado; notebook e build na conta do serviço pendentes |
| GitHub Releases público | distribuição de artefatos sem código-fonte | distribuição | Maycon-bd/webfit-desktop-releases criado; primeira publicação pendente |
| NSIS | instalador Windows e pacote do updater | instalação | instalador primário aprovado |
| Tauri Signer | assinatura obrigatória do updater | segurança | chave de teste criada fora do repositório; rotação/custódia de produção pendentes |
| GitHub Actions Secrets | custódia operacional da chave privada | segurança | usuário confirmou três secrets e variável; valores não acessados; uso real ainda não ensaiado |
| SHA-256 | conferência complementar de integridade | segurança | requisito documentado |
| React/TypeScript | ícone, notas, estado e confirmação | interface | parte da direção Tauri |
| Tauri Tray Icon | aviso na bandeja do Windows | interface | candidato aprovado para o fluxo |
| SQLite/SQLCipher | persistência e backup antes de migração | dados | direção aceita no ADR-0001 |
| Windows DPAPI | proteção da chave local da instalação | dados | direção aceita no ADR-0001 |
| SignTool/certificado local | assinatura Windows opcional | distribuição | não é requisito do updater; avaliar somente se necessário |

Para o spike, registrar versão, licença, origem, permissões, impacto de segurança e aprovação correspondente. A instalação no produto exige novo gate. Nenhuma chave, token ou certificado deve ser versionado.
