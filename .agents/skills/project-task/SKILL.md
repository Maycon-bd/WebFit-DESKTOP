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

## Plane Work Item Contract

Plane is the work-management layer for this entrypoint. It owns demand identification, backlog, priority, module, assignee, operational state and follow-up. It is not canonical for requirements, business rules, ADRs, architecture, Specification, Plan, technical Tasks or Evidence; those remain in `docs/`, ADRs, the Decisions Register, Spec Kit and the harness.

The connected Plane project is WebFit (`WEBFIT`, project ID `70107c4a-e367-46d6-a853-5f11ada706fc`). Read access is automatic. The MCP `plane` uses OAuth and was validated in read mode.

### Existing Work Item

When the input is a Work Item identifier such as `WEBFIT-12`:

1. Read the item from Plane.
2. Use only its title, short description, state, priority and module for intake.
3. Locate the related canonical documentation.
4. Continue through this skill and the harness without treating Plane as a source-of-truth replacement.

### New Demand

When the input explicitly starts a new demand, such as `Nova demanda: adicionar agenda de consultas`:

1. Run intake and classify LIGHT, STANDARD or STRICT.
2. For STANDARD or STRICT, create exactly one Work Item in WebFit and use the returned identifier as the official demand ID.
3. Start a real STANDARD/STRICT analysis in `Planning`; use `Backlog` or `Planning` for LIGHT according to whether work has already started.
4. Associate a module only when evidence is sufficient: `Fundação` for architecture/spike/setup/infrastructure/security-base/persistence/database/tooling, `Incremento 1` for current MVP functionality, and `Futuro` only for functionality explicitly outside the first increment.
5. Preserve an existing human priority. For a new item without priority, use the neutral/default value permitted by Plane; do not invent `high` or `urgent`.
6. Keep the Work Item short, with Objective, Source of Truth and Engineering sections containing classification, Spec path when available and branch when available.

The explicit new-demand invocation authorizes creation of that single Work Item and synchronization of that same item through normal gates. It does not authorize deleting, archiving, cancelling without a human request, modifying other items, bulk updates, cycles, project configuration, states, modules, members, arbitrary human priority or unapproved dates. LIGHT work does not require a Work Item by default; reclassify if it becomes material.

### State Synchronization

Synchronize only the current Work Item:

- Intake / Specify / Plan → `Planning`
- `READY FOR HUMAN DECISION REVIEW` → `Decision Review`
- `READY FOR IMPLEMENTATION` → `Ready for Implementation`
- implementation approved/started → `In Progress`
- `READY FOR VERIFICATION` → `Verification`
- `READY FOR REVIEW` → `Review`
- Review with CHANGES REQUIRED → `In Progress` or `Verification`, according to the correction
- `BLOCKED` → `Blocked`
- final human approval → `Done`
- explicit human abandonment → `Cancelled`

Never set `Done` for `READY FOR HUMAN APPROVAL` without final human approval. When blocked, write only a short reason, blocking gate and required next action. When resolved, return to the state matching the real phase.

After a `Decision Review` batch is validated, return to `Planning` while the demand remains in planning; if Plan/Tasks are complete, advance to `Ready for Implementation`.

Branch, Spec path and Evidence must carry the same Work Item ID. Preserve DEC-010, for example `feature/webfit-12-cadastro-paciente`. If Plane and canonical sources diverge, record `PLANE / SOURCE-OF-TRUTH MISMATCH` and follow the canonical source. If Plane is unavailable, record `PLANE SYNC DEGRADED`; with a known ID, continue safely with pending synchronization. If a new STANDARD/STRICT demand cannot obtain the required Plane ID, record `PLANE ID REQUIRED` and stop before Branch Safety.

## Initialize Context

Before classifying or changing anything:

1. Read `AGENTS.md` in full.
2. Read `.harness/GOVERNANCE.md`, `.harness/AUTONOMY-POLICY.md`, `.harness/PROJECT-STATE.md`, and `.harness/knowledge/DECISIONS-REGISTER.md`.
3. Read `docs/project/status.md` and locate the canonical requirements, rules, use cases, traceability, ADRs, and open questions related to the demand.
4. Read `docs/project/git-workflow.md` and `.harness/integrations/github.md`; check current branch, local/remote refs already known, and `git status --short --branch`.
5. Apply this authority order: human `ACCEPTED` decision; accepted ADR; approved canonical requirement/documentation; Constitution; feature Specification/Plan/Tasks; code; execution evidence.

Do not treat legacy material, an inference, `AGENT-PROVISIONAL`, code, or evidence as an accepted requirement.

## Classify the Demand

State the classification and one-sentence rationale before proceeding.

- **LIGHT**: documentation-only, textual, or trivial technical adjustment; low risk; no material behavior, architecture, data, security, or external integration change.
- **STANDARD**: ordinary feature, bug, UI flow, endpoint, or business rule that does not meet a STRICT condition.
- **STRICT**: authentication, authorization, clinical or other sensitive data, privacy, finance, schema/database, migration, files/backup, infrastructure, architecture, dependency, sensitive external integration, security, irreversible change, or high impact.

When uncertain between levels, use the higher level and explain why. Classification does not authorize an ASK-FIRST action.

## Establish Branch Safety

For every real STANDARD or STRICT demand, obtain or create its Plane Work Item ID before this gate, then complete this gate before `$speckit-specify` or any other versionable write:

1. Identify the current branch and the protected branches. Treat `main`, `master`, `develop`, and branches protected by project policy as protected.
2. Inspect `git status --short --branch` and existing local and already-known remote refs. Do not fetch automatically.
3. Identify an existing branch associated with the demand by its traceable ID and slug.
4. Recover the approved branch convention. DEC-010 requires `feature/<id>-<resumo>` from `develop`; use `hotfix/<id>-<resumo>` from `main` only for an approved urgent hotfix. Do not introduce `fix/`, `chore/`, trunk-based flow, or another convention.
5. Require the approved requirement/task ID, acceptance criteria, and status needed by `docs/project/git-workflow.md`. Read-only intake may continue until they exist, but do not create versionable artifacts.
6. If the associated branch already exists locally, switch to it only when the worktree is safe. If it exists only as a known remote-tracking ref, creating its local tracking branch is allowed when safe.
7. If no associated branch exists, ensure the correct base. A missing local `develop` may track an existing unambiguous `origin/develop` without fetch. If base history is missing, divergent, or uncertain, stop.
8. Create the demand branch locally and verify the current branch before continuing.

Local branch creation/tracking/switching is autonomous, reversible, and has no external effect when these checks pass. Never push, open a PR, commit, merge, tag, release, or deploy automatically.

### Dirty Worktree

- If already on the associated demand branch and every change belongs to it, preserve the work and continue.
- If every change belongs to the demand and the current branch is the correct base, a local branch may be created while preserving those changes.
- If changes are unrelated, attribution is uncertain, the current branch is the wrong base, a conflict is possible, or safety would require stash/reset/clean/discard, do not switch or create a branch.
- Never reset, clean, discard, delete, or stash automatically.

When any required proof is missing, stop with:

`BRANCH SETUP BLOCKED`

Report current branch, intended branch/base, worktree facts, the precise blocker, and the safe human action required. Do not invoke Spec Kit or write demand artifacts.

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

Purely documentary LIGHT work MAY remain on the current branch when consistent with the approved Git policy. If LIGHT begins producing code or a material change, reclassify it or apply Establish Branch Safety before the first such write.

### STANDARD — Before Implementation

1. Perform read-only intake and targeted investigation; obtain the approved traceable ID required by Git policy.
2. Complete **Establish Branch Safety** and verify the demand branch is active.
3. Invoke `$speckit-specify` with the demand and recovered canonical context, keeping its feature metadata associated with the active branch ID/slug.
4. Invoke `$speckit-clarify` only when the autonomy policy cannot resolve a material ambiguity.
5. Perform Architecture Review or create/update an ADR only when the demand contains a material architecture decision.
6. Invoke `$speckit-plan`.
7. Invoke `$speckit-checklist` when a requirements-quality checklist is useful.
8. Invoke `$speckit-tasks`.
9. Invoke `$speckit-analyze`.
10. Stop at the applicable **HUMAN DECISION REVIEW** and/or **IMPLEMENTATION APPROVAL**.

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

Branch setup is not a human gate and does not imply any approval. It only isolates local work safely.

## Conditional Gates

- **Security Gate**: prepare or run only when code exists and the demand has relevant security risk. Mantis remains `PREPARED — NOT ACTIVE` until code and an appropriate environment exist.
- **UI/UX Gate**: use only when the demand produces or changes UI. Impeccable remains `PREPARED — NOT ACTIVE` until UI exists.
- **Loop Engineering**: remains `PREPARED — NOT ACTIVE` until implementation and objective checks exist and activation is explicitly authorized.

## Skill Handoff Limitation

Codex skills provide instructions; they are not a programmable nested-call API. When the current runtime can invoke another installed skill in the same task, invoke the official `$speckit-*` skill and follow it. When it cannot, stop at a transparent handoff that names the exact next skill invocation and carries forward the demand, classification, decisions, and gate state. Never claim an official skill ran when it did not.

## Completion Report

Report:

- classification and rationale;
- Plane Work Item ID, initial/final state and synchronization result;
- current branch, intended branch/base, and Branch Safety result;
- canonical sources used;
- Spec Kit artifacts created or updated;
- decisions made by the agent and their statuses;
- verification, review, and evidence results;
- current gate and exact next action;
- unchanged conditional integrations.

## Done When

- [ ] The demand has a LIGHT, STANDARD, or STRICT classification.
- [ ] Every real STANDARD/STRICT demand passed Branch Safety before versionable writes, or stopped as `BRANCH SETUP BLOCKED`.
- [ ] Canonical sources and accepted decisions were applied.
- [ ] Official Spec Kit skills were orchestrated without duplicated workflow logic.
- [ ] Provisional and human-required decisions are explicit.
- [ ] The correct human or completion gate is reported.
