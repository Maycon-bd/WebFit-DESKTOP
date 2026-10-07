# Falha de download do toolchain Rust — run #4

Demanda: RF-UPD-001 / DEC-053 / T113. Run `up #4`, commit `c394dc44f547c52dac7e66c7658d9ca31501fd79`, registrado na captura de GitHub Actions. Branch `main`, HEAD e `origin/main` coincidentes antes desta correção local. Git permanece sob controle de Maycon.

## Diagnóstico

O job passou por `cmd`, checkout, setup-node e iniciou `scripts/runner-env.mjs`. Rustup 1.29.1 começou a instalar Rust 1.98.1 e baixar cinco componentes; após 41m35s, o download de `rustc-1.98.1-x86_64-pc-windows-msvc.tar.xz` falhou com `request or response body error` e `stream error received: unspecific protocol error detected`. Rustup reverteu a instalação. O erro ocorreu durante o transporte do arquivo, antes dos checks e do build. Nenhum segredo, token ou publicação foi envolvido.

O instalador Rustup e seu checksum foram baixados via Node no mesmo job, enquanto o download maior de componentes falhou pelo cliente de transferência do rustup. A documentação oficial indica `RUSTUP_USE_CURL=1` como modo alternativo de rede para cenários de proxy/protocolo; informa que o modo curl é deprecated, mas ainda suportado. A evidência não confirma um proxy específico nem garante que essa opção resolva a interrupção.

## Correção preparada

`scripts/runner-env.mjs` define e exporta `RUSTUP_USE_CURL=1` para a instalação e ferramentas rustup subsequentes. Docs de operação, pipeline e status foram atualizados. Nenhuma configuração foi feita no computador da empresa; nenhuma alteração Git remota, build, teste integrado ou release foi executada nesta correção.

Fonte técnica: [Rustup Book — Network proxies](https://rust-lang.github.io/rustup/network-proxies.html).

## Próxima verificação

Após integração humana, acompanhar a instalação do toolchain. Se o download falhar de novo, preservar o novo log e avaliar a conexão/proxy do host ou uma distribuição validada alternativa; não trocar de mirror automaticamente.
