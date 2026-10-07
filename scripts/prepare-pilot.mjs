import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function pilotVersion(base, run, attempt) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(base);
  if (!match || !/^\d+$/.test(String(run)) || !/^\d+$/.test(String(attempt)) || +run < 1 || +attempt < 1) throw new Error('Invalid pilot version inputs.');
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}-pilot.${run}.${attempt}`;
}

export function newerPilot(candidate, current) {
  const parse=value=>/^(\d+)\.(\d+)\.(\d+)-pilot\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(BigInt);
  const a=parse(candidate), b=parse(current);
  if (!a || !b) throw new Error('Invalid comparison version.');
  for (let index=0; index<a.length; index++) {
    if (a[index]!==b[index]) return a[index]>b[index];
  }
  return false;
}

async function main() {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const version = pilotVersion(pkg.version, process.env.GITHUB_RUN_NUMBER, process.env.GITHUB_RUN_ATTEMPT);
  const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
  const config = JSON.parse(await readFile('src-tauri/tauri.conf.json', 'utf8'));
  const cargo = await readFile('src-tauri/Cargo.toml', 'utf8');
  const cargoLock = await readFile('src-tauri/Cargo.lock', 'utf8');
  if (!cargo.includes(`version = "${pkg.version}"`) || config.version !== pkg.version || lock.version !== pkg.version) throw new Error('Product version mismatch.');
  const old = pkg.version;
  const marker = `name = "webfit-desktop"\nversion = "${old}"`;
  const normalizedLock = cargoLock.replaceAll('\r\n','\n');
  if (!normalizedLock.includes(marker) || !process.env.GITHUB_OUTPUT) throw new Error('Cargo lock or output configuration mismatch.');
  pkg.version = lock.version = lock.packages[''].version = config.version = version;
  config.bundle.createUpdaterArtifacts = true;
  for (const [file, value] of [['package.json',pkg],['package-lock.json',lock],['src-tauri/tauri.conf.json',config]]) await writeFile(file, JSON.stringify(value,null,2)+'\n');
  await writeFile('src-tauri/Cargo.toml',cargo.replace(`version = "${old}"`, `version = "${version}"`));
  await writeFile('src-tauri/Cargo.lock',normalizedLock.replace(marker,`name = "webfit-desktop"\nversion = "${version}"`));
  await writeFile(process.env.GITHUB_OUTPUT,`version=${version}\n`,{flag:'a'});
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(() => {console.error('Pilot version preparation failed.');process.exitCode=1;});
