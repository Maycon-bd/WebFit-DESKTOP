# WebFit Desktop

Aplicativo desktop local e offline para gestão e acompanhamento nutricional. A primeira versão é Windows-first, para um computador por instalação, sem hospedagem ou mensalidade obrigatória.

## Estado atual

O **Gate G1 — Visão aprovada** foi concluído em 20/08/2026 para o **MVP Saúde**. A entrevista com Amanda validou autoridade, contexto, primeiro incremento e limites do produto.

A baseline de requisitos do primeiro incremento está documentada e aguarda revisão final do Gate G2 antes do planejamento e do spike técnico. Ainda não existe aplicação, dependência, banco, teste executável ou instalador. Tauri, React, Rust e SQLite continuam aprovados apenas para validação pelo spike do ADR-0001.

## Primeiro incremento

```text
autenticação → perfil → espaço Saúde → pacientes
→ auditoria → backup/restauração mínima → persistência comprovada
```

## Navegação

- [Índice da documentação](docs/README.md)
- [Visão aprovada](docs/product/vision.md)
- [Escopo do MVP Saúde](docs/product/scope.md)
- [Entrevista curada](docs/project/stakeholder-interview-round-01.md)
- [Requisitos funcionais](docs/requirements/functional-requirements.md)
- [Matriz de rastreabilidade](docs/requirements/traceability.md)
- [Product Backlog](docs/project/product-backlog.md)
- [ADR-0001](docs/architecture/adr/ADR-0001-desktop-tauri-sqlite.md)

## Regras para contribuir

1. Documentos legados são fontes de descoberta, não requisitos aprovados.
2. Só implementar requisito com ID, critérios de aceite e status aprovado.
3. Não introduzir nuvem, sincronização ou acesso remoto sem decisão e ADR.
4. Não adicionar segredos, dados reais, bancos, backups ou artefatos de build.
5. Manter requisitos, testes, documentação e versão rastreáveis.

Consulte [AGENTS.md](AGENTS.md) para as regras obrigatórias.
