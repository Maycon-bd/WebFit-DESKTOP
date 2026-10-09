# ADR-0004 — Painel administrativo integrado e manutenção local

- Status: **aceito para implementação no escopo definido**, Maycon, 2026-10-09; pedido explícito de painel/emissor/senha mestra e respostas específicas sobre chave hexadecimal/cofre existente. Aceite final técnico/Windows pendente.
- Responsável: Maycon. Demanda: [WEBFIT-16](../../../specs/WEBFIT-16/task.md). Evolui separação do emissor do ADR-0003, preservando protocolos e decisões históricas.

## Contexto

Desktop pessoal da nutricionista, mantido por Maycon via AnyDesk. Ele pediu painel disponível no instalador, senha mestra única e funções de emissão/aplicação/manutenção completas. Futuro React/FastAPI não faz parte desta mudança. Instalação/atualizações são relato humano; nenhum banco/cofre real acessado pelo agente.

## Decisão e alternativas

Integrar emissor e manutenção ao produto, autorização Rust por sessão mestra separada. PHC Argon2 de build substituível por atualização; nenhuma senha padrão ou clara em frontend/repo. Cofre SQLCipher/DPAPI local conserva identidade de emissão existente por importação única de `.webfit-issuer-backup`. Validar chave pública contra raízes do build antes de substituir cofre ou emitir/importar grant. Não criar root local nem confiar na chave que uma licença apresentar.

Alternativas discutidas: emissor separado (baseline anterior); identidade local nova com confiança própria (não escolhida); integração por importação do cofre atual (escolhida por Maycon). Senha de arquivo antigo é necessária para recuperar seu conteúdo; não é um segundo login no emissor. Senha mestra autentica operador, seed interna assina licenças.

Acesso ao banco por chave bruta atual é escolha explícita de Maycon: revelação autorizada de 64 caracteres hex, flag não sensível e snapshot consistente antes de primeira habilitação em banco preparado. Alternativa de passphrase/rekey não escolhida. Sem schema clínico novo. Chave/perfil/licença/pacientes continuam protegidos e preservados por updates/abertura de painel.

## Consequências e limites

- Cinco tipos e pré-condições/consumo/backup/confirmações anteriores mantidos. RESET_CLINIC limpa inventário clínico conservando licença/acessos/perfil/auditoria/backups; não é reset de fábrica.
- Chave privada de emissão acompanha cofre local, nunca instalador/frontend/repo. Trust roots públicas continuam no build.
- Configuração ausente/inválida recusa senha mestra, preservando login clínico existente. Bloqueio Windows/logout/reinício/inatividade encerram sessão.
- Troca de verificador no build muda entrada do painel; não rekey do banco, credenciais clínicas antigas ou assinatura de licenças antigas. Chaves já copiadas não são revogadas por trocar senha do painel.
- Secret retornado deliberadamente ao mantenedor somente por ação específica; nunca em status/log/evidência/Plane/captura de ferramentas do agente. SQL externo fica sob responsabilidade do mantenedor, sem auditoria funcional garantida.
- Acesso total solicitado no cenário pessoal e risco residual aceito por Maycon. Administrador Windows pode modificar executável/memória/cofres; verificador permite ataque offline. Sem promessa de proteção absoluta.

## Evidência e aceite

[Registro único](../../../specs/WEBFIT-16/task.md), RF-ADM-001..006/TA-ADM-001..021. Testes/checks/review e ensaio Windows ainda necessários; desenvolvimento em fixtures não autoriza dados reais, publicação ou G5/G6/G7. Provisionamento real de senha mestra/backup do emissor é ação posterior humana, fora do chat.

Fontes: [SQLCipher API](https://www.zetetic.net/sqlcipher/sqlcipher-api/), [ADR-0001](ADR-0001-desktop-tauri-sqlite.md), [ADR-0003](ADR-0003-ativacao-offline-e-suporte.md).
