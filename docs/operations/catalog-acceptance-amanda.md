# Conferência do catálogo por Amanda — WEBFIT-19 / T097

Status: roteiro preparado em 2026-10-09; **execução e aceite de Amanda pendentes**. Maycon informou que Amanda executará. Usar a instalação de testes com apenas dados fictícios; este roteiro não autoriza uso de prontuários reais. Não é necessário enviar nomes, fotos de pacientes ou senhas.

## Antes de começar

1. Anotar a versão mostrada no aplicativo e a data da conferência.
2. Entrar no Saúde e cadastrar/abrir um paciente de teste chamado `Teste catálogo`, sem dados de pessoa real.
3. Abrir Nova prescrição, informar objetivo `Conferência de catálogo` e criar uma refeição `Teste de porções`.
4. Abrir Buscar alimento nas tabelas oficiais. A versão avaliada deve mostrar **5.875 registros oficiais** (5.874 TBCA + 1 TACO, incluindo restrições). Se mostrar o catálogo antigo, registrar a versão e solicitar a Maycon o candidato atual; não considerar o roteiro executado.

## Passos e resultados esperados

| Passo | O que fazer | O que conferir | Resultado Amanda |
| --- | --- | --- | --- |
| 1 — busca | Buscar `arroz integral cru` e depois `cru integral arroz` | Mesma seleção disponível; conferir nome, preparo, código e origem antes de incluir | Pendente |
| 2 — porção | Incluir `BRC0208A`. Selecionar a medida de 55 g | Quantidade 55 g; composição por 100 g = 138 kcal; total do cardápio = **76 kcal**, arredondado de 75,9 | Pendente |
| 3 — banana | Incluir `BRC0006C`. Selecionar a medida de 65 g, depois preencher quantidade como `50,00` g e sair do campo com Tab | Medida converte para 65 g; após ajuste, banana representa 54,5 kcal. Com arroz de 55 g, total = **130 kcal**, arredondado de 130,4 | Pendente |
| 4 — preparo cru | Incluir `BRC0017A`, quantidade 100 g | Arroz integral cru, TBCA; composição = **347 kcal/100 g** | Pendente |
| 5 — preparo cozido | Incluir `BRC0016A`, quantidade 100 g | Arroz integral cozido sem óleo/sem sal, TBCA; composição = **108 kcal/100 g**. Não trocar a composição do item cru | Pendente |
| 6 — cálculo conjunto | Conferir os quatro itens acima, nas quantidades 55/50/100/100 g | Total **585 kcal** (585,4 antes de arredondar); proteína **12,0 g**, carboidratos **129,0 g**, gordura **4,0 g**, fibras **7,9 g** | Pendente |
| 7 — persistência | Salvar rascunho, voltar ao paciente, reabrir; fechar o aplicativo e entrar novamente | Mesmos códigos, quantidades, preparos e valores. Total continua 585 kcal | Pendente |
| 8 — restrição da fonte | Buscar `BRC0004A` e `BRC0237T` | Aviso de restrição e inclusão indisponível; não representar composição ausente/conflitante como zero | Pendente |
| 9 — fibra ausente | Incluir `BRC0001F`, 50 g | Fibra por 100 g indica indisponibilidade; total de fibras fica **Indisponível**, não zero | Pendente |
| 10 — fallback delimitado | Buscar e incluir `TACO4-522`, 25 g | Nome **Chantilly, spray, com gordura vegetal**; origem TACO 4ª edição visível. Não usar para chantilly em pó ou preparado de pó | Pendente |
| 11 — busca vazia | Buscar `alimento inexistente xyz` | Mensagem sem resultados e orientação para refinar/preencher alimento personalizado; aplicativo continua utilizável | Pendente |
| 12 — personalizado | Adicionar alimento personalizado chamado `Alimento fictício`, origem `Rótulo fictício`, 100 g, 100 kcal, proteína 10 g, carboidrato 10 g, gordura 2 g, fibra 1 g. Salvar/reabrir | Origem e composição pessoais preservadas; os registros TBCA anteriores não mudam | Pendente |
| 13 — fonte corrigida | Buscar e incluir `BRC0293T` | Omelete vegano com vegetais agora disponível; origem TBCA, **119 kcal/100 g**, proteína 5 g, carboidrato 18 g, gordura 4,1 g, fibra 5,02 g. A antiga restrição por página vazia foi removida após correção oficial | Pendente |

As 100 kcal do alimento personalizado são um valor fictício de teste, não uma composição clínica a recomendar. Passos 9–12 alteram o cardápio; o total de 585 kcal vale **antes** deles.

## Decisão de domínio que precisa da Amanda

- Confirmar se o preparo `TACO4-522` (chantilly pronto em spray com gordura vegetal) é adequado como fallback específico, mantendo a distinção dos preparos TBCA em pó. A qualificação técnica está no [registro P02](../../specs/checkpoint-pendencias-2026-10-09/P02-catalogo-tbca-taco.md), D-CAT-019-002; não há aprovação clínica presumida.
- A [matriz completa](../../specs/checkpoint-pendencias-2026-10-09/P02-taco-review.md) explica as diferenças entre descrições TACO e TBCA. **372 descrições diretas não significam 372 substituições nutricionais aprovadas.** Os 220 casos sem identidade direta demonstrada estão separados para revisão de preparo/variedade/alias. Nenhum deles foi habilitado automaticamente como fallback. Avaliar a identidade completa antes de propor novas equivalências; casos cuja informação não baste permanecem separados.
- Quatro registros TBCA continuam com fonte conflitante: `BRC0004A`, `BRC0237T`, `BRC1145B`, `BRC1196B`. A manutenção desses bloqueios é o resultado técnico esperado até correção verificável da fonte, não uma falha a contornar escolhendo valores. O quinto, `BRC0293T`, foi corrigido na fonte e integrado em 2026-10-09; existem agora **5.870 TBCA incluíveis**.

## Retorno suficiente para registrar o aceite

Enviar somente:

```text
Versão do aplicativo:
Data:
Passos aprovados (1–13):
Passos com problema e o que aconteceu:
Chantilly em spray TACO4-522: aprovado / precisa revisar / rejeitado
Observações de preparo, medidas e exibição:
Avaliado por: Amanda
```

Maycon pode encaminhar o retorno de Amanda nesta conversa. Resultado será registrado como relato humano com versão/cenários, sem afirmar execução observada pelo agente. Este roteiro não aprova publicação, dados reais ou os gates G5/G6/G7.
