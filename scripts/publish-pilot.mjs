import { readFile, readdir, writeFile } from 'node:fs/promises';
import { verifySignature, validateManifest, checksums } from './pilot-release.mjs';
import { newerPilot } from './prepare-pilot.mjs';

// External mutation: called only by the enabled main publication workflow.
const token=process.env.WEBFIT_RELEASE_TOKEN;
if (!token || process.env.WEBFIT_RELEASE_REPO !== 'webfit-desktop-releases') throw new Error('Invalid publication configuration.');
const base='https://api.github.com/repos/Maycon-bd/webfit-desktop-releases';
const config=JSON.parse(await readFile('src-tauri/tauri.conf.json','utf8'));
const folder='.artifacts/pilot';
const names=await readdir(folder);
const files=new Map(await Promise.all(names.filter(n=>n !== 'SHA256SUMS' && n !== 'TESTE-LOCAL.md').map(async n=>[n,await readFile(`${folder}/${n}`)])));
const installers=names.filter(n=>n.endsWith('.exe'));
if (installers.length!==1 || !files.has('latest.json')) throw new Error('Invalid staged assets.');
const expected=new Set([installers[0],installers[0]+'.sig','latest.json','SHA256SUMS','TESTE-LOCAL.md']);
if (names.length!==expected.size || names.some(name=>!expected.has(name) || /[\\/\r\n]/.test(name))) throw new Error('Unexpected staged asset.');
verifySignature(files.get(installers[0]),files.get(installers[0]+'.sig').toString('utf8').trim(),config.plugins.updater.pubkey);
if ((await readFile(`${folder}/SHA256SUMS`,'utf8'))!==checksums(files)) throw new Error('Staged checksums mismatch.');

async function api(url, method, body, type='application/json') {
  const response=await fetch(url,{method,body,redirect:'error',signal:AbortSignal.timeout(120000),headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','Content-Type':type,'X-GitHub-Api-Version':'2022-11-28'}});
  if (!response.ok) throw new Error(`GitHub publication failed (HTTP ${response.status}); inspect draft release before retrying.`);
  return response.json();
}
const manifest=JSON.parse(files.get('latest.json').toString('utf8'));
if (manifest.version!==config.version || !/^\d+\.\d+\.\d+-pilot\.\d+\.\d+$/.test(config.version)) throw new Error('Version mismatch.');
const prefix=`https://github.com/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v${config.version}/`;
validateManifest(manifest,config.version,[{name:installers[0],browser_download_url:prefix+encodeURIComponent(installers[0])}],prefix);
const latestResponse=await fetch(`${base}/releases/latest`,{redirect:'error',signal:AbortSignal.timeout(120000),headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json'}});
if (latestResponse.ok) {
  const latest=await latestResponse.json();
  if (!newerPilot(config.version,latest.tag_name.replace(/^pilot-v/,''))) throw new Error('Publication must advance the pilot version.');
} else if (latestResponse.status!==404) throw new Error('Cannot verify current release before publication.');
const release=await api(`${base}/releases`,'POST',JSON.stringify({tag_name:`pilot-v${config.version}`,target_commitish:'main',name:`WebFit piloto ${config.version}`,body:`${manifest.notes}\nCódigo de origem: ${process.env.GITHUB_SHA}.`,draft:true,prerelease:false}));
// Credentials stay on GitHub API/uploads; public download verification uses no token.
for (const name of names) {
  if (/[\\/\r\n]/.test(name)) throw new Error('Unsafe staged filename.');
  const bytes=await readFile(`${folder}/${name}`);
  const asset=await api(`https://uploads.github.com/repos/Maycon-bd/webfit-desktop-releases/releases/${release.id}/assets?name=${encodeURIComponent(name)}`,'POST',bytes,'application/octet-stream');
  if (asset.size!==bytes.length || asset.state!=='uploaded') throw new Error('Upload verification failed; preserve draft for inspection.');
}
await api(`${base}/releases/${release.id}`,'PATCH',JSON.stringify({draft:false,make_latest:'true'}));
await writeFile(process.env.GITHUB_OUTPUT,`releaseId=${release.id}\nversion=${config.version}\n`,{flag:'a'});
console.log(`Published preverified pilot ${config.version}; public verification follows.`);
