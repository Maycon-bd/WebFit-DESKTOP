import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, access, mkdir, writeFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { isRetryableDownloadError, withDownloadRetries, downloadVerifiedRustup, run, prepareBuildCache } from './runner-env.mjs';

test('cache rejects checkout paths and preserves artifacts across preparation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'webfit-cache-policy-'));
  try {
    const workspace = join(root, 'checkout');
    await assert.rejects(prepareBuildCache(workspace, workspace), /outside the checkout/);
    const target = await prepareBuildCache(join(root, 'tools'), workspace);
    await writeFile(join(target, 'artifact'), 'preserved');
    assert.equal(await prepareBuildCache(join(root, 'tools'), workspace), target);
    assert.equal(await readFile(join(target, 'artifact'), 'utf8'), 'preserved');
    assert.notEqual(await prepareBuildCache(join(root, 'tools'), workspace, 'next'), target);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Cargo reuses external artifacts after checkout cleanup and invalidates changed source', { skip: !process.env.WEBFIT_TEST_CARGO_CACHE }, async () => {
  await mkdir('.artifacts/release-tests', { recursive: true });
  const root = await mkdtemp(resolve('.artifacts/release-tests/cargo-cache-'));
  try {
    const workspace = join(root, 'checkout');
    const target = await prepareBuildCache(join(root, 'tools with spaces'), workspace);
    const source = join(workspace, 'src', 'lib.rs');
    const createCheckout = async () => {
      await mkdir(join(workspace, 'src'), { recursive: true });
      await writeFile(join(workspace, 'Cargo.toml'), '[package]\nname="webfit_cache_fixture"\nversion="0.1.0"\nedition="2021"\n');
      await writeFile(source, 'pub fn value() -> u32 { 1 }\n');
    };
    const cargo = (args) => {
      const result = spawnSync('cargo', args, { cwd: workspace, env: { ...process.env, CARGO_TARGET_DIR: target }, encoding: 'utf8' });
      assert.equal(result.status, 0, result.error?.message || result.stderr);
      return result.stderr;
    };
    await createCheckout();
    cargo(['generate-lockfile', '--offline']);
    assert.match(cargo(['build', '--offline', '--locked']), /Compiling webfit_cache_fixture/);
    const artifact = join(target, 'debug', 'libwebfit_cache_fixture.rlib');
    const first = (await stat(artifact)).mtimeMs;
    await rm(workspace, { recursive: true, force: true });
    await createCheckout();
    cargo(['generate-lockfile', '--offline']);
    // Recreated sources can trigger a rebuild; the following unchanged run must be fresh.
    cargo(['build', '--offline', '--locked']);
    const warm = (await stat(artifact)).mtimeMs;
    assert.doesNotMatch(cargo(['build', '--offline', '--locked']), /Compiling webfit_cache_fixture/);
    assert.equal((await stat(artifact)).mtimeMs, warm);
    assert.ok(warm >= first);
    await writeFile(source, 'pub fn value() -> u32 { 22 }\n');
    assert.match(cargo(['build', '--offline', '--locked']), /Compiling webfit_cache_fixture/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


for (const detail of ['Transferred a partial file (end of response with bytes missing)', 'stream error received: unspecific protocol error detected', 'request or response body error']) {
  test(`recovers transport failure: ${detail}`, async () => {
    let calls = 0;
    const pauses = [], warnings = [];
    const result = await withDownloadRetries(async () => {
      if (++calls < 3) throw Object.assign(new Error('rustup exited with code 1.'), { stderr: detail });
      return 'installed';
    }, { wait: async ms => pauses.push(ms), warn: message => warnings.push(message) });
    assert.equal(result, 'installed');
    assert.equal(calls, 3);
    assert.deepEqual(pauses, [2000, 4000]);
    assert.equal(warnings.length, 2);
  });
}

test('persistent transport failure stops after three attempts and preserves the error', async () => {
  const failure = new Error('transfer partial file');
  let calls = 0;
  await assert.rejects(withDownloadRetries(async () => { calls++; throw failure; }, { wait: async () => {}, warn: () => {} }), error => error === failure);
  assert.equal(calls, 3);
});

for (const detail of ['Rustup checksum mismatch.', 'Invalid Rustup checksum response.', 'certificate verify failed', 'access is denied', 'no space left on device', 'unknown toolchain version', 'HTTP status 403']) {
  test(`does not retry permanent failure: ${detail}`, async () => {
    let calls = 0;
    await assert.rejects(withDownloadRetries(async () => { calls++; throw new Error(detail); }, { wait: async () => assert.fail('unexpected wait'), warn: () => assert.fail('unexpected retry') }));
    assert.equal(calls, 1);
  });
}

test('recognizes nested fetch socket failure and timeout but rejects authentication HTTP status', () => {
  assert.equal(isRetryableDownloadError(new TypeError('fetch failed', { cause: Object.assign(new Error('socket'), { code: 'ECONNRESET' }) })), true);
  assert.equal(isRetryableDownloadError(new DOMException('The operation was aborted due to timeout', 'TimeoutError')), true);
  assert.equal(isRetryableDownloadError(Object.assign(new Error('download failed'), { status: 503 })), true);
  assert.equal(isRetryableDownloadError(Object.assign(new Error('download failed'), { status: 401 })), false);
});

test('subprocess stderr is available for transport classification after nonzero exit', async () => {
  await assert.rejects(run(process.execPath, ['-e', 'process.stderr.write("stream error fixture\\n"); process.exitCode = 1;']), error => error.stderr === 'stream error fixture\n' && isRetryableDownloadError(error));
});

for (const valid of [true, false]) {
  test(`installer is written only after valid checksum: ${valid}`, async () => {
    const folder = await mkdtemp(join(tmpdir(), 'webfit-rust-bootstrap-'));
    const installer = join(folder, 'installer.exe');
    const bytes = Buffer.from('fictitious installer, never executed');
    const hash = createHash('sha256').update(bytes).digest('hex');
    const calls = [];
    const fetcher = async (url, { signal }) => {
      calls.push(url);
      assert.ok(signal instanceof AbortSignal);
      return url.endsWith('.sha256') ? new Response(valid ? hash : '0'.repeat(64)) : new Response(bytes);
    };
    try {
      if (valid) {
        await downloadVerifiedRustup(installer, join(folder, 'rustup'), fetcher);
        assert.deepEqual(await readFile(installer), bytes);
      } else {
        await assert.rejects(downloadVerifiedRustup(installer, join(folder, 'rustup'), fetcher), /checksum mismatch/);
        await assert.rejects(access(installer));
      }
      assert.equal(calls.length, 2);
      assert.ok(calls.every(url => url.startsWith('https://static.rust-lang.org/rustup/archive/1.29.1/')));
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  });
}

for (const status of [503, 403]) {
  test(`installer HTTP ${status} handling preserves retry and integrity policy`, async () => {
    const folder = await mkdtemp(join(tmpdir(), 'webfit-rust-http-'));
    const installer = join(folder, 'installer.exe');
    const bytes = Buffer.from('fictitious installer');
    const hash = createHash('sha256').update(bytes).digest('hex');
    let installerCalls = 0;
    const signals = [];
    const fetcher = async (url, { signal }) => {
      signals.push(signal);
      if (url.endsWith('.sha256')) return new Response(hash);
      installerCalls++;
      return installerCalls === 1 ? new Response('', { status }) : new Response(bytes);
    };
    try {
      if (status === 503) {
        await downloadVerifiedRustup(installer, join(folder, 'rustup'), fetcher);
        assert.equal(installerCalls, 2);
        assert.deepEqual(await readFile(installer), bytes);
      } else {
        await assert.rejects(downloadVerifiedRustup(installer, join(folder, 'rustup'), fetcher), error => error.status === 403);
        assert.equal(installerCalls, 1);
        await assert.rejects(access(installer));
      }
      assert.ok(signals.every(signal => signal.aborted));
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  });
}
