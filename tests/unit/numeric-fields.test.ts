import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

async function loadComponent(name: string) {
  const compiled = ts
    .transpileModule(
      readFileSync(new URL(`../../src/${name}.tsx`, import.meta.url), "utf8"),
      {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
        },
      },
    )
    .outputText.replace(
      /from "(react(?:\/jsx-runtime)?)"/g,
      (_, moduleName: string) =>
        `from ${JSON.stringify(import.meta.resolve(moduleName))}`,
    );
  return import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
}

const { PercentField, formatPercentValue, parsePercentValue } =
  await loadComponent("PercentField");
const { ValueField, formatValue, parseValue } =
  await loadComponent("ValueField");

test("percentage field formats pt-BR and parses digits at its decimal precision", () => {
  assert.equal(formatPercentValue(1.23), "1,23");
  assert.equal(formatPercentValue(1.2345, 4), "1,2345");
  assert.equal(parsePercentValue("456"), 4.56);
  assert.equal(parsePercentValue("12346", 4), 1.2346);
  assert.equal(parsePercentValue(""), undefined);

  const html = renderToStaticMarkup(
    createElement(PercentField, {
      "aria-label": "Percentual de proteína",
      value: 25,
      onChange() {},
    }),
  );
  assert.match(html, /aria-label="Percentual de proteína"/);
  assert.match(html, /inputMode="decimal"/);
  assert.match(html, /value="25,00"/);
});

test("value field formats values, supports optional empty and signed inputs", () => {
  assert.equal(formatValue(1234.5), "1.234,50");
  assert.equal(formatValue(12, 0), "12");
  assert.equal(parseValue("12345"), 123.45);
  assert.equal(parseValue("-12345", 2, true), -123.45);
  assert.equal(parseValue("-12345", 2, false), 123.45);
  assert.equal(parseValue("", 2, false, true), undefined);
  assert.equal(parseValue(""), 0);

  const html = renderToStaticMarkup(
    createElement(ValueField, {
      "aria-label": "Peso",
      value: 60.5,
      showCurrencyPrefix: false,
      onChange() {},
    }),
  );
  assert.match(html, /aria-label="Peso"/);
  assert.match(html, /inputMode="decimal"/);
  assert.match(html, /value="60,50"/);
  assert.doesNotMatch(html, /R\$/);

  const currencyHtml = renderToStaticMarkup(
    createElement(ValueField, { value: 10 }),
  );
  assert.match(currencyHtml, /R\$/);
});
