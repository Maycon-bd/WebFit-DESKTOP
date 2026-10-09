# Interface de trabalho

Marca do sistema: símbolo sem texto em public/brand/webfit-icon.png, RF-UX-004/DEC-056, aplicação local autorizada em 2026-10-08. Acesso, lateral, informações e recursos nativos usam a mesma identidade. Guia: docs/ux/system-branding.md. Logo profissional permanece separado.

Direção técnica dentro da UX aprovada: aplicação de operação, sem telas promocionais. Barra lateral recolhível pelo hambúrguer, com Consultório, Dashboard e Pacientes; nome do usuário abre Acesso e Perfil profissional, engrenagem adjacente abre Configurações com Auditoria e Backup e restauração (RF-UX-003/DEC-055). Recolhida, toda a lateral desaparece e o hambúrguer permanece no conteúdo para reabri-la, preservando tela e campos. Estado transitório, aberto a cada sessão. Conteúdo central com lista pesquisável ou formulário único. Fundo claro quente, texto escuro, verde escuro para ação primária, fonte Segoe UI nativa do Windows. Sem imagens externas ou dependência de rede. Ação principal evidente, erros junto ao formulário, preservação do texto digitado, confirmação de arquivamento/restauração. Não altera campos nem fluxos aprovados.

## Padrão de formulários — RF-UX-007

Todos os formulários atuais e futuros usam `src/FormField.tsx` para apresentar rótulos, obrigatoriedade já definida e erros de validação inline. Só campos exigidos pela regra existente exibem `*`; campos opcionais não usam o sufixo “(opcional)”. Após tentativa de envio inválida, controles e rótulos afetados ficam em vermelho, com mensagem segura associada ao campo; corrigir um campo limpa somente o próprio erro. Formulários novos devem reutilizar o componente e adicionar regressão para envio inválido e correção. Grupos de controles customizados seguem o mesmo padrão sem alterar suas regras.

Todos os campos de data usam `src/DateField.tsx`: datas simples têm edição e apresentação `DD/MM/AAAA`, calendário navegável por teclado e valor ISO civil `AAAA-MM-DD` no contrato do formulário; data e hora usam o modo nativo `datetime-local` do mesmo componente. O componente integra-se a `FormField` para obrigatoriedade e mensagens inline.

## Dashboard — RF-UX-008 / WEBFIT-17

Dashboard é a entrada do Consultório e destino do símbolo WebFit. A referência fornecida por Maycon orienta header, quatro indicadores, gráfico principal e painel secundário: superfícies brancas, bordas suaves e raio 16px, mantendo Segoe UI, verde e fundo do produto. Período seis/doze meses pertence ao gráfico, cartões explicitamente globais; contagens alinhadas e tabulares, sem tendências fictícias. Estados vazio/erro/carregando, tabela alternativa e atalhos existentes. Componentes próprios sem plataforma especulativa de widgets; novos módulos acrescentam indicadores com requisito aprovado.

O histórico anual de consultas (TA-DASH-006..008) usa painel claro, título e filtro por ano, meses Jan–Dez com linhas suaves de guia. Enquanto consultas não são registradas nesta versão, apresenta mensagem central de indisponibilidade sem barras ou zeros de atendimento. Mantém os demais indicadores e segue `FormField` no filtro de ano. RF-AGE-001 futuro alimentará histórico mediante requisito próprio.
