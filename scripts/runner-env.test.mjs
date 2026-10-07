import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isRetryableDownloadError, withDownloadRetries, downloadVerifiedRustup, run } from './runner-env.mjs';


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
