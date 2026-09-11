---
name: "project-task"
description: "Orchestrate a WebFit project demand through harness governance and the installed Spec Kit skills, classify it as LIGHT, STANDARD, or STRICT, and stop only at required human gates. Use when the user invokes $project-task or asks to run a new demand through the project's engineering workflow; do not use for a simple status question."
---

## User Input

```text
$ARGUMENTS
```

You MUST consider the user input before proceeding. If it does not describe a demand, ask for the minimum missing objective.

## Role

Act as the WebFit engineering entrypoint. Orchestrate the official Spec Kit skills and the harness; do not reproduce their internal workflows. Follow `.harness/integrations/spec-kit.md`.

## Initialize Context

Before classifying or changing anything:

1. Read `AGENTS.md` in full.
2. Read `.harness/GOVERNANCE.md`, `.harness/AUTONOMY-POLICY.md`, `.harness/PROJECT-STATE.md`, and `.harness/knowledge/DECISIONS-REGISTER.md`.
3. Read `docs/project/status.md` and locate the canonical requirements, rules, use cases, traceability, ADRs, and open questions related to the demand.
4. Check `git status --short --branch` and preserve pre-existing work.
5. Apply this authority order: human `ACCEPTED` decision; accepted ADR; approved canonical requirement/documentation; Constitution; feature Specification/Plan/Tasks; code; execution evidence.

Do not treat legacy material, an inference, `AGENT-PROVISIONAL`, code, or evidence as an accepted requirement.

## Classify the Demand

State the classification and one-sentence rationale before proceeding.

- **LIGHT**: documentation-only, textual, or trivial technical adjustment; low risk; no material behavior, architecture, data, security, or external integration change.
- **STANDARD**: ordinary feature, bug, UI flow, endpoint, or business rule that does not meet a STRICT condition.
- **STRICT**: authentication, authorization, clinical or other sensitive data, privacy, finance, schema/database, migration, files/backup, infrastructure, architecture, dependency, sensitive external integration, security, irreversible change, or high impact.

When uncertain between levels, use the higher level and explain why. Classification does not authorize an ASK-FIRST action.

## Apply Autonomous Decision Policy

For each material ambiguity:

1. Recover accepted constraints and compare alternatives using the criteria in `.harness/AUTONOMY-POLICY.md`.
2. If one option is clearly superior, confidence is sufficient, the choice is reversible, and no ASK-FIRST condition applies, record it as `AGENT-PROVISIONAL` and continue.
3. Accumulate related provisional decisions for one **HUMAN DECISION REVIEW** at the end of the relevant phase.
4. Use `NEEDS-HUMAN-DECISION` and stop only when missing information is material to the next step, alternatives are balanced, or ASK-FIRST applies.
5. Never present a provisional decision as accepted.

Use the official `$speckit-clarify` workflow only when clarification is materially necessary. Do not interrupt the user for minor, reversible choices.

## Orchestrate Official Spec Kit Skills

Use the installed official skills as the operational implementation of Spec Kit. Do not copy or simulate their detailed instructions inside this skill.

### LIGHT

Run the minimum sufficient harness flow: intake, source check, scoped change, proportional verification/review, evidence, and the applicable human gate. A formal feature Specification/Plan/Tasks chain MAY be omitted only when there is no material behavior change. Record why omission is safe.

### STANDARD — Before Implementation

1. Intake and targeted investigation.
2. Invoke `$speckit-specify` with the demand and recovered canonical context.
3. Invoke `$speckit-clarify` only when the autonomy policy cannot resolve a material ambiguity.
4. Perform Architecture Review or create/update an ADR only when the demand contains a material architecture decision.
5. Invoke `$speckit-plan`.
6. Invoke `$speckit-checklist` when a requirements-quality checklist is useful.
7. Invoke `$speckit-tasks`.
8. Invoke `$speckit-analyze`.
9. Stop at the applicable **HUMAN DECISION REVIEW** and/or **IMPLEMENTATION APPROVAL**.

### STANDARD — After Explicit Approval

1. Invoke `$speckit-implement`.
2. Invoke `$speckit-converge`; repeat implement/converge only while approved tasks remain.
3. Run independent harness Verification.
4. Run independent harness Review.
5. Run conditional Security and UI/UX gates when triggered.
6. Produce the Evidence Report.
7. Stop at **FINAL APPROVAL** before commit, PR, release, push, or deploy.

### STRICT

Use the complete STANDARD flow and add, as applicable:

- research with sources and recorded assumptions;
- Architecture Review, ADR, and spike evidence;
- threat model and privacy review;
- explicit sensitive-change approval before dependency, schema, migration, authentication, security, production, or other ASK-FIRST action;
- Security Gate and any domain-specific verification;
- stronger traceability and independent evidence.

Do not weaken STRICT because a technical choice appears straightforward.

## Human Gates

Distinguish and report these gates explicitly:

- **HUMAN DECISION REVIEW**: batch validation of `AGENT-PROVISIONAL` decisions.
- **IMPLEMENTATION APPROVAL**: authorization to begin implementation when required by the selected level or project stage.
- **SENSITIVE CHANGE APPROVAL**: prior authorization for dependencies, schema/migrations, authentication, security, production, destructive or irreversible actions, and other ASK-FIRST conditions.
- **FINAL APPROVAL**: human acceptance before commit, PR, release, push, or deploy.

A user approval applies only to the clearly described scope. Never commit, push, deploy, publish, release, or create external work items automatically.

## Conditional Gates

- **Security Gate**: prepare or run only when code exists and the demand has relevant security risk. Mantis remains `PREPARED — NOT ACTIVE` until code and an appropriate environment exist.
- **UI/UX Gate**: use only when the demand produces or changes UI. Impeccable remains `PREPARED — NOT ACTIVE` until UI exists.
- **Loop Engineering**: remains `PREPARED — NOT ACTIVE` until implementation and objective checks exist and activation is explicitly authorized.

## Skill Handoff Limitation

Codex skills provide instructions; they are not a programmable nested-call API. When the current runtime can invoke another installed skill in the same task, invoke the official `$speckit-*` skill and follow it. When it cannot, stop at a transparent handoff that names the exact next skill invocation and carries forward the demand, classification, decisions, and gate state. Never claim an official skill ran when it did not.

## Completion Report

Report:

- classification and rationale;
- canonical sources used;
- Spec Kit artifacts created or updated;
- decisions made by the agent and their statuses;
- verification, review, and evidence results;
- current gate and exact next action;
- unchanged conditional integrations.

## Done When

- [ ] The demand has a LIGHT, STANDARD, or STRICT classification.
- [ ] Canonical sources and accepted decisions were applied.
- [ ] Official Spec Kit skills were orchestrated without duplicated workflow logic.
- [ ] Provisional and human-required decisions are explicit.
- [ ] The correct human or completion gate is reported.
