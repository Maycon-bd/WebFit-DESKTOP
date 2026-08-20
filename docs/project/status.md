# Status operacional — WebFit Desktop

> Este é o único checkpoint operacional para retomar o trabalho em outra máquina. Atualize-o ao terminar cada sessão e antes de trocar de computador.

## Onde paramos

- **Data do checkpoint:** 2026-08-20
- **Fase:** elicitação e análise de requisitos
- **Gate atual:** G2 — baseline do primeiro incremento
- **Estado:** em revisão
- **Última seção concluída:** seção 4 — pacientes e tags
- **Próxima seção:** seção 5 — prescrição e cardápio
- **Branch registrada:** `main`
- **Commit-base:** `8344c5f`
- **Sincronização:** branch `main` alinhada com `origin/main` antes desta atualização; existem alterações locais que precisam de commit e push antes da troca de máquina

## Última decisão aprovada

A seção 4 do G2 — **pacientes e tags** — foi aprovada por Maycon em 2026-08-20, com ajuste no fluxo de cadastro:

- abrir a área de pacientes, clicar em **Novo**, preencher um único formulário e salvar;
- nome completo, CPF, telefone, data de nascimento, e-mail e endereço obrigatórios;
- nome social, gênero, tags e observações opcionais; sexo permanece campo separado;
- responsável legal informado quando aplicável;
- CPF normalizado, validado e único no espaço Saúde, inclusive entre arquivados;
- busca por nome, nome social, CPF ou telefone e CPF mascarado na listagem;
- edição só persiste após confirmação em Salvar;
- arquivamento preserva dados e histórico e exige restauração antes de novos registros;
- tags podem ser criadas, selecionadas, renomeadas e desativadas sem romper o histórico;
- cadastro incompleto possui rascunho recuperável conforme as regras da seção 6.

## Próxima ação exata

Especificar e aprovar a seção 5 do G2 — prescrição e cardápio:

- confirmar a fonte nutricional oficial;
- definir medidas caseiras e regras para alimentos personalizados;
- aprovar fórmulas, unidades e arredondamentos dos cálculos;
- definir os micronutrientes incluídos no primeiro incremento;
- definir estados e transições da prescrição, inclusive correção e cancelamento;
- detalhar rascunho, finalização, nova versão e histórico imutável;
- criar regras de negócio e testes de aceite para RF-PRE-001 a RF-PRE-004.

As decisões clínicas precisam da aprovação de Amanda antes de concluir esta seção.

## Gates

| Gate | Objetivo | Estado | Evidência/condição seguinte |
|---|---|---|---|
| G1 | aprovar visão, autoridade e MVP Saúde | **aprovado em 2026-08-20** | entrevista e DEC-013 |
| G2 | aprovar baseline rastreável do primeiro incremento | **em revisão** | concluir checklist abaixo |
| G3 | criar plano executável | não iniciado | depende do G2 |
| G4 | validar arquitetura e spike | não iniciado | depende do G3 e ADR-0001 |
| G5 | construir incremento vertical | não iniciado | depende do G4 aplicável |
| G6 | validar release candidate | não iniciado | requisitos críticos verificados |
| G7 | liberar para dados reais | não iniciado | restauração exercitada e riscos aceitos |

## Checklist do G2 — primeiro incremento

| Ordem | Seção | Estado | Observação |
|---:|---|---|---|
| 1 | Escopo do incremento | **aprovado** | prescrição/cardápio incluído; PDF/exportação excluídos |
| 2 | Autenticação e sessão | **aprovado** | RF-AUT-001 a RF-AUT-003; confirmação de Maycon em 2026-08-20 |
| 3 | Perfil e espaço Saúde | **aprovado** | RF-CLI-001 e RF-CLI-002; confirmação de Maycon em 2026-08-20 |
| 4 | Pacientes e tags | **aprovado** | RF-PAT-001 a RF-PAT-006; fluxo ajustado e confirmação de Maycon em 2026-08-20 |
| 5 | Prescrição e cardápio | **em especificação clínica — próximo passo** | fonte nutricional, fórmulas, unidades, arredondamentos e estados |
| 6 | Rascunhos | pendente | RN-DRF-001 a RN-DRF-004 |
| 7 | Auditoria | pendente | RF-AUD-001 |
| 8 | Backup e restauração | pendente | RF-BKP-001 a RF-BKP-003 |
| 9 | Requisitos não funcionais | pendente | RNF-* do incremento |
| 10 | Testes e rastreabilidade | pendente | TA-* e matriz |
| 11 | Aprovação final do G2 | pendente | Amanda e Maycon |

## Escopo aprovado do primeiro incremento

- autenticação, logout e bloqueio;
- nutricionista e administrador;
- perfil profissional e espaço Saúde;
- pacientes, tags, observações, rascunho, arquivamento e restauração;
- prescrição e cardápio individual;
- auditoria;
- backup automático/manual e restauração mínima;
- persistência após fechar e reabrir.

## Fora do primeiro incremento

- Educação;
- agenda, atendimento, anamnese e antropometria;
- financeiro e planner;
- arquivos clínicos, PDF, impressão, relatórios e exportações;
- nuvem, sincronização e recuperação remota.

## Pendências que não devem ser esquecidas

- Amanda deve aprovar fonte nutricional, fórmulas, unidades e arredondamentos.
- Definir estados e transições da prescrição.
- Criptografia, diretório de dados, chaves e pacote de backup dependem do spike.
- Pen drive ou SSD externo deve ser decidido antes do G7.
- Retenção clínica definitiva precisa de avaliação antes de dados reais.
- Educação e serviços em nuvem exigem novo ciclo/ADR.

## Como trocar de máquina

### Antes de sair da máquina atual

1. Atualizar este arquivo.
2. Executar `git status` e revisar o diff.
3. Criar um commit intencional.
4. Executar `git push` na branch registrada.
5. Confirmar que o commit remoto corresponde ao trabalho local.

### Na outra máquina

1. Confirmar que não há alterações locais conflitantes.
2. Executar `git fetch origin`.
3. Trocar para a branch registrada acima.
4. Executar `git pull --ff-only`.
5. Abrir este arquivo e continuar pela seção **Próxima ação exata**.

## Documentos de apoio

- [Escopo](../product/scope.md)
- [Requisitos funcionais](../requirements/functional-requirements.md)
- [Regras de negócio](../requirements/business-rules.md)
- [Testes de aceite](../requirements/acceptance-criteria.md)
- [Matriz de rastreabilidade](../requirements/traceability.md)
- [Decisões](decision-log.md)
- [Product Backlog](product-backlog.md)
- [Roadmap](roadmap.md)

## Gatilho de retomada

Ao receber **“Vamos continuar onde paramos”** ou variação clara, este arquivo deve ser lido integralmente antes de qualquer planejamento ou alteração. O estado Git deve ser comparado com este checkpoint e a retomada deve começar por **Próxima ação exata**.

## Regra de manutenção

Ao final de cada sessão, atualizar pelo menos: data, branch, commit-base, sincronização, última seção concluída, próxima ação e checklist do Gate. Não marcar Gate como aprovado sem decisão dos aprovadores e evidência correspondente.
