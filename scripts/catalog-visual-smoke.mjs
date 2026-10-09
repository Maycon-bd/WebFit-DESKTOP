// Fictional UI only; resources fulfilled from compiled files, no HTTP server.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { homedir } from "node:os";
import { build } from "vite";
import assert from "node:assert/strict";
const runtime =
  process.env.WEBFIT_PLAYWRIGHT_MODULES ??
  resolve(
    homedir(),
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
  );
const { chromium } = createRequire(resolve(runtime, "package.json"))(
  "playwright",
);
const executablePath =
  process.env.WEBFIT_BROWSER ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].find(existsSync);
if (!executablePath)
  throw new Error("Existing Chrome/Edge required; do not install.");
const output = resolve(".artifacts/visual-test/WEBFIT-19/headless");
const buildRoot = resolve(".artifacts/visual-test/WEBFIT-19/headless-build");
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
  for (const scenario of ["ready", "slow", "error", "narrow"]) {
    const context = await browser.newContext({
      viewport:
        scenario === "narrow"
          ? { width: 640, height: 900 }
          : { width: 1366, height: 768 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    let failed = false;
    let catalogRequests = 0;
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== "http://webfit.mock") return route.abort();
      const path = resolve(buildRoot, `.${decodeURIComponent(url.pathname)}`);
      if (!path.startsWith(buildRoot + sep)) return route.abort();
      if (/\/tbca-[^/]+\.js$/.test(url.pathname)) {
        catalogRequests++;
        if (scenario === "error" && !failed) {
          failed = true;
          // Valid module with damaged content permits a fresh validation retry.
          return route.fulfill({
            status: 200,
            contentType: "text/javascript",
            body: 'export default "{}";',
          });
        }
        if (scenario === "slow") await new Promise((r) => setTimeout(r, 1500));
      }
      try {
        await route.fulfill({
          status: 200,
          contentType:
            {
              ".html": "text/html",
              ".js": "text/javascript",
              ".css": "text/css",
              ".svg": "image/svg+xml",
            }[extname(path)] ?? "application/octet-stream",
          body: await readFile(path),
        });
      } catch {
        await route.fulfill({
          status: 404,
          body: "Missing fictional resource",
        });
      }
    });
    await page.goto("http://webfit.mock/tests/visual/index.html");
    await page.locator('input[name="name"]').fill("visual");
    await page.locator('input[name="password"]').fill("mock-webfit");
    await page.getByRole("button", { name: "Entrar no Saúde" }).click();
    await page
      .getByRole("heading", { name: "Dashboard", exact: true })
      .waitFor();
    assert.equal(catalogRequests, 0, "catalog must be lazy");
    await page.getByRole("button", { name: "Pacientes", exact: true }).click();
    await page
      .getByRole("button", {
        name: "Abrir Paciente Fictício Alfa",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Nova prescrição", exact: true })
      .click();
    await page
      .getByLabel("Objetivo", { exact: true })
      .fill("Ensaio fictício TBCA");
    if ((await page.locator(".meal").count()) === 0)
      await page
        .getByRole("button", { name: "Adicionar refeição", exact: true })
        .click();
    await page.locator(".meal .inline input").first().fill("Refeição fictícia");
    await page.locator(".food-picker summary").click();
    if (scenario === "slow")
      await page
        .getByText("Carregando catálogo offline…", { exact: true })
        .waitFor();
    if (scenario === "error") {
      await page
        .getByRole("alert")
        .filter({ hasText: "Não foi possível carregar" })
        .waitFor();
      await page
        .getByRole("button", { name: "Tentar carregar novamente" })
        .click();
      // ES module caching retains damaged content; repeat must remain a visible
      // recovery failure rather than presenting an empty successful catalogue.
      await page
        .getByRole("alert")
        .filter({ hasText: "Não foi possível carregar" })
        .waitFor();
    } else {
      const search = page.getByLabel(
        "Pesquisar alimento, preparação ou código",
        { exact: true },
      );
      await search.waitFor();
      await search.fill("alimento inexistente xyz");
      await page
        .getByText(/Nenhum alimento encontrado neste catálogo/)
        .waitFor();
      await search.fill("BRC0004A");
      assert.equal(
        await page.locator(".catalog-row button").isDisabled(),
        true,
      );
      await search.fill("BRC0208A");
      await page.locator(".catalog-row button").click();
      await page
        .getByLabel("Converter medida caseira para gramas")
        .selectOption("55");
      assert.equal(
        await page.getByLabel("Quantidade (g)").inputValue(),
        "55,00",
      );
      assert.equal(
        await page.getByLabel("kcal / 100 g").inputValue(),
        "138,00",
      );
      await search.fill("BRC0006C");
      await page.locator(".catalog-row button").click();
      await page
        .getByLabel("Converter medida caseira para gramas")
        .nth(1)
        .selectOption("65");
      assert.equal(
        await page.getByLabel("Quantidade (g)").nth(1).inputValue(),
        "65,00",
      );
      // ValueField uses two decimal places while typing; enter the explicit
      // formatted amount rather than the two digits representing 0.50 g.
      await page.getByLabel("Quantidade (g)").nth(1).fill("50,00");
      await page.getByLabel("Quantidade (g)").nth(1).press("Tab");
      await page
        .getByText("Total do cardápio: 130 kcal", { exact: true })
        .waitFor();
      for (const [code, kcal] of [
        ["BRC0017A", "347,00"],
        ["BRC0016A", "108,00"],
      ]) {
        await search.fill(code);
        await page.locator(".catalog-row button").click();
        assert.equal(
          await page.getByLabel("kcal / 100 g").last().inputValue(),
          kcal,
        );
      }
      await page
        .getByText("Total do cardápio: 585 kcal", { exact: true })
        .waitFor();
      await search.fill("TACO4-522");
      await search.fill("BRC0293T");
      assert.equal(
        await page.locator(".catalog-row button").isDisabled(),
        false,
      );
      await page.locator(".catalog-row button").click();
      assert.equal(
        await page.getByLabel("kcal / 100 g").nth(4).inputValue(),
        "119,00",
      );
      await search.fill("TACO4-522");
      await page.locator(".catalog-row button").click();
      await search.fill("BRC0001F");
      await page.locator(".catalog-row button").click();
      await page.getByLabel("Fibra / 100 g").nth(6).waitFor();
      assert.equal(
        await page.getByLabel("Fibra / 100 g").nth(6).inputValue(),
        "Indisponível na fonte",
      );
      await page
        .getByRole("button", {
          name: "Salvar rascunho da prescrição",
          exact: true,
        })
        .click();
      await page
        .getByText("Prescrição salva como rascunho.", { exact: true })
        .waitFor();
      await page
        .getByRole("button", { name: "Voltar ao paciente", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Editar rascunho", exact: true })
        .click();
      assert.equal(
        await page.locator(".food-grid .field:first-child input").count(),
        7,
      );
      assert.equal(
        await page.getByLabel("Origem (ex.: rótulo)").nth(5).inputValue(),
        "TACO 4ª edição",
      );
      assert.equal(
        await page.getByLabel("Quantidade (g)").nth(0).inputValue(),
        "55,00",
      );
      assert.equal(
        await page.getByLabel("Quantidade (g)").nth(1).inputValue(),
        "50,00",
      );
      assert.equal(
        await page.getByLabel("kcal / 100 g").nth(2).inputValue(),
        "347,00",
      );
      assert.equal(
        await page.getByLabel("kcal / 100 g").nth(3).inputValue(),
        "108,00",
      );
      await page.screenshot({
        path: resolve(output, `${scenario}.png`),
        fullPage: true,
      });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        ),
        false,
        "no clipped horizontal layout",
      );
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(
      await page.evaluate(() => window.webfitMock.unsupported),
      [],
    );
    results.push({ scenario, status: "PASS", catalogRequests });
    await context.close();
  }
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify(
      { status: "PASS", browser: await browser.version(), results },
      null,
      2,
    ),
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
