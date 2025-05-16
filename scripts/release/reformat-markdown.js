#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Rewrite some Markdown files.
 */

import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {getDirnameFromImportMeta} from '../../sdk.mjs';

const LINKS_BRANCH = process.argv[2] || 'develop';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDirectory = path.resolve(__dirname, '..', '..');
const readmeFile = path.resolve(rootDirectory, 'README.md');
const disclaimerFile = path.resolve(rootDirectory, 'DISCLAIMER.md');

/**
 * Reformat a file.
 * @param {string} filePath Path to the file.
 */
const reformat = async (filePath) => {
	const fileContent = await readFile(filePath, 'utf8');
	await writeFile(
		filePath,
		fileContent
			// Replace all CDN links with raw links
			.replaceAll(
				/https:\/\/cdn.simpleicons.org\/(.+)\/000\/fff/g,
				`https://raw.githubusercontent.com/simple-icons/simple-icons/${LINKS_BRANCH}/icons/$1.svg`,
			)
			// Replace all GitHub blockquotes with regular markdown
			// Reference: https://github.com/orgs/community/discussions/16925
			.replaceAll(
				/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)](?!\()/g,
				function (string_, $0) {
					const capital = $0.slice(0, 1);
					const body = $0.slice(1).toLowerCase();
					return `**${capital + body}**`;
				},
			),
	);
};

await Promise.all([reformat(readmeFile), reformat(disclaimerFile)]);
