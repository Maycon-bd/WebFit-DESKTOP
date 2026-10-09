# Escopo do produto

Evolução pessoal 2026-10-09 — DEC-059/ADR-0004: Maycon aprovou painel administrativo integrado por senha mestra, código de emissão em abas e importação única do cofre atual; chave SQLCipher fixa em hexadecimal e manutenção local. RF-ADM-001..006/TA-ADM-001..021, [WEBFIT-16](../../specs/WEBFIT-16/task.md). Evolui emissor separado abaixo; protocolo e efeitos anteriores preservados. Não inclui importação WebDiet, reset de fábrica, versão web/FastAPI, dados reais, publicação ou aceite/G7.

## Refinamento de instalação — DEC-058 / WEBFIT-10

Maycon aprovou em 2026-10-08 ativação offline por solicitação/licença vinculada, administrador por instalação, emissor separado com interface e tipos inicial, transferência/recuperação, suporte temporário (uma sessão até 4 h), recuperação administrativa e reinicialização. Última limpa consultório mantendo licença/acessos/consumo, com backup e confirmação separados. Discovery/Plan concluídos e implementação específica aprovada por Maycon (“Aprovo a implementação”), ADR-0003 v1/D-LIC-006..008; execução fictícia, aceite final pendente; [registro único](../../specs/WEBFIT-10/task.md). Instalações anteriores eram testes: ativações iniciais sem limpeza automática. Sem mensalidade/servidor/planos pagos/sincronização ou dados reais/G7. Pacote de suporte por cópia adiado por Maycon para outra demanda.


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

## Dashboard geral — WEBFIT-17

RF-UX-008 aprovado para implementação por Maycon em 2026-10-09: home do Consultório, acima de Pacientes e destino do símbolo WebFit. Visão agregada dos módulos existentes, extensível por requisitos futuros; gráficos/indicadores iniciais registrados como D-DASH-001/002 provisórios no registro único. Não amplia agenda/financeiro nem uso clínico/G5/G6/G7.

## Personalização — WEBFIT-22

RF-UX-009 aprovado para implementação por Maycon em 2026-10-09: tema Claro/Escuro em Configurações → Personalização, escolha global imediata e preferência visual local. Aceite final separado; demais personalizações fora desta demanda. Não altera domínio, backup clínico ou gates G5/G6/G7.
