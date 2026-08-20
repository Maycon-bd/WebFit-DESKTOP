# Status operacional — WebFit Desktop

> Este é o único checkpoint operacional para retomar o trabalho em outra máquina. Atualize-o ao terminar cada sessão e antes de trocar de computador.

## Onde paramos

- **Data do checkpoint:** 2026-08-20
- **Fase:** elicitação e análise de requisitos
- **Gate atual:** G2 — baseline do primeiro incremento
- **Estado:** em revisão
- **Última seção concluída:** seção 1 — escopo do primeiro incremento
- **Próxima seção:** seção 2 — autenticação e sessão
- **Branch registrada:** `main`
- **Commit-base:** `e995940`
- **Sincronização:** existem alterações locais posteriores ao commit-base; precisam de commit e push antes da troca de máquina

## Última decisão aprovada

O primeiro incremento inclui **prescrição e cardápio individual**, além de autenticação, perfil, espaço Saúde, pacientes, auditoria e backup/restauração mínima.

Para prescrição/cardápio entram:

- refeições;
- alimentos e porções;
- cálculos de energia, macro e micronutrientes após aprovação das fontes e fórmulas;
- rascunho;
- versionamento;
- finalização;
- histórico por paciente.

PDF, impressão e exportação continuam fora do primeiro incremento.

## Próxima ação exata

Revisar e aprovar a seção 2 do G2 — autenticação e sessão:

- nutricionista e administrador;
- ambos com acesso total;
- senha mínima de 8 caracteres;
- espera progressiva após falhas: 30 segundos, 1 minuto, 5 minutos e 15 minutos;
- bloqueio após 1 hora de inatividade;
- bloqueio junto com o Windows;
- reset administrativo sem revelar a senha anterior;
- senha temporária com troca obrigatória;
- recuperação remota fora do primeiro incremento;
- eventos de autenticação registrados na auditoria.

Quando Maycon confirmar esse conjunto, marcar a seção 2 como aprovada e avançar para perfil e espaço Saúde.

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
| 2 | Autenticação e sessão | **em revisão — próximo passo** | RF-AUT-001 a RF-AUT-003 |
| 3 | Perfil e espaço Saúde | pendente | RF-CLI-001 e RF-CLI-002 |
| 4 | Pacientes e tags | pendente | RF-PAT-001 a RF-PAT-006 |
| 5 | Prescrição e cardápio | em especificação clínica | fonte nutricional, fórmulas, unidades, arredondamentos e estados |
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
