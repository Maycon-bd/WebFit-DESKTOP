import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const cli = fileURLToPath(
  new URL("../node_modules/@tauri-apps/cli/tauri.js", import.meta.url),
);
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: `${root}/tools/license-issuer`,
  stdio: "inherit",
  env: process.env,
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
