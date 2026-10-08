import test from "node:test";
import assert from "node:assert/strict";
import {
  createSessionUpdateCheck,
  startSessionUpdateChecks,
  UPDATE_INTERVAL_MS,
  UPDATE_RESUME_COOLDOWN_MS,
} from "../../src/update-check.ts";

test("one request per login, shared by StrictMode remounts", async () => {
  const calls: string[] = [];
  const check = createSessionUpdateCheck(async (token) => {
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
  const check = createSessionUpdateCheck(async () => {
    if (++calls === 1) throw new Error("fixture offline");
    return null;
  });
  await assert.rejects(check("fixture-session-one"), /offline/);
  assert.equal(await check("fixture-session-two"), null);
  assert.equal(calls, 2);
});

test("a session discovers a release published after login at the next interval", async () => {
  let now = 0;
  let available: string | null = null;
  let calls = 0;
  const check = createSessionUpdateCheck(
    async () => {
      calls++;
      return available;
    },
    () => now,
  );
  assert.equal(await check("session"), null);
  available = "next-version";
  now = UPDATE_INTERVAL_MS - 1;
  assert.equal(await check("session"), null);
  now++;
  assert.equal(await check("session"), available);
  assert.equal(calls, 2);
});

test("resume respects cooldown and shares pending requests with the timer", async () => {
  let now = 0;
  let calls = 0;
  let resolveRequest: (value: string) => void = () => {};
  const check = createSessionUpdateCheck(
    () => {
      calls++;
      return new Promise<string>((resolve) => {
        resolveRequest = resolve;
      });
    },
    () => now,
  );
  const first = check("session");
  await Promise.resolve();
  now = UPDATE_INTERVAL_MS;
  assert.equal(check("session", "resume"), first);
  assert.equal(check("session"), first);
  resolveRequest("first");
  await first;
  const resumed = check("session", "resume");
  await Promise.resolve();
  assert.notEqual(resumed, first);
  resolveRequest("second");
  await resumed;
  now += UPDATE_RESUME_COOLDOWN_MS - 1;
  assert.equal(check("session", "resume"), resumed);
  now++;
  const next = check("session", "resume");
  await Promise.resolve();
  resolveRequest("third");
  await next;
  assert.equal(calls, 3);
});

test("offline attempt retries in the same session after resume cooldown", async () => {
  let now = 0;
  let calls = 0;
  const check = createSessionUpdateCheck(
    async () => {
      if (++calls === 1) throw new Error("offline");
      return "recovered";
    },
    () => now,
  );
  await assert.rejects(check("session"), /offline/);
  now = UPDATE_RESUME_COOLDOWN_MS;
  assert.equal(await check("session", "resume"), "recovered");
  assert.equal(calls, 2);
});

test("returning to the window does not skip the next periodic check", async () => {
  let now = 0;
  let tick = () => {};
  let resume = () => {};
  const attempts: number[] = [];
  const check = createSessionUpdateCheck(
    async () => {
      attempts.push(now);
      return null;
    },
    () => now,
  );
  const stop = startSessionUpdateChecks({
    token: "session",
    check,
    onResult: () => {},
    isPaused: () => false,
    environment: {
      every: (callback) => {
        tick = callback;
        return () => {};
      },
      onResume: (callback) => {
        resume = callback;
        return () => {};
      },
    },
  });
  await new Promise<void>((resolve) => setImmediate(resolve));
  now = 5 * 60 * 1000;
  resume();
  await new Promise<void>((resolve) => setImmediate(resolve));
  now = UPDATE_INTERVAL_MS;
  tick();
  await new Promise<void>((resolve) => setImmediate(resolve));
  now = 2 * UPDATE_INTERVAL_MS;
  tick();
  await new Promise<void>((resolve) => setImmediate(resolve));
  stop();
  assert.deepEqual(attempts, [
    0,
    5 * 60 * 1000,
    UPDATE_INTERVAL_MS,
    2 * UPDATE_INTERVAL_MS,
  ]);
});

test("old session completion cannot replace the new session cache", async () => {
  let resolveOld: (value: string) => void = () => {};
  const check = createSessionUpdateCheck((token) =>
    token === "old"
      ? new Promise<string>((resolve) => {
          resolveOld = resolve;
        })
      : Promise.resolve("new-result"),
  );
  const old = check("old");
  await Promise.resolve();
  const current = check("new");
  await current;
  resolveOld("old-result");
  await old;
  assert.equal(check("new"), current);
  assert.equal(await check("new"), "new-result");
});

test("subscription cleans up, ignores late replies, pauses installation and resumes", async () => {
  let timer = () => {};
  let resume = () => {};
  let removed = 0;
  let paused = false;
  let calls = 0;
  let resolveRequest: (value: string) => void = () => {};
  const delivered: string[] = [];
  const cleanup = startSessionUpdateChecks({
    token: "old",
    check: () => {
      calls++;
      return new Promise<string>((resolve) => {
        resolveRequest = resolve;
      });
    },
    onResult: (value) => delivered.push(value),
    isPaused: () => paused,
    environment: {
      every: (callback, interval) => {
        assert.equal(interval, UPDATE_INTERVAL_MS);
        timer = callback;
        return () => {
          removed++;
        };
      },
      onResume: (callback) => {
        resume = callback;
        return () => {
          removed++;
        };
      },
    },
  });
  assert.equal(calls, 1);
  paused = true;
  timer();
  resume();
  assert.equal(calls, 1);
  resolveRequest("during-installation");
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(delivered, []);
  paused = false;
  resume();
  assert.equal(calls, 2);
  cleanup();
  resolveRequest("after-logout");
  await new Promise<void>((resolve) => setImmediate(resolve));
  timer();
  resume();
  assert.equal(calls, 2);
  assert.equal(removed, 2);
  assert.deepEqual(delivered, []);
});
