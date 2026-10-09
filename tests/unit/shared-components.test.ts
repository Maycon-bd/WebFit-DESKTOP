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
      (_, name: string) => `from ${JSON.stringify(import.meta.resolve(name))}`,
    );
  return import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
}

const { DataTable } = await loadComponent("DataTable");
const { FormField } = await loadComponent("FormField");
const { DateInput } = await loadComponent("DateInput");
const { SearchInput } = await loadComponent("SearchInput");

test("shared table names its scroll region and columns, escapes data and retains the result limit notice", () => {
  const html = renderToStaticMarkup(
    createElement(DataTable, {
      label: "Pacientes encontrados",
      rows: [{ id: "fixture-uuid", name: "Fixture <paciente>" }],
      rowKey: (row: { id: string }) => row.id,
      columns: [
        {
          key: "name",
          label: "Paciente",
          render: (row: { name: string }) => row.name,
        },
      ],
      footer: createElement("p", null, "Refine a pesquisa."),
    }),
  );
  assert.match(
    html,
    /role="region" aria-label="Pacientes encontrados" tabindex="0"/,
  );
  assert.match(html, /<caption[^>]*>Pacientes encontrados<\/caption>/);
  assert.match(html, /<th scope="col">Paciente<\/th>/);
  assert.match(html, /Fixture &lt;paciente&gt;/);
  assert.match(html, /Refine a pesquisa/);
});

test("shared table row actions retain the original UUID callback and disabled state", () => {
  const opened: string[] = [];
  for (const busy of [false, true]) {
    const table = DataTable({
      label: "Eventos de auditoria",
      rows: [{ id: "audit-uuid" }],
      rowKey: (row: { id: string }) => row.id,
      columns: [
        {
          key: "actions",
          label: "Ações",
          render: (row: { id: string }) =>
            createElement(
              "button",
              {
                disabled: busy,
                onClick: () => opened.push(row.id),
              },
              "Detalhes",
            ),
        },
      ],
    });
    const row = table.props.children[0].props.children[2].props.children[0];
    assert.equal(row.key, "audit-uuid");
    const button = row.props.children[0].props.children;
    assert.equal(button.props.disabled, busy);
    if (!button.props.disabled) button.props.onClick();
  }
  assert.deepEqual(opened, ["audit-uuid"]);
});

test("date controls preserve civil and local date-time strings, required and input events", () => {
  for (const [type, value] of [
    ["date", "1990-01-02"],
    ["datetime-local", "2026-10-09T08:30"],
  ]) {
    let received = "";
    const input = DateInput({
      type,
      value,
      required: true,
      min: value,
      onChange: (event: { target: { value: string } }) => {
        received = event.target.value;
      },
    });
    assert.equal(input.props.type, type);
    assert.equal(input.props.value, value);
    assert.equal(input.props.min, value);
    assert.equal(input.props.required, true);
    input.props.onChange({ target: { value: "" } });
    assert.equal(received, "");
    const html = renderToStaticMarkup(
      createElement(FormField, { label: "Data" }, input),
    );
    assert.match(html, /<label class="field"><span>Data<\/span><input/);
  }
});

test("search input preserves text, native search type and the caller's change handler", () => {
  let query = "";
  const input = SearchInput({
    value: "São arroz",
    placeholder: "Pesquisar",
    onChange: (event: { target: { value: string } }) => {
      query = event.target.value;
    },
  });
  assert.equal(input.props.type, "search");
  assert.equal(input.props.value, "São arroz");
  input.props.onChange({ target: { value: "BRC0208A" } });
  assert.equal(query, "BRC0208A");
});
