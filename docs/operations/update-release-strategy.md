# Estratégia de atualização e releases

**Status:** decisão aceita `ACCEPTED`; implementação do updater ainda depende do planejamento e do gate específico do G5.

## Objetivo

Permitir evolução frequente do WebFit Desktop com participação contínua da nutricionista, sem transformar cada commit em uma atualização do computador de uso e sem comprometer dados clínicos, migrações ou a política de custo recorrente igual a R$ 0.

## Estado atual documentado

- `DEC-020` foi refinada por `DEC-043` e pelo ADR-0002 aceito: atualização conectada é permitida no canal piloto sob as condições registradas.
- `docs/operations/installation.md` já foi alinhado ao ADR-0002; a implementação do updater ainda depende do G5.
- A política de custo zero mantém o runner próprio e a ausência de serviços pagos; a atualização piloto agora é automatizada pelo pipeline aprovado.
- Não existe aplicação de produto nem pipeline de release; existe somente o spike descartável do G4.

Portanto, a política anterior de atualização **manual** foi substituída para o canal piloto por publicação automática após merge revisado na `main`, mantendo confirmação antes da instalação.

## Princípio central

Um commit direto em `main` continua proibido. Um merge revisado na `main` passa a ser o gatilho autorizado para publicar o canal piloto; a instalação na máquina da nutricionista continua exigindo confirmação explícita.

```text
feature/* → develop → release/<versão> → revisão/checagens → merge em main
                                                            ↓
                                      pipeline piloto + artefato assinado
                                                            ↓
                                      ícone → confirmação → atualização
                                                            ↓
                                      promoção estável após G7
```

## Tecnologias aprovadas para o fluxo

| Responsabilidade | Tecnologia | Uso |
|---|---|---|
| Código e gatilho | Git + GitHub | merge revisado na `main` inicia a publicação piloto |
| Automação | GitHub Actions | testes, build, assinatura e publicação |
| Ambiente de build | GitHub Actions Runner auto-hospedado no Windows de Maycon | preserva custo recorrente de R$ 0 |
| Build desktop | Tauri 2, Rust, React, TypeScript e Vite | compila o aplicativo |
| Pipeline Tauri | `tauri-apps/tauri-action` | gera e publica os artefatos do Tauri |
| Instalador | Tauri Bundler + NSIS | instalação e atualização no Windows |
| Atualizador | `tauri-plugin-updater` | consulta, download, validação e instalação |
| Catálogo | `latest.json` estático | informa versão, notas, URL e assinatura |
| Distribuição | GitHub Releases em repositório público separado | hospeda somente binários e metadados assinados |
| Versionamento | SemVer | compara versões piloto e estáveis |
| Assinatura | Tauri Signer + segredo protegido no pipeline | impede instalação de artefato adulterado |
| Integridade | SHA-256 | validação complementar do pacote |
| Interface | React/TypeScript + Tauri Tray Icon | ícone, estado e confirmação da atualização |
| Dados | SQLite/SQLCipher + backup consistente + DPAPI | backup antes da atualização e proteção local |
| Scripts | PowerShell versionado | geração de versão, manifesto e verificações |
| Assinatura Windows | SignTool com certificado local, opcional | reduzir alertas no único computador confiável; não substitui a assinatura do updater |

A instalação de dependências, geração de chaves, configuração de credenciais e criação do runner continuam condicionadas ao spike do updater, à aprovação sensível e ao gate de implementação do G5.

## Canais propostos

### 1. Desenvolvimento

- Executado somente no ambiente de desenvolvimento.
- Pode mudar várias vezes ao dia.
- Nunca acessa o banco de uso da nutricionista.
- Não produz atualização automática.

### 2. Piloto da stakeholder — G5 e G6

- Versões identificadas como pré-release, por exemplo `0.1.0-alpha.1` ou `0.1.0-rc.1`.
- Publicação automática após merge revisado na `main`.
- Instalação semiautomática pelo ícone do aplicativo, com confirmação da nutricionista.
- Uso apenas com dados fictícios ou controlados até aprovação do G7.
- Perfil, identificador da aplicação e diretório de dados separados de uma futura instalação estável.
- Cada instalação exige notas da versão, backup aplicável, testes de migração e instrução de retorno.

### 3. Estável — depois do G7

- Versões SemVer, como `0.1.0`, geradas somente de tag aprovada em `main`.
- É promovido por release aprovada depois do G7.
- Usa o mesmo updater assinado, mostrando notas e solicitando confirmação; instalação silenciosa sem ciência da usuária não é permitida.

## Alternativas analisadas

| Alternativa | Vantagens | Riscos/limitações | Avaliação |
|---|---|---|---|
| NSIS manual em toda versão piloto | simples, custo zero, controle máximo, não exige endpoint | trabalho manual e mais lento | substituída para o piloto |
| Tauri Updater + release estática | experiência simples, assinatura obrigatória do artefato, pode usar GitHub Releases | exige endpoint HTTPS, chave privada de assinatura, política de publicação e acesso aos artefatos | adotada para o piloto, com confirmação da usuária |
| instalar automaticamente a cada commit em `main` | feedback muito rápido | pode distribuir build defeituoso, executar migração não validada e interromper atendimento | rejeitada |
| servidor dinâmico próprio | canais e rollback mais flexíveis | infraestrutura, manutenção e possível custo recorrente | desnecessária para uma instalação |

## Fluxo recomendado de release

1. Desenvolver em `feature/*` e integrar em `develop` somente após revisão.
2. Criar `release/<versão>` para estabilização.
3. Atualizar versão e notas de release.
4. Integrar a release em `main` por revisão aprovada.
5. O pipeline gera a versão piloto SemVer, executa formatação, lint, TypeScript, testes frontend/Rust/SQLite, migrações e build Tauri.
6. Criar e verificar backup antes de qualquer atualização que possa tocar dados persistidos.
7. Gerar NSIS, checksum, artefato de updater, assinatura Tauri e `latest.json`.
8. Publicar os artefatos no repositório público separado.
9. O aplicativo detecta a versão, exibe notas e aguarda a confirmação da nutricionista.
10. Após confirmação, executa backup, download, validação, instalação e reinício.
11. Registrar feedback, corrigir pela mesma release e repetir verificações.

## Atualização semiautomática do canal piloto

O Tauri Updater pode consultar um `latest.json` estático e baixar um instalador NSIS. A assinatura do updater é obrigatória e não pode ser desativada. A chave pública fica no aplicativo; a chave privada deve permanecer fora do repositório, com cópia de recuperação segura.

Comportamento recomendado:

- verificar atualização ao abrir, no máximo uma vez por dia, e também pelo ícone/botão manual;
- se estiver offline, continuar normalmente sem erro bloqueante;
- mostrar versão, resumo e necessidade de reinício;
- nunca instalar durante edição ou operação clínica em andamento;
- solicitar confirmação antes do download e da instalação;
- criar backup de segurança antes de migração;
- instalar com progresso visível e reiniciar dentro do fluxo confirmado;
- registrar versão anterior/nova e resultado, sem dados clínicos no log.

## Hospedagem com custo zero

Se o repositório de código for privado, o aplicativo não deve carregar token GitHub embutido para acessar releases privadas. As opções seguras são:

1. usar um repositório público separado contendo somente artefatos assinados, `latest.json`, checksums e notas — nunca código-fonte ou segredos;
2. hospedar os mesmos arquivos em outro endpoint HTTPS gratuito somente mediante nova decisão;
3. manter entrega manual como contingência se o pipeline estiver indisponível.

GitHub Actions em repositório privado possui franquia gratuita, mas pode gerar cobrança ou ser bloqueado após excedê-la. Para garantir custo recorrente igual a R$ 0, o build usará runner Windows auto-hospedado e controlado. A preparação local do spike e o workflow foram executados após T081; a criação do runner, suas credenciais, o repositório de releases e o endpoint ainda dependem de T082.

## Banco, migração e retorno

- Atualizar o executável não substitui a estratégia de migração do banco.
- Antes de uma migração, criar snapshot consistente e validar espaço/checksum.
- Migrações devem ser transacionais, versionadas e testadas do banco anterior para o novo.
- Voltar somente o binário pode ser incompatível com um schema já migrado; por isso o retorno deve restaurar também o backup compatível quando necessário.
- Falha de atualização deve preservar a versão e os dados atuais sempre que possível.

## Decisão aceita

O canal piloto será publicado automaticamente após merge revisado na `main`, usando runner Windows próprio, Tauri Updater assinado, NSIS e repositório público separado de artefatos. A nutricionista sempre confirma a instalação. O canal estável será ativado posteriormente, após G7 e promoção formal.

## Fontes técnicas

- Tauri Updater: <https://v2.tauri.app/plugin/updater/>
- Pipeline Tauri com GitHub: <https://v2.tauri.app/distribute/pipelines/github/>
- GitHub Releases: <https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases>
- Custos do GitHub Actions: <https://docs.github.com/en/actions/concepts/billing-and-usage>

