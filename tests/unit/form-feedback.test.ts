import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Compile the actual TSX with the existing compiler. No DOM substitute is used:
// these checks cover emitted accessible content; focus/scroll need WebView QA.
const compiled = ts
  .transpileModule(
    readFileSync(
      new URL("../../src/FormFeedback.tsx", import.meta.url),
      "utf8",
    ),
    {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
      },
    },
  )
  .outputText.replace(
    /from "(react(?:\/jsx-runtime)?)"/g,
    (_, name: string) => `from ${JSON.stringify(import.meta.resolve(name))}`,
  );
const { FormFeedback } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("V03: in-flight feedback announces progress instead of stale success", () => {
  const html = renderToStaticMarkup(
    createElement(FormFeedback, {
      busy: true,
      error: "",
      notice: "Cadastro salvo.",
    }),
  );
  assert.match(html, /role="status"/);
  assert.match(html, /Concluindo operação/);
  assert.doesNotMatch(html, /Cadastro salvo/);
});

test("V03: failure is safely escaped, announced and focusable for correction", () => {
  const html = renderToStaticMarkup(
    createElement(FormFeedback, {
      busy: false,
      error: "Falha <fixture>",
      notice: "",
    }),
  );
  assert.match(html, /role="alert"/);
  assert.match(html, /tabindex="-1"/);
  assert.match(html, /Falha &lt;fixture&gt;/);
  assert.doesNotMatch(html, /Cadastro salvo|Perfil salvo|Concluindo operação/);
});

test("V03: confirmed success has one polite status and no error alert", () => {
  const html = renderToStaticMarkup(
    createElement(FormFeedback, {
      busy: false,
      error: "",
      notice: "Perfil salvo.",
    }),
  );
  assert.equal((html.match(/role="status"/g) ?? []).length, 1);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Perfil salvo/);
  assert.doesNotMatch(html, /role="alert"|Concluindo operação/);
});
