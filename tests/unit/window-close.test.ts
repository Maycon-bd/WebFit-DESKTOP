import test from "node:test";
import assert from "node:assert/strict";
import {
  closePreferenceKey,
  createCloseFlow,
  skipsCloseConfirmation,
} from "../../src/window-close.ts";

function fixture() {
  const calls: string[] = [];
  let busy = false;
  let skip = false;
  let save = async () => {
    calls.push("save");
  };
  let remember = () => {
    calls.push("remember");
  };
  const flow = createCloseFlow({
    busy: () => busy,
    skip: () => skip,
    save: () => save(),
    remember: () => remember(),
    destroy: async () => {
      calls.push("destroy");
    },
    prompt: () => {
      calls.push("prompt");
    },
    wait: () => {
      calls.push("wait");
    },
    pending: (value) => {
      calls.push(`pending:${value}`);
    },
    error: () => {
      calls.push("error");
    },
  });
  return {
    calls,
    flow,
    busy: (value: boolean) => {
      busy = value;
    },
    skip: () => {
      skip = true;
    },
    save: (value: typeof save) => {
      save = value;
    },
    remember: (value: typeof remember) => {
      remember = value;
    },
  };
}

test("close preference accepts only the explicit boolean and fails safely when storage is unavailable", () => {
  for (const value of [null, "false", "1", "garbage", "true"]) {
    assert.equal(
      skipsCloseConfirmation({
        getItem: (key) => {
          assert.equal(key, closePreferenceKey);
          return value;
        },
      }),
      value === "true",
    );
  }
  assert.equal(
    skipsCloseConfirmation({
      getItem: () => {
        throw Error("unavailable");
      },
    }),
    false,
  );
});
test("X prompts once; cancel performs no save or persistence and allows another request", () => {
  const f = fixture();
  f.flow.request();
  f.flow.request();
  assert.deepEqual(f.calls, ["prompt"]);
  assert.equal(f.flow.cancel(), true);
  f.flow.request();
  assert.deepEqual(f.calls, ["prompt", "prompt"]);
});
test("confirmation saves before remembering and destroying; unchecked confirmation stores nothing", async () => {
  for (const remember of [false, true]) {
    const f = fixture();
    f.flow.request();
    await f.flow.confirm(remember);
    assert.deepEqual(f.calls, [
      "prompt",
      "pending:true",
      "save",
      ...(remember ? ["remember"] : []),
      "destroy",
      "pending:false",
    ]);
  }
});
test("opt-out closes directly but still saves and deduplicates repeated native requests", async () => {
  const f = fixture();
  f.skip();
  f.flow.request();
  f.flow.request();
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(f.calls, [
    "pending:true",
    "save",
    "destroy",
    "pending:false",
  ]);
});
test("save failure keeps the window open and preference unchanged; retry uses latest callback", async () => {
  const f = fixture();
  f.skip();
  f.save(async () => {
    throw Error("save failed");
  });
  f.flow.request();
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(f.calls, [
    "pending:true",
    "prompt",
    "error",
    "pending:false",
  ]);
  f.save(async () => {
    f.calls.push("retry-save");
  });
  await f.flow.confirm(true);
  assert.deepEqual(f.calls.slice(-5), [
    "pending:true",
    "retry-save",
    "remember",
    "destroy",
    "pending:false",
  ]);
});
test("busy operations defer opt-out close without a question; cancellation is blocked during draft save", async () => {
  const f = fixture();
  f.skip();
  f.busy(true);
  f.flow.request();
  await f.flow.confirm(true);
  assert.deepEqual(f.calls, ["wait"]);
  f.busy(false);
  let release = () => {};
  f.save(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      }),
  );
  f.flow.resume();
  assert.equal(f.flow.cancel(), false);
  await f.flow.confirm(true);
  f.flow.request();
  release();
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(f.calls, [
    "wait",
    "pending:true",
    "destroy",
    "pending:false",
  ]);
});
test("preference write failure does not destroy the window; unchecked retry can close", async () => {
  const f = fixture();
  f.remember(() => {
    throw Error("storage unavailable");
  });
  await f.flow.confirm(true);
  assert.ok(!f.calls.includes("destroy"));
  assert.ok(f.calls.includes("error"));
  await f.flow.confirm(false);
  assert.equal(f.calls.filter((call) => call === "destroy").length, 1);
});
