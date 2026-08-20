# Entrevista com stakeholder — rodada 01

- **Data de consolidação:** 2026-08-20
- **Stakeholder:** Amanda — nutricionista e aprovadora funcional
- **Product Owner e responsável técnico:** Maycon
- **Fonte recebida:** `entrevista_consolidada_webfit.md`
- **Status:** curada e aprovada como fonte do MVP Saúde

## Regra de uso

Este documento registra decisões extraídas da entrevista. Respostas diretas da stakeholder são evidência funcional; recomendações derivadas são formalizadas nos documentos canônicos. Scrum não elimina gates, rastreabilidade ou Definition of Ready.

## Contexto confirmado

- Aplicativo desktop local, offline, Windows-first e destinado inicialmente a um computador por instalação.
- Computador de trabalho com Windows 10, conta Windows exclusiva e sem restrições conhecidas de instalação ou mídia externa.
- Aproximadamente 80 pacientes existentes, crescimento de 30 a 40 pacientes por mês e cerca de 2.400 pacientes em cinco anos.
- O núcleo clínico deve funcionar sem servidor, hospedagem ou mensalidade obrigatória.
- Atualizações, recuperação remota de acesso e backup opcional em nuvem são evoluções futuras; não fazem parte do MVP e exigem análise e ADR próprios.

## Autoridade

- Amanda aprova necessidades clínicas, comportamento funcional e aceite.
- Maycon atua como Product Owner, responsável técnico e administrador de suporte.
- Mudanças relevantes de escopo são aprovadas conjuntamente.

## Espaços de trabalho

- Uma instalação poderá conter mais de um espaço de trabalho.
- O MVP implementará somente **Saúde**: pacientes, atendimentos, anamnese, antropometria, prescrições e cardápios individualizados.
- **Educação** abrangerá escolas, cardápios semanais, fornecedores, pedidos e gestão municipal de alimentos; é um domínio futuro com descoberta própria.
- O perfil profissional pertence ao usuário, não ao espaço de trabalho.

## Primeiro incremento aprovado

```text
primeiro acesso e autenticação → perfil profissional → espaço Saúde
→ cadastrar, localizar, abrir, editar, arquivar e restaurar paciente
→ auditar ações críticas → criar backup local e validar restauração
→ fechar e reabrir sem perda dos dados salvos
```

## Decisões principais

- Papéis: nutricionista e administrador.
- Ambos possuem acesso total por decisão dos aprovadores; ações administrativas e clínicas são auditadas.
- Senha mínima de oito caracteres, espera progressiva e bloqueio após uma hora de inatividade ou bloqueio do Windows.
- CPF, data de nascimento, telefone, e-mail e endereço são obrigatórios para paciente.
- CPF é único; arquivamento não exclui; paciente arquivado deve ser restaurado antes de novos registros.
- Tags predefinidas e criadas pela nutricionista são permitidas.
- Formulários longos podem usar rascunho protegido com salvamento aproximado a cada 30 segundos.
- Backup automático diário e manual, retenção de 60 dias, RPO de 24 horas e RTO até o próximo dia útil.
- Fluxos principais por teclado, ampliação de 200% e documentos A4.

## Pendências não bloqueantes do primeiro incremento

- Escolha entre pen drive e SSD externo.
- Fonte e estratégia de migração dos aproximadamente 80 pacientes.
- Refinamentos de impressão, tags e campos após Sprint Reviews.
- Descoberta do espaço Educação.
- Serviços futuros de atualização, recuperação remota e backup em nuvem.
