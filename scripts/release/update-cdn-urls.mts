#!/usr/bin/env node
/**
 * @file
 * Updates the CDN URLs in the README.md to match the major version in the
 * NPM package manifest. Does nothing if the README.md is already up-to-date.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
const packageJsonFile = path.resolve(rootDirectory, 'package.json');
const readmeFile = path.resolve(rootDirectory, 'README.md');

/**
 * Get the major version number from a semantic version string.
 * @param semVersion A semantic version string.
 * @returns The major version number.
 */
const getMajorVersion = (semVersion: string) => {
	const majorVersionAsString = semVersion.split('.')[0]!;
	return Number.parseInt(majorVersionAsString, 10);
};

/**
 * Get the package.json manifest.
 * @returns The package.json manifest.
 */
const getManifest = async () => {
	const manifestRaw = await fs.readFile(packageJsonFile, 'utf8');
	return JSON.parse(manifestRaw) as {version: string};
};

/**
 * Update the version number in the README.md.
 * @param majorVersion The major version number.
 */
const updateVersionInReadmeIfNecessary = async (majorVersion: number) => {
	let content = await fs.readFile(readmeFile, 'utf8');

	content = content.replaceAll(
		/simple-icons@v\d+/g,
		`simple-icons@v${majorVersion}`,
	);

	await fs.writeFile(readmeFile, content);
};

try {
	const manifest = await getManifest();
	const majorVersion = getMajorVersion(manifest.version);
	await updateVersionInReadmeIfNecessary(majorVersion);
} catch (error) {
	console.error('Failed to update CDN version number:', error);
	process.exit(1);
}
