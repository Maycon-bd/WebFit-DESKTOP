import test from "node:test";
import assert from "node:assert/strict";
import {
  auditQuery,
  auditActor,
  createAuditOpening,
  emptyAuditFilters,
} from "../../src/audit-view.ts";

test("audit filters preserve the UTC half-open interval and combine metadata filters", () => {
  const query = auditQuery({
    ...emptyAuditFilters,
    from: "2026-10-01T09:00",
    to: "2026-10-02T09:00",
    user: "fixture-user",
    action: "LOGIN",
    entity: "USER",
    result: "DENIED",
  });
  assert.deepEqual(query, {
    from: new Date("2026-10-01T09:00").toISOString(),
    to: new Date("2026-10-02T09:00").toISOString(),
    user: "fixture-user",
    action: "LOGIN",
    entity: "USER",
    result: "DENIED",
  });
  assert.deepEqual(auditQuery(emptyAuditFilters), { from: null, to: null });
});

test("invalid and reversed audit periods fail before querying", () => {
  assert.throws(
    () => auditQuery({ ...emptyAuditFilters, from: "invalid" }),
    /datas válidas/,
  );
  for (const to of ["2026-10-01T09:00", "2026-09-30T09:00"]) {
    assert.throws(
      () => auditQuery({ ...emptyAuditFilters, from: "2026-10-01T09:00", to }),
      /anterior/,
    );
  }
});

test("StrictMode subscriptions share one audit opening; a failed opening permits retry", async () => {
  let writes = 0;
  const open = createAuditOpening(async () => {
    writes++;
    return "fixture-page";
  });
  const first = open();
  assert.equal(open(), first);
  await first;
  await open();
  assert.equal(writes, 1);
  let attempts = 0;
  const retry = createAuditOpening(async () => {
    if (++attempts === 1) throw new Error("fixture-query-failure");
    return "fixture-page";
  });
  await assert.rejects(retry(), /fixture-query-failure/);
  assert.equal(await retry(), "fixture-page");
  assert.equal(attempts, 2);
});

test("audit actors never substitute a user label for system or unauthenticated actors", () => {
  assert.equal(auditActor("SYSTEM", "fixture-name"), "Sistema");
  assert.equal(
    auditActor("UNAUTHENTICATED", "fixture-name"),
    "Não autenticado",
  );
  assert.equal(auditActor("USER", "fixture-name"), "fixture-name");
  assert.equal(auditActor("USER", null), "Usuário indisponível");
});
