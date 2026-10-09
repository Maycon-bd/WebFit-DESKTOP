import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateReleaseNotes,
  releaseNotesText,
} from "../../scripts/check-release-notes.mjs";

const notes = JSON.parse(
  readFileSync(
    new URL("../../src/data/release-notes.json", import.meta.url),
    "utf8",
  ),
);
test("TA-UPD-NEWS-001/007: installed release has a short plain language summary", () => {
  assert.equal(validateReleaseNotes(notes), notes);
  assert.ok(notes.highlights.length <= 6);
  assert.ok(
    !/SQLCipher|Rust|Tauri|SHA256|RF-|TA-|WEBFIT-|schema|migration|commit/i.test(
      releaseNotesText(notes),
    ),
  );
  assert.ok(releaseNotesText(notes).includes("• "));
});
test("TA-UPD-NEWS-007: absent, empty or oversized summaries stop the build", () => {
  for (const value of [
    null,
    {},
    { ...notes, unexpected: true },
    { ...notes, highlights: [] },
    { ...notes, highlights: [""] },
    { ...notes, highlights: ["a".repeat(241)] },
    { ...notes, highlights: ["<script>texto</script>"] },
  ])
    assert.throws(() => validateReleaseNotes(value));
});
test("TA-UPD-NEWS-004/006: session-specific mounted dialog gates tours and preserves recovery actions", () => {
  const view = readFileSync(
    new URL("../../src/ReleaseNotes.tsx", import.meta.url),
    "utf8",
  );
  const app = readFileSync(
    new URL("../../src/App.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(view.includes("generation.current++"));
  assert.ok(view.includes("createPortal"));
  assert.ok(view.includes("showModal()"));
  assert.ok(view.includes('aria-labelledby="release-notes-title"'));
  assert.ok(view.includes("Fechar por agora"));
  assert.ok(app.includes("!notesPending && tourScreen"));
});
