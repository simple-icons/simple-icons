const fs = require("fs");
const path = require("path");
const semver = require("semver");

const PATCH = "patch";

const repositoryPath = path.resolve(__dirname, "../simple-icons-font");
const packageJsonPath = path.resolve(repositoryPath, "package.json");
const packageLockJsonPath = path.resolve(repositoryPath, "package-lock.json");

// Update version number in package.json
const packageJson = require(packageJsonPath);
packageJson.version = semver.inc(packageJson.version, PATCH);
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Update version number in package-lock.json
const packageLockJson = require(packageLockJsonPath);
packageLockJson.version = semver.inc(packageLockJson.version, PATCH);
fs.writeFileSync(packageLockJsonPath, JSON.stringify(packageLockJson, null, 2));
