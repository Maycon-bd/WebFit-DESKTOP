import test from "node:test";
import assert from "node:assert/strict";
import {
  composition,
  menuComposition,
  displayName,
} from "../../src/nutrition.ts";
test("TA-PRE-003: proportional composition retains precision across meals", () => {
  const item = {
    name: "Fictício",
    source: "fixture",
    grams: 33.333,
    kcal: 123.4,
    protein: 9.7,
    carbs: 15.3,
    fat: 2.1,
    fiber: 1.7,
  };
  const a = composition([item]);
  assert.ok(Math.abs(a.kcal - 41.132922) < 1e-9);
  const totals = menuComposition([
    { name: "Refeição 1", items: [item] },
    { name: "Refeição 2", items: [item] },
  ]);
  assert.equal(totals.kcal, a.kcal * 2);
});
test("RN-PAT-004: social name preferred without deleting civil name", () => {
  const patient = {
    name: "Nome civil fictício",
    socialName: "Nome social fictício",
  };
  assert.equal(displayName(patient), patient.socialName);
  assert.equal(patient.name, "Nome civil fictício");
  assert.equal(displayName({ ...patient, socialName: "" }), patient.name);
});

test("RN-PRE-003: missing macro propagates through meal and menu without becoming zero", () => {
  const food = {
    name: "Fonte fictícia",
    source: "fixture",
    grams: 50,
    kcal: 100,
    protein: 10,
    carbs: 20,
    fat: 1,
    fiber: null,
  };
  assert.equal(composition([food]).fiber, null);
  const totals = menuComposition([
    { name: "Refeição", items: [food, { ...food, fiber: 2 }] },
  ]);
  assert.equal(totals.fiber, null);
  assert.equal(totals.kcal, 100);
});
