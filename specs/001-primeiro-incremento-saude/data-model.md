# Data Model: Primeiro incremento de Saúde

**Status**: modelo conceitual para design; não é schema aprovado nem autoriza migration.

## Bounded contexts

- **Identidade**: usuário, papel, sessão e credencial protegida.
- **Saúde**: espaço, perfil profissional, paciente, tags, rascunhos e prescrição.
- **Auditoria**: eventos imutáveis e consulta autorizada.
- **Recuperação**: pacote de backup, manifesto, checksum e resultado de restauração.

Educação não compartilha automaticamente entidades clínicas e não aparece neste modelo.

## Entities

### Usuário local

- Identidade estável, papel controlado, estado de primeiro acesso e parâmetros versionados da credencial.
- Relação: possui perfil, sessões e eventos de usuário.
- Regras: somente administrador ou nutricionista; senha nunca persiste em texto claro.

### Sessão

- Referência do usuário, início, último uso, expiração, encerramento e motivo de bloqueio.
- Estados: ativa, encerrada, expirada e bloqueada.
- Regras: expira após uma hora de inatividade e reage ao bloqueio do Windows.

### Perfil profissional

- Nome completo, nome profissional, CRN, região, e-mail, telefone, endereço, cargo, local de trabalho, logotipo e assinatura.
- Relação: pertence ao usuário; recursos privados exigem autorização.
- Regras: obrigatórios e opcionais seguem RF-CLI-001.

### Espaço Saúde

- Identidade e estado do espaço autorizado.
- Relação: contém pacientes, tags, rascunhos e prescrições.
- Regra: é o único espaço disponível no incremento.

### Paciente

- Nome civil, nome social opcional, CPF normalizado, telefone, nascimento, e-mail, endereço, sexo, gênero, responsável legal, observações, situação e datas de ciclo de vida.
- Relação: pertence ao espaço; pode possuir tags e prescrições.
- Estados: ativo e arquivado.
- Regras: CPF válido e único no espaço, arquivamento não destrutivo e restauração antes de novos registros.

### Tag de paciente

- Identidade, nome, estado ativo/desativado e datas de ciclo de vida.
- Relação: associação muitos-para-muitos com pacientes, preservando referências históricas.
- Regra: renomear/desativar não apaga histórico.

### Rascunho automático

- Usuário, espaço, tipo de formulário, referência temporária, conteúdo protegido, última gravação e expiração.
- Estados: disponível, recuperado, descartado e expirado.
- Regras: aproximadamente 30 s, antes de navegação segura, somente autenticado, remoção após 30 dias; não se aplica a senha, login, administração, confirmação ou backup.

### Prescrição

- Paciente, autor, espaço, objetivo, orientações, estado, versão, referência anterior, motivo de cancelamento e dados de cálculo.
- Estados: rascunho, finalizada, substituída e cancelada.
- Relação: contém refeições, itens, composição e metas.
- Regras: versão finalizada é imutável; correção cria versão derivada; cancelamento exige motivo.

### Refeição, item alimentar e alimento

- Ordem e identificação da refeição; alimento oficial ou personalizado; quantidade canônica em gramas; medida caseira quando convertida; fonte e versão; composição por 100 g.
- Regras: TBCA 7.3 é fonte principal, TACO é fallback explícito, alimento personalizado preserva origem e não altera oficial.

### Cálculo de composição e metas

- Valores calculados, unidade, protocolo, referência, versão, entradas, origem automática/manual, alertas e observação de ajuste.
- Regras: precisão interna, arredondamento somente na exibição, protocolos aprovados, limites e entradas obrigatórias validados.

### Evento de auditoria

- Tipo de ator, referência de usuário quando aplicável, instante UTC, espaço, ação, tipo/ID de entidade, resultado e motivo seguro.
- Relação: associado a operações críticas e consultas autorizadas.
- Regras: imutável, retenção indeterminada no MVP, sem senha, CPF completo, conteúdo clínico, snapshots ou before/after.
- Consulta: janela padrão de 30 dias, intervalo semiaberto, filtros AND, máximo 50 por página e cursor estável.

### Pacote de backup

- Versão, instante de criação, manifesto, snapshot, arquivos, checksums, resultado e diagnóstico seguro.
- Estados: em criação, válido, inválido e restaurado.
- Regras: publicação atômica, retenção de válidos por 60 dias, validação antes de rotação, restauração em área temporária e confirmação explícita.

## Cross-entity invariants

- Toda entidade funcional pertence ao espaço Saúde ou ao usuário apropriado.
- Paciente arquivado não recebe novo registro até ser restaurado.
- Operação crítica sem auditoria obrigatória persistida não conclui.
- Restauração inválida nunca substitui o estado atual.
- Datas civis são preservadas como datas; instantes são UTC.
- Dados e identificadores usados no design, testes e evidências são fictícios.

## State transitions

~~~text
Paciente: ativo -> arquivado -> ativo
Rascunho automático: disponível -> recuperado | descartado | expirado
Prescrição: rascunho -> finalizada -> substituída
Prescrição: rascunho/finalizada -> cancelada (motivo obrigatório)
Backup: em criação -> válido | inválido