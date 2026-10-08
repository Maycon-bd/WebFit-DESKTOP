# Quickstart — WEBFIT-7

Use fictitious data only. These scenarios validate the user-visible recovery flow in the installed local desktop application after implementation.

## Prerequisites

- An authenticated local test account.
- A working local database and the existing draft auto-save operation.
- One fictitious example for each covered context: profile, patient creation, patient edit, and prescription/cardápio.

## Scenarios

1. Open a covered form, change a field, wait for the existing auto-save interval, and leave through a safe path or close the app.
2. Re-enter that same form context. Verify the contextual modal identifies the draft and offers “Sim, restaurar” and “Não, descartar.”
3. Choose restore. Verify the matching field values return and further edits remain available.
4. Repeat and choose discard. Verify a new form is empty, an edit shows the last persisted values, and no saved clinical prescription is deleted.
5. With a draft available, open the patients list and an unrelated patient/form context. Verify no unrelated draft or global recoverable-drafts panel appears.
6. Repeat with separate fictitious user accounts; verify each account only sees its own authenticated drafts.
7. Simulate a recoverable draft lookup or discard failure. Verify an error appears and the last valid form/persisted state remains intact.
8. Navigate the prompt with keyboard and assistive technology. Verify both choices have clear accessible names, focus remains in the dialog until an explicit choice, and focus returns to the form.

## Acceptance reference

Map each outcome to TA-DRF-005..010 and record whether the test used a draft in the matching context, another context, or another user session. Do not include patient values in screenshots or logs.
