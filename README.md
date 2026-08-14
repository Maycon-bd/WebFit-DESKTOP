# WebFit Desktop

Aplicativo desktop local e offline para gestão de consultório e acompanhamento nutricional. A direção inicial é Windows-first, para uso em um único computador, sem hospedagem ou mensalidade obrigatória.

## Estado atual

O projeto está no **Ciclo 0 — Descoberta e baseline**. Não há aplicação, dependências ou funcionalidades implementadas. A combinação Tauri 2, React, TypeScript, Vite, Rust e SQLite é uma proposta autorizada somente para spike; ainda não é uma arquitetura comprovada para produção.

O [Gate G1 — Visão aprovada](docs/project/development-lifecycle.md#gate-g1--visão-aprovada) permanece pendente. Nenhum código do WebFit Web deve ser copiado e nenhum requisito deve ser implementado antes das aprovações previstas no ciclo de desenvolvimento.

## Navegação

- [Índice da documentação](docs/README.md): ponto de entrada para toda a documentação canônica.
- [Contexto e decisões iniciais](docs/project/context.md): problema, direção, hipóteses e decisões já registradas.
- [Ciclo de desenvolvimento](docs/project/development-lifecycle.md): gates, entregáveis, IDs e estrutura documental.
- [Escopo candidato](docs/product/scope.md): itens ainda sujeitos a validação no Gate G1.
- [Registro de decisões](docs/project/decision-log.md): decisões vigentes e questões pendentes.
- [Registro de riscos](docs/project/risk-register.md): riscos, respostas e responsáveis a definir.
- [ADR-0001](docs/architecture/adr/ADR-0001-desktop-tauri-sqlite.md): arquitetura proposta e critérios do spike.
- [Matriz de rastreabilidade](docs/requirements/traceability.md): instruções e tabela ainda sem requisitos.

## Regras para contribuir nesta fase

1. Trate documentos legados como fontes de descoberta, nunca como requisitos aprovados.
2. Registre lacunas explicitamente; não complete decisões de produto por suposição.
3. Só implemente requisitos com ID, critérios de aceite e status `aprovado`.
4. Registre decisões arquiteturais significativas em ADR.
5. Nunca adicione segredos, dados reais, bancos, backups, dependências instaladas ou artefatos de build ao repositório.

Consulte também [AGENTS.md](AGENTS.md), que contém as regras obrigatórias do projeto.
