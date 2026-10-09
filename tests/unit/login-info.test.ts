import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

// Exercise the real component and callbacks; native dialog/focus needs WebView.
const source = readFileSync(
  new URL("../../src/LoginInfo.tsx", import.meta.url),
  "utf8",
)
  .replace(
    'import { useEffect, useRef, useState } from "react";',
    "const useEffect = () => {}; const useRef = () => ({current: null}); const useState = () => [null, () => {}];",
  )
  .replace(
    'import { getVersion } from "@tauri-apps/api/app";',
    "const getVersion = async () => 'fixture';",
  )
  .replace(
    'import { isTauri } from "@tauri-apps/api/core";',
    "const isTauri = () => false;",
  )
  .replace(
    'import { version as previewVersion } from "../package.json";',
    "const previewVersion = 'fixture';",
  );
const compiled = ts
  .transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
  })
  .outputText.replace(
    /from "react\/jsx-runtime"/g,
    `from ${JSON.stringify(import.meta.resolve("react/jsx-runtime"))}`,
  );
const { LoginInfo } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("license support and its errors stay inside the closed information dialog", () => {
  const tree = LoginInfo({
    busy: false,
    onAdmin: () => {},
    children: "SUPPORT_FIXTURE",
    error: "ERROR_FIXTURE",
  });
  const html = renderToStaticMarkup(tree);
  const start = html.indexOf("<dialog");
  const end = html.indexOf("</dialog>");
  assert.ok(start >= 0 && end > start);
  assert.ok(
    html.indexOf("SUPPORT_FIXTURE") > start &&
      html.indexOf("SUPPORT_FIXTURE") < end,
  );
  assert.ok(
    html.indexOf("ERROR_FIXTURE") > start &&
      html.indexOf("ERROR_FIXTURE") < end,
  );
  assert.doesNotMatch(
    html.slice(start, html.indexOf(">", start)),
    /\bopen(?:=|\s|$)/,
  );
  assert.match(html, /role="alert"/);
});

test("information dialog prevents dismissal only during an operation and keeps administrator access", () => {
  for (const busy of [false, true]) {
    let admin = 0;
    const tree = LoginInfo({ busy, onAdmin: () => admin++ });
    const dialog = tree.props.children[1];
    let prevented = false;
    dialog.props.onCancel({
      preventDefault: () => {
        prevented = true;
      },
    });
    assert.equal(prevented, busy);
    const actions = dialog.props.children.at(-1);
    assert.equal(actions.props.children[0].props.children.props.disabled, busy);
    const button = actions.props.children[1];
    assert.equal(button.props.disabled, busy);
    if (!busy) button.props.onClick();
    assert.equal(admin, busy ? 0 : 1);
  }
});

test("failed initial status does not trap the information dialog", () => {
  const tree = LoginInfo({
    busy: false,
    adminUnavailable: true,
    onAdmin: () => assert.fail("admin"),
    error: "Falha ao consultar",
  });
  const dialog = tree.props.children[1];
  dialog.props.onCancel({
    preventDefault: () => assert.fail("Escape must remain available"),
  });
  const actions = dialog.props.children.at(-1);
  assert.equal(actions.props.children[0].props.children.props.disabled, false);
  assert.equal(actions.props.children[1].props.disabled, true);
});
