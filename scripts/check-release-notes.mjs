import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function validateReleaseNotes(value) {
  if (!value || Object.keys(value).some(key => !['title', 'highlights'].includes(key)) ||
      typeof value.title !== 'string' || !value.title.trim() || value.title.length > 80 ||
      !Array.isArray(value.highlights) || value.highlights.length < 1 || value.highlights.length > 6 ||
      value.highlights.some(text => typeof text !== 'string' || !text.trim() || text.length > 240 || /[<>]/.test(text)))
    throw new Error('Prepare um resumo curto das novidades desta atualização em src/data/release-notes.json.');
  return value;
}

export async function readReleaseNotes() {
  return validateReleaseNotes(JSON.parse(await readFile('src/data/release-notes.json', 'utf8')));
}

export function releaseNotesText(notes) {
  validateReleaseNotes(notes);
  return `${notes.title}\n\n${notes.highlights.map(text => `• ${text}`).join('\n')}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  readReleaseNotes().then(() => console.log('Resumo de novidades validado.')).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
