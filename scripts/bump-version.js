#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the version of this package to the CLI specified version.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_FILE = path.resolve(__dirname, '..', 'package.json');
const PACKAGE_LOCK_FILE = path.resolve(__dirname, '..', 'package-lock.json');

function readManifest(file) {
  const manifestRaw = fs.readFileSync(file).toString();
  const manifestJson = JSON.parse(manifestRaw);
  return manifestJson;
}

function writeManifest(file, json) {
  const manifestRaw = JSON.stringify(json, null, 2) + '\n';
  fs.writeFileSync(file, manifestRaw);
}

function main(newVersion) {
  try {
    const manifest = readManifest(PACKAGE_JSON_FILE);
    const manifestLock = readManifest(PACKAGE_LOCK_FILE);

    manifest.version = newVersion
    manifestLock.version = newVersion

    writeManifest(PACKAGE_JSON_FILE, manifest);
    writeManifest(PACKAGE_LOCK_FILE, manifestLock);
  } catch (error) {
    console.error(`Failed to bump package version to ${newVersion}:`, error);
    process.exit(1);
  }
}

main(process.argv[2]);
