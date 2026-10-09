import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFoodCatalog } from "../../src/food-catalog.ts";

test("RF-PRE-002: catalog parsing rejects corruption and duplicate identities", () => {
  const raw = readFileSync(
    new URL("../../src/data/taco.json", import.meta.url),
    "utf8",
  );
  const foods = parseFoodCatalog(raw);
  assert.equal(foods.length, 1);
  assert.equal(foods[0].code, "TACO4-522");
  assert.throws(() => parseFoodCatalog("{}"));
  assert.throws(() => parseFoodCatalog(JSON.stringify([...foods, ...foods])));
  assert.throws(() =>
    parseFoodCatalog(JSON.stringify([{ ...foods[0], kcal: -1 }])),
  );
  assert.throws(() =>
    parseFoodCatalog(
      JSON.stringify([
        { ...foods[0], measures: [{ name: "Inválida", grams: 0 }] },
      ]),
    ),
  );
});

test("complete TBCA assets parse together while empty source pages remain blocked", () => {
  const foods = parseFoodCatalog(
    readFileSync(new URL("../../src/data/tbca.json", import.meta.url), "utf8"),
  );
  assert.equal(foods.length, 5874);
  const empty = foods.find((f) => f.code === "BRC0293T");
  assert.ok(empty?.name);
  assert.ok(empty?.compositionIssues?.length);
  assert.equal(empty?.kcal, null);
  assert.equal(foods.filter((f) => f.compositionIssues?.length).length, 5);
});

test("RN-PRE-001: TACO fallback belongs to the complete inventory qualification", () => {
  const coverage = JSON.parse(
    readFileSync(
      new URL("../../src/data/taco-coverage.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(coverage.length, 597);
  assert.equal(
    new Set(coverage.map((r: { code: string }) => r.code)).size,
    597,
  );
  assert.deepEqual(
    coverage
      .filter((r: { fallbackEnabled: boolean }) => r.fallbackEnabled)
      .map((r: { code: string }) => r.code),
    ["TACO4-522"],
  );
  const qualified = coverage.find(
    (r: { code: string }) => r.code === "TACO4-522",
  );
  assert.equal(Object.keys(qualified.evidence.reviewedTbcaFamily).length, 9);
  assert.ok(qualified.evidence.inventorySha256.match(/^[a-f0-9]{64}$/));
});
