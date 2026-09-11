# Planning Review — Decision Review & Challenge

Data: 2026-09-10
Escopo: decisões, requisitos, arquitetura, segurança, operação e NFRs existentes.
Status: revisão crítica preparatória; nenhuma decisão canônica foi alterada.

> Atualização pós-review em 2026-09-11: RQ-001 e o risco de consulta incompleta foram superados por DEC-028 a DEC-037. A reavaliação sob DEC-038 está em [AUDIT-DECISION-REVIEW-2026-09-11.md](AUDIT-DECISION-REVIEW-2026-09-11.md), com D-AUTO-001 e D-AUTO-002 `AGENT-PROVISIONAL`. O corpo abaixo permanece preservado como registro histórico.

## Executive Summary

O projeto está em PLANNING e ainda não possui código. A maior parte das decisões de processo e escopo continua coerente com o produto local, offline e Windows-first. Porém, sete decisões devem ser reavaliadas antes da implementação:

1. DEC-010 — Git Flow com main e develop permanentes.
2. DEC-016 — acesso total para administrador e nutricionista.
3. DEC-017 — senha mínima de oito caracteres e espera progressiva.
4. DEC-022 — TBCA 7.3/TACO como base alimentar.
5. DEC-023 — conjunto de fórmulas, metas e ajustes energéticos.
6. DEC-025 — retenção indeterminada da auditoria.
7. DEC-026 — bloqueio de operação crítica quando a auditoria falha.

O ADR-0001 não é uma decisão de produção: permanece com evidência insuficiente e deve continuar restrito ao spike. Não há evidência forte suficiente para propor uma substituição arquitetural agora.

A sequência de risco principal é: consulta de auditoria incompleta → G2 incompleto → requisitos de segurança/backup ainda dependentes → spike arquitetural prematuro → implementação difícil de verificar.

## Decisions Reviewed

| Decisão | Classificação | Problema e evidência | Complexidade, risco e reversibilidade |
|---|---|---|---|
| DEC-001 novo repositório | KEEP | Isolar Desktop do Web pausado; contexto e decision log | Baixa complexidade, alta reversibilidade |
| DEC-002 pausar WebFit Web | KEEP WITH OBSERVATIONS | Evitar importar arquitetura legada; ciclo documental | Válida; preservar referências históricas |
| DEC-003 Tauri 2 | KEEP WITH OBSERVATIONS | Shell/empacotamento offline; ADR-0001 | Proposta de spike; dependência de WebView/instalador |
| DEC-004 React/TypeScript/Vite | KEEP WITH OBSERVATIONS | Interface desktop; ADR-0001 | Sem evidência de necessidade final; custo ainda desconhecido |
| DEC-005 SQLite local | KEEP WITH OBSERVATIONS | Um computador, volume de 2.400 pacientes; contexto/ADR | Proporcional; riscos em criptografia, migração e colaboração futura |
| DEC-006 Rust como fronteira | KEEP WITH OBSERVATIONS | Comandos, domínio e autorização; ADR-0001 | Segurança maior, mas contratos IPC e testes bilíngues |
| DEC-007 não importar arquitetura Web | KEEP | Evitar Supabase, RLS e localStorage como verdade | Baixa complexidade e baixo lock-in |
| DEC-008 importar comportamento validado | KEEP | Preservar valor sem dívida técnica antiga | Custo documental justificável |
| DEC-009 requisitos e gates | KEEP | Evitar hipóteses e manter aceite verificável | Custo controlável com LIGHT/STANDARD/STRICT |
| DEC-010 Git Flow permanente | REVISIT | Organizar branches/releases; só há decisão documental, sem CI/release | Pode criar overhead e divergência sem necessidade demonstrada |
| DEC-011 GitHub oficial | KEEP WITH OBSERVATIONS | Repositório/revisão futura; remote existente | Dependência operacional externa |
| DEC-012 Amanda/Maycon | KEEP WITH OBSERVATIONS | Separar aprovação funcional/técnica; contexto | Válido; bus factor e ausência de substituto não definidos |
| DEC-013 G1 MVP Saúde | KEEP WITH OBSERVATIONS | Fixar visão, domínio e limites; Gate G1 | Válido; primeiro incremento ainda é largo |
| DEC-014 Saúde/Educação | KEEP WITH OBSERVATIONS | Separar domínios futuros; contexto/modelo | Manter só Saúde; evitar abstração genérica precoce |
| DEC-015 perfil ligado ao usuário | KEEP | Autoria e auditoria; modelo conceitual | Baixa complexidade e boa reversibilidade |
| DEC-016 ambos com acesso total | REVISIT | Simplificar permissões; segurança reconhece RSK-008 | Alto blast radius e matriz de autorização incompleta |
| DEC-017 senha mínima de 8 | REVISIT | Barreira local + espera progressiva; security/rules | Suficiência sem MFA/recuperação não demonstrada |
| DEC-018 auth/auditoria/pacientes/backup | KEEP WITH OBSERVATIONS | Fundação vertical; escopo aprovado | Muitos riscos concentrados no primeiro slice |
| DEC-019 backup diário/manual, 60d, RPO/RTO | KEEP WITH OBSERVATIONS | Recuperação local; operations/context | Destino externo e RPO operacional ainda abertos |
| DEC-020 nuvem/sync fora do MVP | KEEP | Reduz exposição/custo; escopo/riscos | Reversível por novo ADR |
| DEC-021 prescrição sem PDF/exportação | KEEP WITH OBSERVATIONS | Valor clínico sem saída documental; status/scope | Escopo menor, mas cálculo é complexo |
| DEC-022 TBCA/TACO | REVISIT | Composição rastreável; regras/aprovação de Amanda | Fonte, licença, atualização e fallback não demonstrados |
| DEC-023 fórmulas e metas | REVISIT | Estimativas explicáveis; regras/testes aprovados | Alto impacto clínico e cobertura incompleta |
| DEC-024 autosave | KEEP WITH OBSERVATIONS | Evitar perda sem histórico clínico; rules/tests | Conteúdo protegido, expiração e falhas exigem desenho |
| DEC-025 auditoria indeterminada | REVISIT | Preservar evidência até política legal; status/rules | Privacidade, crescimento e retenção legal em aberto |
| DEC-026 auditoria fail-closed | REVISIT | Não concluir sem evento; RN-AUD/TA-AUD | Integridade forte, mas risco de indisponibilidade/lockout |
| DEC-027 arquivos posteriores | KEEP WITH OBSERVATIONS | Adiar domínio complexo; status/modelo | Bom recorte; backup/auditoria já criam acoplamento futuro |

## KEEP

### DEC-001, DEC-007, DEC-008 e DEC-009

Essas decisões resolvem isolamento, curadoria do legado, rastreabilidade e gates sem introduzir complexidade técnica relevante. Devem permanecer.

### DEC-015

V
incular perfil ao usuário favorece autoria, autorização e auditoria; permanece mesmo que o modelo de papéis seja revisado.

### DEC-020

Manter conectividade, nuvem e sincronização fora do MVP é coerente com operação local/offline. Só reabrir diante de requisito real e novo ADR.

## KEEP WITH OBSERVATIONS

### DEC-002

Manter a pausa do WebFit Web. O legado deve continuar como fonte histórica; correções no Web não são automaticamente correções do Desktop.

### DEC-003 a DEC-006 e ADR-0001

A composição é proporcional ao cenário conhecido, mas deve continuar como proposta de spike. Tauri exige validação de WebView2, instalador, atualização e IPC; React/TypeScript/Vite ainda não têm evidência de necessidade final; SQLite é adequado ao cenário atual mas concentra riscos de criptografia, migração, backup e futura colaboração; Rust protege a fronteira, porém acrescenta contratos, tratamento de erros e custo de onboarding.

O ADR-0001 é INSUFFICIENT EVIDENCE para decisão de produção. Deve comparar alternativas, avaliar proteção de chaves e produzir evidência antes de qualquer shell de aplicação.

### DEC-011 e DEC-012

Manter, mas decidir futuramente continuidade se um aprovador estiver indisponível, acesso ao repositório e registro de desacordos. Não inventar suplentes agora.

### DEC-013, DEC-014 e DEC-018

O escopo é coerente, mas o primeiro incremento reúne autenticação, dados clínicos, cálculos, auditoria e recuperação. Decompor em fatias verticais menores sem mover requisitos silenciosamente. Implementar só Saúde; não construir um framework genérico de Educação.

### DEC-019

A direção é adequada, mas backup automático depende da abertura do app, cópia externa mensal não garante sozinha RPO de 24 horas e proteção/destino ainda dependem do spike. Retenção de backup não resolve retenção clínica ou de auditoria.

### DEC-021

Excluir PDF/exportação reduz superfície, mas confirmar que exemplos, fontes, arredondamentos, alertas e falhas são suficientes para o primeiro aceite e que nenhum documento é requisito oculto.

### DEC-024

Manter autosave, fechando proteção em repouso, última versão válida, expiração sem apagar rascunho persistente, logout/reset/troca de usuário e ausência de conteúdo sensível em logs.

### DEC-027

Manter o recorte. O backup do primeiro incremento deve declarar que não cobre arquivos clínicos inexistentes; entidades e eventos futuros não autorizam schema ou migração agora.

## REVISIT

### DEC-010 — Git Flow com main e develop permanentes

#### Decisão atual

Adotar Git Flow com main e develop permanentes.

#### Problema que resolve

Organizar integração, releases e branches de trabalho.

#### Evidência existente

Há apenas registro documental; não há equipe distribuída, CI, aplicação ou cadência de release demonstrada.

#### Problemas encontrados

- Não há evidência de que develop permanente seja necessária.
- Branch longa aumenta merges, divergência e custo de manutenção.
- Não existe regra concreta ligando Spec, branch, commit e PR.
- Pode ter sido decidido cedo demais.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexidade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Manter Git Flow | Familiar; separa release/desenvolvimento | Merges e branches longas | Média; custo contínuo | Útil se releases formais surgirem |
| Trunk-based com branches curtas | Integração rápida e menos estado | Exige commits pequenos e gates fortes | Baixa; risco controlável | Proporcional a equipe pequena |
| main + branches de tarefa; release sob demanda | Simples e flexível | Menos prescritivo | Baixa; depende de disciplina | Permite formalizar depois |

#### Recomendação

Revisar antes da implementação. Considerar main protegida com branches curtas e release branch apenas quando houver necessidade real.

#### Confiança

ALTA para revisar; MÉDIA para a alternativa recomendada.

#### Decisão necessária

Maycon deve confirmar se colaboração e releases justificam develop permanente e atualizar DEC-010 se não justificarem.

### DEC-016 — acesso total

#### Decisão atual

Nutricionista e administrador têm acesso total.

#### Problema que resolve

Evitar matriz complexa de permissões no MVP.

#### Evidência existente

Aprovada por Maycon/Amanda; security.md reconhece maior impacto de comprometimento; RSK-008 está aceito para MVP.

#### Problemas encontrados

- “Acesso total” não define comandos administrativos, clínicos, backup, restauração e auditoria.
- Amplia dano de conta comprometida ou erro.
- RNF-SEG-002 exige testes negativos por papel embora os papéis tenham os mesmos poderes.
- Não há condição de revisão antes de dados reais.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexidade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Manter acesso total | Simples | Maior blast radius | Baixa; risco alto | Pode exigir migração futura |
| Admin administrativo; nutricionista clínico | Menor privilégio | Matriz e UX de autorização | Média; risco de regra incompleta | Melhor para assistente/múltiplos usuários |
| Capacidades explícitas por operação | Nega ações sensíveis sem RBAC completo | Pode virar matriz informal | Média; risco de inconsistência | Evolui para RBAC |

#### Recomendação

Revisar antes de G7 e definir no mínimo uma matriz explícita de capacidades. Não transformar acesso total em bypass de autorização backend.

#### Confiança

ALTA.

#### Decisão necessária

Amanda e Maycon devem aceitar formalmente o risco residual ou aprovar separação entre administração, clínica, reset, backup, restauração e auditoria.

### DEC-017 — senh
a mínima de oito caracteres

#### Decisão atual

Mínimo de oito caracteres, espera progressiva e sem bloqueio permanente automático.

#### Problema que resolve

Barreira mínima e redução de tentativas automatizadas locais.

#### Evidência existente

Security.md e business-rules.md; hash forte, salt e parâmetros versionados também estão aprovados.

#### Problemas encontrados

- A suficiência de oito caracteres não está demonstrada para dados de saúde sem MFA.
- Não há limite máximo, reutilização, troca, limpeza de senha temporária ou recuperação local.
- Espera progressiva não resolve acesso físico nem contas alternativas.
- Não há threat model que justifique o mínimo.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexidade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Manter 8 + espera | Simples e já aprovado | Depende de controles compensatórios | Baixa; risco residual maior | Pode exigir migração de política |
| Senha mais longa/frase-senha | Maior resistência | UX e recuperação | Baixa; baixo custo | Compatível com evolução local |
| Senha longa + proteção Windows | Combina fatores locais | Depende de configuração do dispositivo | Média; portabilidade menor | Pode melhorar uso Windows-first |

#### Recomendação

Revisar comprimento e recuperação local antes do spike. Manter espera como complemento, não como controle principal.

#### Confiança

MÉDIA sobre o mínimo; ALTA sobre a lacuna de recuperação.

#### Decisão necessária

Maycon e Amanda devem decidir o mínimo, recuperação local e controles compensatórios antes de dados reais.

### DEC-022 — TBCA 7.3/TACO

#### Decisão atual

TBCA 7.3 principal, TACO fallback, gramas canônicas e fonte/versão registradas.

#### Problema que resolve

Composição nutricional offline com rastreabilidade.

#### Evidência existente

Aprovação de Amanda, regras e testes de aceite.

#### Problemas encontrados

- Não há evidência suficiente sobre uso, licença, distribuição, manutenção e atualização.
- Fallback e conflitos entre bases não estão completos.
- Não está claro como preservar cálculos históricos após nova versão.
- A decisão pode ter fixado uma versão antes da validação operacional.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexidade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Bases embutidas e versionadas | Offline e reproduzível | Atualização e distribuição | Média; risco de catálogo desatualizado | Migrações de catálogo |
| Uma base aprovada | Menos conflitos | Menor cobertura | Baixa; risco de ausência | Atualização mais simples |
| Catálogo importável versionado | Atualiza sem trocar código | Importação e validação | Média/alta; risco de pacote inválido | Evolução melhor, operação maior |

#### Recomendação

Revisitar com pesquisa/spike específico sobre fonte, cobertura, uso, atualização, versionamento e reprodução histórica. Separar aprovação clínica de empacotamento técnico.

#### Confiança

ALTA para revisar; BAIXA para escolher alternativa sem pesquisa.

#### Decisão necessária

Amanda e Maycon devem aprovar fonte, versão, uso permitido, atualização e fallback.

### DEC-023 — fórmulas e metas

#### Decisão atual

Harris-Benedict revisada, EER/DRI 2023, 7.800 kcal/kg configurável, metas, alertas e substituição manual rastreável.

#### Problema que resolve

Estimativas energéticas explicáveis e metas com histórico.

#### Evidência existente

Aprovação de Amanda, regras numeradas e casos de aceite.

#### Problemas encontrados

- Aprovação de domínio não substitui validação independente.
- Populações, unidades, entradas ausentes, sexo/gênero, gestação/lactação e condições especiais exigem cobertura explícita.
- Coeficiente configurável precisa de governança, versão e aprovação.
- Não há política de atualização e comparação de protocolos.
- “Estimativa” não define sozinha uso seguro.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexidade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Implementar todo conjunto aprovado | Entrega valor | Muitos edge cases | Alta; risco clínico alto | Pode cristalizar regras |
| Cálculo manual rastreado primeiro | Menor risco de automação | Menor valor e mais trabalho | Baixa/média; risco manual | Permite adicionar protocolos |
| Protocolo versionado com casos fechados | Reproduzibilidade e testes | Escopo inicial menor | Média; risco controlável | Melhor evolução |

#### Recomendação

Revisar o desenho antes da implementação. Exigir protocolo versionado, casos de referência, validação independente, entradas ausentes e aprovação para mudar coeficientes. Considerar primeira fatia com protocolo fechado.

#### Confiança

ALTA para validação adicional; BAIXA para recomendar fórmula substituta.

#### Decisão necessária

Amanda deve confirmar protocolos, população, unidades, exceções e autoridade de mudança; Maycon deve definir persistência, testes e auditoria da versão.

### DEC-025 — retenção indeterminada da auditoria

#### Decisão atual

Eventos permanecem indefinidamente, sem exclusão automática, até política legal.

#### Problema que resolve

Preservar evidência antes de decidir retenção.

#### Evidência existente

Status, regras e TA-AUD-002; RSK-012 mantém política legal aberta.

#### Problemas encontrados

- “Indeterminado” já é uma decisão operacional real.
- Pode aumentar exposição, custo, backup e impacto de incidente.
- Pode conflitar com minimização, retenção legal e titular.
- Não há política de acesso, volume, indexação ou prazo de revisão.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexi
dade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Manter indeterminado | Preserva evidência | Risco legal e crescimento | Baixa; privacidade maior | Migração de retenção depois |
| Retenção aprovada | Mais previsível | Exige decisão legal | Baixa; risco depende da política | Facilita operação |
| Arquivo imutável separado | Integridade e separação | Mais storage/acesso | Média; restauração mais complexa | Suporta longo prazo |

#### Recomendação

Manter imutabilidade, mas marcar retenção como provisória e bloqueadora para dados reais. Definir acesso, volume, backup e prazo de revisão antes de G7.

#### Confiança

ALTA.

#### Decisão necessária

Maycon e Amanda, com assessoria adequada, devem aprovar retenção, acesso, eliminação/anonimização quando aplicável e prazo de revisão.

### DEC-026 — falha de auditoria bloqueia operação crítica

#### Decisão atual

Operação crítica e login bem-sucedido só concluem após persistir evento obrigatório.

#### Problema que resolve

Não permitir sucesso sem evidência.

#### Evidência existente

Status, RN-AUD-004 e TA-AUD-003.

#### Problemas encontrados

- Disco cheio, corrupção ou permissão podem bloquear login e recuperação.
- Diagnóstico e correção segura não estão definidos.
- Mudança e auditoria exigem atomicidade real.
- Fila local pode reduzir indisponibilidade, mas cria risco de perda/duplicidade.

#### Alternativas

| Alternativa | Vantagens | Desvantagens | Complexidade, risco e custo | Impacto futuro |
|---|---|---|---|---|
| Fail-closed transacional | Integridade forte | Indisponibilidade sob falha | Média; risco operacional alto | Exige recuperação |
| Outbox/spool durável | Tolera falha temporária | Intervalo sem evento confirmado | Média/alta; duplicidade | Exige idempotência |
| Fail-closed + modo diagnóstico | Protege e permite reparar | Modo especial é superfície adicional | Média; risco controlável | Melhor suporte |
| Permitir com aviso | Disponibilidade | Lacuna de auditoria | Baixa; risco alto | Difícil demonstrar conformidade |

#### Recomendação

Manter fail-closed como princípio para ações críticas, mas definir diagnóstico mínimo, recuperação e testes de disco cheio, corrupção, permissão e interrupção. Não permitir bypass manual genérico.

#### Confiança

ALTA para revisar recuperação; MÉDIA para aplicar a mesma regra a todo fluxo.

#### Decisão necessária

Maycon e Amanda devem decidir operações críticas, atomicidade, modo de recuperação e evidência para liberação a dados reais.

## SUPERSEDE CANDIDATES

Nenhum neste momento. Há razões para reavaliar, mas não evidência para afirmar que Tauri, SQLite, Rust, GitHub, TBCA/TACO ou outra solução deve ser substituída. Substituir sem spike/pesquisa/aprovação criaria decisão silenciosa.

## Requirements Questions

Registrar como REQUIREMENT QUESTION; não alterar automaticamente.

### RQ-001 — Consulta de auditoria

RF-AUD-001 está em revisão e o caso de uso correspondente está pendente na matriz. Definir filtros, ordenação, volume/paginação, resolução autorizada do identificador, entidade não encontrada, papéis e metadados exibidos.

### RQ-002 — Primeiro incremento e arquivos

Arquivos estão fora do primeiro incremento, mas aparecem em auditoria, backup, segurança, modelo e ADR. Declarar se o backup atual cobre banco/rascunhos apenas ou arquivos existentes. Tornar auditoria de entidades futuras condicional.

### RQ-003 — Acesso total

RNF-SEG-002 exige teste negativo por papel, mas ambos têm acesso total. Definir comandos comuns, administrativos, clínicos, backup, restauração e recuperação; decidir se acesso total inclui todos.

### RQ-004 — Cadastro mínimo

RN-PAT-001 torna nome, CPF, telefone, nascimento, e-mail e endereço obrigatórios. Registrar justificativa de cada obrigatoriedade e o fluxo, se houver, para ausência de contato/endereço.

### RQ-005 — Fórmulas

RF-PRE-005 precisa declarar entradas ausentes, limites, unidades, idades, sexo/gênero, gestação/lactação, condições especiais e autoridade para alterar protocolos/coeficientes.

### RQ-006 — Autosave

Definir comportamento após desativação, perda de acesso, restauração, troca de computador e usuário. Definir proteção do conteúdo em repouso.

### RQ-007 — Backup

Definir destino, mídia, proteção, versão compatível, espaço insuficiente, app fechado e recuperação de chave. Confirmar se RTO inclui reinstalação e arquivos futuros.

### RQ-008 — Falhas de auditoria

Definir diagnóstico seguro e como registrar falhas quando o próprio armazenamento da auditoria está indisponível, sem bypass.

### RQ-009 — Git Flow

Confirmar se main/develop permanente é requisito de equipe/release ou preferência de processo; definir proteção, revisão e vínculo Spec/commit/PR.

## Missing Non-Functional Requirements

Registrar como NOT YET DEFINED; não inventar metas.

### Segurança e privacidade

- Proteção contra acesso físico e relação com conta/dispositivo Windows.
- Recuperação local sem senha mestra.
- Limite máximo, troca, reutilização e senha temporária.
- Chave, rotação, backup e recuperação de chave.
- Dados em memória, dumps e arquivos temporários.
- Exportação, correção, eliminação/anonimização e retenção legal.

### Disponibilidade e recuperação

- Comportamento com app, banco, disco ou permissão indisponível.
- Tempo de recuperação de chave/reinstalação dentro do RTO.
- Backup quando computador está desligado.
- Compatibilidade de restauração entre versões e rollback.
- Interrupção durante publicação atômica.

### Observabilidade e diagnóstico

- Logs técnicos locais seguros, níveis, rotação e retenção.
- Diagnóstico de auditoria
, backup, migração, espaço e permissão.
- Correlation ID técnico sem conteúdo sensível.
- Evidência de suporte sem envio de dados clínicos.
- Telemetria remota não deve surgir sem nova decisão.

### Evolução e capacidade

- Compatibilidade de banco, migração, rollback e instalador.
- Matriz de versões Windows e dependências offline.
- Volume de prescrições, versões, auditoria, rascunhos e backups.
- Tempo/tamanho máximos de backup e restauração.
- Crescimento da auditoria indeterminada.

### Operação, custo e acessibilidade

- Custo/disponibilidade de mídia externa, certificado e suporte.
- Responsabilidade por backup externo e incidentes.
- Critérios com tecnologias assistivas e WebView2.
- Localização, datas/números e idioma além do contexto atual.

RNF-DES-001 a RNF-DES-003 têm metas, mas protocolo de medição, repetição, variação e aprovação ainda precisam ser operacionalizados. RNF-DOC-001 continua proposto.

## Contradictions

1. Uma frase histórica do contexto coloca prescrições/cardápios entre incrementos posteriores, enquanto status e escopo aprovam esse módulo no primeiro incremento.
2. Arquivos estão fora do primeiro incremento, mas aparecem em auditoria, backup, segurança, modelo e ADR.
3. Auditoria indeterminada é aprovada provisoriamente enquanto a política legal continua aberta.
4. RPO de 24 horas depende de backup diário, mas o automático ocorre na próxima abertura; cópia externa mensal não garante sozinha o RPO.
5. RNF-SEG-002 pede teste negativo por papel, embora os papéis tenham acesso total.
6. RNF-DOC-001 está proposto e PDF/exportação estão fora do primeiro incremento; deve permanecer condicional.
7. Git Flow registra main/develop, mas o estado operacional mostra apenas main e nenhum release/CI demonstrado.

## Architectural Risks

- ADR-0001 pode virar implementação por inércia antes do spike.
- Tauri/WebView/Rust cria superfície IPC sem contrato executável.
- SQLite concentra riscos de criptografia, chave, migração, restauração e futura sincronização.
- Espaços/memberships podem antecipar abstração de Educação.
- Auditoria transacional e autosave exigem atomicidade, concorrência e recuperação.
- Filesystem e banco podem divergir sem publicação/backup conjunto correto.
- Catálogo e fórmulas criam dependência de dados versionados e validação clínica.
- Upgrade, compatibilidade de schema e rollback não estão definidos.
- Auditoria, rascunhos e backups não têm limites operacionais.
- Prescrição, backup e auditoria no mesmo incremento ampliam caminho crítico.

## Product Risks

- Primeiro incremento grande demais, especialmente por incluir cálculos clínicos.
- Acesso total conflita com futura expectativa de assistente/segregação.
- CPF, telefone, e-mail e endereço obrigatórios podem bloquear adoção sem justificativa explícita.
- Sem migração dos 80 pacientes, valor de adoção inicial pode ficar abaixo do esperado.
- Backup exige disciplina do usuário e experiência de verificação ainda incompleta.
- Consulta de auditoria crítica ainda não está fechada.
- Fórmulas/base alimentar podem tornar a feature clínica de alto risco.

## Security Considerations

- Provar proteção de banco, arquivos, rascunhos, assinatura e backups antes de G7.
- Acesso total nunca pode virar ausência de autorização backend.
- Definir recuperação local sem senha mestra.
- Dados sensíveis não devem aparecer em logs, diagnósticos, dumps ou evidence reports.
- Falha de auditoria precisa de recuperação segura sem lockout irrecuperável.
- Testar corrupção, disco cheio, permissão, interrupção e restauração com dados fictícios.
- Retenção indeterminada é provisória e não solução legal.
- Mantis só quando houver código executável em ambiente isolado; não fabricar findings.

## Decisions Requiring Human Approval

1. DEC-010: Git Flow ou fluxo simples de branches.
2. DEC-016: acesso total ou matriz mínima de capacidades.
3. DEC-017: mínimo de senha e recuperação local.
4. DEC-022: fonte, versão, uso permitido, atualização e fallback alimentar.
5. DEC-023: protocolos, casos, entradas, coeficientes e governança clínica.
6. DEC-025: retenção e acesso da auditoria.
7. DEC-026: fail-closed, transação e modo de recuperação.
8. RQ-001 a RQ-009 antes de G2/G3.
9. NFRs de chaves, recuperação, compatibilidade, observabilidade e backup antes de G4/G7.

## Recommended Decision Order

1. Fechar RF-AUD-001, caso de uso, TA-AUD e filtros/ordenação.
2. Normalizar a fronteira do primeiro incremento: arquivos, PDF/exportação e backup.
3. Decidir autorização e risco de acesso total.
4. Fechar retenção, acesso e recuperação da auditoria.
5. Fechar senha, recuperação local e proteção de chaves.
6. Validar fonte e governança do catálogo alimentar.
7. Validar protocolos e casos de referência energéticos.
8. Definir NFRs de upgrade, observabilidade, capacidade, backup externo e operação.
9. Reavaliar Git Flow com base em equipe e releases.
10. Executar o spike do ADR-0001 com matriz de decisão.
11. Atualizar ADR, plano, riscos e Gate G3 com a evidência.
12. Só então iniciar implementação vertical aprovada.

## Conclusão

O projeto não precisa de uma troca arquitetural imediata. Precisa fechar decisões de produto, segurança e operação antes de cristalizar a proposta técnica em código.

O próximo passo de maior valor é concluir a consulta de auditoria e resolver autorização, retenção e recuperação de falha antes do spike.
