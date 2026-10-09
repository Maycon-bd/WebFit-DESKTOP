import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const compiled = ts
  .transpileModule(
    readFileSync(
      new URL("../../src/WindowCloseGuard.tsx", import.meta.url),
      "utf8",
    ),
    {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
      },
    },
  )
  .outputText.replace(/from "([^"]+)"/g, (_, name: string) => {
    const url = name.startsWith("./")
      ? new URL(`../../src/${name.slice(2)}.ts`, import.meta.url).href
      : import.meta.resolve(name);
    return `from ${JSON.stringify(url)}`;
  });
const { WindowCloseGuard } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
test("close dialog has named question, labelled preference, safe initial action and busy status", () => {
  for (const busy of [false, true]) {
    const html = renderToStaticMarkup(
      createElement(WindowCloseGuard, {
        busy,
        beforeClose: async () => {},
      }),
    );
    assert.match(
      html,
      /<dialog[^>]*aria-labelledby="close-title"[^>]*aria-describedby="close-description"/,
    );
    assert.match(html, /<h2 id="close-title">Fechar o WebFit Desktop\?<\/h2>/);
    assert.match(
      html,
      /<label[^>]*><input type="checkbox"\/>Não perguntar novamente<\/label>/,
    );
    assert.match(html, /<button type="button" autofocus="">Cancelar<\/button>/);
    assert.match(
      html,
      busy ? /class="primary" disabled="">Fechar/ : /class="primary">Fechar/,
    );
    assert.equal(html.includes('role="status"'), busy);
    assert.doesNotMatch(html, /<dialog[^>]*\sopen[=> ]/);
  }
});
