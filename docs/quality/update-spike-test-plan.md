# Plano de teste do spike de atualização

**Status:** preparação G5; wiring/build local executados; cenários de publicação e atualização ponta a ponta aguardam T082/T083.

## Objetivo

Validar que o canal piloto pode ser publicado após merge revisado na main e instalado com confirmação, sem adulteração do pacote, perda de dados ou interrupção insegura.

## Pré-condições

- build Tauri funcional;
- banco e backup fictícios;
- chave de teste separada da chave de produção;
- runner e repositório de artefatos ainda pendentes em T082;
- nenhuma credencial ou dado clínico real.

## Cenários de aceite

| ID | Cenário | Resultado esperado |
|---|---|---|
| UPD-001 | versão piloto válida | o aplicativo detecta, mostra versão/notas e aguarda confirmação |
| UPD-002 | assinatura inválida | download é rejeitado; versão atual e dados permanecem intactos |
| UPD-003 | manifesto incompleto ou URL não HTTPS | atualização é rejeitada com erro seguro |
| UPD-004 | rede indisponível | aplicativo continua utilizável offline e não altera a instalação |
| UPD-005 | usuário recusa | nada é instalado e o aviso pode ser consultado novamente |
| UPD-006 | operação clínica em andamento | instalação é adiada até estado seguro |
| UPD-007 | backup pré-atualização | backup válido é criado e sua integridade é confirmada antes da migração |
| UPD-008 | migração compatível | migração transacional conclui e a versão nova abre com dados preservados |
| UPD-009 | migração incompatível | instalação/restauração é interrompida; estado atual é preservado |
| UPD-010 | interrupção durante download | pacote parcial é descartado sem substituir a versão atual |
| UPD-011 | falha durante instalação | instalador preserva o backup e apresenta procedimento de recuperação |
| UPD-012 | retorno para versão anterior | retorno usa binário e backup/schema compatíveis; não depende apenas de reinstalar o executável |
| UPD-013 | canal piloto | somente artefato do canal piloto é oferecido a uma instalação piloto |
| UPD-014 | canal estável | somente versão promovida após G7 aparece para instalação estável |
| UPD-015 | log e auditoria | nenhuma senha, chave, CPF completo ou dado clínico aparece em logs/evidências |

## Evidência parcial do wiring local

A preparação local confirmou build frontend, formatação Rust, testes Rust e geração de MSI/NSIS assinados. Isso não substitui os cenários UPD-001 a UPD-015, que dependem de manifesto e repositório acessíveis.

## Evidências

Cada cenário deve registrar versão, resultado, checksum, estado do banco e referência ao artefato, sem registrar segredo ou dado clínico. A evidência será armazenada em .harness/evidence/update-pilot/.

## Gate

O spike só pode ser considerado aprovado após todos os cenários críticos UPD-002, UPD-004, UPD-007, UPD-008, UPD-009, UPD-011 e UPD-015 passarem e a revisão humana aceitar os riscos residuais.