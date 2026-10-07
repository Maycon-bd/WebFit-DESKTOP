import { createHash } from 'node:crypto';
import { access, appendFile, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

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

export function run(executable, args, env = process.env) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(executable, args, { env, stdio: ['inherit', 'inherit', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      process.stderr.write(chunk);
      stderr = `${stderr}${chunk}`.slice(-16384);
    });
    child.once('error', reject);
    child.once('close', (code) => {
      if (code === 0) resolveRun();
      else {
        const error = new Error(`${executable} exited with code ${code ?? 'unknown'}.`);
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

export function isRetryableDownloadError(error) {
  const messages = [];
  let current = error;
  for (let depth = 0; current && depth < 5; depth += 1, current = current.cause) {
    messages.push(current.name ?? '', current.message ?? '', current.stderr ?? '', current.code ?? '');
    if ([408, 429, 500, 502, 503, 504].includes(current.status)) return true;
  }
  const detail = messages.join(' ');
  if (/checksum (?:mismatch|failed)|invalid.*checksum|certificate|permission denied|access is denied|no space left|disk full/i.test(detail)) return false;
  return /ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|UND_ERR_(?:SOCKET|CONNECT_TIMEOUT|HEADERS_TIMEOUT|BODY_TIMEOUT)|TimeoutError|timed out|transfer(?:red)? (?:a )?partial file|stream error|request or response body error|connection (?:reset|closed)|unexpected eof|end of response/i.test(detail);
}

export async function withDownloadRetries(operation, { wait = delay, warn = console.warn } = {}) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === 3 || !isRetryableDownloadError(error)) throw error;
      const pause = attempt * 2000;
      warn(`Rust download interrupted; retry ${attempt + 1}/3 in ${pause / 1000}s.`);
      await wait(pause);
    }
  }
}

export async function downloadVerifiedRustup(installer, rustupHome, fetcher = fetch) {
  const url = `https://static.rust-lang.org/rustup/archive/${rustupVersion}/x86_64-pc-windows-msvc/rustup-init.exe`;
  const installerBytes = await withDownloadRetries(async () => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(120000)]);
    try {
      const [installerResponse, checksumResponse] = await Promise.all([
        fetcher(url, { signal }), fetcher(`${url}.sha256`, { signal }),
      ]);
      for (const response of [installerResponse, checksumResponse]) {
        if (!response.ok) {
          const error = new Error('Could not download the pinned Rustup installer and checksum.');
          error.status = response.status;
          throw error;
        }
      }
      const bytes = Buffer.from(await installerResponse.arrayBuffer());
      const expected = (await checksumResponse.text()).match(/^([a-f\d]{64})\b/i)?.[1];
      if (!expected) fail('Invalid Rustup checksum response.');
      const actual = createHash('sha256').update(bytes).digest('hex');
      if (actual.toLowerCase() !== expected.toLowerCase()) fail('Rustup checksum mismatch.');
      return bytes;
    } finally {
      controller.abort();
    }
  });
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
  const testTemp = process.env.RUNNER_TEMP
    ? join(process.env.RUNNER_TEMP, 'webfit-tests')
    : null;
  if (!testTemp) fail('RUNNER_TEMP is unavailable.');
  await mkdir(testTemp, { recursive: true });
  const env = {
    ...process.env,
    CARGO_HOME: cargoHome,
    RUSTUP_HOME: rustupHome,
    RUSTUP_USE_CURL: '0',
    LC_ALL: 'C',
    LANG: 'C',
    TMP: testTemp,
    TEMP: testTemp,
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
      '--default-toolchain', 'none',
    ], env);
  }

  if (process.argv.includes('--initialize')) {
    await withDownloadRetries(() => run(rustupExe, [
      'toolchain', 'install', rustVersion, '--profile', 'minimal',
      '--component', 'rustfmt', '--component', 'clippy',
    ], env));
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
    RUSTUP_USE_CURL: '0',
    RUSTUP_TOOLCHAIN: rustVersion,
    PERL: perlExe,
    LC_ALL: 'C',
    LANG: 'C',
    TMP: testTemp,
    TEMP: testTemp,
  })) {
    await appendGitHubFile(process.env.GITHUB_ENV, `${name}=${value}`);
  }
  for (const folder of [cargoBin, dirname(perlExe), perlC]) {
    await appendGitHubFile(process.env.GITHUB_PATH, folder);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Runner environment preparation failed.');
    process.exitCode = 1;
  });
}
