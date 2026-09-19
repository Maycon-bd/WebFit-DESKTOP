# Política operacional sem custo recorrente

**Status:** proposta operacional; validação humana pendente antes do G5.

## Objetivo

O WebFit Desktop deve atender uma única instalação Windows, usada pela nutricionista, sem hospedagem, servidor remoto, assinatura mensal ou serviço externo obrigatório. A meta é custo recorrente de operação igual a **R$ 0**, preservando segurança, backup, restauração, testes e manutenção técnica.

"Gratuito" neste documento significa sem mensalidade obrigatória. Pode existir custo opcional e pontual de mídia externa de backup ou, futuramente, de assinatura de código para distribuição pública.

## Composição proposta

| Área | Direção | Custo recorrente obrigatório |
|---|---|---:|
| Shell e interface | Tauri, React, TypeScript e Vite | R$ 0 |
| Domínio e persistência | Rust, SQLite e comandos tipados | R$ 0 |
| Proteção do banco | SQLCipher Community, com avisos de licença | R$ 0 |
| Chave local | DPAPI `CurrentUser`, uma chave aleatória por instalação | R$ 0 |
| Instalador | NSIS | R$ 0 |
| Backup | armazenamento local e cópia manual em mídia externa | R$ 0, se já houver mídia |
| Atualizações | aplicação manual pelo responsável técnico | R$ 0 |
| Telemetria, login e nuvem | não usar no MVP | R$ 0 |

SQLite é domínio público. Tauri é distribuído sob MIT/Apache-2.0. O SQLCipher Community é a opção gratuita, mas exige preservação dos avisos e atribuições de licença; a edição Commercial não faz parte desta proposta.

## Backup e recuperação

- O backup permanece criptografado e portátil.
- O pacote não deve conter uma senha de recuperação em texto claro.
- A credencial de recuperação fica separada do pacote e sob custódia offline de Maycon.
- Não haverá envio automático de chaves por e-mail, nuvem ou serviço de terceiros.
- O destino primário será local; a cópia externa mensal continua recomendada.
- SQLite ativo não será colocado em pasta de rede ou sincronizada.
- A restauração em outra máquina será um procedimento manual, com validação de checksum, integridade e auditoria.

## Distribuição e manutenção

O NSIS será o instalador primário do MVP. Para uso privado em uma máquina conhecida, não será obrigatório comprar certificado de assinatura. O Windows pode exibir aviso do SmartScreen para um instalador não assinado; o responsável técnico deverá validar a origem e o checksum antes da instalação.

Atualizações serão preparadas e aplicadas manualmente por Maycon. Cada atualização deve preservar migrações, backup de segurança e possibilidade de restauração. Não haverá auto-update, analytics ou dependência de conta externa.

## O que não será sacrificado para economizar

- criptografia do banco e proteção de chaves;
- autorização no backend Tauri;
- migrações transacionais e foreign keys;
- snapshot consistente para backup;
- checksum e verificação de integridade na restauração;
- auditoria de operações relevantes;
- testes automatizados e teste de restauração;
- CSP e isolamento da WebView;
- avisos de licença e inventário de componentes.

## Riscos aceitos e mitigação

| Risco | Mitigação |
|---|---|
| perda da máquina | cópia externa periódica e restauração testada |
| perda da senha de recuperação | guardar a credencial offline em local seguro; sem prometer recuperação impossível |
| alerta do SmartScreen | instalar diretamente no equipamento conhecido e validar checksum |
| manutenção depender de Maycon | manter manual de operação, instalador, backups e procedimento de restauração |
| custo futuro de distribuição pública | somente avaliar assinatura de código se o produto sair do uso privado |

## Aprovações necessárias

Antes de iniciar o G5, confirmar explicitamente:

1. modelo local, offline e sem mensalidade;
2. SQLCipher Community e seus avisos de licença;
3. backup local com cópia externa opcional;
4. credencial de recuperação mantida offline por Maycon;
5. NSIS como instalador primário;
6. atualizações manuais, sem telemetria, nuvem ou serviço de autenticação externo.
