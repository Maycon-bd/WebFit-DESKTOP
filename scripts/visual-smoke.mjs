import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { build } from "vite";
import { homedir } from "node:os";

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
  throw new Error(
    "Chrome/Edge existente não localizado. Informe WEBFIT_BROWSER; não instalar automaticamente.",
  );
const output = resolve(".artifacts/visual-test/WEBFIT-15/headless");
await mkdir(output, { recursive: true });
const buildRoot = resolve(".artifacts/visual-test/WEBFIT-15/headless-build");
console.log("Compilando interface de teste isolada...");
await build({
  build: {
    outDir: buildRoot,
    emptyOutDir: false,
    rollupOptions: { input: resolve("tests/visual/index.html") },
  },
});
let browser;
const results = [];
await writeFile(
  resolve(output, "results.json"),
  JSON.stringify({ status: "RUNNING", results }),
);
try {
  console.log("Abrindo navegador headless sem servidor/rede...");
  browser = await chromium.launch({ headless: true, executablePath });
  for (const scenario of ["ready", "empty", "error", "slow"]) {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    // Fulfill compiled resources directly; no sockets, external requests or host UI.
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== "http://webfit.mock") return route.abort();
      const path = resolve(buildRoot, `.${decodeURIComponent(url.pathname)}`);
      if (!path.startsWith(buildRoot + sep)) return route.abort();
      const contentType =
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".svg": "image/svg+xml",
        }[extname(path)] ?? "application/octet-stream";
      try {
        await route.fulfill({
          status: 200,
          contentType,
          body: await readFile(path),
        });
      } catch {
        await route.fulfill({ status: 404, body: "Test resource not found" });
      }
    });
    console.log(`Cenário ${scenario}`);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(
      `http://webfit.mock/tests/visual/index.html?scenario=${scenario}`,
      { waitUntil: "domcontentloaded" },
    );
    const loginButton = page.getByRole("button", { name: "Entrar no Saúde" });
    if (scenario === "ready") {
      await loginButton.click();
      await page.locator(".field-invalid").nth(1).waitFor();
      await page.getByText("Nome de acesso é obrigatório.").waitFor();
      await page.getByText("Senha é obrigatório.").waitFor();
      for (const name of ["name", "password"]) {
        const field = page.locator(`input[name="${name}"]`);
        if ((await field.getAttribute("aria-invalid")) !== "true")
          throw new Error(`Campo de login ${name} não foi marcado inválido`);
        const describedBy = await field.getAttribute("aria-describedby");
        if (!describedBy) throw new Error(`Campo ${name} sem erro associado`);
        const errorId = describedBy.split(" ").at(-1);
        if (!errorId || (await page.locator(`#${errorId}`).count()) !== 1)
          throw new Error(`Descrição de erro ausente para ${name}`);
      }
      await page.screenshot({
        path: resolve(output, "login-invalid.png"),
        fullPage: true,
      });
      const passwordError = await page
        .locator('input[name="password"]')
        .locator("xpath=ancestor::label")
        .innerText();
      if (passwordError.includes("mock-webfit"))
        throw new Error("A mensagem visual expôs conteúdo de senha");
      await page.locator('input[name="name"]').fill("visual");
      if (
        (
          await page
            .locator('input[name="name"]')
            .locator("xpath=ancestor::label")
            .getAttribute("class")
        )?.includes("field-invalid") ||
        !(
          await page
            .locator('input[name="password"]')
            .locator("xpath=ancestor::label")
            .getAttribute("class")
        )?.includes("field-invalid")
      )
        throw new Error(
          "Corrigir o login removeu erro incorreto ou em excesso",
        );
      await page.locator('input[name="password"]').fill("mock-webfit");
      if ((await page.locator(".field-invalid").count()) !== 0)
        throw new Error("A correção não limpou os erros de login");
      const validity = await page
        .locator("form")
        .first()
        .evaluate((form) =>
          [...form.elements].map((element) => ({
            name: element.name,
            valid: element.validity?.valid,
            message: element.validationMessage,
            value: element.type === "password" ? "[redacted]" : element.value,
          })),
        );
      if (validity.some((field) => field.valid === false))
        throw new Error(
          `Login continua inválido após correção: ${JSON.stringify(validity)}`,
        );
    } else {
      await page.locator('input[name="name"]').fill("visual");
      await page.locator('input[name="password"]').fill("mock-webfit");
    }
    await loginButton.click();
    await page
      .getByRole("heading", { name: "Dashboard", exact: true })
      .waitFor();
    await page.getByRole("button", { name: "Pacientes", exact: true }).click();
    try {
      await page
        .getByRole("heading", { name: "Pacientes", exact: true })
        .waitFor({ timeout: 3000 });
    } catch {
      throw new Error(
        JSON.stringify({
          loginState: await page.locator("#root").innerText(),
          calls: await page.evaluate(() => window.webfitMock.calls),
        }),
      );
    }
    const accountName = page.locator(".account-name strong");
    await accountName.getByText("maycon.teste", { exact: true }).waitFor();
    const accountNameLayout = await accountName.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        lineHeight: Number.parseFloat(style.lineHeight),
        lines: (() => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getClientRects().length;
        })(),
      };
    });
    if (
      accountNameLayout.scrollWidth > accountNameLayout.clientWidth ||
      accountNameLayout.lines > 1 ||
      accountNameLayout.clientHeight > accountNameLayout.lineHeight * 1.2
    )
      throw new Error(
        `Nome de acesso recortado ou quebrado: ${JSON.stringify(accountNameLayout)}`,
      );
    const accountRowAlignment = await page.evaluate(() => {
      const selectors = [".account-name", ".settings-button", ".logout-button"];
      const centers = selectors.map((selector) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Controle da conta ausente: ${selector}`);
        const bounds = element.getBoundingClientRect();
        return bounds.top + bounds.height / 2;
      });
      return Math.max(...centers) - Math.min(...centers);
    });
    if (accountRowAlignment > 1)
      throw new Error(
        `Nome e ícones da conta não estão alinhados: ${accountRowAlignment}px`,
      );
    if (scenario === "ready") {
      const menuToggle = page.getByRole("button", { name: "Fechar menu" });
      const openPosition = await menuToggle.boundingBox();
      if (!openPosition) throw new Error("Toggle do menu aberto não visível");
      const sidebarPosition = await page.locator(".sidebar").boundingBox();
      if (
        !sidebarPosition ||
        Math.abs(
          openPosition.x - (sidebarPosition.x + sidebarPosition.width - 62),
        ) > 0.5
      )
        throw new Error(
          `Toggle aberto não ficou no canto superior direito da lateral: ${JSON.stringify(openPosition)}`,
        );
      await page.screenshot({ path: resolve(output, "sidebar-open.png") });
      await menuToggle.click();
      await page.waitForFunction(() =>
        document
          .querySelector(".app-shell")
          ?.classList.contains("sidebar-collapsed"),
      );
      await page.waitForFunction(() => {
        const toolbar = document.querySelector(".shell-toolbar");
        return (
          toolbar && Math.abs(toolbar.getBoundingClientRect().left - 42) < 0.5
        );
      });
      const reopenToggle = page.getByRole("button", { name: "Abrir menu" });
      const closedPosition = await reopenToggle.boundingBox();
      if (
        !closedPosition ||
        Math.abs(closedPosition.x - 42) > 0.5 ||
        Math.abs(closedPosition.y - openPosition.y) > 0.5 ||
        Math.abs(closedPosition.width - openPosition.width) > 0.5 ||
        Math.abs(closedPosition.height - openPosition.height) > 0.5
      )
        throw new Error(
          `Toggle não foi para o canto mantendo altura/tamanho: aberto ${JSON.stringify(openPosition)}, recolhido ${JSON.stringify(closedPosition)}`,
        );
      const bannerPosition = await page.locator(".test-banner").boundingBox();
      if (
        bannerPosition &&
        closedPosition.x < bannerPosition.x + bannerPosition.width &&
        closedPosition.x + closedPosition.width > bannerPosition.x &&
        closedPosition.y < bannerPosition.y + bannerPosition.height &&
        closedPosition.y + closedPosition.height > bannerPosition.y
      )
        throw new Error("Toggle sobrepõe o banner de ambiente recolhido");
      if (
        !(await reopenToggle.evaluate(
          (button) => button === document.activeElement,
        ))
      )
        throw new Error("Recolher a lateral não manteve o foco no toggle");
      await page.screenshot({ path: resolve(output, "sidebar-collapsed.png") });
      await reopenToggle.click();
      await page.waitForFunction(
        () =>
          !document
            .querySelector(".app-shell")
            ?.classList.contains("sidebar-collapsed"),
      );
      await page.waitForFunction(() => {
        const toolbar = document.querySelector(".shell-toolbar");
        const sidebar = document.querySelector(".sidebar");
        if (!toolbar || !sidebar) return false;
        return (
          Math.abs(
            toolbar.getBoundingClientRect().left -
              (sidebar.getBoundingClientRect().right - 62),
          ) < 0.5
        );
      });
      const reopenedPosition = await menuToggle.boundingBox();
      if (
        !reopenedPosition ||
        Math.abs(reopenedPosition.y - closedPosition.y) > 0.5 ||
        Math.abs(reopenedPosition.width - closedPosition.width) > 0.5 ||
        Math.abs(reopenedPosition.height - closedPosition.height) > 0.5
      )
        throw new Error(
          `Reabrir o menu mudou altura/tamanho: recolhido ${JSON.stringify(closedPosition)}, aberto ${JSON.stringify(reopenedPosition)}`,
        );
      if (
        !(await menuToggle.evaluate(
          (button) => button === document.activeElement,
        ))
      )
        throw new Error("Reabrir a lateral não manteve o foco no toggle");
    }
    if (scenario === "empty")
      await page
        .getByRole("heading", { name: "Sua lista começa aqui" })
        .waitFor();
    else if (scenario === "error") {
      await page
        .getByText("Falha fictícia para testar recuperação.", { exact: true })
        .waitFor();
      await page.getByLabel("Pesquisar pacientes").fill("Alfa");
      await page.getByText("Paciente Fictício Alfa", { exact: true }).waitFor();
    } else {
      const patientStatus = page.getByRole("combobox", {
        name: "Situação dos pacientes",
      });
      if ((await patientStatus.inputValue()) !== "active")
        throw new Error("A lista de pacientes não inicia no filtro Ativos");
      await patientStatus.selectOption("archived");
      await page
        .getByText("Paciente Fictício Arquivado", { exact: true })
        .waitFor();
      await patientStatus.selectOption("active");
      await page.getByText("Paciente Fictício Alfa", { exact: true }).waitFor();
      if (
        await page
          .getByText("Paciente Fictício Arquivado", { exact: true })
          .count()
      )
        throw new Error("O filtro Ativos manteve paciente arquivado na lista");
      await page.getByLabel("Pesquisar pacientes").fill("inexistente");
      await page
        .getByRole("heading", { name: "Nenhum paciente encontrado" })
        .waitFor();
      await page.getByLabel("Pesquisar pacientes").fill("");
      await page.getByText("Paciente Fictício Beta", { exact: true }).waitFor();
    }
    await page.screenshot({
      path: resolve(output, `${scenario}.png`),
      fullPage: true,
    });
    if (scenario === "ready") {
      await page
        .getByRole("button", { name: "Novo paciente", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Salvar cadastro", exact: true })
        .click();
      await page.getByText("Nome completo é obrigatório.").waitFor();
      await page.getByText("Data de nascimento é obrigatório.").waitFor();
      await page
        .getByText("Selecione Feminino ou Masculino.", { exact: false })
        .waitFor();
      const saveCalls = await page.evaluate(() =>
        window.webfitMock.calls.filter(
          (call) => call.command === "save_patient",
        ),
      );
      if (saveCalls.length)
        throw new Error("Cadastro inválido foi enviado ao backend mock");
      await page.screenshot({
        path: resolve(output, "new-patient-invalid.png"),
        fullPage: true,
      });
      await page.locator('input[name="name"]').fill("Paciente Fictício Gamma");
      if (
        (
          await page
            .locator('input[name="name"]')
            .locator("xpath=ancestor::label")
            .getAttribute("class")
        )?.includes("field-invalid") ||
        !(
          await page
            .locator('input[name="birth"]')
            .locator("xpath=ancestor::label")
            .getAttribute("class")
        )?.includes("field-invalid") ||
        (await page.locator(".patient-sex").getAttribute("aria-invalid")) !==
          "true"
      )
        throw new Error("Corrigir o nome removeu erro incorreto ou em excesso");
      await page.locator('input[name="birth"]').fill("15");
      await page
        .getByRole("button", { name: "Salvar cadastro", exact: true })
        .click();
      await page
        .getByText("Informe uma data válida no formato DD/MM/AAAA.")
        .waitFor();
      if ((await page.locator('input[name="birth"]').inputValue()) !== "15")
        throw new Error("Data incompleta não foi preservada para correção");
      await page.locator('input[name="birth"]').fill("31022001");
      await page
        .getByRole("button", { name: "Salvar cadastro", exact: true })
        .click();
      await page
        .getByText("Informe uma data válida no formato DD/MM/AAAA.")
        .waitFor();
      const invalidDateCalls = await page.evaluate(() =>
        window.webfitMock.calls.filter(
          (call) => call.command === "save_patient",
        ),
      );
      if (invalidDateCalls.length)
        throw new Error("Data impossível foi enviada ao backend mock");
      await page.locator('input[name="birth"]').fill("15011992");
      if (
        await page
          .getByText("Informe uma data válida no formato DD/MM/AAAA.")
          .count()
      )
        throw new Error("Corrigir a data não removeu seu erro inline");
      if (!(await page.locator(".patient-sex").getAttribute("aria-invalid")))
        throw new Error("Corrigir o nascimento removeu o erro do sexo");
      await page.getByRole("button", { name: "Abrir calendário" }).click();
      await page
        .getByRole("dialog", { name: "Calendário" })
        .getByRole("button", { name: "15 de janeiro de 1992" })
        .click();
      if (
        (await page.locator('input[name="birth"]').inputValue()) !==
        "15/01/1992"
      )
        throw new Error("Selecionar no calendário não preservou a máscara BR");
      await page.getByRole("button", { name: "Abrir calendário" }).click();
      await page
        .getByRole("table", { name: "Dias de janeiro de 1992" })
        .waitFor();
      await page.locator('[data-date="1992-01-15"]').focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(
        (expected) =>
          document.activeElement?.getAttribute("data-date") === expected,
        "1992-01-16",
      );
      await page.keyboard.press("ArrowDown");
      await page.waitForFunction(
        (expected) =>
          document.activeElement?.getAttribute("data-date") === expected,
        "1992-01-23",
      );
      await page.keyboard.press("ArrowUp");
      await page.waitForFunction(
        (expected) =>
          document.activeElement?.getAttribute("data-date") === expected,
        "1992-01-16",
      );
      await page.keyboard.press("ArrowLeft");
      await page.waitForFunction(
        (expected) =>
          document.activeElement?.getAttribute("data-date") === expected,
        "1992-01-15",
      );
      await page.locator('[data-date="1992-01-01"]').focus();
      await page.keyboard.press("ArrowLeft");
      await page.waitForFunction(
        (expected) =>
          document.activeElement?.getAttribute("data-date") === expected,
        "1991-12-31",
      );
      await page.keyboard.press("Escape");
      if (
        (await page.getByRole("dialog", { name: "Calendário" }).count()) !==
          0 ||
        (await page.evaluate(() =>
          document.activeElement?.getAttribute("aria-label"),
        )) !== "Abrir calendário"
      )
        throw new Error("Escape não fechou o calendário e restaurou o foco");
      await page.locator('input[name="patient-sex"][value="F"]').check();
      if ((await page.locator(".field-invalid").count()) !== 0)
        throw new Error("A correção não limpou os erros do paciente");
      await page.screenshot({
        path: resolve(output, "new-patient.png"),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Salvar cadastro", exact: true })
        .click();
      await page
        .getByRole("heading", { name: "Paciente Fictício Gamma", exact: true })
        .waitFor();
      await page
        .getByRole("button", { name: "Voltar à lista", exact: true })
        .click();
      await page
        .getByRole("button", {
          name: "Abrir Paciente Fictício Gamma",
          exact: true,
        })
        .click();
      await page
        .getByRole("heading", { name: "Paciente Fictício Gamma", exact: true })
        .waitFor();
      if (
        (await page.locator('input[name="birth"]').inputValue()) !==
        "15/01/1992"
      )
        throw new Error("Reabrir o paciente não preservou a data civil salva");
      await page.screenshot({
        path: resolve(output, "saved-patient.png"),
        fullPage: true,
      });
    }
    const unsupported = await page.evaluate(
      () => window.webfitMock.unsupported,
    );
    if (errors.length || unsupported.length)
      throw new Error(JSON.stringify({ scenario, errors, unsupported }));
    results.push({
      scenario,
      status: "PASS",
      operations: await page.evaluate(() => window.webfitMock.calls),
    });
    await context.close();
  }
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify(
      {
        status: "PASS",
        date: new Date().toISOString(),
        browser: await browser.version(),
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ status: "PASS", scenarios: results.length, output }),
  );
} catch (error) {
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify({ status: "FAIL", results, error: String(error) }, null, 2),
  );
  throw error;
} finally {
  await browser?.close();
}
