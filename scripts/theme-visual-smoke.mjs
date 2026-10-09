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
const output = resolve(".artifacts/visual-test/WEBFIT-22/headless");
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
  for (const initial of process.env.WEBFIT_THEME_SCENARIOS?.split(",") ?? [
    "light",
    "dark",
    "invalid",
    "blocked",
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    async function settleVisuals() {
      await page.evaluate(async () => {
        await Promise.all(
          document
            .getAnimations()
            .map((animation) => animation.finished.catch(() => {})),
        );
      });
    }
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    if (initial === "dark" || initial === "invalid")
      await context.addInitScript((value) => {
        if (!localStorage.getItem("webfit:appearance:v1"))
          localStorage.setItem("webfit:appearance:v1", value);
      }, initial);
    if (initial === "blocked")
      await context.addInitScript(() => {
        const original = Storage.prototype.setItem;
        Object.assign(window, {
          restoreThemeStorage: () => {
            Storage.prototype.setItem = original;
          },
        });
        Storage.prototype.setItem = () => {
          throw new Error("fixture storage blocked");
        };
      });
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
      "http://webfit.mock/tests/visual/index.html?scenario=ready",
    );
    await page.waitForFunction(() => document.documentElement.dataset.theme);
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      initial === "dark" ? "dark" : "light",
    );
    await settleVisuals();
    await page.screenshot({ path: resolve(output, `${initial}-login.png`) });
    async function login() {
      await page.locator('input[name="name"]').fill("visual");
      await page.locator('input[name="password"]').fill("mock-webfit");
      await page.getByRole("button", { name: "Entrar no Saúde" }).click();
      await page
        .getByRole("heading", { name: "Dashboard", exact: true })
        .waitFor();
      await page.getByRole("definition").first().waitFor();
    }
    async function personal() {
      await page
        .getByRole("button", { name: "Configurações", exact: true })
        .click();
      await page
        .getByRole("button", { name: /Personalização Escolher/ })
        .click();
      await page
        .getByRole("heading", { name: "Personalização", exact: true })
        .waitFor();
    }
    await login();
    await personal();
    // Arrow keys operate the native radio group and apply theme without a save gate.
    await page
      .getByRole("radio", {
        name: initial === "dark" ? "Escuro" : "Claro",
        exact: true,
      })
      .focus();
    await page.keyboard.press(initial === "dark" ? "ArrowLeft" : "ArrowRight");
    const selected = initial === "dark" ? "light" : "dark";
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      selected,
    );
    const activeRadio = page.locator('input[name="theme"]:checked');
    const keyboardFocus = await activeRadio.evaluate((node) => {
      const css = getComputedStyle(node);
      return {
        radius: css.borderRadius,
        outline: css.outlineWidth,
        visible: node.matches(":focus-visible"),
      };
    });
    assert.equal(keyboardFocus.radius, "50%");
    assert.equal(keyboardFocus.outline, "2px");
    assert.equal(keyboardFocus.visible, true);
    await page
      .getByRole("heading", { name: "Personalização", exact: true })
      .click();
    await activeRadio.click();
    assert.equal(
      await activeRadio.evaluate((node) => getComputedStyle(node).outlineStyle),
      "none",
    );
    if (initial === "blocked") {
      await page.getByText(/não foi possível salvar a preferência/).waitFor();
      await page.evaluate(() => window.restoreThemeStorage());
      await page
        .getByRole("button", { name: "Tentar salvar novamente" })
        .click();
      await page.getByText(/aplicado e salvo neste computador/).waitFor();
    }
    for (const theme of ["dark", "light"]) {
      await page
        .getByRole("radio", {
          name: theme === "dark" ? "Escuro" : "Claro",
          exact: true,
        })
        .check();
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        theme,
      );
      const palette = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return Object.fromEntries(
          [
            "text",
            "muted",
            "surface",
            "surface-subtle",
            "green",
            "on-primary",
            "error-text",
            "error-surface",
            "success-text",
            "success-surface",
            "placeholder",
            "selected-text",
            "selected",
          ].map((name) => [name, style.getPropertyValue(`--${name}`).trim()]),
        );
      });
      function luminance(color) {
        if (color === "white") color = "#ffffff";
        const hex =
          color.slice(1).length === 3
            ? color
                .slice(1)
                .split("")
                .map((x) => x + x)
                .join("")
            : color.slice(1);
        const rgb = [0, 2, 4]
          .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map((v) =>
            v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
          );
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      }
      const contrasts = {};
      for (const [fg, bg] of [
        ["text", "surface"],
        ["text", "surface-subtle"],
        ["muted", "surface"],
        ["muted", "surface-subtle"],
        ["on-primary", "green"],
        ["error-text", "error-surface"],
        ["success-text", "success-surface"],
        ["placeholder", "surface"],
        ["selected-text", "selected"],
      ]) {
        const a = luminance(palette[fg]),
          b = luminance(palette[bg]);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        contrasts[`${fg}/${bg}`] = Number(ratio.toFixed(2));
        assert.ok(ratio >= 4.5, `${theme}: ${fg}/${bg} contrast ${ratio}`);
      }
      const previews = await page
        .locator(".theme-preview-content > span")
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const rect = node.getBoundingClientRect();
            const css = getComputedStyle(node);
            return {
              width: rect.width,
              height: rect.height,
              background: css.backgroundColor,
              border: css.borderColor,
            };
          }),
        );
      assert.equal(previews.length, 6);
      for (const preview of previews) {
        assert.ok(
          preview.width > 0 && preview.height > 0,
          "Preview contents need visible bounds",
        );
        assert.notEqual(preview.background, "rgba(0, 0, 0, 0)");
      }
      const widths = [1366, 640];
      for (const width of widths) {
        await page.setViewportSize({ width, height: 768 });
        await page.locator(".theme-options").scrollIntoViewIfNeeded();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        assert.equal(overflow, false, `${theme}/${width} horizontal overflow`);
        await settleVisuals();
        await page.screenshot({
          path: resolve(output, `${initial}-${theme}-personal-${width}.png`),
        });
      }
      await page.setViewportSize({ width: 1366, height: 768 });
      await page
        .getByRole("button", { name: "Voltar às Configurações" })
        .click();
      await page
        .getByRole("navigation", { name: "Módulos do consultório" })
        .getByRole("button", { name: "Dashboard", exact: true })
        .click();
      await page.getByRole("definition").first().waitFor();
      await page.locator(".account-name").click();
      await page
        .getByRole("button", { name: "Ver novidades", exact: true })
        .click();
      await page.getByRole("dialog").waitFor();
      await settleVisuals();
      await page.screenshot({
        path: resolve(output, `${initial}-${theme}-about.png`),
      });
      await page.keyboard.press("Escape");

      await settleVisuals();
      await page.screenshot({
        fullPage: true,
        path: resolve(output, `${initial}-${theme}-dashboard.png`),
      });
      await page
        .getByRole("navigation", { name: "Módulos do consultório" })
        .getByRole("button", { name: "Pacientes", exact: true })
        .click();
      await page.getByRole("button", { name: "Novo paciente" }).waitFor();
      await settleVisuals();
      await page.screenshot({
        path: resolve(output, `${initial}-${theme}-patients.png`),
      });
      await page.getByRole("button", { name: "Novo paciente" }).click();
      await page.locator('input[name="name"]').waitFor();
      await page.locator('input[name="name"]').fill("Paciente Fictício Tema");
      await page.getByRole("button", { name: "Salvar cadastro" }).click();
      await page.locator(".field-invalid").first().waitFor();
      await page.getByRole("button", { name: /Abrir calendário/ }).click();
      await settleVisuals();
      await page.screenshot({
        path: resolve(output, `${initial}-${theme}-form-calendar-error.png`),
      });
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Voltar à lista" }).click();
      await personal();
      results.push({ initial, theme, contrasts, previews, status: "PASS" });
    }
    await page.getByRole("radio", { name: "Escuro", exact: true }).check();
    await page.setViewportSize({ width: 683, height: 384 });
    await page.locator(".theme-options").scrollIntoViewIfNeeded();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.getByRole("radio", { name: "Claro", exact: true }).check();
    await page.getByRole("radio", { name: "Escuro", exact: true }).check();
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.reload();
    await page.waitForFunction(() => document.documentElement.dataset.theme);
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await login();
    await page
      .getByRole("button", { name: "Sair da conta", exact: true })
      .click();
    await page.getByRole("button", { name: "Entrar no Saúde" }).waitFor();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.deepEqual(errors, []);
    assert.deepEqual(
      await page.evaluate(() => window.webfitMock.unsupported),
      [],
    );
    console.log(`${initial}: PASS`);
    await context.close();
  }
  await writeFile(
    resolve(
      output,
      process.env.WEBFIT_THEME_SCENARIOS
        ? "targeted-results.json"
        : "results.json",
    ),
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
} catch (error) {
  await writeFile(
    resolve(
      output,
      process.env.WEBFIT_THEME_SCENARIOS
        ? "targeted-results.json"
        : "results.json",
    ),
    JSON.stringify({ status: "FAIL", error: String(error), results }, null, 2),
  );
  throw error;
} finally {
  await browser.close();
}
