# Escopo do produto

## Refinamento de instalação — DEC-058 / WEBFIT-10

Maycon aprovou em 2026-10-08 ativação offline por solicitação/licença vinculada, administrador por instalação, emissor separado com interface e tipos inicial, transferência/recuperação, suporte temporário (uma sessão até 4 h), recuperação administrativa e reinicialização. Última limpa consultório mantendo licença/acessos/consumo, com backup e confirmação separados. Discovery funcional concluída, Plan técnico em elaboração; [registro único](../../specs/WEBFIT-10/task.md). Instalações anteriores eram testes: ativações iniciais sem limpeza automática. Sem mensalidade/servidor/planos pagos/sincronização ou dados reais/G7. Pacote de suporte por cópia adiado por Maycon para outra demanda.


**Status:** MVP Saúde aprovado no Gate G1 em 2026-08-20.

## MVP Saúde

- Fundação local: instalação, primeiro acesso, autenticação, espaço de trabalho, auditoria e persistência.
- Perfil profissional pertencente ao usuário.
- Pacientes: cadastro, pesquisa, edição, tags, arquivamento e restauração.
- Agenda e ciclo básico de atendimentos.
- Anamnese e histórico clínico.
- Antropometria e cálculos aprovados pelo domínio.
- Prescrições e cardápios individualizados com cálculos aprovados.
- Arquivos clínicos vinculados a pacientes e documentos A4 prioritários.
- Financeiro básico e planner.
- Relatórios e exportações PDF, XLSX e CSV.
- Backup local manual e automático, restauração e diagnóstico de integridade.

## Primeiro incremento

- Primeiro acesso, login, logout e bloqueio.
- Perfil profissional.
- Entrada no espaço Saúde.
- Cadastro, busca, abertura, edição, arquivamento e restauração de pacientes.
- Tags e observações básicas.
- Prescrições e cardápios individualizados: refeições, alimentos, porções, cálculos, rascunho, versões, finalização e histórico.
- Auditoria das ações críticas.
- Rascunho automático protegido nos formulários longos do incremento, incluindo pacientes e prescrição, sem confundi-lo com o estado clínico persistente da prescrição.
- Backup local mínimo, manual e automático, com restauração em ambiente de teste.
- Persistência comprovada após fechar e reabrir.

## Fora do MVP Saúde

- Espaço Educação: escolas, cardápios semanais, fornecedores, pedidos e gestão municipal de alimentos.
- Portal ou aplicativo do paciente.
- Chat remoto, diário por celular e notificações push.
- WhatsApp automatizado, teleconsulta e wearables.
- Site público, marketing, cursos e podcast.
- Sincronização ou colaboração entre computadores.
- Hospedagem, backup em nuvem, planos pagos e bloqueios comerciais.

## Evoluções sujeitas a nova decisão

- Atualizações do aplicativo pela internet.
- Recuperação remota de acesso.
- Backup opcional em nuvem.
- Migração dos aproximadamente 80 pacientes existentes.
- Descoberta, requisitos e arquitetura do espaço Educação.
- Biblioteca profissional de documentos e imagens sem vínculo obrigatório com paciente.

O catálogo detalhado permanece em [funcionalidades candidatas](../project/functional-candidates.md). A implementação é condicionada aos requisitos e testes aprovados no Gate G2.
