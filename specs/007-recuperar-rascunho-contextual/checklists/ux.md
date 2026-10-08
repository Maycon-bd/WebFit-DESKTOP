# UX Requirements Quality Checklist: WEBFIT-7

**Purpose**: Review completeness and clarity of the contextual recovery UX requirements
**Created**: 2026-10-08
**Feature**: [spec.md](../spec.md)

**Note**: Generated as a requirements-quality review artifact; it does not test the implementation.
**Review Ownership**: Reviewer-owned. Keep all items unchecked until a reviewer evaluates the requirements.

## Context and prompt

- [ ] CHK001 - Are every eligible long-form context and the exact matching condition specified? [Completeness, Spec §FR-001/FR-005]
- [ ] CHK002 - Are the modal trigger, message, and two explicit actions clear without implying a global draft list? [Clarity, Spec §FR-002]

## Outcome consistency

- [ ] CHK003 - Are restore, new-form discard, edit discard, and persistent prescription outcomes clearly distinct? [Consistency, Spec §FR-003/FR-004]
- [ ] CHK004 - Do error requirements explain what remains visible and prevent false success or loss of the last valid state? [Exception Flow, Spec §FR-006]

## Accessibility and privacy

- [ ] CHK005 - Are keyboard operation, assistive-technology names, focus containment/return, and passive dismissal behavior specified? [Coverage, Spec §FR-008]
- [ ] CHK006 - Are user/session scoping and exclusion of unrelated or protected forms consistent across stories and requirements? [Security, Spec §FR-005/FR-007]

## Traceability

- [ ] CHK007 - Does every recovery outcome map to approved rules and acceptance criteria without conflating autosave with clinical prescription state? [Traceability, Spec §FR-004/FR-007]

## Notes

- Items evaluate wording and coverage of requirements only; they do not confirm code or test execution.
- Reviewer owns the checkbox state.
