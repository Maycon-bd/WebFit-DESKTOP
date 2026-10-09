import { readFile, readdir, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { verifySignature, validateManifest, checksums } from './pilot-release.mjs';
import { readReleaseNotes, releaseNotesText } from './check-release-notes.mjs';

const config=JSON.parse(await readFile('src-tauri/tauri.conf.json','utf8'));
const version=config.version;
if (!/^\d+\.\d+\.\d+-pilot\.\d+\.\d+$/.test(version)) throw new Error('Expected unique pilot version.');
const folder=resolve(process.env.CARGO_TARGET_DIR || 'src-tauri/target','release/bundle/nsis');
const names=(await readdir(folder)).filter(name=>name.includes(`_${version}_`) && name.endsWith('.exe'));
if (names.length!==1) throw new Error('Expected exactly one installer for this version.');
const sourceName=names[0];
// GitHub normalizes whitespace in uploaded names. Stage one stable ASCII name
// so manifest URLs, signatures and checksum filenames match the public assets.
const name=`WebFit-Desktop_${version}_x64-setup.exe`;
const bytes=await readFile(`${folder}/${sourceName}`);
const signature=(await readFile(`${folder}/${sourceName}.sig`,'utf8')).trim();
verifySignature(bytes,signature,config.plugins.updater.pubkey);
const prefix=`https://github.com/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v${version}/`;
const manifest={version,notes:releaseNotesText(await readReleaseNotes()),pub_date:new Date().toISOString(),platforms:{'windows-x86_64':{url:prefix+encodeURIComponent(name),signature}}};
validateManifest(manifest,version,[{name,browser_download_url:manifest.platforms['windows-x86_64'].url}],prefix);
const files=new Map([[name,bytes],[`${name}.sig`,Buffer.from(signature+'\n')],['latest.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n')]]);
const out='.artifacts/pilot';await mkdir(out,{recursive:true});
if ((await readdir(out)).length) throw new Error('Staging directory must be empty; preserve prior artifacts separately.');
for (const [file,data] of files) await writeFile(`${out}/${file}`,data);
await writeFile(`${out}/SHA256SUMS`,checksums(files));
await copyFile('docs/operations/mvp-local-test.md',`${out}/TESTE-LOCAL.md`);
console.log(`Verified local signed pilot ${version}.`);
