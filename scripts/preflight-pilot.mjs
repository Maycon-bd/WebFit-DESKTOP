import { pathToFileURL } from 'node:url';
import { publicationClient, preflightPublication } from './publication-api.mjs';

async function main() {
  const api = publicationClient({ token: process.env.WEBFIT_RELEASE_TOKEN, repo: process.env.WEBFIT_RELEASE_REPO });
  await preflightPublication(api);
  console.log('Release repository main commit verified; build may proceed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
