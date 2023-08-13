/**
 * @fileoverview
 * Updates the CDN URLs in the README.md to match the major version in the
 * NPM package manifest. Does nothing if the README.md is already up-to-date.
 */

import process from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..', '..');
const packageJsonFile = path.resolve(rootDir, 'package.json');
const readmeFile = path.resolve(rootDir, 'README.md');

const getMajorVersion = (semVerVersion) => {
  const majorVersionAsString = semVerVersion.split('.')[0];
  return parseInt(majorVersionAsString);
};

const getManifest = async () => {
  const manifestRaw = await fs.readFile(packageJsonFile, 'utf-8');
  return JSON.parse(manifestRaw);
};

const updateVersionInReadmeIfNecessary = async (majorVersion) => {
  let content = await fs.readFile(readmeFile, 'utf8');

  content = content.replace(
    /simple-icons@v[0-9]+/g,
    `simple-icons@v${majorVersion}`,
  );

  await fs.writeFile(readmeFile, content);
};

const main = async () => {
  try {
    const manifest = await getManifest();
    const majorVersion = getMajorVersion(manifest.version);
    await updateVersionInReadmeIfNecessary(majorVersion);
  } catch (error) {
    console.error('Failed to update CDN version number:', error);
    process.exit(1);
  }
};

await main();
