import test from "node:test";
import assert from "node:assert/strict";
import { createLoginUpdateCheck } from "../../src/update-check.ts";

test("one request per login, shared by StrictMode remounts", async () => {
  const calls: string[] = [];
  const check = createLoginUpdateCheck(async (token) => {
    calls.push(token);
    return { version: "0.1.9-pilot.1.1" };
  });
  const first = check("fixture-session-one");
  assert.equal(check("fixture-session-one"), first);
  await first;
  const next = check("fixture-session-two");
  assert.notEqual(next, first);
  await next;
  assert.deepEqual(calls, ["fixture-session-one", "fixture-session-two"]);
});

test("a failed/offline check does not prevent the next login from retrying", async () => {
  let calls = 0;
  const check = createLoginUpdateCheck(async () => {
    if (++calls === 1) throw new Error("fixture offline");
    return null;
  });
  await assert.rejects(check("fixture-session-one"), /offline/);
  assert.equal(await check("fixture-session-two"), null);
  assert.equal(calls, 2);
});
