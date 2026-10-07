---
name: "webfit-task"
description: "Orchestrate a WebFit project demand through harness governance and the installed Spec Kit skills, classify it as LIGHT, STANDARD, or STRICT, and stop only at required human gates. Use when the user invokes $webfit-task or asks to run a new demand through the project's engineering workflow; do not use for a simple status question."
---

## User Input

```text
$ARGUMENTS
```

You MUST consider the user input before proceeding. If it does not describe a demand, ask for the minimum missing objective.

## Role

Act as the WebFit engineering entrypoint. Orchestrate the official Spec Kit skills and the harness; do not reproduce their internal workflows. Follow `.harness/integrations/spec-kit.md`.

The former name was `project-task`; use `webfit-task` for current invocations. For resume/save requests, use [webfit-checkpoint](../webfit-checkpoint/SKILL.md); for focused checks or the Verification phase, use [webfit-verificar](../webfit-verificar/SKILL.md). These are operating procedures, not additional stages or approvals. Follow their instructions in this chat and reuse their outputs. Do not execute checkpoint or verification twice because both this router and a helper mention them.

## Human Interaction Contract

Apply the [Human Interaction Contract](../../../.harness/HUMAN-INTERACTION-CONTRACT.md) once per chat and when its content changes. Use brief execution updates; ask only about material gaps, explain decisions and batch related approvals. Recover previous answers and sufficient authorization. DEC-038 permits proportional autonomy for internal choices; meaningful product behavior still needs discovery and the applicable human owner.

Make progress understandable: distinguish the demand's current phase from the overall project stage, and say whether work was registered, planned, implemented or verified. Before ending, execute the next necessary authorized action if one exists. At a real blocker, apply the contract's continuity guidance: give a concrete recommended resolution and ask the specific missing decision instead of merely repeating the blocker. Partial answers resolve only their scope; carry them forward and address the remaining gap.

Before `READY FOR IMPLEMENTATION`, verify understandable behavior and acceptance criteria, discussed decisions and absence of silent assumptions within the existing review. Keep operational details in artifacts.

## Plane Work Item Contract

Read [Plane integration](../../../.harness/integrations/plane.md) only when the task uses Plane or requires its identity/state contract. Plane manages work; canonical engineering sources remain in docs/, ADRs and Spec Kit.

- Existing Work Item: read the necessary metadata and locate canonical sources.
- Explicit new STANDARD/STRICT demand: create exactly one item in WebFit, use its ID throughout Spec/Evidence and record the observed current branch, and synchronize only that item at the prescribed gates. Preserve human priority; use modules only with evidence. No unrelated or bulk writes.
- LIGHT does not require a Work Item. Do not contact Plane solely to complete a documentary correction.
- Known ID with unavailable Plane: `PLANE SYNC DEGRADED`; continue safe local work and record pending sync. New STANDARD/STRICT without the required ID: `PLANE ID REQUIRED`; stop before creating demand artifacts.
- `Done` requires final human approval. Approval of a phase is not approval of the entire demand.

## Initialize Context and Resume

Follow [proportional execution](../../../.harness/GOVERNANCE.md#condução-proporcional-e-retomada). Check `git status --short --branch` before editing and at completion.

1. Read AGENTS.md, docs/project/status.md, Governance, Autonomy Policy and Human Interaction Contract on entry when not already current in this chat. These own stage, authority and permission boundaries.
2. Classify from the objective and effects. For LIGHT documentation, locate the affected owner and its source; do not preload domain catalogs, the full decision ledger or unrelated integrations.
3. For product planning/changes, perform all reads required by AGENTS.md and locate relevant canonical requirements, rules, acceptance, traceability and ADRs. Consult PROJECT-STATE and the ledger for related decisions, without duplicating their contents.
4. Apply the current-branch policy (DEC-054), reading Git integration when needed; for Plane identity/sync, read its contract. Expand context only as the next phase needs it.
5. Recover the demand ID, existing artifacts, approvals and first unfinished phase. Continue there; do not restart Specification/Plan/Tasks on each turn. Reopen stages when scope, relevant inputs, conflicts or approvals change.

Reuse already-read context only while files, scope, branch and authority remain valid. New chats and machine changes require fresh checks. The mandatory “Vamos continuar onde paramos” trigger still requires the full operational checkpoint and comparison with Git.

Authority order: human `ACCEPTED`; accepted ADR; approved canonical requirement/documentation; Constitution; Specification/Plan/Tasks; code; evidence. Never promote an inference or legacy material to an approved requirement.

## Classify the Demand

State the classification and one-sentence rationale before proceeding.

- **LIGHT**: documentation-only, textual, or trivial technical adjustment; low risk; no material behavior, architecture, data, security, or external integration change.
- **STANDARD**: ordinary feature, bug, UI flow, endpoint, or business rule that does not meet a STRICT condition.
- **STRICT**: authentication, authorization, clinical or other sensitive data, privacy, finance, schema/database, migration, files/backup, infrastructure, architecture, dependency, sensitive external integration, security, irreversible change, or high impact.

When uncertain between levels, use the higher level and explain why. Classification does not authorize an ASK-FIRST action.

## Work in the Current Branch

Apply DEC-054 and [Git integration](../../../.harness/integrations/github.md): Maycon owns Git. Perform all demands on the current branch; do not require a dedicated branch, demand ID in its name, develop ancestry or a clean worktree. Read-only Git inspection is for context, traceability and preserving existing changes.

Do not create/switch branches or worktrees, fetch/pull, stash/reset/clean, commit/push/merge, create PRs, tags or releases on your own initiative. A later explicit human instruction may authorize a specific operation. Record the observed branch in artifacts while keeping the Plane ID as the demand identity.

Unrelated changes, branch name and base do not trigger BRANCH SETUP BLOCKED. Continue scoped work while preserving preexisting changes; stop only the affected edit if a concrete content conflict or overwrite cannot be resolved safely. Product and sensitive-change gates still apply.

## Apply Autonomous Decision Policy

For each material ambiguity:

1. Recover accepted constraints and compare alternatives using the criteria in `.harness/AUTONOMY-POLICY.md`.
2. If one option is clearly superior, confidence is sufficient, the choice is reversible, and no ASK-FIRST condition applies, record it as `AGENT-PROVISIONAL` and continue.
3. Accumulate related provisional decisions for one **HUMAN DECISION REVIEW** at the end of the relevant phase.
4. Use `NEEDS-HUMAN-DECISION` and stop only when missing information is material to the next step, alternatives are balanced, or ASK-FIRST applies.
5. Never present a provisional decision as accepted.

Use the official `$speckit-clarify` workflow only when clarification is materially necessary. Do not interrupt the user for minor, reversible implementation choices. This does not suppress product discovery: investigate meaningful behavioral gaps before consolidating them, following the Human Interaction Contract.

## Orchestrate Official Spec Kit Skills

Use the installed official skills as the operational implementation of Spec Kit. Do not copy or simulate their detailed instructions inside this skill.

### LIGHT

Run source check, scoped change, proportional verification/review and brief evidence. An explicit request authorizes its reversible local documentary correction; do not insert a generic continuation or implementation approval. External actions and product gates retain their own authorization. A formal feature Specification/Plan/Tasks chain MAY be omitted only when there is no material behavior change. Record why omission is safe.

All work remains on the current branch under DEC-054. If LIGHT begins producing code or a material change, reclassify it and apply the relevant product workflow and gates.

### STANDARD — Before Implementation (resume at the pending stage)

1. Perform intake and targeted investigation; obtain the traceable Plane ID required for STANDARD/STRICT.
2. Apply **Work in the Current Branch**, preserving existing changes without Git mutations.
3. Invoke `$speckit-specify` with the demand and recovered canonical context, keeping its feature metadata associated with the Plane ID and recording the current branch. If an official helper would create/switch a branch, use its supported no-branch path or explicit feature selection; never change the official skill or silently run a Git mutation.
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

Distinguish these gates in records and explain the applicable approval to the human with its context and scope, without dumping the full gate inventory:

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

Codex skills are instructions. Read the available official `$speckit-*` SKILL.md needed for the phase and perform its workflow in this chat. No nested-call API or repeated user invocation is needed. Reading alone does not mean its workflow ran. Stop for a handoff only when required instructions, tools, environment or authority are unavailable; name that concrete blocker and the next action. Continue independent authorized work while awaiting a material answer. Do not pause merely because another skill or phase comes next.

## Completion Report

Record in the evidence/handoff as applicable; the user-facing report selects what helps understanding, decision, progress and validation under the Human Interaction Contract:

For material work, the final response must identify the current phase, actual result, remaining work and concrete next action in plain language. Give a grounded recommendation when it helps resolve a blocker or choose the next step; ask only when human input is needed. Do not end at a phase transition while necessary authorized work remains. Do not imply implementation from a Plane registration or a discovery answer.

- classification and rationale;
- Plane Work Item ID, initial/final state and synchronization result;
- observed current branch and preservation of preexisting changes under DEC-054;
- canonical sources used;
- Spec Kit artifacts created or updated;
- decisions made by the agent and their statuses;
- verification, review, and evidence results;
- current gate and exact next action;
- unchanged conditional integrations.

## Done When

- [ ] The demand has a LIGHT, STANDARD, or STRICT classification.
- [ ] Work stayed on the current branch under DEC-054, preserving preexisting changes without unauthorized Git mutations.
- [ ] Canonical sources and accepted decisions were applied.
- [ ] Official Spec Kit skills were orchestrated without duplicated workflow logic.
- [ ] Provisional and human-required decisions are explicit.
- [ ] Human decisions received context and provenance; important product behavior received adequate discovery.
- [ ] Before `READY FOR IMPLEMENTATION`, specification comprehension and absence of silent product assumptions were reviewed.
- [ ] The correct human or completion gate is reported.
