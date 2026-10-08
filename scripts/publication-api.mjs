export const releaseBase = 'https://api.github.com/repos/Maycon-bd/webfit-desktop-releases';

export function publicationClient({ token, repo, fetchImpl = fetch }) {
  if (!token || repo !== 'webfit-desktop-releases') throw new Error('Invalid publication configuration.');
  return async function api(url, method = 'GET', body, type = 'application/json') {
    if (!url.startsWith(`${releaseBase}/`) && !url.startsWith('https://uploads.github.com/repos/Maycon-bd/webfit-desktop-releases/')) throw new Error('Untrusted publication API destination.');
    let response;
    try {
      response = await fetchImpl(url, { method, body, redirect: 'error', signal: AbortSignal.timeout(120000), headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': type, 'X-GitHub-Api-Version': '2022-11-28' } });
    } catch {
      throw new Error(`GitHub ${method} request failed; check network and inspect any draft before retrying.`);
    }
    if (response.status === 404 && method === 'GET') return null;
    if (!response.ok) {
      // Never echo response bodies, headers, request payloads or credentials.
      const operation = method === 'PATCH' ? 'publish draft' : method === 'POST' ? 'create draft/upload asset' : 'preflight/read';
      const advice = response.status === 422 ? 'Check the target commit, tag and existing draft; preserve uploaded assets for inspection.' : 'Check repository access and inspect any draft before retrying.';
      throw new Error(`GitHub ${operation} failed (HTTP ${response.status}). ${advice}`);
    }
    return response.json();
  };
}

export async function preflightPublication(api) {
  const branch = await api(`${releaseBase}/branches/main`);
  if (!branch) throw new Error('Release repository main branch is missing or inaccessible. Initialize webfit-desktop-releases with a README commit on main, or verify token access, before retrying. No build or publication is needed to repair this prerequisite.');
  const sha = branch.commit?.sha;
  if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Release repository main does not resolve to a valid commit.');
  return sha;
}

export function validateUploadedAsset(asset, name, size, prefix) {
  if (asset.size !== size || asset.state !== 'uploaded' || asset.name !== name || asset.browser_download_url !== prefix + encodeURIComponent(name)) throw new Error('Uploaded asset name, URL, size or state mismatch; preserve draft for inspection.');
}
