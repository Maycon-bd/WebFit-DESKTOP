---
target: WebFit instalado 0.1.9-pilot.16.1, audit visual
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:D:\\MAYCON\\PROJETOS\\WebFit-DESKTOP\\.artifacts\\ui-audit\\2026-10-08\\source\\App.tsx"
target_fingerprint: "sha256:d595aa2ae3f23da1ea17fa7fdab9bded6699a0dfed47474925d300a1f541cb4e"
target_path: "D:\\MAYCON\\PROJETOS\\WebFit-DESKTOP\\.artifacts\\ui-audit\\2026-10-08\\source\\App.tsx"
timestamp: 2026-10-08T18-50-31Z
slug: artifacts-ui-audit-2026-10-08-source-app-tsx
---
Método: dois agentes independentes — A /root/visual_current; B /root/audit_current. Root conduziu a inspeção nativa; agentes avaliaram capturas e source sem compartilhar findings antes do término de A.

# Critique e audit visual — WebFit 0.1.9-pilot.16.1

Data: 2026-10-08. Plataforma: aplicação instalada Windows/Tauri/WebView2, modo Operate. Versão conferida no ProductVersion/FileVersion do executável instalado. Fonte de comparação: commit 680fad5616d54a895dbecc6702595a1b5d232cfd, copiado com git show para .artifacts/ui-audit/2026-10-08/source. O checkpoint associa o piloto 16 a esse commit; não se afirma equivalência byte a byte entre source e binário. O workspace contém mudanças posteriores de ativação offline/branding que não foram tratadas como UI do piloto. Git somente leitura; branch main; trabalho preexistente preservado.

## Conclusão

A interface tem identidade, legibilidade e calma adequadas ao consultório offline. Marca, paleta e estrutura devem ser preservadas. O próximo ganho está na clareza do preenchimento e no uso da altura disponível. Esta revisão não recomenda um redesenho amplo.

O login funciona como acolhimento; configurações e lista vazia têm orientação clara. O cadastro perde eficiência pela quantidade de faixas antes do formulário, e faltam sinais uniformes de obrigatoriedade. O rascunho protege o trabalho, mas o modal força uma escolha mesmo quando a pessoa entrou por engano.

## Cobertura observada

- Login antes da autenticação; autenticação feita por Maycon, sem senha fornecida ao agente.
- Lista de pacientes vazia, cadastro com rascunho preexistente, ações do formulário, configurações, backup, auditoria, menu da conta e perfil.
- Escape no modal de recuperação manteve o modal aberto. Restaurar preencheu o cadastro e colocou foco em Nome completo; o agente não modificou o preenchimento.
- Recolher/reabrir menu funcionou. Um Tab após recolher menu produziu foco visível no botão Ver tutorial.
- Duas variantes de atalho de ampliação não produziram mudança visual. Não há confirmação de 200% nem de 1366×768.
- Aplicativo devolvido à lista de pacientes, menu aberto, sem salvar/descartar cadastros. Não foram acionados backup manual, restauração de banco ou atualização. A navegação e o login podem gerar eventos normais/backup automático previstos no produto.

Foram arquivadas 16 capturas PNG e árvores acessíveis em .artifacts/ui-audit/2026-10-08. A maioria das capturas tem 1202×832; uma lista inicial foi capturada em 1758×942. Isso não equivale ao ensaio exigido em 1366×768. Árvores capturadas imediatamente após algumas navegações estavam transitórias; screenshots e observações posteriores foram usados em conjunto, sem inferir defeito do produto a partir da defasagem da ferramenta.

NOT RUN: lista populada, prescrição/energia/TBCA na UI (não há paciente persistido), envio/validação de formulários, erros de backend, corrida de salvamento, NVDA, fluxo integral somente por teclado, backup/restauração/update e 200%. Não foi criado paciente para completar cobertura. Achados antigos que dependem dessas fronteiras não foram automaticamente promovidos a findings verificados nesta versão.

## Critique — 26/40

| Heurística | Nota /4 | Evidência |
|---|---:|---|
| Visibilidade do estado | 2 | Mensagens globais; autosave sem confirmação junto às ações |
| Correspondência com mundo real | 3 | Linguagem apropriada; alguns termos/identificadores técnicos |
| Controle e liberdade | 2 | Retorno disponível; decisão obrigatória sobre rascunho |
| Consistência | 3 | Paleta/campos coerentes; Escape varia conforme superfície |
| Prevenção de erros | 2 | Obrigatoriedade pouco explícita |
| Reconhecimento | 3 | Títulos e busca claros; conta tem pouca indicação de expansão |
| Flexibilidade e eficiência | 2 | Menu recolhível; ações do cadastro ao final |
| Estética e minimalismo | 3 | Limpo, mas cabeçalho ocupa muita altura |
| Recuperação de erros | 3 | Rascunho com foco correto; feedback global requer ensaio |
| Ajuda | 3 | Tutoriais e instruções locais; orientação de campos/tags incompleta |
| **Total** | **26/40** | **Melhorias de interação, preservando identidade** |

## Audit — 13/20

| Dimensão | Nota /4 | Evidência e limite |
|---|---:|---|
| Acessibilidade | 2 | Labels/foco presentes; contraste de contornos/foco insuficiente |
| Performance | 3 provisória | Debounce/resultados limitados; runtime/bundle não medidos |
| Tokens e tema | 2 | Base coerente, tokens parciais e cores literais |
| Responsividade | 3 provisória | Menu/grids flexíveis; 200% não verificados |
| Integridade | 3 | Sistema consistente; lacunas de comunicação/tradução |
| **Total** | **13/20** | **Aceitável, com cobertura limitada** |

Detector executado uma vez no snapshot de source: exit 0, JSON [], zero findings/regras/localizações/falsos positivos. Não certifica WCAG nem ausência de defeitos. Sem overlay ou console injetado, pois inspeção nativa não oferece injeção no DOM; não houve navegador ou live server. Não se penalizou ausência de dark mode ou mobile.

## Achados consolidados

### V01 [P1] Contraste do foco e dos contornos

Local: source/style.css:54 e :67; 01-login,05-patient-restored e15-keyboard-focus. Foco #8fb19e tem 2,35:1 contra branco e 2,16:1 contra #f5f6f2; contorno #a9b8ac tem 2,07:1 e1,91:1 respectivamente. O foco é visível, mas insuficientemente distinguível para baixa visão. Criar tokens de foco/contorno com pelo menos 3:1 nos fundos usados. WCAG1.4.11: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html. Categoria acessibilidade. Comando: impeccable colorize ou harden. Texto principal/secundário e botão primário passaram nos pares calculados; separadores decorativos não foram tratados como falha.

### V02 [P2] Campos obrigatórios sem convenção uniforme

Local: source/App.tsx:1295,1302,1335–1344;05-patient-restored e13-profile. Alguns rótulos dizem opcional, mas obrigatórios não são sinalizados e Sexo não tem required nem indicação de opcional. A pessoa precisa descobrir a regra ao tentar salvar. Adotar indicação visual/textual consistente, exemplos de formato e nome acessível correspondente, sem mudar a obrigatoriedade aprovada. Categoria UX/acessibilidade; referência3.3.2: https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html. Comando: impeccable clarify. Não houve submissão para verificar erro nativo/backend.

### V03 [P2] Feedback longe das ações

Local: source/App.tsx:266,273,755–765,1490;06-patient-actions. Salvar fica no rodapé, mas erro/sucesso/progresso global aparecem antes do conteúdo. task atualiza erro sem scroll/foco de correção. Risco: não enxergar feedback ao enviar no final do formulário. Mostrar feedback junto às ações e associar validação aos campos/resumo. Comando: impeccable harden. Risco inferido por source e geometria, não erro reproduzido.

### V04 [P2] Cabeçalho consome área de trabalho

Local: source/App.tsx:732,749,752; source/style.css:222,228,841;05-patient-restored,08-backup,13-profile. Menu, tutorial, aviso e título ocupam faixas sucessivas; no cadastro o primeiro campo aparece aproximadamente a430px na captura1202×832. Reduzir margens e alinhar menu/tutorial numa faixa; preservar aviso de ambiente fictício e formulário único. Ações do cadastro podem ficar mais próximas sem encobrir campos. Categoria composição/eficiência. Comando: impeccable layout. Observação visual, sem falha a200% presumida.

### V05 [P2, proposta de UX] Sem saída neutra da recuperação

Local: source/DraftRecoveryDialog.tsx:38;03-patient-new e04-draft-escape. Modal exige Restaurar ou Descartar; Escape é impedido. Restaurar depois voltar é saída possível, portanto não é bloqueio total nem P0. O fluxo binário atende a RF-DRF-002/WEBFIT-7; a crítica identifica um custo de controle, não uma violação automática do requisito. Considerar Voltar à lista preservando rascunho, sujeito a decisão de comportamento. Nunca associar Escape a descarte silencioso. Comando: impeccable harden após escolha funcional. Na síntese, prioridade reduzida de P1 sugerida por A para P2 pela existência de saída segura e pela restrição aprovada.

### V06 [P2] Cancelar edição preserva rascunho sem explicar

Local: source/App.tsx:1495 e879. O callback salva preenchimento dirty antes de sair. Label pode ser entendido como descarte, mas conteúdo reaparece na recuperação. Tornar a retenção explícita em texto/feedback ou alinhar comportamento ao fluxo aprovado. Categoria clareza. Comando: impeccable clarify. Consequência verificada por source, não ensaiada com novas alterações.

### V07 [P2] Eventos de atualização aparecem em inglês técnico

Local: source/App.tsx:82,2232,2238; árvore12-account-menu.txt. UPDATE_INSTALL_START e UPDATE_PREPARE foram observados na árvore nativa porque faltam no mapa de traduções. Usar descrições em português na lista, mantendo identificador técnico em detalhe quando útil. Categoria integridade/UX. Comando: impeccable clarify.

### V08 [P2] Tags sem explicação contextual

Local: source/App.tsx:1398,1457,1462,1479;06-patient-actions. Organização do acompanhamento começa com Nova tag/Criar tag sem indicar finalidade ou exemplo. Oferecer explicação curta baseada na função aprovada; não inventar categorias clínicas. Categoria clareza/carga cognitiva. Comando: impeccable clarify.

Contagem:8 achados; P0=0,P1=1,P2=7,P3=0. Prioridades são avaliação do agente, não aceite humano. Tokens parciais e descoberta do menu da conta são observações secundárias, não contadas novamente.

## Pontos fortes e jornada

- Marca/paleta adequadas, login com proposta local clara e Lembrar de mim explicando que só o nome é salvo.
- Lista vazia orienta a próxima ação; Configurações reduz opções a duas ferramentas descritas. Menu recolhível libera área, com reabertura disponível.
- Recuperação contextual remove lista global e mostra quando o preenchimento foi salvo; restauração coloca foco no nome. Backup explica validação e preservação do estado atual.
- Labels nativos, landmarks e mensagens anunciáveis presentes; navegação de perfil agora carrega dentro de task. O antigo finding de API de perfil fora do wrapper não se aplica a este snapshot. navigationFocus também existe; não se repete a afirmação antiga de ausência absoluta de gestão de foco.

Carga cognitiva moderada no cadastro: agrupamento visual existe, mas nove campos de identificação e obrigatoriedade pouco explícita aumentam hesitação. Auditoria tem seis filtros, aceitáveis para ferramenta secundária, mas pode ser agrupada por intenção. Não aplicar um limite mecânico de quatro opções a tabelas/resultados.

Alex se beneficia da busca e menu recolhível, mas percorre formulário longo. Jordan hesita em obrigatórios/tags e entende Cancelar como descarte. Sam tem foco observável no campo restaurado e no botão tutorial, mas contraste fraco e descoberta de erros precisam ser corrigidos/testados. Login acolhe; modal de recuperação cria decisão forçada; backup devolve confiança. Fim do cadastro não ensaiado.

## Propostas de próximo recorte

Corrigir contraste com colorize/harden; esclarecer campos/cancelamento/eventos/tags com clarify; compactar cabeçalho com layout; discutir saída neutra da recuperação; polish após correções. São recomendações, sem implementação nesta auditoria.

Questões: priorizar acessibilidade e clareza ou compactação e eficiência? Para recuperação, manter decisão binária atual ou oferecer Voltar à lista preservando o rascunho? A segunda opção altera comportamento e requer decisão explícita.

As notas anteriores24/40 e12/20 pertencem a outro piloto/cobertura. A comparação26/40 e13/20 não é medição controlada de evolução.
