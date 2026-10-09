import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { homedir } from "node:os";
import { build } from "vite";
const runtime =
  process.env.WEBFIT_PLAYWRIGHT_MODULES ??
  resolve(
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
const output = resolve(".artifacts/visual-test/WEBFIT-17");
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
  for (const scenario of process.env.WEBFIT_DASHBOARD_SCENARIOS?.split(",") ?? [
    "ready",
    "empty",
    "slow",
    "error",
    "unauthorized",
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
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
    await page.locator('input[name="name"]').fill("visual");
    await page.locator('input[name="password"]').fill("mock-webfit");
    if (scenario === "error")
      await page.evaluate(() => window.webfitMock.failNext("dashboard"));
    await page.getByRole("button", { name: "Entrar no Saúde" }).click();
    if (scenario === "unauthorized") {
      await page.getByRole("definition").first().waitFor();
      await page.evaluate(() => window.webfitMock.expireSession());
      await page.getByRole("button", { name: "Atualizar indicadores" }).click();
      await page
        .getByRole("alert")
        .filter({
          hasText: "Sua sessão terminou. Entre novamente para continuar.",
        })
        .waitFor({ timeout: 10000 })
        .catch(async (failure) => {
          await page.screenshot({
            path: resolve(output, "unauthorized-diagnostic.png"),
          });
          throw new Error(
            `${failure.message}; UI=${await page.locator("#root").innerText()}; calls=${await page.evaluate(() => window.webfitMock.calls.join(","))}`,
          );
        });
      if (await page.locator(".dashboard").count())
        throw new Error("Dashboard permanece após sessão expirada");
      await page.getByRole("button", { name: "Entrar no Saúde" }).waitFor();
      await page.screenshot({ path: resolve(output, "unauthorized.png") });
      results.push({ scenario, status: "PASS" });
      console.log(`${scenario}: PASS`);
      await context.close();
      continue;
    }
    await page
      .getByRole("heading", { name: "Dashboard", exact: true })
      .waitFor();
    if (scenario === "slow") {
      await page
        .getByRole("status")
        .filter({ hasText: "Carregando indicadores" })
        .waitFor();
      await page.screenshot({ path: resolve(output, "loading.png") });
    }
    if (scenario === "error") {
      await page
        .getByRole("alert")
        .filter({ hasText: "Não foi possível carregar a dashboard" })
        .waitFor();
      await page.screenshot({ path: resolve(output, "error.png") });
      await page.getByRole("button", { name: "Tentar novamente" }).click();
    }
    await page.getByRole("definition").first().waitFor();
    const consultationYear = page.getByRole("combobox", {
      name: "Ano do histórico de consultas",
    });
    const currentYear = await page.evaluate(() => new Date().getFullYear());
    if ((await consultationYear.inputValue()) !== String(currentYear))
      throw new Error("Histórico não inicia no ano corrente");
    await consultationYear.selectOption(String(currentYear - 1));
    await page
      .getByRole("heading", {
        name: `Histórico de ${currentYear - 1} ainda indisponível`,
      })
      .waitFor();
    if ((await page.locator(".consultation-months li").count()) !== 12)
      throw new Error("Histórico deve mostrar os doze meses");
    if (
      await page.locator(".consultation-history .dashboard-bar-track").count()
    )
      throw new Error("Consultas indisponíveis não podem ter barras fictícias");
    await consultationYear.selectOption(String(currentYear));
    await page.locator(".consultation-history").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: resolve(output, `${scenario}-consultation.png`),
    });
    const navigation = await page
      .getByRole("navigation", { name: "Módulos do consultório" })
      .getByRole("button")
      .allTextContents();
    if (navigation.join(",") !== "Dashboard,Pacientes")
      throw new Error("Ordem do menu incorreta");
    const totals = await page
      .locator(".dashboard-metrics dd")
      .allTextContents();
    if (totals.join(",") !== (scenario === "empty" ? "0,0,0,0" : "2,1,3,5"))
      throw new Error(`Totais incorretos: ${totals}`);
    await page.getByText("Ver dados do gráfico", { exact: true }).click();
    if ((await page.locator(".dashboard-chart-table tbody tr").count()) !== 6)
      throw new Error("Gráfico não tem seis meses");
    await page.getByRole("button", { name: "12 meses", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".dashboard-chart-table tbody tr").length ===
        12,
    );
    await page.getByRole("button", { name: "6 meses", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".dashboard-chart-table tbody tr").length ===
        6,
    );
    await page.getByText("Ver dados do gráfico", { exact: true }).click();
    await page.screenshot({
      path: resolve(output, `${scenario}-desktop.png`),
      fullPage: true,
    });
    if (scenario === "empty")
      await page
        .getByRole("heading", { name: "Seu consultório começa aqui" })
        .waitFor();
    if (scenario === "ready") {
      await page
        .getByRole("button", { name: "Novo paciente", exact: true })
        .click();
      await page
        .getByLabel("Nome completo", { exact: false })
        .fill("Paciente fictício Dashboard");
      await page.getByRole("button", { name: "Ir para Dashboard" }).click();
      await page
        .getByRole("heading", { name: "Dashboard", exact: true })
        .waitFor();
      const calls = await page.evaluate(() => window.webfitMock.calls);
      if (!calls.includes("save_draft"))
        throw new Error("Logo não salvou rascunho");
      await page.getByRole("definition").first().waitFor();
      await page.getByRole("button", { name: "Atualizar indicadores" }).click();
      await page.getByRole("definition").first().waitFor();
      await page.setViewportSize({ width: 800, height: 700 });
      await page.screenshot({
        path: resolve(output, "compact.png"),
        fullPage: true,
      });
      await page.locator(".dashboard-shortcuts").scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, "compact-lower.png") });
      await page.setViewportSize({ width: 480, height: 720 });
      await page.locator(".consultation-history").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: resolve(output, "consultation-narrow.png"),
      });
      await page.screenshot({
        path: resolve(output, "narrow.png"),
        fullPage: true,
      });
      await page.locator(".dashboard-grid").scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, "narrow-chart.png") });
      await page.locator(".dashboard-shortcuts").scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, "narrow-lower.png") });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.evaluate(() => {
        document.documentElement.style.zoom = "2";
      });
      await page.locator(".consultation-history").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: resolve(output, "consultation-zoom200.png"),
      });
      await page.screenshot({
        path: resolve(output, "zoom200.png"),
        fullPage: true,
      });
      await page.locator(".dashboard-shortcuts").scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, "zoom200-lower.png") });
      for (const selector of [
        ".dashboard",
        ".dashboard-heading",
        ".dashboard-metrics",
        ".dashboard-grid",
      ]) {
        const overflow = await page
          .locator(selector)
          .evaluate((e) => e.scrollWidth > e.clientWidth + 1);
        if (overflow) throw new Error(`Overflow: ${selector}`);
      }
    }
    if (scenario === "empty") {
      await page.locator(".dashboard-start").scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(output, "empty-lower.png") });
    }
    if (errors.length) throw new Error(errors.join("; "));
    const unsupported = await page.evaluate(
      () => window.webfitMock.unsupported,
    );
    if (unsupported.length) throw new Error(`IPC sem mock: ${unsupported}`);
    results.push({ scenario, status: "PASS" });
    console.log(`${scenario}: PASS`);
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify(results, null, 2),
  );
}
