import { readFile, readdir, writeFile } from 'node:fs/promises';
import { verifySignature, validateManifest, checksums } from './pilot-release.mjs';
import { newerPilot } from './prepare-pilot.mjs';
import { publicationClient, preflightPublication, validateUploadedAsset, releaseBase as base } from './publication-api.mjs';

// External mutation: called only by the enabled main publication workflow.
const api=publicationClient({token:process.env.WEBFIT_RELEASE_TOKEN,repo:process.env.WEBFIT_RELEASE_REPO});
const targetCommit=await preflightPublication(api);
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

const manifest=JSON.parse(files.get('latest.json').toString('utf8'));
if (manifest.version!==config.version || !/^\d+\.\d+\.\d+-pilot\.\d+\.\d+$/.test(config.version)) throw new Error('Version mismatch.');
const prefix=`https://github.com/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v${config.version}/`;
validateManifest(manifest,config.version,[{name:installers[0],browser_download_url:prefix+encodeURIComponent(installers[0])}],prefix);
const latest=await api(`${base}/releases/latest`);
if (latest) {
  if (!newerPilot(config.version,latest.tag_name.replace(/^pilot-v/,''))) throw new Error('Publication must advance the pilot version.');
}
const release=await api(`${base}/releases`,'POST',JSON.stringify({tag_name:`pilot-v${config.version}`,target_commitish:targetCommit,name:`WebFit piloto ${config.version}`,body:`${manifest.notes}\nCódigo de origem: ${process.env.GITHUB_SHA}.`,draft:true,prerelease:false}));
// Credentials stay on GitHub API/uploads; public download verification uses no token.
for (const name of names) {
  if (/[\\/\r\n]/.test(name)) throw new Error('Unsafe staged filename.');
  const bytes=await readFile(`${folder}/${name}`);
  const asset=await api(`https://uploads.github.com/repos/Maycon-bd/webfit-desktop-releases/releases/${release.id}/assets?name=${encodeURIComponent(name)}`,'POST',bytes,'application/octet-stream');
  validateUploadedAsset(asset,name,bytes.length,prefix);
}
await api(`${base}/releases/${release.id}`,'PATCH',JSON.stringify({draft:false,make_latest:'true'}));
await writeFile(process.env.GITHUB_OUTPUT,`releaseId=${release.id}\nversion=${config.version}\n`,{flag:'a'});
console.log(`Published preverified pilot ${config.version}; public verification follows.`);
