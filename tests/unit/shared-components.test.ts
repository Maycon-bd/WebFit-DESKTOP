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

const { MestreGrid, sortGridRows } = await loadComponent("MestreGrid");
const { FormField } = await loadComponent("FormField");
const {
  DateField,
  dateDigitsToIso,
  dateIsoToDigits,
  dateWithinRange,
  formatDateDigits,
} = await loadComponent("DateField");
const { SearchInput } = await loadComponent("SearchInput");

test("MestreGrid names its scroll region and columns, escapes data and retains the result limit notice", () => {
  const html = renderToStaticMarkup(
    createElement(MestreGrid, {
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
  assert.match(html, /Paciente/);
  assert.match(html, /Fixture &lt;paciente&gt;/);
  assert.match(html, /Refine a pesquisa/);
});

test("MestreGrid preserves rendered row actions and their disabled state", () => {
  const opened: string[] = [];
  for (const busy of [false, true]) {
    const actionColumn = {
      key: "actions",
      label: "Ações",
      sortable: false,
      render: (row: { id: string }) =>
        createElement(
          "button",
          {
            disabled: busy,
            onClick: () => opened.push(row.id),
          },
          "Detalhes",
        ),
    };
    const html = renderToStaticMarkup(
      createElement(MestreGrid, {
        label: "Eventos de auditoria",
        rows: [{ id: "audit-uuid" }],
        rowKey: (row: { id: string }) => row.id,
        columns: [actionColumn],
      }),
    );
    assert.match(
      html,
      busy
        ? /<td><button disabled="">Detalhes<\/button><\/td>/
        : /<td><button>Detalhes<\/button><\/td>/,
    );
    if (!busy) {
      const action = actionColumn.render({ id: "audit-uuid" });
      action.props.onClick();
    }
  }
  assert.deepEqual(opened, ["audit-uuid"]);
});

test("MestreGrid sorts numeric and localized text values in either direction", () => {
  const column = {
    key: "name",
    label: "Paciente",
    sortValue: (row: { name: string; number: number }) => row.name,
    render: (row: { name: string }) => row.name,
  };
  const rows = [
    { name: "Zélia", number: 10 },
    { name: "Álvaro", number: 2 },
  ];
  assert.deepEqual(
    sortGridRows(rows, column, "ascending").map(
      (row: { name: string }) => row.name,
    ),
    ["Álvaro", "Zélia"],
  );
  assert.deepEqual(
    sortGridRows(rows, column, "descending").map(
      (row: { name: string }) => row.name,
    ),
    ["Zélia", "Álvaro"],
  );
});

test("date field formats DD/MM/YYYY and preserves valid ISO civil dates", () => {
  assert.equal(dateIsoToDigits("2005-03-24"), "24032005");
  assert.equal(dateDigitsToIso("24032005"), "2005-03-24");
  assert.equal(formatDateDigits("24032005"), "24/03/2005");
  assert.equal(dateDigitsToIso("29022024"), "2024-02-29");
  assert.equal(dateDigitsToIso("29022023"), undefined);
  assert.equal(dateIsoToDigits("2026-02-30"), "");
  assert.equal(dateDigitsToIso("01012000"), "2000-01-01");
  assert.equal(dateWithinRange("2000-01-01", "2000-01-01", "2000-12-31"), true);
  assert.equal(
    dateWithinRange("1999-12-31", "2000-01-01", "2000-12-31"),
    false,
  );
  assert.equal(
    dateWithinRange("2001-01-01", "2000-01-01", "2000-12-31"),
    false,
  );
});

test("date field keeps FormField required semantics and provides an accessible calendar trigger", () => {
  const html = renderToStaticMarkup(
    createElement(
      FormField,
      { label: "Data de nascimento (opcional)" },
      createElement(DateField, {
        name: "birth",
        value: "2005-03-24",
        required: true,
        onValueChange() {},
      }),
    ),
  );
  assert.match(html, /value="24\/03\/2005"/);
  assert.match(html, /type="text"[^>]*inputMode="numeric"/);
  assert.match(html, /required=""/);
  assert.match(html, /aria-label="Abrir calendário"/);
  assert.match(html, /Data de nascimento<span aria-hidden="true"> \*<\/span>/);
  assert.doesNotMatch(html, /opcional/);
});

test("DateField date-time mode keeps local date-time strings and native semantics", () => {
  const html = renderToStaticMarkup(
    createElement(DateField, {
      type: "datetime-local",
      value: "2026-10-09T08:30",
      required: true,
      min: "2026-10-01T00:00",
      onValueChange() {},
    }),
  );
  assert.match(html, /type="datetime-local"/);
  assert.match(html, /value="2026-10-09T08:30"/);
  assert.match(html, /min="2026-10-01T00:00"/);
  assert.match(html, /required=""/);
  assert.doesNotMatch(html, /Abrir calendário/);
});

test("optional fields omit the suffix and required fields receive only the required marker", () => {
  const optional = renderToStaticMarkup(
    createElement(
      FormField,
      { label: "Nome social (opcional)" },
      createElement("input", { name: "social_name" }),
    ),
  );
  const required = renderToStaticMarkup(
    createElement(
      FormField,
      { label: "Senha (obrigatório)" },
      createElement("input", { name: "password", required: true }),
    ),
  );
  assert.match(optional, /<span>Nome social<\/span>/);
  assert.doesNotMatch(optional, /opcional|aria-hidden="true"/);
  assert.match(
    required,
    /<span>Senha<span aria-hidden="true"> \*<\/span><\/span>/,
  );
  assert.doesNotMatch(required, /obrigatório/);
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
