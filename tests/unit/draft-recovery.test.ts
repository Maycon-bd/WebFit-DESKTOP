import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function compile(source: string) {
  return ts
    .transpileModule(source, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
      },
    })
    .outputText.replace(
      /from "react\/jsx-runtime"/g,
      `from ${JSON.stringify(import.meta.resolve("react/jsx-runtime"))}`,
    );
}
async function load(source: string) {
  return import(
    `data:text/javascript;base64,${Buffer.from(compile(source)).toString("base64")}`
  );
}

// Stub only the DOM lifecycle hooks to exercise the actual event callbacks.
// Native showModal, focus trapping and WebView navigation remain manual checks.
const dialogSource = readFileSync(
  new URL("../../src/DraftRecoveryDialog.tsx", import.meta.url),
  "utf8",
).replace(
  'import { useLayoutEffect, useRef } from "react";',
  "const useLayoutEffect = () => {}; const useRef = (value) => ({ current: value });",
);
const { DraftRecoveryDialog } = await load(dialogSource);

test("V05: Escape and Voltar invoke only neutral exit; busy prevents both", () => {
  for (const busy of [false, true]) {
    let exits = 0;
    const element = DraftRecoveryDialog({
      open: true,
      formLabel: "paciente",
      savedAt: "fixture",
      savedAtIso: "",
      busy,
      onBack: () => exits++,
      backLabel: "Voltar à lista",
      onRestore: () => assert.fail("restore"),
      onDiscard: () => assert.fail("discard"),
    });
    let prevented = false;
    element.props.onCancel({
      preventDefault: () => {
        prevented = true;
      },
    });
    assert.ok(prevented);
    const actions = element.props.children.at(-1);
    const back = actions.props.children.at(-1);
    assert.equal(back.props.children, "Voltar à lista");
    assert.equal(back.props.disabled, busy);
    back.props.onClick();
    assert.equal(exits, busy ? 0 : 2);
    assert.equal(
      element.props.onClick,
      undefined,
      "backdrop does not trigger exit/discard",
    );
  }
});

test("V05: neutral close focuses destination heading; restoration close focuses form", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "document");
  const queries: string[] = [];
  let focuses = 0;
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      querySelector: (selector: string) => {
        queries.push(selector);
        return { focus: () => focuses++ };
      },
    },
  });
  try {
    const element = DraftRecoveryDialog({
      open: true,
      formLabel: "fixture",
      savedAt: "",
      savedAtIso: "",
      busy: false,
      onBack: () => {},
      backLabel: "Voltar ao paciente",
      onRestore: () => {},
      onDiscard: () => {},
    });
    element.props.onCancel({ preventDefault: () => {} });
    element.props.onClose();
    element.props.onClose();
    assert.equal(queries[0], ".workspace-main h1");
    assert.match(queries[1], /form\[data-draft-form\]/);
    assert.equal(focuses, 2);
  } finally {
    if (original) Object.defineProperty(globalThis, "document", original);
    else Reflect.deleteProperty(globalThis, "document");
  }
});

const appSource = readFileSync(
  new URL("../../src/App.tsx", import.meta.url),
  "utf8",
);
const ast = ts.createSourceFile(
  "App.tsx",
  appSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
let exitSource = "";
function visit(node: ts.Node) {
  if (ts.isFunctionDeclaration(node) && node.name?.text === "leaveDraft")
    exitSource = node.getText(ast);
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(exitSource, "exercise the real App exit handler");
const { makeExit } = await load(`export function makeExit(env) {
  const {busy, visibleDraft, recoveryExitFocus, draftDirty, draftRef, setPendingDraft, setPrescription, setPatient, setPage, setAccountOpen, setNavigationFocus} = env;
  ${exitSource}
  return leaveDraft;
}`);

test("V05: each context exits without changing stored draft or patient; busy stays put", () => {
  for (const kind of ["patient", "profile", "prescription"]) {
    for (const busy of [false, true]) {
      const storedDraft = Object.freeze({
        kind,
        payload: Object.freeze({ fixture: "protected" }),
      });
      const storedPatient = Object.freeze({ name: "fixture persisted" });
      const state = {
        pending: storedDraft as unknown,
        prescription: { fixture: "opened" } as unknown,
        patient: storedPatient as unknown,
        page: kind === "profile" ? "profile" : "patients",
        account: true,
        focus: 0,
      };
      const refs = {
        recoveryExitFocus: { current: false },
        draftDirty: { current: false },
        draftRef: { current: storedDraft as unknown },
      };
      makeExit({
        busy,
        visibleDraft: storedDraft,
        ...refs,
        setPendingDraft: (v: unknown) => {
          state.pending = v;
        },
        setPrescription: (v: unknown) => {
          state.prescription = v;
        },
        setPatient: (v: unknown) => {
          state.patient = v;
        },
        setPage: (v: string) => {
          state.page = v;
        },
        setAccountOpen: (v: boolean) => {
          state.account = v;
        },
        setNavigationFocus: (f: (v: number) => number) => {
          state.focus = f(state.focus);
        },
      })();
      assert.equal(state.pending, busy ? storedDraft : null);
      assert.equal(
        state.patient,
        busy || kind === "prescription" ? storedPatient : null,
      );
      assert.equal(
        state.page,
        busy && kind === "profile" ? "profile" : "patients",
      );
      assert.equal(state.focus, busy ? 0 : 1);
      assert.deepEqual(storedDraft.payload, { fixture: "protected" });
      assert.equal(storedPatient.name, "fixture persisted");
      assert.equal(refs.draftRef.current, busy ? storedDraft : null);
      assert.equal(refs.recoveryExitFocus.current, !busy);
    }
  }
});
