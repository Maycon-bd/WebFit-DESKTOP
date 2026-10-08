# Implementation Plan: WEBFIT-7

**Branch**: main | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)
**Work Item**: WEBFIT-7. Current HEAD-base: e07cdc8300de0421dbdc7fd64aafe7d30a191e80. Git remains controlled by Maycon (DEC-054).

## Summary

Replace the global recoverable-drafts panel with a contextual modal shown only when the authenticated user opens the same long-form context that has an auto-saved draft. Reuse existing draft loading, identifier matching, authenticated discard operation, autosave cadence, and saved form state. No schema, migration, IPC command, dependency, or architecture change is needed.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.1.0; Rust service stays unchanged.
**Primary Dependencies**: Existing Tauri 2 / React / Vite application; no new dependencies.
**Storage**: Existing authenticated SQLite draft operations; no schema changes.
**Testing**: Project-proportional frontend/backend checks from the existing scripts and manual acceptance scenarios using fictitious data. No new test task was requested in the specification.
**Target Platform**: Windows desktop and its WebView; keyboard and assistive-technology access required.
**Project Type**: Tauri desktop application.
**Performance Goals**: Refresh the authenticated draft list once when an eligible form context opens, then show a matching prompt without a polling loop.
**Constraints**: Only the matching authenticated user/form context is presented. Preserve autosave every ~30 seconds, safe navigation, close/logout behavior, 30-day expiry, cancellation semantics, and the distinction between temporary autosave and persistent clinical prescription draft. No data is cleared until discard succeeds.
**Scale/Scope**: Four existing contexts: professional profile, new/edit patient, and new/edit prescription/cardápio. A form becomes eligible only through an approved long-form requirement.

## Constitution Check

**Before research**: PASS — RF-DRF-002 is approved for implementation by Maycon, with TA-DRF-005..010; the existing accepted backend authorization and storage are reused. The ask does not introduce a new schema, dependency, authentication path, or architecture.

**After design**: PASS — current authenticated draft results are matched to the active form context. A focused native dialog provides explicit Restore/Discard choices. On restore, the draft payload is applied to that context. On discard, remove only that draft; a new form returns to its empty defaults and an edit returns to persisted values. Existing authenticated Rust operations remain the authority for access and deletion. Keep clinical values and error details out of logs.

Human Gate: Maycon approved implementation on 2026-10-08. Final functional acceptance and G5/G6/G7 gates remain separate.

## Phase 0: Research

See [research.md](research.md). Existing source code confirms the authenticated `drafts`, `save_draft`, and `discard_draft` operations. Draft identifiers already distinguish form kind and entity/context; exact-context matching can stay in the current UI. Refresh the existing user-scoped draft list on eligible form entry so autosaves created during the current session are visible. Reusing the current operations avoids a new backend contract or schema.

## Phase 1: Design

- [Data model](data-model.md): no new persisted entity or field; uses the current temporary Draft payload and its form context.
- [UI contract](contracts/ui.md): trigger, copy, Restore/Discard outcomes, errors, accessibility, and no global panel.
- [Quickstart](quickstart.md): manual validation paths using fictitious data and the existing local application.

Implementation is localized to the active app shell, a focused recovery dialog component (or an existing native dialog pattern), and its styles. Frontend context keys must include the authenticated user ID to match the backend's returned `<user-id>:<context-key>` draft IDs; do not match by kind or suffix alone. Documentation updates accompany the behavior. Do not edit adjacent branding, update-banner, navigation, or tutorial code without a direct need.

## Project Structure

```text
src/App.tsx                         # active form context, matching and dialog state
src/DraftRecoveryDialog.tsx         # accessible Restore/Discard dialog
src/style.css                       # dialog styling consistent with the active design
src/api.ts                          # existing Draft contract; no behavior change expected
src-tauri/src/service.rs            # existing authorized draft operations; no change expected
docs/requirements/                  # RF, rules, acceptance criteria, use case and traceability
docs/ux/flows.md                    # contextual recovery flow
specs/007-recuperar-rascunho-contextual/  # Spec Kit artifacts
.harness/evidence/webfit-7/         # verification, review and final evidence
```

**Structure Decision**: Keep behavior in the existing desktop app and rely on its authenticated draft service. Add a small focused UI component only if it can follow the established `LoginInfo` native-dialog interaction without coupling unrelated flows.

## Complexity Tracking

No Constitution violations or additional architecture are required.
