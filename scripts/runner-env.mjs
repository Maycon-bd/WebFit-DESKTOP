import { createHash } from 'node:crypto';
import { access, appendFile, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const toolRoot = process.env.RUNNER_TOOL_CACHE
  ? resolve(process.env.RUNNER_TOOL_CACHE, 'webfit')
  : null;
const rustVersion = '1.98.1';
const rustupVersion = '1.29.1';

function fail(message) {
  throw new Error(message);
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function run(executable, args, env = process.env) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(executable, args, { env, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${executable} exited with code ${code ?? 'unknown'}.`));
    });
  });
}

async function downloadVerifiedRustup(installer, rustupHome) {
  const url = `https://static.rust-lang.org/rustup/archive/${rustupVersion}/x86_64-pc-windows-msvc/rustup-init.exe`;
  const [installerResponse, checksumResponse] = await Promise.all([
    fetch(url),
    fetch(`${url}.sha256`),
  ]);
  if (!installerResponse.ok || !checksumResponse.ok) {
    fail('Could not download the pinned Rustup installer and checksum.');
  }

  const installerBytes = Buffer.from(await installerResponse.arrayBuffer());
  const checksumText = await checksumResponse.text();
  const expected = checksumText.match(/^([a-f\d]{64})\b/i)?.[1];
  if (!expected) fail('Invalid Rustup checksum response.');

  const actual = createHash('sha256').update(installerBytes).digest('hex');
  if (actual.toLowerCase() !== expected.toLowerCase()) {
    fail('Rustup checksum mismatch.');
  }

  await mkdir(dirname(installer), { recursive: true });
  await writeFile(installer, installerBytes);
  await mkdir(rustupHome, { recursive: true });
}

async function appendGitHubFile(file, value) {
  if (!file) return;
  await appendFile(file, `${value}\n`, 'utf8');
}

async function main() {
  if (!toolRoot) fail('RUNNER_TOOL_CACHE is unavailable.');

  const cargoHome = join(toolRoot, 'cargo');
  const rustupHome = join(toolRoot, 'rustup');
  const cargoBin = join(cargoHome, 'bin');
  const rustupExe = join(cargoBin, 'rustup.exe');
  const env = {
    ...process.env,
    CARGO_HOME: cargoHome,
    RUSTUP_HOME: rustupHome,
    LC_ALL: 'C',
    LANG: 'C',
    PATH: `${cargoBin};${process.env.PATH ?? ''}`,
  };

  if (!(await exists(rustupExe))) {
    if (!process.argv.includes('--initialize')) {
      fail('Runner toolchain not prepared. Run with --initialize in the runner tool cache.');
    }

    const installer = join(toolRoot, `rustup-init-${rustupVersion}.exe`);
    await downloadVerifiedRustup(installer, rustupHome);
    await run(installer, [
      '-y', '--no-modify-path', '--profile', 'minimal',
      '--default-toolchain', rustVersion,
      '--component', 'rustfmt', '--component', 'clippy',
    ], env);
  }

  if (process.argv.includes('--initialize')) {
    await run(rustupExe, [
      'toolchain', 'install', rustVersion, '--profile', 'minimal',
      '--component', 'rustfmt', '--component', 'clippy',
    ], env);
  }
  await run(rustupExe, ['run', rustVersion, 'rustc', '--version'], env);
  env.RUSTUP_TOOLCHAIN = rustVersion;

  const perlRoot = process.env.WEBFIT_PERL_PATH ||
    'D:\\MAYCON\\PROJETOS\\WebFit-DESKTOP\\.tools\\strawberry';
  const perlExe = join(perlRoot, 'perl', 'bin', 'perl.exe');
  const perlC = join(perlRoot, 'c', 'bin');
  if (!(await exists(perlExe)) || !(await exists(perlC))) {
    fail('Complete Strawberry Perl distribution unavailable; configure WEBFIT_PERL_PATH for this machine.');
  }
  env.PERL = perlExe;
  env.PATH = `${dirname(perlExe)};${perlC};${env.PATH}`;
  await run(perlExe, ['-e', 'print "Perl ready\\n";'], env);

  for (const tool of ['git', 'node', 'npm', 'cargo', 'rustc']) {
    await run('where.exe', [tool], env);
  }

  for (const [name, value] of Object.entries({
    CARGO_HOME: cargoHome,
    RUSTUP_HOME: rustupHome,
    RUSTUP_TOOLCHAIN: rustVersion,
    PERL: perlExe,
    LC_ALL: 'C',
    LANG: 'C',
  })) {
    await appendGitHubFile(process.env.GITHUB_ENV, `${name}=${value}`);
  }
  for (const folder of [cargoBin, dirname(perlExe), perlC]) {
    await appendGitHubFile(process.env.GITHUB_PATH, folder);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Runner environment preparation failed.');
  process.exitCode = 1;
});
