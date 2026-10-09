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
const output = resolve(".artifacts/visual-test/WEBFIT-21/headless");
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
  for (const scenario of [
    "news-ready",
    "news-narrow",
    "news-save-error",
    "news-query-error",
    "news-slow",
  ]) {
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
    assert.equal(await dialog.locator("li").count(), 4);
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      "release-notes-title",
    );
    if (scenario === "news-save-error") {
      await page.evaluate(() =>
        window.webfitMock.failNext("mark_release_notes_seen"),
      );
      await dialog.getByRole("button", { name: "Entendi" }).click();
      await dialog.getByRole("alert").waitFor();
      await dialog.getByRole("button", { name: "Fechar por agora" }).click();
      await page.getByRole("button", { name: "Sair da conta" }).click();
      await login();
      await dialog.waitFor();
    }
    await page.screenshot({ path: resolve(output, `${scenario}.png`) });
    assert.equal(
      await dialog.evaluate((el) => el.scrollWidth > el.clientWidth),
      false,
    );
    if (scenario === "news-narrow") {
      await page.evaluate(() => (document.documentElement.style.zoom = "2"));
      await dialog
        .getByRole("button", { name: "Entendi" })
        .scrollIntoViewIfNeeded();
      assert.equal(
        await dialog.evaluate((el) => el.scrollWidth > el.clientWidth),
        false,
      );
      await page.evaluate(() => (document.documentElement.style.zoom = "1"));
    }
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await page
      .getByRole("button", { name: "maycon.teste Nutricionista" })
      .click();
    const trigger = page.getByRole("button", {
      name: "Ver novidades",
      exact: true,
    });
    await trigger.click();
    await dialog.waitFor();
    await dialog.getByRole("button", { name: "Fechar", exact: true }).click();
    assert.equal(
      await trigger.evaluate((el) => el === document.activeElement),
      true,
    );
    await page.getByRole("button", { name: "Sair da conta" }).click();
    await login();
    await page
      .getByRole("heading", { name: "Dashboard", exact: true })
      .waitFor();
    await page.waitForTimeout(1100);
    assert.equal(await dialog.isVisible(), false);
    await page.evaluate(() =>
      window.webfitMock.setNotesVersion("0.1.13-pilot.99.1"),
    );
    await page.getByRole("button", { name: "Sair da conta" }).click();
    await login();
    await dialog.waitFor();
    assert.deepEqual(errors, []);
    assert.deepEqual(
      await page.evaluate(() => window.webfitMock.unsupported),
      [],
    );
    results.push({ scenario, status: "PASS" });
    await context.close();
  }
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", results }));
} catch (error) {
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify({ status: "FAIL", results, error: String(error) }, null, 2),
  );
  throw error;
} finally {
  await browser.close();
}
