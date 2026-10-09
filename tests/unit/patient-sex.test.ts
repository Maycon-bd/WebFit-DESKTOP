import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const compiled = ts
  .transpileModule(
    readFileSync(
      new URL("../../src/PatientSexField.tsx", import.meta.url),
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
const { PatientSexField, canonicalPatientSex } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function moduleUrl(source: string) {
  const output = ts
    .transpileModule(source, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
      },
    })
    .outputText.replace(
      /from "(react(?:\/jsx-runtime)?)"/g,
      (_, name: string) => `from ${JSON.stringify(import.meta.resolve(name))}`,
    );
  return `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
}
const appSource = ts.createSourceFile(
  "App.tsx",
  readFileSync(new URL("../../src/App.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const declarations = appSource.statements
  .filter(
    (node) =>
      ts.isFunctionDeclaration(node) &&
      ["PatientForm", "Field", "Heading"].includes(node.name?.text ?? ""),
  )
  .map((node) => node.getText(appSource))
  .join("\n");
const sexUrl = moduleUrl(
  readFileSync(
    new URL("../../src/PatientSexField.tsx", import.meta.url),
    "utf8",
  ),
);
const feedbackUrl = moduleUrl(
  readFileSync(new URL("../../src/FormFeedback.tsx", import.meta.url), "utf8"),
);
const nutritionUrl = moduleUrl(
  readFileSync(new URL("../../src/nutrition.ts", import.meta.url), "utf8"),
);
const { PatientForm } = await import(
  moduleUrl(`
  import { useState, useEffect, useRef } from "react";
  import { PatientSexField, canonicalPatientSex } from ${JSON.stringify(sexUrl)};
  import { FormFeedback } from ${JSON.stringify(feedbackUrl)};
  import { displayName } from ${JSON.stringify(nutritionUrl)};
  ${declarations}
  export { PatientForm };
`)
);
test("WEBFIT-5: actual patient form requires only name, birth and sex, including partial guardian", () => {
  const html = renderToStaticMarkup(
    createElement(PatientForm, {
      patient: {
        id: "fixture-uuid",
        internalNumber: 245,
        name: "Fixture",
        birth: "1990-01-02",
        sex: "F",
        cpf: "",
        phone: "",
        email: "",
        address: "",
        tags: [],
        guardian: { name: "Fixture guardian" },
      },
      feedback: { busy: false, error: "", notice: "" },
      busy: false,
      token: null,
      task() {},
      onChange() {},
      onClose() {},
      onSaved() {},
      onPrescription() {},
    }),
  );
  const required = (html.match(/<input\b[^>]*>/g) ?? []).filter((input) =>
    input.includes('required=""'),
  );
  assert.equal(required.length, 4);
  assert.equal(
    required.filter((input) => input.includes('type="radio"')).length,
    2,
  );
  assert.equal(
    required.filter((input) => input.includes('type="date"')).length,
    1,
  );
  assert.match(html, /Nome completo \(obrigatório\)/);
  assert.match(html, /CPF \(opcional\)/);
  assert.match(html, /CPF do responsável \(opcional\)/);
  assert.match(html, /Número do paciente: 245/);
  assert.doesNotMatch(html, /000245/);
});
test("WEBFIT-5: sex offers exactly two required named radios with no assumed selection", () => {
  const html = renderToStaticMarkup(
    createElement(PatientSexField, { value: "", onChange() {} }),
  );
  assert.match(html, /<fieldset/);
  assert.match(html, /<legend>Sexo \(obrigatório\)<\/legend>/);
  assert.equal((html.match(/type="radio"/g) ?? []).length, 2);
  assert.equal((html.match(/name="patient-sex"/g) ?? []).length, 2);
  assert.equal((html.match(/required=""/g) ?? []).length, 2);
  assert.match(html, /value="F"/);
  assert.match(html, /value="M"/);
  assert.doesNotMatch(html, /checked|type="text"/);
});
test("WEBFIT-5: known legacy values display one selection; unknown values remain visible without inference", () => {
  for (const [value, expected] of [
    ["Feminino", "F"],
    [" masculino ", "M"],
    ["F", "F"],
    ["M", "M"],
    ["outro", ""],
    ["", ""],
  ]) {
    assert.equal(canonicalPatientSex(value), expected);
    const html = renderToStaticMarkup(
      createElement(PatientSexField, { value, onChange() {} }),
    );
    assert.equal((html.match(/checked=""/g) ?? []).length, expected ? 1 : 0);
    if (value === "outro") {
      assert.match(html, /aria-describedby="patient-sex-help"/);
      assert.match(html, /Valor anterior: outro/);
    }
  }
});
test("WEBFIT-5: each radio sends its canonical choice to the form", () => {
  const received: string[] = [];
  const field = PatientSexField({
    value: "",
    onChange: (value: string) => received.push(value),
  });
  const options = field.props.children[1].props.children;
  for (const label of options) label.props.children[0].props.onChange();
  assert.deepEqual(received, ["F", "M"]);
});
test("WEBFIT-5: absent legacy sex renders safely and requires an explicit choice", () => {
  for (const value of [undefined, null]) {
    assert.equal(canonicalPatientSex(value), "");
    const html = renderToStaticMarkup(
      createElement(PatientSexField, { value, onChange() {} }),
    );
    assert.equal((html.match(/type="radio"/g) ?? []).length, 2);
    assert.doesNotMatch(html, /checked=""/);
  }
});
