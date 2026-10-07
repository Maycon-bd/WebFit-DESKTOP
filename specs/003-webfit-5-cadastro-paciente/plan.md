# Implementation Plan: WEBFIT-5 cadastro minimo

**Branch**: `main` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)
**HEAD-base**: a83998ef33c032ea46e283322bbf7620c0051d49
**Status**: planejamento para revisao humana; nao implementado.

## Summary

Cadastro/edicao exigem nome, nascimento e sexo com duas opcoes de radio. Demais campos opcionais; validar os preenchidos no backend. Migracao 002 torna CPF anulavel mantendo unicidade dos informados. Backup/restauracao suportam schema 1/2.

## Technical Context

- **Language/Version**: TypeScript 5.9.3, React 19.1, Rust existente.
- **Primary Dependencies**: Tauri 2, Vite 8, rusqlite/SQLCipher existentes; nenhuma instalacao.
- **Storage**: SQLCipher protegido por DPAPI, payload JSON existente e UUID como identidade.
- **Testing**: testes Node, cargo test, integracao SQLCipher/backup e ensaio Windows.
- **Target Platform / Project Type**: desktop Windows-first, local/offline.
- **Performance Goals**: manter RNFs existentes; sem meta arbitraria nova.
- **Constraints**: dados ficticios; transacoes; foreign_keys ON; logs sem dados sensiveis; Git humano.
- **Scale/Scope**: formulario e persistencia/backup necessarios a opcionalidade; sem alterar calculos clinicos.

## Constitution Check

Antes/depois do design: I/III/IV/VIII/X atendidos pelo planejamento com status proposto e gate humano; nenhum requisito implementado antes de aprovar. II/IX exigem testes/evidencia antes de concluir. V exige autorizacao backend, auditoria e protecao do backup; VI/VII mantem stack/API/padroes. ADR-0001 aceito e DEC-045 superam a restricao historica de arquitetura somente para spike na Constitution; nenhuma nova arquitetura. Autorizacao recebida cobre preparacao com migracao, nao concede aceite funcional de Amanda.

## Project Structure

Documentacao: `specs/003-webfit-5-cadastro-paciente/{spec,plan,research,data-model,quickstart,tasks}.md`, `contracts/patient.md`, checklist e `.harness/evidence/webfit-5/`.

Codigo previsto: `src/App.tsx`, `src/style.css`, `src/onboarding.ts`, `src/api.ts` se necessario; `src-tauri/src/{service,database,recovery,tests,acceptance_tests}.rs`; nova `src-tauri/migrations/002_optional_patient_cpf.sql`. Fontes canonicas: requisitos, decisoes e checkpoint.

**Structure Decision**: produto na raiz; spike G4 separado.

## Phase 0: Research / Architecture and Privacy Review

Pesquisa em [research.md](research.md). Mudanca de nulabilidade/validacao sem stack, dependencia ou fronteira nova; nao exige ADR material novo. Riscos: colisao de CPF vazio, referencias perdidas na reconstrucao, backup recusado, sexo inferido. Mitigacoes: SQL NULL, transacao/integridade, compatibilidade e preservacao do legado. Nenhum dado real acessado.

## Phase 1: Design

1. CPF ausente como Option/SQL NULL e payload vazio consistente com API existente. Consultar duplicidade somente se informado. Nao deduplicar por nome nem criar CPF sintetico.
2. Radios nativos em fieldset/legend, labels Feminino/Masculino, required, mesmo name e foco visivel. Sem default. Canonico F/M; equivalencias inequivocas Feminino/Masculino/F/M somente ao exibir legado, sem reescrever antes de salvar.
3. Nova 002 sem editar 001; manter ordem/quantidade de colunas, IDs, payload, search, datas e arquivamento. Runner 0->1->2 rejeita schema futuro. Reconstrucao sob foreign_keys ON com defer_foreign_keys na transacao e integrity_check/foreign_key_check antes do commit. Primeiro provar essa sequencia no SQLCipher empacotado com referencias existentes; se falhar, parar a tarefa e revisar plano sem desativar FKs silenciosamente.
4. Antes de migrar v1, snapshot criptografado consistente pela API SQLite, validado e recuperavel com chave DPAPI existente. Falha bloqueia migracao; nao copiar banco ativo. Service::open migra antes de construir Service: extrair helper minimo ou reorganizar abertura limitada. Snapshot local de migracao nao equivale a backup portatil; provar reabertura em teste.
5. Backup informa schema real da copia; restore aceita v1/v2 e exige concordancia metadata/user_version. Migrar copia temporaria v1 antes do import logico, verificar integridade novamente. Manter Envelope.version=1, credencial de recuperacao, DPAPI destino, backup preventivo, auditoria append-only e bloqueio apos sucesso.
6. D-PAT-001: responsavel tambem opcional; D-PAT-002: sexo antigo diferente permanece ate escolha explicita ao salvar. Ambas AGENT-PROVISIONAL.

Contratos: [data-model.md](data-model.md), [contracts/patient.md](contracts/patient.md). Guia: [quickstart.md](quickstart.md).

## Quality / Gates

Analyze antes de implementar. Maycon autorizou registro/preparacao; validar D-PAT-001/002, obter confirmacao funcional de Amanda e autorizacao de execucao deste plano. Depois: Implement, Converge, Verification, Review independente, Security/UI gates e Evidence. Sem Git mutavel, publicacao ou aprovacao G5/G6/G7 implicita.

## Complexity Tracking

Sem violacao proposta. Reconstrucao e recovery necessarios porque schema proibe CPF ausente e backup aceita so v1.
