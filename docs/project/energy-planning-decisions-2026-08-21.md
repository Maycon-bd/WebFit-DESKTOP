# Decisões clínicas — energia e planejamento teórico

**Elicitação iniciada:** 2026-08-21  
**Validação clínica concluída:** 2026-09-10  
**Gate:** G2 — seção 5B  
**Estado:** baseline clínica aprovada  
**Aprovadores:** Amanda (domínio) e Maycon (produto/técnico)

Este registro consolida as respostas fornecidas por Amanda durante a elicitação e a validação do cálculo energético e da distribuição teórica. A implementação ainda deve preservar o protocolo versionado, executar os testes de aceite e apresentar os alertas aprovados antes de qualquer uso clínico.

## Decisões confirmadas

### Fórmula por público

- Adultos, idosos e atletas: Harris-Benedict revisada — Roza e Shizgal, 1984.
- Homens: `TMB = 88,362 + (13,397 × peso em kg) + (4,799 × altura em cm) − (5,677 × idade)`.
- Mulheres: `TMB = 447,593 + (9,247 × peso em kg) + (3,098 × altura em cm) − (4,330 × idade)`.
- Para Harris-Benedict, `GET = TMB × fator de atividade`; os fatores iniciais são sedentário 1,20, leve 1,375, moderado 1,55 e muito ativo 1,725.
- Crianças e adolescentes: EER/DRI 2023, inicialmente de 3 a 18,99 anos, para sexo masculino e feminino e atividades inativa, pouco ativa, ativa e muito ativa.
- As equações pediátricas são escolhidas por sexo, idade e atividade conforme a tabela 5-15 da DRI 2023; o custo de crescimento depende da faixa etária e já integra o resultado.
- Gestantes: EER/DRI 2023; o primeiro trimestre usa a equação da mulher não gestante. Segundo e terceiro trimestres usam idade, altura, peso atual, atividade, semana gestacional e componente definido pelo IMC pré-gestacional: baixo peso +300, eutrofia +200, sobrepeso +150 e obesidade −50 kcal/dia.
- Lactantes: EER/DRI 2023; aleitamento exclusivo de 0 a 6 meses usa custo de produção de 540 menos mobilização de 140 kcal/dia. Aleitamento parcial de 7 a 12 meses usa incremento de 380 kcal/dia.
- A atividade já está incorporada nas equações EER e não recebe multiplicação adicional.
- Pessoas menores de 3 anos e padrões de aleitamento diferentes dos suportados ficam sem cálculo automático no primeiro incremento.
- Pacientes com condições especiais podem usar a equação selecionada como estimativa teórica, sempre com alerta e sem transformação automática em prescrição definitiva.
- Fator de injúria, adicional por MET e adicional separado de gestação não entram no primeiro incremento.
- Ausência de entrada obrigatória impede o cálculo automático e solicita correção sem apagar os dados informados.

### Meta de peso

- Não haverá limite automático de ganho ou perda de peso por dia ou semana.
- O coeficiente padrão é 7.800 kcal/kg, configurável e identificado como estimativa, tanto para perda quanto para ganho.
- O ajuste diário é `variação desejada em kg × coeficiente ÷ prazo em dias`, com sinal negativo para perda e positivo para ganho.
- Variação e prazo devem ser positivos; prazo zero ou inválido impede o cálculo.
- Se a meta energética ficar abaixo da TMB, o sistema exibe alerta, exige confirmação e registra a confirmação, o usuário e o instante; o valor não é bloqueado.
- O exemplo de perda de 3 kg em 40 dias deve apresentar ajuste de **-585 kcal/dia**.
- O exemplo de ganho de 2 kg em 60 dias deve apresentar ajuste de **+260 kcal/dia**.
- O coeficiente representa uma projeção operacional e não garante alteração corporal real equivalente.

### Distribuição de macronutrientes

- O planejamento utiliza a meta energética final, seja ela derivada do GET, ajustada por objetivo ou informada manualmente.
- Percentuais de carboidratos, proteínas e gorduras devem totalizar 100%.
- Exemplo confirmado: 45% carboidratos, 25% proteínas e 30% gorduras.
- Conversões: carboidratos 4 kcal/g, proteínas 4 kcal/g e gorduras 9 kcal/g.
- Proteína pode ser informada em percentual ou em gramas por quilograma.
- Quando proteína for informada em g/kg, ela tem prioridade; o carboidrato mantém o percentual escolhido e a gordura fecha as calorias restantes.
- Se proteína e carboidrato ultrapassarem a energia disponível, o sistema rejeita a distribuição. Se consumirem exatamente 100%, a gordura zero exige ajuste antes da conclusão.
- A comparação entre teórico e prescrito usa tolerância de ±5%.
- A tolerância é inclusiva: resultados entre 95% e 105%, inclusive, ficam dentro da meta.
- Resultado abaixo ou acima da faixa adequada é vermelho; resultado dentro da faixa é verde.

### Fibras

- Fibras entram no primeiro incremento.
- Adultos: meta fixa por idade e sexo:
  - homens: aproximadamente 38 g/dia até 50 anos e 30 g/dia após 50 anos;
  - mulheres: aproximadamente 25 g/dia até 50 anos e 21 g/dia após 50 anos.
- Gestantes: 28 g/dia.
- Lactantes: 29 g/dia.
- Para pessoas com diabetes, usar o maior valor entre a recomendação geral aplicável e 14 g/1.000 kcal.
- Gestação e lactação prevalecem sobre a regra geral por idade e sexo.
- Fibra possui AI e não UL; não será criado limite máximo tolerável automático.
- Metas automáticas de micronutrientes ficam fora desta seção; a composição de micronutrientes do cardápio permanece aprovada em RF-PRE-003.

### Substituição manual

- A nutricionista pode substituir manualmente o resultado calculado.
- O resultado deve ser identificado como **manual** no histórico.
- Não será exigida justificativa no formulário.
- O campo de motivo ou observação é opcional.
- O histórico mantém valor calculado, valor final, usuário, instante em UTC, origem manual e observação quando informada.

### Validação

Amanda forneceu e aprovou exemplos fictícios de:

- mulher e homem adultos;
- idoso;
- criança e adolescente;
- gestante e lactante;
- atleta;
- condição especial com alerta;
- perda e ganho de peso;
- planejamento de 1.246 kcal com 45/25/30;
- proteína em percentual e em g/kg;
- cardápio dentro, 5% abaixo, 5% acima e fora da tolerância;
- fibra por idade/sexo e fibra para diabetes.

Os resultados aritméticos dos 19 exemplos foram conferidos em 2026-09-10 e correspondem às fórmulas e regras declaradas. Cada fixture deve preservar entradas, resultado esperado sem arredondamento intermediário e apresentação final conforme RN-PRE-023.

## Fora do primeiro incremento

- fator de injúria;
- adicional por MET;
- adicional separado de gestação;
- protocolos específicos para condições especiais;
- metas automáticas de micronutrientes.

## Fontes clínicas versionadas

- [Roza AM, Shizgal HM. *The Harris Benedict equation reevaluated*. American Journal of Clinical Nutrition, 1984](https://pubmed.ncbi.nlm.nih.gov/6741850/). DOI `10.1093/ajcn/40.1.168`.
- [National Academies of Sciences, Engineering, and Medicine. *Dietary Reference Intakes for Energy*. 2023](https://www.ncbi.nlm.nih.gov/books/NBK588659/). DOI `10.17226/26818`, especialmente tabelas [5-15](https://www.ncbi.nlm.nih.gov/books/NBK591021/table/tab_5_15/), [5-17](https://www.ncbi.nlm.nih.gov/books/NBK591021/table/tab_5_17/), [5-18](https://www.ncbi.nlm.nih.gov/books/NBK591021/table/tab_5_18/) e [5-19](https://www.ncbi.nlm.nih.gov/books/NBK591021/table/tab_5_19/).
- [American Diabetes Association. *Standards of Care in Diabetes — 2025*](https://diabetesjournals.org/care/article/48/Supplement_1/S86/157563/5-Facilitating-Positive-Health-Behaviors-and-Well), recomendação mínima de 14 g de fibras por 1.000 kcal.

## Resultado da seção 5B

- RF-PRE-005 aprovado por Amanda em 2026-09-10.
- Regras RN-PRE-011 a RN-PRE-024 aprovadas.
- Testes TA-PRE-008 a TA-PRE-016 definidos e rastreados.
- A evidência de execução continuará pendente até a implementação e execução automatizada dos fixtures.
