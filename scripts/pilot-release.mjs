import { createHash, createPublicKey, verify } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

export function verifySignature(bytes, encodedSignature, encodedKey) {
  const keyLines = Buffer.from(encodedKey, 'base64').toString('utf8').trim().split(/\r?\n/);
  const lines = Buffer.from(encodedSignature, 'base64').toString('utf8').trim().split(/\r?\n/);
  const key = Buffer.from(keyLines[1] ?? '', 'base64');
  const signature = Buffer.from(lines[1] ?? '', 'base64');
  requireCondition(key.length === 42 && signature.length === 74, 'Invalid minisign envelope.');
  requireCondition(key.subarray(2, 10).equals(signature.subarray(2, 10)), 'Signing key mismatch.');
  const algorithm = signature.subarray(0, 2).toString('ascii');
  requireCondition(['Ed', 'ED'].includes(algorithm), 'Unsupported signature algorithm.');
  const publicKey = createPublicKey({ key: Buffer.concat([
    Buffer.from('302a300506032b6570032100', 'hex'), key.subarray(10),
  ]), format: 'der', type: 'spki' });
  const payload = algorithm === 'ED' ? createHash('blake2b512').update(bytes).digest() : bytes;
  requireCondition(verify(null, payload, publicKey, signature.subarray(10)), 'Invalid installer signature.');
  requireCondition(lines[2]?.startsWith('trusted comment: '), 'Missing trusted comment.');
  const globalPayload = Buffer.concat([signature.subarray(10), Buffer.from(lines[2].slice(17))]);
  requireCondition(verify(null, globalPayload, publicKey, Buffer.from(lines[3] ?? '', 'base64')), 'Invalid trusted comment signature.');
}

export function validateManifest(manifest, version, assets, prefix) {
  requireCondition(manifest.version === version, 'Manifest version mismatch.');
  requireCondition(typeof manifest.pub_date === 'string' && Number.isFinite(Date.parse(manifest.pub_date)), 'Invalid publication date.');
  const platforms = Object.entries(manifest.platforms ?? {});
  requireCondition(platforms.some(([name]) => name === 'windows-x86_64' || name.startsWith('windows-x86_64-')), 'Missing Windows x64 update.');
  for (const [platform, entry] of platforms) {
    requireCondition(platform.startsWith('windows-x86_64'), 'Unexpected platform for Windows-only pilot.');
    requireCondition(typeof entry.url === 'string' && entry.url.startsWith(prefix), 'Untrusted installer URL.');
    const asset = assets.find((item) => item.browser_download_url === entry.url);
    requireCondition(asset && /\.(exe|msi)$/.test(asset.name), 'Manifest installer is absent from release.');
    requireCondition(typeof entry.signature === 'string' && entry.signature.length > 0, 'Missing update signature.');
  }
  return platforms.map(([, entry]) => entry);
}

export function checksums(files) {
  return [...files].sort(([a], [b]) => a.localeCompare(b)).map(([name, bytes]) => {
    requireCondition(!/[\r\n\\/]/.test(name), 'Unsafe checksum filename.');
    return `${createHash('sha256').update(bytes).digest('hex')}  ${name}\n`;
  }).join('');
}

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(120_000) });
  requireCondition(response.ok, `Release request failed (HTTP ${response.status}).`);
  return response;
}

async function main() {
  const { WEBFIT_RELEASE_REPO: repo, RELEASE_ID: id, RELEASE_VERSION: version, GITHUB_TOKEN: token } = process.env;
  requireCondition(repo === 'webfit-desktop-releases' && /^\d+$/.test(id ?? '') && token, 'Invalid release configuration.');
  requireCondition(/^0\.1\.0-pilot\.\d+\.\d+$/.test(version ?? ''), 'Invalid pilot version.');
  const base = `https://api.github.com/repos/Maycon-bd/${repo}`;
  // Credentials are sent only to the GitHub API, never to manifest/download URLs.
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const release = await (await request(`${base}/releases/${id}`, { headers, redirect: 'error' })).json();
  requireCondition(!release.draft && !release.prerelease && release.tag_name === `pilot-v${version}`, 'Unexpected release state.');
  const assets = release.assets;
  requireCondition(Array.isArray(assets) && assets.length > 0 && assets.length < 100, 'Invalid release assets.');
  requireCondition(new Set(assets.map((a) => a.name)).size === assets.length, 'Duplicate asset names.');
  const prefix = `https://github.com/Maycon-bd/${repo}/releases/download/${release.tag_name}/`;
  const files = new Map();
  for (const asset of assets) {
    requireCondition(asset.browser_download_url.startsWith(prefix), 'Unexpected asset URL.');
    if (asset.name === 'SHA256SUMS') throw new Error('Release already has checksums; refusing overwrite.');
    const bytes = Buffer.from(await (await request(asset.browser_download_url)).arrayBuffer());
    requireCondition(bytes.length === asset.size && bytes.length > 0, 'Asset size mismatch.');
    files.set(asset.name, bytes);
  }
  requireCondition(files.has('latest.json'), 'Missing latest.json.');
  const manifestBytes = files.get('latest.json');
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const config = JSON.parse(await readFile('spikes/g4-tauri-foundation/src-tauri/tauri.conf.json', 'utf8'));
  const entries = validateManifest(manifest, version, assets, prefix);
  for (const asset of assets.filter((a) => /\.(exe|msi)$/.test(a.name))) {
    requireCondition(files.has(`${asset.name}.sig`), 'Missing installer signature asset.');
    verifySignature(files.get(asset.name), files.get(`${asset.name}.sig`).toString('utf8').trim(), config.plugins.updater.pubkey);
  }
  for (const entry of entries) {
    const asset = assets.find((a) => a.browser_download_url === entry.url);
    verifySignature(files.get(asset.name), entry.signature, config.plugins.updater.pubkey);
    requireCondition(entry.signature.trim() === files.get(`${asset.name}.sig`).toString('utf8').trim(), 'Manifest/signature asset mismatch.');
  }
  const endpoint = config.plugins.updater.endpoints[0];
  requireCondition(endpoint === `https://github.com/Maycon-bd/${repo}/releases/latest/download/latest.json`, 'Unexpected updater endpoint.');
  const publicManifest = Buffer.from(await (await request(endpoint)).arrayBuffer());
  requireCondition(publicManifest.equals(manifestBytes), 'Latest endpoint does not serve this release.');
  const body = Buffer.from(checksums(files));
  const uploadUrl = `https://uploads.github.com/repos/Maycon-bd/${repo}/releases/${id}/assets?name=SHA256SUMS`;
  const uploaded = await (await request(uploadUrl, {
    method: 'POST', headers: { ...headers, 'Content-Type': 'text/plain' }, body, redirect: 'error',
  })).json();
  requireCondition(uploaded.browser_download_url === `${prefix}SHA256SUMS`, 'Unexpected checksum URL.');
  const downloaded = Buffer.from(await (await request(uploaded.browser_download_url)).arrayBuffer());
  requireCondition(downloaded.equals(body), 'Published checksum content mismatch.');
  console.log(`Verified public pilot ${version}: manifest, installer signatures and ${files.size} SHA256 checksums.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
