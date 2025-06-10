#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Script to remove an icon and its data.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {search} from '@inquirer/prompts';
import {search as fuzzySearch} from 'fast-fuzzy';
import {getIconSlug, getIconsData} from '../sdk.mjs';
import {writeIconsData} from './utils.js';

process.exitCode = 1;
process.on('uncaughtException', (error) => {
	if (error instanceof Error && error.name === 'ExitPromptError') {
		process.stdout.write('\nAborted\n');
		process.exit(1);
	} else {
		throw error;
	}
});

const rootDirectory = path.resolve(import.meta.dirname, '..');
const svgFilesDirectory = path.resolve(rootDirectory, 'icons');

const iconsData = await getIconsData();
const icons = iconsData.map((icon, index) => {
	const slug = getIconSlug(icon);
	return {
		name: `${icon.title} (${slug})`,
		value: {title: icon.title, slug, index},
	};
});

const found = await search({
	message: 'Search for an icon to remove:',
	async source(input) {
		if (!input) return [];
		return fuzzySearch(input, icons, {
			keySelector: (icon) => [icon.value.title, icon.value.slug],
		});
	},
});

if (!found) {
	console.error('No icon selected.');
	process.exit(1);
}

iconsData.splice(found.index, 1);
await writeIconsData(iconsData);
await fs.unlink(path.resolve(svgFilesDirectory, `${found.slug}.svg`));
process.stdout.write(`Icon "${found.title} (${found.slug}.svg)" removed.\n`);
process.exit(0);
