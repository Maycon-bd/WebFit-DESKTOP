import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Exercise the real control callbacks without a native window or real data.
const source = readFileSync(
  new URL("../../src/WindowTitleBar.tsx", import.meta.url),
  "utf8",
)
  .replace(
    /import .* from "react";/,
    `const useMemo = factory => factory(); const useEffect = () => {}; const useState = initial => [initial, () => {}];`,
  )
  .replace(
    /import .* from "@tauri-apps\/api\/window";/,
    `const getCurrentWindow = () => { throw new Error("Use fixture controls"); };`,
  );
const compiled = ts
  .transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
  })
  .outputText.replace(
    /from "react\/jsx-runtime"/g,
    `from ${JSON.stringify(import.meta.resolve("react/jsx-runtime"))}`,
  );
const { WindowTitleBar } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("window titlebar keeps drag area separate and requests close without bypassing the guard", async () => {
  const calls: string[] = [];
  const tree = WindowTitleBar({
    controls: {
      minimize: async () => {
        calls.push("minimize");
      },
      toggleMaximize: async () => {
        calls.push("toggle");
      },
      close: async () => {
        calls.push("close-request");
      },
    },
  });
  const html = renderToStaticMarkup(tree);
  assert.match(html, /data-tauri-drag-region/);
  assert.match(html, /aria-label="Minimizar janela"/);
  assert.match(html, /aria-label="Restaurar janela"/);
  assert.match(html, /aria-label="Fechar janela"/);
  const buttons = tree.props.children[2].props.children;
  for (const button of buttons) {
    button.props.onClick();
    await Promise.resolve();
  }
  assert.deepEqual(calls, ["minimize", "toggle", "close-request"]);
});
