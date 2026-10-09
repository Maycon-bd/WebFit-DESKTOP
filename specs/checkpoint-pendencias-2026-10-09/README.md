# Pendências do checkpoint — specs de retomada

Data: 2026-10-09. Status: **registro documental concluído; resolução das pendências não executada**.

Pedido de Maycon: “Crie specs das pendencias que estão no checkpoint”. Entrega LIGHT documental. IDs P01–P08 e N01–N05 são locais; não inventam IDs Plane. A criação deste inventário não concede exceção para infraestrutura, implementação de propostas ou aceite funcional.

## Specs

Adição documental solicitada em 2026-10-09: [N06 — acesso local do agente ao banco](N06-acesso-agente-banco-local.md), leitura no escopo autorizado e escrita após aprovação concreta. Spec proposta, sem conexão/implementação nesta entrega.

| ID | Pendência | Estado registrado |
| --- | --- | --- |
| P01 | [Ambiente isolado e automação da interface](P01-ambiente-testes.md) | WEBFIT-14: headless mock funcional, quatro cenários PASS sem login humano/foco; camada Tauri real e review pendentes |
| P02 | [Composição completa TBCA e fallback TACO](P02-catalogo-tbca-taco.md) | PENDENTE — implementação parcial / T038 |
| P03 | [Cobertura e ensaio integral da auditoria](P03-auditoria.md) | PENDENTE — código/checks parciais existentes |
| P04 | [Cobertura de backup e restauração](P04-backup-restauracao.md) | PENDENTE — código/checks parciais existentes |
| P05 | [Ensaio Windows e revisão integrada das entregas](P05-ensaio-ui-review.md) | PENDENTE — implementações existentes |
| P06 | [Atualização ponta a ponta e segundo runner](P06-atualizacao-runners.md) | PENDENTE — evidência operacional parcial |
| P07 | [Licenciamento, custódia e ensaios do emissor](P07-licenciamento-custodia.md) | PENDENTE — código/builds existentes; aceite/custódia incompletos |
| P08 | [Decisões e aceites humanos remanescentes](P08-decisoes-aceites.md) | PENDENTE — reconciliação e aceite humano |
| N01 | [Preservar edições durante cálculo e confirmação](N01-preservar-edicoes.md) | PROPOSTA PENDENTE — P1 da auditoria, não prioridade humana |
| N02 | [Esclarecer estado inicial do cálculo](N02-estado-inicial-calculo.md) | PROPOSTA PENDENTE — P1 da auditoria, não prioridade humana |
| N03 | [Distinguir entradas alteradas e metas aplicadas](N03-metas-aplicadas.md) | PROPOSTA PENDENTE — P2 da auditoria, não prioridade humana |
| N04 | [Desfazer inclusão de refeição](N04-desfazer-refeicao.md) | PROPOSTA PENDENTE — P2 da auditoria, não prioridade humana |
| N05 | [Distinguir consulta pendente, falha e vazio](N05-estados-consulta.md) | PROPOSTA PENDENTE — P2 da auditoria, não prioridade humana |

## Detalhamento solicitado — 2026-10-09

Maycon solicitou “detalhe cada spec”. As 13 specs foram aprofundadas no próprio arquivo: objetivo/atores/entradas, fluxo previsto, 78 cenários locais verificáveis, fronteiras técnicas, dependências/riscos/decisões abertas, entrega/evidência e sequência de conclusão. Não foram criados plans/tasks concorrentes.

Os cenários P organizam retomada e verificação dos requisitos existentes; os cenários N detalham propostas e precisam validação pertinente. Nenhum cenário foi executado nesta entrega. Dependências/implementação não são autorizadas por este detalhamento. Onde comportamento ainda depende de decisão (estado inicial clínico, persistência de entradas não aplicadas, remoção de refeição), a lacuna permanece explícita, sem opção inventada como aprovada.

Os caminhos de código são alvos de inspeção na retomada, não afirmação de reprodução atual ou obrigação de refatoração. O registro inicial de Git/árvore limpa abaixo descreve a criação; ao iniciar este aprofundamento, as specs e o checkpoint já estavam alterados e foram preservados.

## Uso e cobertura

[status.md](../../docs/project/status.md) continua o único checkpoint operacional. Estas specs são recortes de pendências para futura retomada; artefatos históricos de cada demanda continuam canônicos, sem novos plan/tasks concorrentes. N01–N05 detalham propostas do relatório existente; P05 agrega somente a organização de ensaios, mantendo specs V01–V08 e das features.

Cobertura: plano de ambiente/automação; catálogo TBCA/TACO; auditoria; backup; cadastro e componentes; conta/menu/barra/fechamento; tutoriais; rascunhos; marca e V01–V08; atualizador/runners/cache; licença/emissor; informações globais, decisões/aceites e gates; cinco candidatos do próximo recorte de UI. Checks/ensaios históricos específicos (T087/T090/T093/T097/T100/T110) devem ser reconciliados com o candidato atual em P05–P07, sem validar instalador antigo como se incluísse as novas entregas.

Não transformar caixas históricas desmarcadas em prova de código ausente: comparar código, evidência e decisão atuais. Não recriar automação cancelada. Integração local não comprova remoto vivo/Actions/distribuição. Artefatos ignorados exigem preservação humana ou recompilação ao mudar de máquina.

## Ordem sugerida

P01 permite ampliar ensaios P03–P07; P02 pode seguir sua trilha aprovada em paralelo lógico, sem scheduler. P08 resolve decisões materialmente necessárias à respectiva trilha. N01 + N03 são recomendação da auditoria; N02 precisa conciliação de domínio; N04/N05 permanecem propostas, sem prioridade humana presumida.

## Evidência desta entrega

Somente documentos criados e checkpoint atualizado; nenhum comportamento alterado, teste funcional/build ou ensaio Windows executado. Validação documental: links locais e whitespace; autorrevisão de cobertura/status. Revisão independente deste lote pendente; não declarar REVIEW PASSED/READY TO SHIP.

Git observado: feature/pbi-001-primeiro-incremento-saude, HEAD 88387e46266dbfc6e1e47363da595db545695ddd. Árvore limpa antes; referência local upstream 0/0, sem consulta remota. Mudança externa de branch desde consulta anterior comunicada e preservada. Sem operação Git mutável.

