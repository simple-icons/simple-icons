#!/usr/bin/env node
/**
 * @file
 * Updates the CDN URLs in the README.md to match the major version in the
 * NPM package manifest. Does nothing if the README.md is already up-to-date.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {getDirnameFromImportMeta} from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDirectory = path.resolve(__dirname, '..', '..');
const packageJsonFile = path.resolve(rootDirectory, 'package.json');
const readmeFile = path.resolve(rootDirectory, 'README.md');

/**
 * Get the major version number from a semantic version string.
 * @param {string} semVersion A semantic version string.
 * @returns {number} The major version number.
 */
const getMajorVersion = (semVersion) => {
  const majorVersionAsString = semVersion.split('.')[0];
  return Number.parseInt(majorVersionAsString, 10);
};

/**
 * Get the package.json manifest.
 * @returns {Promise<{version: string}>} The package.json manifest.
 */
const getManifest = async () => {
  const manifestRaw = await fs.readFile(packageJsonFile, 'utf8');
  return JSON.parse(manifestRaw);
};

/**
 * Update the version number in the README.md.
 * @param {number} majorVersion The major version number.
 */
const updateVersionInReadmeIfNecessary = async (majorVersion) => {
  let content = await fs.readFile(readmeFile, 'utf8');

  content = content.replaceAll(
    /simple-icons@v\d+/g,
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
