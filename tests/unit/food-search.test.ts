import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { searchFoods } from "../../src/food-search.ts";

const foods = JSON.parse(
  readFileSync(new URL("../../src/data/tbca.json", import.meta.url), "utf8"),
);

test("RF-PRE-002: search combines words without accents, order or case restrictions", () => {
  const results = searchFoods(foods, "  COZIDO   feijao ");
  assert.ok(results.length > 0);
  assert.ok(results.some((f) => f.code === "BRC0001T"));
  assert.ok(!results.some((f) => f.name.includes("cru,")));
  assert.equal(searchFoods(foods, "brc0208a")[0].code, "BRC0208A");
  assert.deepEqual(searchFoods(foods, "alimento inexistente xyz"), []);
  assert.deepEqual(searchFoods(foods, "   "), foods);
});

test("RN-PRE-001/003: catalog has unique official codes, source, units and quantitative macros", () => {
  assert.ok(foods.length >= 70);
  assert.equal(
    new Set(foods.map((f: { code: string }) => f.code)).size,
    foods.length,
  );
  for (const food of foods) {
    assert.equal(food.source, "TBCA 7.3");
    assert.equal(new URL(food.url).hostname, "www.tbca.net.br");
    assert.equal(food.grams, 100);
    assert.ok(!JSON.stringify(food).includes("\uFFFD"));
    for (const field of ["kcal", "protein", "carbs", "fat", "fiber"]) {
      assert.ok(
        Number.isFinite(food[field]) && food[field] >= 0,
        `${food.code}: ${field}`,
      );
    }
    for (const measure of food.measures) assert.ok(measure.grams > 0);
    for (const nutrient of Object.values(food.nutrients) as {
      value: number | null;
      unit: string;
      original: string;
    }[]) {
      assert.ok(nutrient.unit && nutrient.original);
      assert.ok(nutrient.value === null || Number.isFinite(nutrient.value));
    }
  }
});
