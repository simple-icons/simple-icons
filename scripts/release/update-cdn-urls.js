#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the CDN URLs in the README.md to match the major version in the
 * NPM package manifest. Does nothing if the README.md is already up-to-date.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {getDirnameFromImportMeta} from '../utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..', '..');
const packageJsonFile = path.resolve(rootDir, 'package.json');
const readmeFile = path.resolve(rootDir, 'README.md');

const getMajorVersion = (semVerVersion) => {
  const majorVersionAsString = semVerVersion.split('.')[0];
  return Number.parseInt(majorVersionAsString, 10);
};

const getManifest = () => {
  const manifestRaw = fs.readFileSync(packageJsonFile, 'utf8');
  return JSON.parse(manifestRaw);
};

const updateVersionInReadmeIfNecessary = (majorVersion) => {
  let content = fs.readFileSync(readmeFile).toString();

  content = content.replace(
    /simple-icons@v\d+/g,
    `simple-icons@v${majorVersion}`,
  );

  fs.writeFileSync(readmeFile, content);
};

const main = () => {
  try {
    const manifest = getManifest();
    const majorVersion = getMajorVersion(manifest.version);
    updateVersionInReadmeIfNecessary(majorVersion);
  } catch (error) {
    console.error('Failed to update CDN version number:', error);
    process.exit(1);
  }
};

main();
