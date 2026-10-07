# WebFit Desktop
<!-- impeccable:product-schema 1 -->
## Platform
web
Interface React em WebView desktop Windows, offline; não é site hospedado.
## Stack
Tauri 2, React/TypeScript/Vite, Rust, SQLCipher e DPAPI — ADR-0001, DEC-045.
## Users
Amanda, nutricionista em consultório, e Maycon, administrador local. Ambos possuem acesso total aprovado.
## Product Purpose
Organizar pacientes e prescrições sem mensalidade obrigatória, preservando dados e permitindo recuperação.
## Operating Context
Windows 10 x64, um computador por instalação. Primeiro teste com dados fictícios. Instalador manual, sem updater conectado — DEC-044.
## Capabilities and Constraints
Escopo e fluxo canônicos em docs/product/scope.md e docs/ux/flows.md. Este documento não cria requisitos. Campos e comportamento seguem requisitos aprovados.
## Accessibility & Inclusion
Teclado, foco visível, português brasileiro, zoom 200%, estados vazios/erro explícitos.
