# Inventário de componentes do updater e pipeline

**Status:** T081 aprovado; dependências do updater foram instaladas somente no spike descartável; configuração externa e decisão de produção continuam pendentes.

| Componente | Finalidade | Fase | Situação |
|---|---|---|---|
| Tauri 2 updater plugin | consulta, assinatura, download e instalação | aplicativo | `@tauri-apps/plugin-updater` e `tauri-plugin-updater` 2.12.0 instalados no spike; não importados para produto |
| Tauri CLI/Bundler | build e artefatos Windows | build | build assinado do spike aprovado; versão deve ser fixada para produto |
| tauri-apps/tauri-action | automação do build/publicação | pipeline | `v1` usado no workflow local; validação externa de publicação pendente |
| GitHub Actions | execução do workflow | pipeline | serviço escolhido; custo deve permanecer dentro da política |
| Windows self-hosted runner | build controlado no computador de Maycon | pipeline | aprovado em princípio; não configurado |
| GitHub Releases público | distribuição de artefatos sem código-fonte | distribuição | aprovado em princípio; repositório ainda não criado |
| NSIS | instalador Windows e pacote do updater | instalação | instalador primário aprovado |
| Tauri Signer | assinatura obrigatória do updater | segurança | chave de teste criada fora do repositório; rotação/custódia de produção pendentes |
| GitHub Actions Secrets | custódia operacional da chave privada | segurança | nomes definidos no workflow; configuração externa T082 pendente |
| SHA-256 | conferência complementar de integridade | segurança | requisito documentado |
| React/TypeScript | ícone, notas, estado e confirmação | interface | parte da direção Tauri |
| Tauri Tray Icon | aviso na bandeja do Windows | interface | candidato aprovado para o fluxo |
| SQLite/SQLCipher | persistência e backup antes de migração | dados | direção aceita no ADR-0001 |
| Windows DPAPI | proteção da chave local da instalação | dados | direção aceita no ADR-0001 |
| SignTool/certificado local | assinatura Windows opcional | distribuição | não é requisito do updater; avaliar somente se necessário |

Para o spike, registrar versão, licença, origem, permissões, impacto de segurança e aprovação correspondente. A instalação no produto exige novo gate. Nenhuma chave, token ou certificado deve ser versionado.