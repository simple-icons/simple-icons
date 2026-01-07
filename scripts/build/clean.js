#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Clean files built by the build process.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileExists} from '../utils.js';

const files = [
	'index.js',
	'index-icons.js',
	'index.mjs',
	'index-icons.mjs',
	'index.d.ts',
	'sdk.js',
];

try {
	Promise.all(
		files.map(async (file) => {
			const filepath = path.resolve(import.meta.dirname, '..', '..', file);
			if (!(await fileExists(filepath))) {
				console.error(`File ${file} does not exist, skipping...`);
				return;
			}

			return fs.unlink(filepath);
		}),
	);
} catch (error) {
	console.error('Error cleaning files:', error);
	process.exit(1);
}
