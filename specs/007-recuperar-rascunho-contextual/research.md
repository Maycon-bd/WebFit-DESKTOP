# Research — WEBFIT-7

## Decision: match drafts to the active form context in the existing UI

- **Finding**: `src/App.tsx` loads the authenticated user's auto-saved drafts after login, but saves during the current session can make that in-memory list stale. The active form state identifies patient creation/edit, profile, and prescription contexts; patient and prescription IDs distinguish separate records.
- **Finding**: the existing backend `drafts` operation is authenticated and scoped to the current user, expires auto-saved drafts after 30 days, and returns kind, ID, payload, and last-save time. `discard_draft` deletes by draft ID and authenticated user. `save_draft` upserts the same draft context.
- **Decision**: refresh the existing authenticated draft list when an eligible form context opens, then identify the exact active context before presenting a dialog. Do not present the list globally on the patients page.
- **Rationale**: it satisfies contextual recovery and exact-draft discard without changing Rust authorization, IPC contracts, schema, backup, or persistence.
- **Alternatives considered**:
  - Add a new backend command to fetch one draft: unnecessary because the existing authenticated list operation can refresh the draft set without expanding the backend contract.
  - Keep the global panel and filter its rows: inconsistent with the requested modal at form entry and still exposes unrelated recovery actions on the patient list.
  - Delete the draft on restore: rejected because the user may continue editing; existing auto-save should keep protecting that work until it is saved or explicitly discarded.

## Decision: preserve the active record when discarding an edit draft

- **Finding**: approved RF-PAT-003/TA-PAT-004 state that canceling patient edits does not persist unconfirmed changes. RN-DRF-005 separates temporary auto-save from an explicitly saved clinical prescription draft.
- **Decision**: discard only the temporary auto-save. A new form returns to its empty defaults; an edit returns to the persisted record; an explicitly saved clinical prescription remains unchanged.
- **Rationale**: applies the already approved cancellation and persistence rules and avoids treating “discard auto-save” as deletion of a persisted record.

## No new architecture or external research

The affected behavior uses existing local authenticated commands and the current React application. No new library, remote service, schema, migration, backup format, or architectural decision is introduced. Source inspection and accepted project requirements are sufficient; there is no unstable external fact to research.

## Identifier mapping detail

The UI creates a local context key such as `patient:new`, `patient:<id>`, `profile`, or `prescription:<prescription-or-patient-context>`. The backend stores/returns the draft ID with the authenticated user ID prefix (`<user-id>:<context-key>`). Matching must add the current authenticated user's ID to the local key; suffix or kind-only matching could surface the wrong record. Discard must continue to pass the backend-returned ID to the existing user-scoped operation.
