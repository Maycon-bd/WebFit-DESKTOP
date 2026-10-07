import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { checksums, validateManifest, verifySignature } from './pilot-release.mjs';

test('signature rejects changed installer, wrong key and altered trusted comment', () => {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const id = Buffer.from('0102030405060708', 'hex');
  const key = Buffer.concat([Buffer.from('Ed'), id, publicKey.export({ format: 'der', type: 'spki' }).subarray(-32)]);
  const encodedKey = Buffer.from(`untrusted comment: fixture\n${key.toString('base64')}\n`).toString('base64');
  const bytes = Buffer.from('fictitious installer');
  const raw = sign(null, createHash('blake2b512').update(bytes).digest(), privateKey);
  const packet = Buffer.concat([Buffer.from('ED'), id, raw]);
  const comment = 'timestamp:1';
  const global = sign(null, Buffer.concat([raw, Buffer.from(comment)]), privateKey);
  const envelope = `untrusted comment: fixture\n${packet.toString('base64')}\ntrusted comment: ${comment}\n${global.toString('base64')}\n`;
  const encoded = Buffer.from(envelope).toString('base64');
  assert.doesNotThrow(() => verifySignature(bytes, encoded, encodedKey));
  assert.throws(() => verifySignature(Buffer.from('tampered installer'), encoded, encodedKey), /Invalid installer/);
  const wrong = Buffer.from(key); wrong[2] ^= 1;
  assert.throws(() => verifySignature(bytes, encoded, Buffer.from(`comment\n${wrong.toString('base64')}`).toString('base64')), /key mismatch/);
  assert.throws(() => verifySignature(bytes, Buffer.from(envelope.replace('timestamp:1', 'timestamp:2')).toString('base64'), encodedKey), /trusted comment signature/);
});

test('manifest requires correct release, HTTPS asset and Windows x64 platform', () => {
  const prefix = 'https://github.com/Maycon-bd/webfit-desktop-releases/releases/download/pilot-v0.1.0-pilot.1.1/';
  const url = `${prefix}fixture.exe`;
  const assets = [{ name: 'fixture.exe', browser_download_url: url }];
  const manifest = { version: '0.1.0-pilot.1.1', pub_date: '2026-10-06T00:00:00Z', platforms: { 'windows-x86_64': { url, signature: 'fixture' } } };
  assert.equal(validateManifest(manifest, manifest.version, assets, prefix).length, 1);
  assert.throws(() => validateManifest(manifest, '0.1.0-pilot.2.1', assets, prefix), /version mismatch/);
  assert.throws(() => validateManifest({ ...manifest, platforms: {} }, manifest.version, assets, prefix), /Missing Windows/);
  for (const badUrl of [url.replace('https:', 'http:'), 'https://example.com/fixture.exe']) {
    assert.throws(() => validateManifest({ ...manifest, platforms: { 'windows-x86_64': { url: badUrl, signature: 'fixture' } } }, manifest.version, assets, prefix), /Untrusted/);
  }
  assert.throws(() => validateManifest(manifest, manifest.version, [], prefix), /absent/);
});

test('checksums cover exact bytes and reject filenames that forge extra entries', () => {
  assert.equal(checksums(new Map([['fixture.exe', Buffer.from('abc')]])), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad  fixture.exe\n');
  assert.throws(() => checksums(new Map([['bad\nname.exe', Buffer.from('abc')]])), /Unsafe/);
});
