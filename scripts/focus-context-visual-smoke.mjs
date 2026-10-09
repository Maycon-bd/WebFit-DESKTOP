import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { homedir } from "node:os";
import { build } from "vite";
import assert from "node:assert/strict";
const runtime = resolve(
  homedir(),
  ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
);
const { chromium } = createRequire(resolve(runtime, "package.json"))(
  "playwright",
);
const executablePath = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
const output = resolve(".artifacts/visual-test/WEBFIT-22/focus-context");
const buildRoot = resolve(output, "build");
await mkdir(output, { recursive: true });
await build({
  build: {
    outDir: buildRoot,
    emptyOutDir: false,
    rollupOptions: { input: resolve("tests/visual/index.html") },
  },
});
const browser = await chromium.launch({ headless: true, executablePath });
const results = [];
try {
  for (const scenario of ["news-ready"]) {
    const context = await browser.newContext({
      viewport:
        scenario === "news-narrow"
          ? { width: 640, height: 768 }
          : { width: 1366, height: 768 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== "http://webfit.mock") return route.abort();
      const path = resolve(buildRoot, `.${decodeURIComponent(url.pathname)}`);
      if (!path.startsWith(buildRoot + sep)) return route.abort();
      try {
        await route.fulfill({
          status: 200,
          contentType:
            {
              ".html": "text/html",
              ".js": "text/javascript",
              ".css": "text/css",
              ".png": "image/png",
            }[extname(path)] ?? "application/octet-stream",
          body: await readFile(path),
        });
      } catch {
        await route.fulfill({ status: 404, body: "Missing fixture" });
      }
    });
    await page.goto(
      `http://webfit.mock/tests/visual/index.html?scenario=${scenario}`,
    );
    async function login() {
      await page.locator('input[name="name"]').fill("visual");
      await page.locator('input[name="password"]').fill("mock-webfit");
      await page.getByRole("button", { name: "Entrar no Saúde" }).click();
    }
    if (scenario === "news-query-error")
      await page.evaluate(() => window.webfitMock.failNext("release_notes"));
    await login();
    const dialog = page.getByRole("dialog", { name: "Novidades do WebFit" });
    if (scenario === "news-query-error") {
      await page
        .getByRole("status")
        .filter({ hasText: "Não foi possível consultar as novidades" })
        .waitFor();
      await page
        .getByRole("button", { name: "Ver novidades", exact: true })
        .first()
        .click();
    }
    if (scenario === "news-slow")
      await page
        .getByRole("heading", { name: "Dashboard", exact: true })
        .waitFor();
    await dialog.waitFor();
    const inspect = () =>
      page.evaluate(() => {
        const node = document.activeElement;
        const css = getComputedStyle(node);
        return {
          tag: node.tagName,
          id: node.id,
          text: node.textContent?.trim().slice(0, 70),
          tabIndex: node.tabIndex,
          focusVisible: node.matches(":focus-visible"),
          outlineStyle: css.outlineStyle,
          outlineWidth: css.outlineWidth,
          outlineColor: css.outlineColor,
        };
      });
    assert.equal((await inspect()).id, "release-notes-title");
    assert.equal((await inspect()).outlineStyle, "none");
    await page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    await page.screenshot({ path: resolve(output, "title-focus.png") });
    await page.keyboard.press("Tab");
    assert.equal((await inspect()).tag, "BUTTON");
    assert.equal((await inspect()).outlineStyle, "solid");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await page
      .getByRole("button", { name: "maycon.teste Nutricionista" })
      .click();
    await page
      .getByRole("button", { name: "Ver novidades", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await dialog.waitFor();
    assert.equal((await inspect()).id, "release-notes-title");
    assert.equal((await inspect()).tabIndex, -1);
    assert.equal((await inspect()).outlineStyle, "none");
    await page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    await page.screenshot({
      path: resolve(output, "title-keyboard-focus.png"),
    });
    await page.keyboard.press("Tab");
    assert.equal((await inspect()).tag, "BUTTON");
    assert.equal((await inspect()).outlineStyle, "solid");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.equal(
      await page
        .getByRole("button", { name: "Ver novidades", exact: true })
        .evaluate((node) => node === document.activeElement),
      true,
    );
    await page.locator("#dashboard-title").focus();
    assert.equal((await inspect()).id, "dashboard-title");
    assert.equal((await inspect()).outlineStyle, "none");
    assert.deepEqual(errors, []);
    console.log(
      "PASS: mouse/keyboard dialog context, Tab, Escape/return and page heading",
    );
    await context.close();
  }
} finally {
  await browser.close();
}
