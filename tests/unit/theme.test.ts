import { test } from "node:test";
import assert from "node:assert/strict";
import { readTheme, saveTheme, themeStorageKey } from "../../src/theme.ts";

test("tema ausente, inválido e armazenamento inacessível preservam acesso claro", () => {
  for (const value of [null, "", "system", "Dark", "{}", "light"]) {
    assert.equal(readTheme({ getItem: () => value }), "light");
  }
  assert.equal(
    readTheme({
      getItem: () => {
        throw new Error("unavailable");
      },
    }),
    "light",
  );
});

test("preferência escura reabre e troca para claro sem alterar outras chaves", () => {
  const values = new Map<string, string>([["unrelated", "keep"]]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  assert.equal(saveTheme(storage, "dark"), true);
  assert.equal(readTheme(storage), "dark");
  assert.equal(values.get(themeStorageKey), "dark");
  assert.equal(saveTheme(storage, "light"), true);
  assert.equal(readTheme(storage), "light");
  assert.equal(values.get("unrelated"), "keep");
  assert.equal(values.size, 2);
});

test("falha de persistência retorna falha real e pode ser repetida", () => {
  let unavailable = true;
  let saved = "";
  const storage = {
    setItem: (_: string, value: string) => {
      if (unavailable) throw new Error("storage blocked");
      saved = value;
    },
  };
  assert.equal(saveTheme(storage, "dark"), false);
  assert.equal(saved, "");
  unavailable = false;
  assert.equal(saveTheme(storage, "dark"), true);
  assert.equal(saved, "dark");
});
