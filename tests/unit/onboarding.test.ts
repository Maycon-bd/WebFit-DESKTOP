import test from "node:test";
import assert from "node:assert/strict";
import { positionTour, shouldShowTour, tours } from "../../src/onboarding.ts";

test("RF-UX-001: first visits and replay eligibility remain independent by screen", () => {
  assert.equal(shouldShowTour("patients", []), true);
  assert.equal(shouldShowTour("patients", ["patients"]), false);
  assert.equal(shouldShowTour("patient-new", ["patients"]), true);
  assert.equal(shouldShowTour("patient", ["patient-new"]), true);
  // RF-UX-003: reorganizing navigation preserves per-screen completion IDs.
  assert.deepEqual(Object.keys(tours).sort(), [
    "access",
    "audit",
    "backup",
    "patient",
    "patient-new",
    "patients",
    "prescription",
    "profile",
  ]);
  for (const steps of Object.values(tours)) {
    assert.ok(steps.length >= 2 && steps.length <= 4);
    assert.ok(steps.every((step) => step.title && step.text && step.target));
  }
});

test("RF-UX-001: tooltip stays inside viewport near all edges and at 200% zoom", () => {
  for (const viewport of [
    { width: 1366, height: 768 },
    { width: 683, height: 384 },
  ]) {
    for (const target of [
      null,
      { left: 5, top: 5, right: 300, bottom: 60 },
      { left: 1200, top: 700, right: 1300, bottom: 760 },
      { left: -500, top: -500, right: 0, bottom: 1800 },
    ]) {
      const card = { width: 360, height: 290 };
      const position = positionTour(target, viewport, card);
      assert.ok(position.left >= 16 && position.top >= 16);
      assert.ok(position.left + card.width <= viewport.width - 16);
      assert.ok(position.top + card.height <= viewport.height - 16);
    }
  }
  const under = positionTour(
    { left: 100, top: 100, right: 200, bottom: 130 },
    { width: 1366, height: 768 },
    { width: 360, height: 290 },
  );
  assert.equal(under.top, 142);
});
