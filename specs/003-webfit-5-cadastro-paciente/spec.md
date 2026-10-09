# WEBFIT-5 — Cadastro mínimo e número do paciente

**Data:** 2026-10-08. **Branch:** main. **Base:** 3558eddd84211e504ba0457388b1bedc30c9697d.
**Status:** aprovado para implementação; código local e testes nativos/SQLCipher PASS. Aceite final/Windows pendentes. Plane sync degraded. Evidência atualizada em 2026-10-09.

## Origem e decisões

Maycon pediu somente nome, nascimento e sexo obrigatórios, radios Feminino/Masculino e todos os demais campos opcionais, inclusive CPF. Confirmou número sequencial visível mantendo UUID: “Sim, mas sem os zeros, por exemplo apenas 1, 245, 123”. À pergunta conjunta sobre aprovação funcional de Amanda e migração necessária com testes fictícios respondeu “Foi solicitação dela”, após pedir continuidade. Registrar como solicitação de Amanda relatada por Maycon, não como aceite da entrega.

D-PAT-001 ACCEPTED: responsável e seus campos também opcionais. D-PAT-003 ACCEPTED: número sequencial visível sem zeros. D-PAT-002 AGENT-PROVISIONAL não bloqueante: preservar sexo legado até salvar; reconhecer apenas F/M/Feminino/Masculino; valor ausente/desconhecido exige escolha explícita sem inferência. Aprovação de implementação/migração no escopo do pedido; sem dados reais, publicação, Git mutável ou G5/G6/G7.

## Requisitos — RF-PAT-007

| ID | Comportamento | Aceite |
|---|---|---|
| FR-001 | Exigir somente nome não vazio, nascimento válido não futuro e sexo | TA-PAT-008/010 |
| FR-002 | Radios Feminino/Masculino exclusivos, acessíveis, sem texto livre nem default | TA-PAT-012 |
| FR-003 | CPF/contato opcionais; CPF preenchido válido/normalizado/único inclusive em arquivados; e-mail preenchido validado | TA-PAT-009/011 |
| FR-004 | Preservar UUIDs, números, conteúdos, vínculos, licença e auditoria em atualização/backup | TA-PAT-013/014/017 |
| FR-005 | Preservar sexo legado até edição; exigir escolha quando desconhecido | TA-PAT-015 |
| FR-006 | Responsável e campos opcionais; validar CPF/e-mail quando preenchidos | TA-PAT-016 |
| FR-007 | Número de controle inteiro positivo crescente, sem zeros, gerado pelo sistema, exibido no cadastro/lista e pesquisável | TA-PAT-017 |

Prioridade: refinamento solicitado do incremento 1, sem repriorização remota. FR-001..004/006/007 aprovados no escopo; FR-005 segue decisão provisória não bloqueante. Nenhuma equação ou regra nutricional alterada.

## Cenários de aceite

- **TA-PAT-008:** salvar somente nome/nascimento/sexo e reencontrar após reiniciar.
- **TA-PAT-009:** salvar dois pacientes sem CPF (inclusive mesmo nome/nascimento); UUIDs e números distintos. Não deduplicar automaticamente por nome.
- **TA-PAT-010:** ausências dos três obrigatórios, nascimento inválido/futuro e sexo arbitrário impedem salvamento pela UI/comando protegido; preservar formulário.
- **TA-PAT-011:** CPF ou e-mail informado inválido, ou CPF duplicado inclusive em arquivado, impede salvar; CPF vazio/espaços/ausente permitido.
- **TA-PAT-012:** mouse/teclado escolhem exclusivamente Feminino ou Masculino; rótulos, agrupamento e foco acessíveis, sem default.
- **TA-PAT-013:** editar removendo CPF/contato preserva UUID, número, tags enviadas, prescrições, arquivamento e auditoria.
- **TA-PAT-014:** banco vazio e atualização 1/2→3; snapshot anterior validado/reabrível; restaurar backups 1/2/3 respeitando licença/transferência; integridade/rollback; futuro, metadata divergente, corrupção e senha errada não substituem estado atual.
- **TA-PAT-015:** sexo legado conhecido aparece selecionado sem reescrita em massa; desconhecido permanece visível e exige escolha ao salvar; ausente abre com radios vazios.
- **TA-PAT-016:** responsável parcial ou vazio não cria novos obrigatórios; CPF/e-mail preenchidos validados.
- **TA-PAT-017:** números como 1 e 245, sem zeros, distintos e não editáveis; não confiar em número enviado pelo cliente; mostrar imediatamente após salvar; preservar ao editar/arquivar/reabrir/restaurar; busca por número exato. Novo número acima dos já consumidos na instalação. UUID segue identificador dos vínculos.

## Compatibilidade e limites

### Refinamento visual aprovado — 2026-10-09

Pedido explícito de Maycon com captura do cadastro. RF-PAT-007 / FR-001: substituir “(obrigatório)” por `*` nos rótulos de nome, nascimento e sexo. **TA-PAT-018:** formulário inicial sem erro; tentar salvar incompleto impede envio e marca em vermelho os campos inválidos, inclusive contorno do grupo de sexo. Mensagens próximas aos obrigatórios ausentes e associadas aos controles; corrigir o campo remove sua indicação. Nome só com espaços também é vazio. Validação/foco nativos e dados digitados preservados. Prioridade: ajuste solicitado; aprovado para implementação, aceite Windows pendente. Sem novo obrigatório, banco ou regra clínica.

Legado recebe numeração por criação, UUID como desempate. CPF ausente é SQL NULL e aparece como “Não informado” na lista. Banco com schema futuro é recusado. Backup 3 conserva números; backup 1/2 não possuía número: UUID conhecido mantém número do destino; desconhecido recebe próximo número local. Números não são uma identidade global entre instalações; o UUID é preservado.

Somente fixtures. Checks SQL Node/SSR não substituem SQLCipher/DPAPI/WebView/aceite. [Plano e evidência](plan.md), [tarefas](tasks.md), [modelo](data-model.md), [contrato](contracts/patient.md), [roteiro](quickstart.md). Histórico de preparação em [.harness/evidence/webfit-5/planning.md](../../.harness/evidence/webfit-5/planning.md); bloqueios antigos superados pelas respostas acima.
