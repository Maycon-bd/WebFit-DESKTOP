# Pesquisa de compilação e distribuição — WebFit Desktop

Data: 2026-10-07. Status: análise para decisão humana; nenhuma alteração de integração, cobrança, credencial ou publicação executada. O pedido de Maycon é comparar limites gratuitos e resolver a distribuição das mudanças integradas na main. A recomendação abaixo não substitui DEC-043/044, ADR-0002 nem aprovação de ativação externa.

## Recomendação

Usar GitHub Actions com Windows padrão hospedado pelo GitHub para compilar o produto da raiz, mantendo o código privado, e publicar instalador assinado, metadados e checksums no repositório público separado de releases. Configurar e verificar bloqueio de consumo pago antes de ativar. Preservar o runner próprio já preparado como contingência sob demanda, sem executar duas publicações concorrentes da mesma versão.

É uma recomendação técnica, pendente de validação humana: altera a escolha vigente de runner próprio. Atualização conectada continua conforme ADR-0002: confirmação da nutricionista, backup, download, validação e instalação. Nenhum servidor próprio ou nova conta de CI é necessário nessa opção.

O motivo é simplicidade: código, revisão, execução e distribuição já estão no GitHub. No uso pequeno esperado do MVP, convém medir e administrar a franquia existente antes de acrescentar outro serviço. Essa expectativa não é medição nem promessa de gratuidade ilimitada.

## Quatro responsabilidades separadas

1. Integração: chats entregam mudanças isoladas e revisadas; main recebe o conjunto que deve chegar à usuária.
2. Compilação: uma máquina Windows executa testes, Rust/MSVC, SQLCipher e NSIS. Pode ser do GitHub, de outro provedor ou de Maycon.
3. Distribuição: GitHub Releases armazena os arquivos publicados e o manifesto de atualização.
4. Atualizador: o WebFit consulta o manifesto, compara versões e instala após confirmação. A troca do provedor de build não exige trocar o atualizador.

O instalador continua sendo produzido. A automação remove sua geração e transferência manuais. Nenhum dado clínico/banco do computador de Amanda precisa ser enviado para CI ou GitHub.

## Limites pesquisados

### GitHub

O GitHub Free publica franquia de 2.000 minutos/mês, 500 MB de artefatos e 10 GB de cache por repositório. O consumo de minutos pertence ao dono da conta e inclui outros projetos; tentativas que falham também consomem. Runners próprios e runners padrão de repositórios públicos têm execução gratuita. Sem forma de pagamento válida, exceder a franquia bloqueia uso. [Cobrança oficial](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

Windows privado padrão: 2 CPUs, 8 GB RAM e 14 GB SSD; máquina renovada por job. Limite geral de execução hospedada: seis horas/job. Esses limites não impedem tecnicamente nosso build, mas espaço e duração precisam ser medidos. [Máquinas](https://docs.github.com/en/actions/reference/runners/github-hosted-runners), [limites](https://docs.github.com/en/actions/reference/limits).

Preço adicional de Windows x64 padrão: US$ 0,010/minuto. Runners maiores são pagos e não utilizam os minutos incluídos. Não contratar runner maior para este MVP. A documentação atual consultada não explicita o multiplicador histórico de Windows na página principal de cobrança; não converter a franquia publicada em quantidade garantida de releases. Confirmar consumo contabilizado no painel da conta após execução. [Preços](https://docs.github.com/en/billing/reference/actions-runner-pricing).

GitHub Releases aceita arquivo menor que 2 GiB e até 1.000 assets por release; a documentação não estabelece limite de tamanho total da release ou banda. Isso é separado dos artefatos temporários do Actions. O instalador local 0.1.4 tem 218.910.266 bytes, bem abaixo do limite individual. [Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

Um orçamento que apenas envia alerta não bloqueia cobrança. Configurar escopo apropriado e a opção de parar uso ao atingir o limite; validar orçamento de consumo pago zero e comportamento efetivo na conta antes de afirmar proteção. [Orçamentos](https://docs.github.com/en/billing/how-tos/set-up-budgets).

### Alternativas com Windows hospedado

| Serviço | Gratuidade pesquisada | Limitação decisiva para WebFit |
|---|---|---|
| Azure Pipelines | Projeto privado: 1.800 minutos/mês, um job simultâneo, até 60 minutos/job | Precisa habilitar concessão; documentação atual exige organização vinculada a assinatura Azure válida. Mais integração e limite por build menor. |
| CircleCI | 30.000 créditos/mês; Windows Medium custa 40 créditos/minuto | Equivale a até 750 minutos Windows se todos os créditos forem usados só em computação nessa classe. Acrescenta conta/pipeline; armazenamento pode consumir créditos. |
| GitLab.com | Free: 400 minutos computacionais/mês; Windows Medium fator 1 | Runner Windows em beta; exige migração/espelhamento ou integração adicional com GitHub. |
| AppVeyor | Gratuito para projetos públicos; privado Basic US$ 29/mês | Não oferece a alternativa privada gratuita contínua que buscamos. Trial de 14 dias não resolve operação permanente. |
| Runner próprio com GitHub Actions | Execução própria gratuita conforme documentação atual | Depende de computador ligado, conectado e ferramentas mantidas; usa energia/hardware local. |

Fontes: [Azure — franquia e ativação](https://learn.microsoft.com/en-us/azure/devops/pipelines/licensing/concurrent-jobs?view=azure-devops), [CircleCI — plano](https://circleci.com/pricing/), [CircleCI — máquina/créditos](https://circleci.com/pricing/price-list/), [GitLab — franquia](https://docs.gitlab.com/ci/pipelines/compute_minutes/), [GitLab — Windows beta](https://docs.gitlab.com/ci/runners/hosted_runners/windows/), [AppVeyor](https://www.appveyor.com/pricing/).

A publicidade de até 6.000 minutos do CircleCI refere-se à classe Docker pequena, não a Windows. A taxa atual de Windows Medium é 40 créditos/minuto: 30.000 / 40 = 750. Não comparar números anunciados sem o tipo de máquina.

O anúncio histórico de cobrança de runners próprios pelo GitHub foi adiado; a documentação vigente ainda informa execução própria gratuita. Não usar o trecho antigo do anúncio como política ativa. [Comunicado atualizado](https://github.com/resources/insights/2026-pricing-changes-for-github-actions).

## Capacidade: cenários, não medições

Tempo total é preparo + dependências + verificações + compilação + empacotamento + publicação, somado por job. O build local usa cache e máquina diferente: não comprova desempenho de uma VM hospedada nova.

| Frequência ilustrativa | Duração hipotética por versão | Tempo Windows bruto/mês |
|---|---:|---:|
| 8 versões | 20 minutos | 160 minutos |
| 20 versões | 20 minutos | 400 minutos |
| 40 versões | 30 minutos | 1.200 minutos |
| 100 versões | 30 minutos | 3.000 minutos |

São hipóteses de planejamento. Não incluem PRs, falhas, repetição, outros repositórios, consumo adicional de armazenamento ou eventual conversão de unidades de franquia por máquina. Para aceitar a solução, medir ao menos build frio e build com cache e confrontar o painel de consumo real. Planejar margem em vez de utilizar 100% da franquia.

O número de instalações da aplicação não determina a quantidade de builds: uma versão é compilada uma vez e pode ser baixada por várias pessoas. Esgotar a franquia de CI impede preparar novas versões, mas não desinstala a aplicação já instalada; distribuição existente permanece separada.

## Como reduzir consumo sem complicar a operação

- Tarefas individuais não publicam versões nem incrementam SemVer por conta própria; a versão é definida na integração da release.
- Um build de distribuição por integração aprovada na main. Agrupar tarefas relacionadas antes de integrar quando possível, sem mudar silenciosamente o gatilho já aprovado.
- PRs fazem checks proporcionais; evitar repetir build NSIS completo em cada commit e novamente no merge sem necessidade.
- Preservar testes Windows/SQLCipher/DPAPI necessários. Checks puramente frontend podem executar em Linux; não transferir testes Windows para Linux só por economia.
- Cachear dependências/Rust com chave adequada e limite de retenção; medir tamanho de target antes de cachear tudo.
- Publicar assets diretamente do job Windows no Releases. Artefatos temporários do Actions só para necessidade concreta, com retenção curta: três instaladores de aproximadamente 219 MB já ultrapassam nominalmente 500 MB se mantidos simultaneamente.
- Verificar timeouts, alertas e bloqueio de gastos; impedir publicação concorrente e reutilizar exatamente os mesmos arquivos assinados.
- Se a franquia acabar, aguardar renovação ou acionar explicitamente o runner próprio. Não ativar fallback automático irrestrito nem pagar excedente sem decisão humana.

Publicar em repo público separado não torna gratuita a compilação de código privado realizada no repositório privado. Tornar o código inteiro público permitiria usar a gratuidade pública padrão, mas é uma decisão de exposição/licenciamento distinta e não recomendada apenas para obter minutos de build. Licenciamento externo do produto/dados também permanece pendente.

## Funcionamento final proposto

```text
Mudanças isoladas → revisão/testes → integração aprovada na main
                                      ↓
                         Windows hospedado pelo GitHub
                                      ↓
                        build + assinatura + verificações
                                      ↓
                 Releases: instalador + .sig + latest.json + SHA256
                                      ↓
            WebFit: verificar versão → mostrar notas → confirmação
                                      ↓
                backup → baixar → validar → instalar → reiniciar
```

Tauri aceita manifesto JSON estático e exige assinatura de atualização. No Windows o updater pode reutilizar o instalador NSIS assinado para esse mecanismo. Não exige servidor de aplicação dedicado nem autenticação de usuário remoto. [Tauri Updater](https://v2.tauri.app/plugin/updater/), [pipeline GitHub](https://v2.tauri.app/distribute/pipelines/github/).

O aplicativo verifica ao abrir, no máximo diariamente, e por ação manual conforme ADR-0002; offline continua funcionando. Uma instalação manual inicial incorpora o updater e a chave pública correspondente. Não confundir assinatura do updater com Authenticode: esta proposta não comprova remoção de alertas do Windows.

## Estado observado e execução necessária

Em 2026-10-07, o workflow local `.github/workflows/pilot-release.yml` está desativado e aponta para o spike descartável. O produto da raiz tem `createUpdaterArtifacts: false` e ainda não tem o fluxo de updater. Runner/segredos/repositório de releases foram preparados segundo o checkpoint; seus valores não foram consultados. Não ativar o workflow antigo como se já compilasse o MVP.

1. Validar a mudança de runner próprio para hospedado, preservando distribuição/assinatura e confirmação aprovadas; registrar a decisão na fonte canônica.
2. Conferir plano, consumo disponível e bloqueio de cobrança da conta GitHub; sem presumir que o plano seja Free ou que a franquia esteja intacta.
3. Adaptar o workflow para a raiz, Windows/MSVC e Perl/SQLCipher; verificar build frio sem depender de `.tools` local já instalado.
4. Implementar updater, chave pública/endpoint e geração de artefatos. Aproveitar material preparado, sem copiar spike para produto.
5. Medir tempo, espaço e franquia consumida. Verificar fonte/versão, assinatura, checksum e publicação completa antes de tornar latest.json disponível.
6. Testar duas versões consecutivas: atualização, backup, persistência, rede indisponível, download interrompido e assinatura inválida. Só então ativar publicação e entregar a versão inicial com updater.

Essa pesquisa não efetuou nenhum desses passos externos. Sem commit/push/merge/release ou configuração de cobrança. A outra demanda em andamento no chat de login foi preservada; não houve alteração de produto nesta análise.
