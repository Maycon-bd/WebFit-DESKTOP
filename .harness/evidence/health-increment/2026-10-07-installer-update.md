# RF-DIS-001 — atualização manual no instalador, 2026-10-07

## Escopo e autorização

Maycon perguntou se precisa desinstalar a cada versão e pediu detecção/opção de atualização no instalador. DEC-048/RF-DIS-001 registram o refinamento da distribuição manual em execução. Mesma branch de feature e alterações preexistentes preservadas; sem commit/push, publicação ou updater conectado.

## Diagnóstico

Template gerado pelo Tauri CLI 2.11.3 já lê registro Windows/DisplayVersion, compara SemVer e mostra a página de manutenção. Tradução original usa Não desinstalar para o ramo de atualização e recomenda desinstalar no texto: isso explica a confusão. Leitura somente do registro HKCU deste host confirmou DisplayName WebFit Desktop, DisplayVersion 0.1.1. Nenhum instalador foi executado e nenhum registro/banco de usuário foi alterado.

## Implementação 0.1.3

- src-tauri/installer/PortugueseBR.nsh mantém todos os IDs do idioma oficial, com Atualizar mantendo os dados, Reparar arquivos (manter os dados), Instalação encontrada e instruções coerentes.
- bundle.windows.nsis.customLanguageFiles carrega o idioma; mecanismo nativo de detecção/manutenção preservado, sem fork de template ou hooks. Nome, publisher, bundle ID e currentUser estáveis.
- Atualizar é a segunda opção da página de versão anterior e segue o ramo sem executar o desinstalador. A escolha padrão permanece a do NSIS: o usuário deve selecionar explicitamente Atualizar mantendo os dados.
- allowDowngrades=false desabilita substituição direta por versão anterior. Isso não impede instalar versão antiga depois de desinstalar; não declarar proteção completa contra downgrade. Detalhamento AGENT-PROVISIONAL.
- Nenhuma mudança de schema, domínio ou autenticação. Versão de aplicativo 0.1.3; seis caracteres de acesso e doze de recuperação preservados.

Mecanismo suportado: [configuração NSIS do Tauri](https://v2.tauri.app/reference/config/#nsisconfig) e [instaladores Windows](https://v2.tauri.app/distribute/windows-installer/); schema local e script gerado da versão instalada são a evidência técnica específica.

## Verificação

npm run check PASS (lint/TypeScript/4 Node/build). npm run format:check e cargo fmt --check PASS. cargo test --locked: 14 Rust PASS; cargo clippy --locked --all-targets -- -D warnings PASS. Verificação do script/idioma final e pacote registrada abaixo após build.

Ensaio gráfico e atualização real não executados pelo agente. T093 é o teste manual no Windows 10 x64: base fictícia antes/depois, mesma senha, perfil/paciente/prescrições/tour, instalação única, atualização da versão e reparação. Não declarar preservação dinâmica aprovada sem esse ensaio. Fontes e roteiro em docs/operations/mvp-local-test.md; G5/G6/G7 continuam pendentes.


Correção de empacotamento: o arquivo original trazia BOM; ao prefixar comentários, esse marcador ficou antes do primeiro LangString e causou erro NSIS. Removido do arquivo customizado e mensagem de reparação do primeiro ID confirmada. Idioma com 27 mensagens únicas e chaves de manutenção presentes; segunda geração concluída com sucesso. Nenhum código/domínio foi alterado por esse reparo.


Checks do template/idioma gerados 0.1.3 PASS: identidade br.webfit.desktop/WebFit Desktop/currentUser; VERSION correta; leitura DisplayVersion e SemverCompare; segunda opção de upgrade usa dontUninstall e o ramo reinst_done, sem reinst_uninstall; strings Atualizar/Reparar presentes, sem BOM interno; ALLOWDOWNGRADES=false; createUpdaterArtifacts=false. Confirmação estática do mecanismo e compilação não equivalem ao ensaio de preservação dinâmica T093.


## Artefato final

- Build Tauri/NSIS exit code 0, após correção de codificação; sem executar instalador no host.
- .artifacts/mvp/2026-10-07/update-0.1.3/WebFit-Desktop-0.1.3-teste-x64.exe
- 218.875.060 bytes; SHA256 `f58b9956d85ee5154bf17099d658fa23ada776de3faec604b8c9f75fa4cfe29b`; Authenticode NotSigned.
- BUILD-MANIFEST.json inclui fontes e tradução; SHA256.txt e COMO-TESTAR.md acompanham a cópia. Candidatos anteriores preservados.
- Avisos de empacotamento conhecidos: colisão PDB bin/lib, STATIC_VCRUNTIME deprecado e OpenSSL sem PDB; clippy dos fontes passou.
- Branch feature/pbi-001-primeiro-incremento-saude; HEAD 66f886fe2be407803298918c08798af6791fffda; upstream local sem ahead/behind indicado. git diff --check PASS. Nenhum fetch, commit, push, PR ou release/publicação externa.
- T091/T092 concluídos, T093 ensaio manual pendente. G5/G6/G7 preservados em execução/pendentes; somente base fictícia autorizada.


## Complemento documental solicitado por Maycon

2026-10-07: registrada a vigência da entrega manual pelo instalador/Atualizar mantendo os dados até pipeline com runner e updater implementados, validados e ativados. Owners: installation.md, update-release-strategy.md, update-pipeline-design.md, decision-log.md e status.md. Corrigidas afirmações operacionais antigas de ausência de produto/política manual já substituída. Checks de consistência dos cinco documentos, existência dos links locais e git diff --check por paths PASS. Resultado READY para documentação; não altera aceite do produto/T093. Plane NOT APPLICABLE (nenhuma operação externa). Agent Decisions deste complemento: Total 0, Accepted 0, Pending Validation 0, Rejected 0; fonte é a instrução humana explícita. Código, config, workflow e artefatos de instalador não alterados nesta solicitação; suíte de produto não repetida por mudança somente documental.
