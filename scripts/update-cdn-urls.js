#!/usr/bin/env node
/**
 * @fileoverview
 * Updates the CDN URLs in the README.md to the latest major version. Does
 * nothing if the README.md is already up-to-date.
 *
 * It assumes the major version in the README is either equal to the current
 * package major version, or the package minor version minus 1. If not the
 * behaviour of this script should be consider undefined.
 */

const fs = require("fs");
const path = require("path");
const getMajorVersion = require("semver/functions/major");

const rootDir = path.resolve(__dirname, "..");
const packageFileJson = path.resolve(rootDir, "package.json");
const readmeFile = path.resolve(rootDir, "README.md");

function getManifest() {
  const manifestRaw = fs.readFileSync(packageFileJson).toString();
  const manifestJson = JSON.parse(manifestRaw);
  return manifestJson;
}

function updateVersionInReadmeIfNecessary(majorVersion) {
  let content = fs.readFileSync(readmeFile).toString();

  content = content.replace(
    new RegExp(`simple-icons@v${majorVersion - 1}`, "g"),
    `simple-icons@v${majorVersion}`,
  );

  fs.writeFileSync(readmeFile, content);
}

function main() {
  try {
    const manifest = getManifest();
    const majorVersion = getMajorVersion(manifest.version);
    updateVersionInReadmeIfNecessary(majorVersion);
  } catch (error) {
    console.error("Failed to update CDN version number:", error);
    process.exit(1);
  }
}

main();
