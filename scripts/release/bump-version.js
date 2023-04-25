#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the version of this package to the CLI specified version.
 */

import fs from 'node:fs';
import path from 'node:path';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..', '..');
const packageJsonFile = path.resolve(rootDir, 'package.json');

const readManifest = (file) => {
  const manifestRaw = fs.readFileSync(file, 'utf-8');
  const manifestJson = JSON.parse(manifestRaw);
  return manifestJson;
};

const writeManifest = (file, json) => {
  const manifestRaw = JSON.stringify(json, null, 2) + '\n';
  fs.writeFileSync(file, manifestRaw);
};

const main = (newVersion) => {
  try {
    const manifest = readManifest(packageJsonFile);

    manifest.version = newVersion;

    writeManifest(packageJsonFile, manifest);
  } catch (error) {
    console.error(`Failed to bump package version to ${newVersion}:`, error);
    process.exit(1);
  }
};

main(process.argv[2]);
