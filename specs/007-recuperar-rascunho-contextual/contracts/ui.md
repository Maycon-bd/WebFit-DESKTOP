# UI Contract — Contextual Draft Recovery

## Trigger

On entry to an approved long-form context, check whether that authenticated user's context has an auto-saved draft. The prompt appears only for an exact matching context. The patients list and unrelated form contexts do not show drafts.

Covered contexts: professional profile; new patient; edit of a specific patient; new or existing prescription/cardápio for its patient/context.

## Prompt

Show a modal identifying the form and last-save time, with a direct question such as “Um rascunho anterior foi salvo. Deseja restaurá-lo?” Actions: **Sim, restaurar** and **Não, descartar**. Both actions have accessible names and work with keyboard and assistive technology. Focus stays within the modal until an explicit choice; Escape or clicking outside does not discard work. After a choice, return focus to the form.

## Outcomes

| Action | Result |
|---|---|
| Sim, restaurar | Apply the matching payload to the active form. Keep it editable and eligible for continued auto-save. |
| Não, descartar | Remove only the matching temporary draft. New-form inputs return to empty defaults; edit forms return to persisted values. Explicitly saved clinical prescription drafts remain. |
| Lookup/discard error | Show a safe actionable error; do not claim success or clear valid state. |

## Preserved behavior

Authenticated ownership, authorization, auto-save cadence, save-before-safe-navigation, close/logout handling, 30-day expiration, audit rules, and the existing distinction between auto-save and a persistent prescription draft remain unchanged.
