import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

let fixtureStatus: unknown = null;
let fixtureError = false;
const source = readFileSync(
  new URL("../../src/BackupNotice.tsx", import.meta.url),
  "utf8",
)
  .replace(
    'import { useEffect, useState } from "react";',
    "const useEffect = () => {}; const useState = (initial) => [globalThis.__webfitBackupFixture(initial), () => {}];",
  )
  .replace(
    'import { api } from "./api";',
    "const api = () => Promise.reject(new Error('fixture')); ",
  );
const compiled = ts
  .transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
  })
  .outputText.replace(
    /from "react\/jsx-runtime"/g,
    `from ${JSON.stringify(import.meta.resolve("react/jsx-runtime"))}`,
  );
const { BackupNotice, backupWarning } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
function render(status: unknown, queryError = false, busy = false) {
  fixtureStatus = status;
  fixtureError = queryError;
  const globals = globalThis as typeof globalThis & {
    __webfitBackupFixture?: (initial: unknown) => unknown;
  };
  globals.__webfitBackupFixture = (initial) =>
    initial === null ? fixtureStatus : fixtureError;
  try {
    return renderToStaticMarkup(
      BackupNotice({ token: "fixture", revision: 0, busy, onManage: () => {} }),
    );
  } finally {
    delete globals.__webfitBackupFixture;
  }
}
test("failed automatic backup alerts the session even when a recent copy exists", () => {
  const html = render({ failed: true, stale: false });
  assert.match(html, /role="alert"/);
  assert.match(html, /última tentativa de backup falhou/);
  assert.match(html, /Abrir backup e restauração/);
  assert.match(render({ failed: true, stale: false }, false, true), /disabled/);
});
test("a stale copy and a query failure have different recovery messages", () => {
  assert.match(render({ failed: false, stale: true }), /últimas 24 horas/);
  assert.match(render(null, true), /Não foi possível consultar/);
  assert.doesNotMatch(render(null, true), /últimas 24 horas/);
  assert.equal(
    backupWarning({ failed: true, stale: true }),
    "A última tentativa de backup falhou. Crie uma nova cópia.",
  );
});
test("successful recovery clears the banner without claiming unqueried state", () => {
  assert.equal(render({ failed: false, stale: false }), "");
  assert.equal(render(null), "");
});
