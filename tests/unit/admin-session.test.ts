import test from "node:test";
import assert from "node:assert/strict";
import { createAdminSessionGuard } from "../../src/admin-session.ts";

test("a pending operation cannot restore a master session after logout, lock or another login", () => {
  const guard = createAdminSessionGuard();
  const pendingLogin = guard.capture();
  guard.clear();
  assert.equal(guard.valid(pendingLogin), false);
  guard.open("fixture-token");
  const pendingKey = guard.capture();
  assert.equal(guard.valid(pendingKey), true);
  guard.clear();
  assert.equal(guard.valid(pendingKey), false);
  assert.equal(guard.capture().token, null);
  guard.open("second-fixture-token");
  assert.equal(guard.valid(pendingKey), false);
});
