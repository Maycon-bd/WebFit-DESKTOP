import { createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { setTimeout as delay } from 'node:timers/promises';

const [urlText, destination] = process.argv.slice(2);
const maximumAttempts = 3;
const maximumRedirects = 5;
const maximumDownloadBytes = 128 * 1024 * 1024;
const redirectStatuses = new Set([301, 302, 303, 307, 308]);

function describeError(error) {
  const messages = [];
  let current = error;
  while (current instanceof Error) {
    if (current.message && !messages.includes(current.message)) messages.push(current.message);
    current = current.cause;
  }
  return messages.join(' | ') || 'Unknown download error';
}

async function download() {
  if (!urlText || !destination) throw new Error('Usage: node download-db-browser.mjs <https-url> <output-path>');

  const url = new URL(urlText);
  if (url.protocol !== 'https:') throw new Error('Only HTTPS download URLs are allowed.');

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const signal = AbortSignal.timeout(120_000);
      let currentUrl = url;
      let response;

      for (let redirectCount = 0; redirectCount <= maximumRedirects; redirectCount += 1) {
        response = await fetch(currentUrl, { redirect: 'manual', signal });
        if (!redirectStatuses.has(response.status)) break;
        const location = response.headers.get('location');
        await response.body?.cancel().catch(() => {});
        if (redirectCount === maximumRedirects) throw new Error('Download exceeded the redirect limit.');
        if (!location) throw new Error('Redirect response has no Location header.');

        currentUrl = new URL(location, currentUrl);
        if (currentUrl.protocol !== 'https:') throw new Error('Redirects to non-HTTPS URLs are not allowed.');
      }

      if (!response) throw new Error('Download did not return an HTTP response.');
      if (!response.ok || !response.body) {
        await response.body?.cancel().catch(() => {});
        throw new Error(`Download returned HTTP ${response.status}.`);
      }

      const contentLength = Number(response.headers.get('content-length'));
      if (Number.isFinite(contentLength) && contentLength > maximumDownloadBytes) {
        await response.body.cancel().catch(() => {});
        throw new Error(`Download exceeds the ${maximumDownloadBytes}-byte limit.`);
      }

      let downloadedBytes = 0;
      const sizeLimit = new Transform({
        transform(chunk, encoding, callback) {
          downloadedBytes += chunk.length;
          if (downloadedBytes > maximumDownloadBytes) {
            callback(new Error(`Download exceeds the ${maximumDownloadBytes}-byte limit.`));
            return;
          }
          callback(null, chunk);
        },
      });

      await pipeline(
        Readable.fromWeb(response.body),
        sizeLimit,
        createWriteStream(destination, { flags: 'wx' }),
      );
      process.stdout.write('DB Browser ZIP downloaded.\n');
      return;
    } catch (error) {
      await rm(destination, { force: true }).catch(() => {});
      process.stderr.write(`Download attempt ${attempt}/${maximumAttempts} failed: ${describeError(error)}\n`);
      if (attempt === maximumAttempts) throw new Error('DB Browser download failed after 3 attempts.');
      await delay(attempt * 2_000);
    }
  }
}

download().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
