import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicationClient, preflightPublication, validateUploadedAsset, releaseBase } from './publication-api.mjs';

const sha = 'a'.repeat(40);
const token = 'fictitious-token-never-print';
const config = { token, repo: 'webfit-desktop-releases' };

test('upload name or URL normalization stops while release is still a draft', () => {
  const prefix='https://github.com/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v0.1.9-pilot.10.2/';
  const name='WebFit-Desktop_0.1.9-pilot.10.2_x64-setup.exe';
  const asset={name,size:15,state:'uploaded',browser_download_url:prefix+name};
  assert.doesNotThrow(()=>validateUploadedAsset(asset,name,15,prefix));
  for (const altered of [{...asset,name:'WebFit.Desktop.exe'},{...asset,browser_download_url:prefix+'other.exe'},{...asset,size:14},{...asset,state:'starter'}]) assert.throws(()=>validateUploadedAsset(altered,name,15,prefix),/preserve draft/);
  const spaceName=name.replace('WebFit-Desktop','WebFit Desktop');
  assert.throws(()=>validateUploadedAsset({...asset,name:spaceName.replace(' ','.')},spaceName,15,prefix),/mismatch/);
});

test('empty repository stops before any release or asset mutation', async () => {
  const calls = [];
  const api = publicationClient({ ...config, fetchImpl: async (url, options) => {
    calls.push([url, options.method]);
    return new Response('{}', { status: 404 });
  } });
  await assert.rejects(preflightPublication(api), /README commit on main/);
  assert.deepEqual(calls, [[`${releaseBase}/branches/main`, 'GET']]);
});

test('preflight resolves artifact repository commit and rejects invalid API data', async () => {
  const api = publicationClient({ ...config, fetchImpl: async (url, options) => {
    assert.equal(url, `${releaseBase}/branches/main`);
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    assert.equal(options.redirect, 'error');
    return Response.json({ commit: { sha } });
  } });
  assert.equal(await preflightPublication(api), sha);
  await assert.rejects(preflightPublication(async () => ({ commit: { sha: 'main' } })), /valid commit/);
});

test('API diagnoses permission and publish 422 failures without echoing raw response or secrets', async () => {
  for (const [status, method] of [[403, 'GET'], [422, 'PATCH']]) {
    const api = publicationClient({ ...config, fetchImpl: async () => new Response(JSON.stringify({ message: token, errors: [{ value: token }] }), { status }) });
    await assert.rejects(api(`${releaseBase}/releases/123`, method, '{}'), error => {
      assert.match(error.message, new RegExp(`HTTP ${status}`));
      assert.equal(error.message.includes(token), false);
      if (status === 422) assert.match(error.message, /publish draft.*target commit, tag and existing draft/);
      return true;
    });
  }
});

test('network diagnostics do not leak underlying exception; credentials stay on trusted API paths', async () => {
  let count = 0;
  const api = publicationClient({ ...config, fetchImpl: async () => { count++; throw new Error(token); } });
  await assert.rejects(api(`${releaseBase}/releases`), error => !error.message.includes(token) && /check network/.test(error.message));
  await assert.rejects(api('https://example.com/download'), /Untrusted/);
  await assert.rejects(api(`${releaseBase}-other/releases`), /Untrusted/);
  assert.equal(count, 1);
});

test('missing latest is allowed only for reads; upload 404 fails', async () => {
  const api = publicationClient({ ...config, fetchImpl: async () => new Response('{}', { status: 404 }) });
  assert.equal(await api(`${releaseBase}/releases/latest`), null);
  await assert.rejects(api('https://uploads.github.com/repos/Maycon-bd/webfit-desktop-releases/releases/123/assets?name=fixture.exe', 'POST', Buffer.from('fixture')), /HTTP 404/);
});

test('workflow preflight runs before compiler bootstrap, dependencies and signing', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pilot-release.yml', import.meta.url), 'utf8');
  const preflight = workflow.indexOf('run: node scripts/preflight-pilot.mjs');
  assert.ok(preflight > 0);
  for (const marker of ['run: node scripts/runner-env.mjs --initialize', 'run: npm ci', 'TAURI_SIGNING_PRIVATE_KEY:']) assert.ok(workflow.indexOf(marker) > preflight);
});
