#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Generates a MarkDown file that lists every brand name and their slug.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getIconSlug, getIconsData} from '../../sdk.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDirectory = path.resolve(__dirname, '..', '..');
const slugsFile = path.resolve(rootDirectory, 'slugs.md');

let content = `<!--
This file is automatically generated. If you want to change something, please
update the script at '${path.relative(rootDirectory, __filename)}'.
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
