# Data Model — WEBFIT-7

## Existing entity: temporary form draft

No schema change is planned. The existing draft represents an incomplete form payload and is already scoped to the authenticated user and workspace.

| Attribute | Meaning | Constraint |
|---|---|---|
| Kind | Long-form type: patient, profile, or prescription | Only kinds allowed by RN-DRF-001 |
| Form context | Exact creation/edit context to which the draft belongs | Must match the current form before prompting |
| Payload | Incomplete form values | Temporary; not an audit snapshot or clinical history entry |
| Last saved time | Time of latest automatic save | Existing 30-day expiration remains |

## Relationships and lifecycle

- The authenticated user owns each draft; the backend remains the authorization boundary.
- A draft corresponds to one form context. Separate entities or form contexts continue to have separate drafts under RN-DRF-004.
- Restore places the payload into its matching active form so editing/autosave can continue.
- Discard removes only the corresponding temporary draft. It does not delete a persisted patient or explicitly saved prescription.
- Completing a form removes its auto-save according to RN-DRF-003.
