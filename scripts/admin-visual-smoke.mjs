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
const executablePath =
  process.env.WEBFIT_BROWSER ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].find(existsSync);
if (!executablePath) throw new Error("Chrome/Edge existente não localizado.");
const output = resolve(".artifacts/webfit-16/visual");
const buildRoot = resolve(".artifacts/webfit-16/visual-build");
await mkdir(output, { recursive: true });
await writeFile(
  resolve(output, "results.json"),
  JSON.stringify({ status: "RUNNING" }),
);
await build({
  build: {
    outDir: buildRoot,
    emptyOutDir: false,
    rollupOptions: { input: resolve("tests/visual/admin.html") },
  },
});
const results = [];
const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const scenario of [
    "ready",
    "retry",
    "pending",
    "unconfigured",
    "narrow",
    "pending-code",
  ]) {
    const context = await browser.newContext({
      viewport:
        scenario === "narrow"
          ? { width: 640, height: 480 }
          : { width: 1366, height: 768 },
    });
    try {
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
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
              }[extname(path)] ?? "application/octet-stream",
            body: await readFile(path),
          });
        } catch {
          await route.fulfill({ status: 404, body: "Test resource not found" });
        }
      });
      await page.goto(
        `http://webfit.mock/tests/visual/admin.html?scenario=${scenario}`,
      );
      const password = page.getByLabel(/^Senha mestra/);
      if (scenario === "unconfigured") {
        await page
          .getByText("A senha mestra precisa ser configurada", { exact: false })
          .waitFor();
        if (!(await password.isDisabled()))
          throw new Error("Mestra ausente permitiu login");
      } else {
        await password.fill("wrong");
        await page
          .getByRole("button", { name: "Entrar no painel", exact: true })
          .click();
        await page
          .getByRole("alert")
          .filter({ hasText: "Senha mestra inválida" })
          .waitFor();
        await password.fill("fictional master phrase");
        await page
          .getByRole("button", { name: "Entrar no painel", exact: true })
          .click();
        if (scenario === "retry") {
          await page
            .getByRole("alert")
            .filter({ hasText: "Falha fictícia" })
            .waitFor();
          await page
            .getByRole("button", { name: "Tentar carregar novamente" })
            .click();
        }
        await page
          .getByRole("heading", { name: "Emitir para este computador" })
          .waitFor();
        if (scenario === "pending-code") {
          page.on("dialog", (d) => d.accept());
          await page
            .getByText("Emitir ativação inicial por arquivo e código", {
              exact: true,
            })
            .click();
          await page
            .getByRole("button", {
              name: "Salvar licença inicial e gerar código",
            })
            .click();
          await page.waitForFunction(() => window.adminMock.refreshWaiting);
          await page.evaluate(() => window.adminMock.lock());
          await password.waitFor();
          await password.fill("fictional master phrase");
          await page
            .getByRole("button", { name: "Entrar no painel", exact: true })
            .click();
          await page
            .getByRole("heading", { name: "Emitir para este computador" })
            .waitFor();
          await page
            .getByText("Emitir ativação inicial por arquivo e código", {
              exact: true,
            })
            .click();
          if (
            await page
              .getByLabel("Código de ativação da licença emitida")
              .count()
          )
            throw new Error("Código pendente reapareceu em outra sessão");
          if (errors.length) throw new Error(errors.join("; "));
          results.push({ scenario, status: "PASS" });
          console.log(`${scenario}: PASS`);
          continue;
        }
        await page.screenshot({
          path: resolve(output, `${scenario}-licenses.png`),
          fullPage: true,
        });
        await page
          .getByRole("button", { name: "Banco e manutenção", exact: true })
          .click();
        page.on("dialog", (d) => d.accept());
        await page
          .getByRole("button", {
            name: "Habilitar acesso técnico",
            exact: true,
          })
          .click();
        await page
          .getByRole("button", { name: "Mostrar chave hexadecimal" })
          .click();
        if (scenario === "pending") {
          await page.waitForFunction(() =>
            window.adminMock.operations.includes("reveal_database_key"),
          );
          await page.evaluate(() => window.adminMock.lock());
          await password.waitFor();
          if (await page.getByLabel("Chave hexadecimal do banco").count())
            throw new Error("Resposta pendente reexibiu chave após bloqueio");
        } else {
          const key = page.getByLabel("Chave hexadecimal do banco");
          await key.waitFor();
          if ((await key.inputValue()).length !== 64)
            throw new Error("Chave mock inválida");
          await page
            .getByRole("button", { name: "Emissor de licenças", exact: true })
            .click();
          if (await key.count())
            throw new Error("Chave persistiu após trocar aba");
          await page.screenshot({
            path: resolve(output, `${scenario}-vault.png`),
            fullPage: true,
          });
          const overflow = await page
            .locator("dialog")
            .evaluate((d) => d.scrollWidth > d.clientWidth + 2);
          if (overflow) throw new Error("Overflow horizontal no painel");
          await page.getByRole("button", { name: "Sair do painel" }).click();
          await page.locator("dialog").waitFor({ state: "hidden" });
          if (
            await page
              .getByRole("heading", { name: "Emissor integrado" })
              .count()
          )
            throw new Error("Logout deixou ferramentas visíveis");
        }
      }
      if (errors.length) throw new Error(errors.join("; "));
      results.push({ scenario, status: "PASS" });
      console.log(`${scenario}: PASS`);
    } finally {
      await context.close();
    }
  }
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
} catch (error) {
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify({ status: "FAIL", results, error: error.message }, null, 2),
  );
  throw error;
} finally {
  await browser.close();
}
