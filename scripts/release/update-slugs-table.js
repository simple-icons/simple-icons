#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Generates a MarkDown file that lists every brand name and their slug.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {getIconSlug, getIconsData} from '../../sdk.mjs';

const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
const slugsFile = path.resolve(rootDirectory, 'slugs.md');

let content = `<!--

update the script at '${path.relative(rootDirectory, import.meta.filename)}'.
-->

# Simple Icons slugs

| Brand name | Brand slug |
| :--- | :--- |
`;

const icons = await getIconsData();
for (const icon of icons) {
	const brandName = icon.title;
	const brandSlug = getIconSlug(icon);
	content += `| \`${brandName}\` | \`${brandSlug}\` |\n`;
}

await fs.writeFile(slugsFile, content);
