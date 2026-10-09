import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const source = ts.createSourceFile(
  "GuidedTour.tsx",
  readFileSync(new URL("../../src/GuidedTour.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const tour = source.statements.find(
  (node) => ts.isFunctionDeclaration(node) && node.name?.text === "Tour",
)!;
const output = ts
  .transpileModule(
    `
  import { useEffect, useLayoutEffect, useRef, useState } from "react";
  import { tours, positionTour } from ${JSON.stringify(new URL("../../src/onboarding.ts", import.meta.url).href)};
  ${tour.getText(source)}
  export { Tour };
`,
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
const { Tour } = await import(
  `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`
);

test("RF-UX-001: completed tours have no fixed replay button; automatic tours keep teaching controls", () => {
  const props = {
    screen: "patients",
    automatic: false,
    initialFailure: "",
    finish: async () => {},
  };
  assert.equal(renderToStaticMarkup(createElement(Tour, props)), "");
  const active = renderToStaticMarkup(
    createElement(Tour, { ...props, automatic: true }),
  );
  assert.match(active, /Pular/);
  assert.match(active, /Próximo/);
  assert.match(active, /role="dialog"/);
  assert.doesNotMatch(active, /Ver tutorial|Reiniciar tutoriais/);
  const failure = renderToStaticMarkup(
    createElement(Tour, { ...props, initialFailure: "Fixture failure" }),
  );
  assert.match(failure, /role="status"/);
  assert.match(failure, /Fixture failure/);
  assert.doesNotMatch(failure, /<button/);
});
