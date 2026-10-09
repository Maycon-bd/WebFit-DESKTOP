import test from "node:test";
import assert from "node:assert/strict";
import { monthLabel, registrationScale } from "../../src/dashboard-data.ts";
test("dashboard month labels and zero-safe chart scale", () => {
  assert.match(monthLabel("2026-01", true), /janeiro/);
  assert.match(monthLabel("2025-12"), /dez/);
  assert.equal(registrationScale([]), 1);
  assert.equal(registrationScale([{ month: "2026-01", count: 0 }]), 1);
  assert.equal(
    registrationScale([
      { month: "2026-01", count: 205 },
      { month: "2026-02", count: 2 },
    ]),
    205,
  );
});
