#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Script to add data for a new icon to the simple-icons dataset.
 */

/**
 * @typedef {import("../sdk.js").IconData} IconData
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {checkbox, confirm, input, search} from '@inquirer/prompts';
import chalk from 'chalk';
import {search as fuzzySearch} from 'fast-fuzzy';
import getRelativeLuminance from 'get-relative-luminance';
import {getIconsDataString, normalizeColor, titleToSlug} from '../sdk.mjs';
import {
	formatIconData,
	getJsonSchemaData,
	getSpdxLicenseIds,
	sortIconsCompare,
	writeIconsData,
} from './utils.js';

process.exitCode = 1;
process.on('uncaughtException', (error) => {
	if (error instanceof Error && error.name === 'ExitPromptError') {
		process.stdout.write('\nAborted\n');
		process.exit(1);
	} else {
		throw error;
	}
});

/** @type {import('../types.d.ts').IconData[]} */
const iconsData = JSON.parse(await getIconsDataString());
const jsonSchema = await getJsonSchemaData();

const HEX_REGEX = /^#?[a-f\d]{3,8}$/i;

const aliasTypes = ['aka', 'old'].map((key) => ({
	name: `${key} (${jsonSchema.definitions.brand.properties.aliases.properties[key].description})`,
	value: key,
}));

const spdxLicenseIds = await getSpdxLicenseIds();
const licenseTypes = [
	{name: 'Custom', value: 'custom'},
	...spdxLicenseIds.map((id) => ({name: id, value: id})),
];

/**
 * Build a regex to validate HTTPs URLs.
 * @returns {Promise<RegExp>} Regex to validate HTTPs URLs.
 */
const urlRegex = async () =>
	new RegExp(
		JSON.parse(
			await fs.readFile(
				path.resolve(import.meta.dirname, '..', '.jsonschema.json'),
				'utf8',
			),
		).definitions.url.pattern,
	);

/**
 * Whether an input is a valid URL.
 * @param {string} input URL input.
 * @returns {Promise<boolean|string>} Whether the input is a valid URL.
 */
const isValidURL = async (input) => {
	const regex = await urlRegex();
	return regex.test(input) || 'Must be a valid and secure (https://) URL.';
};

/**
 * Whether an input is a valid hex color.
 * @param {string} input Hex color.
 * @returns {boolean|string} Whether the input is a valid hex color.
 */
const isValidHexColor = (input) =>
	HEX_REGEX.test(input) || 'Must be a valid hex code.';

/**
 * Whether an icon is not already in the dataset.
 * @param {string} input New icon input.
 * @returns {boolean} Whether the icon is new.
 */
const isNewIcon = (input) =>
	!iconsData.some(
		(icon) =>
			icon.title === input || titleToSlug(icon.title) === titleToSlug(input),
	);

/**
 * Compute a preview of a color to use in prompt background.
 * @param {string} input Color input.
 * @returns {string} Preview of the color.
 */
const previewHexColor = (input) => {
	const color = normalizeColor(input);
	const luminance = HEX_REGEX.test(input)
		? getRelativeLuminance.default(`#${color}`)
		: -1;
	if (luminance === -1) return input.toUpperCase();
	return chalk.bgHex(`#${color}`).hex(luminance < 0.4 ? '#fff' : '#000')(
		input.toUpperCase(),
	);
};

/** @type {IconData} */
// @ts-expect-error: `slug` is not required in our source simple-icons.json file.
const answers = {
	title: '',
	hex: '',
	source: '',
};

answers.title = await input({
	message: 'What is the title of this icon?',
	validate: (input) =>
		input.trim().length > 0
			? isNewIcon(input) || 'This icon title or slug already exists.'
			: 'This field is required.',
});

answers.hex = normalizeColor(
	await input({
		message: 'What is the brand color of this icon?',
		validate: isValidHexColor,
		transformer: previewHexColor,
	}),
);

answers.source = await input({
	message: 'What is the source URL of the icon?',
	validate: isValidURL,
});

if (
	await confirm({
		message: 'Does this icon have brand guidelines?',
	})
) {
	answers.guidelines = await input({
		message: 'What is the URL for the brand guidelines?',
		validate: isValidURL,
	});
}

if (
	await confirm({
		message: 'Does this icon have a license?',
	})
) {
	answers.license = {
		type: await search({
			message: "What is the icon's license?",
			async source(input) {
				input = (input || '').trim();
				return input
					? fuzzySearch(input, licenseTypes, {
							keySelector: (x) => x.value,
						})
					: licenseTypes;
			},
		}),
	};

	if (answers.license.type === 'custom') {
		// @ts-expect-error
		answers.license.url = await input({
			message: `What is the URL for the license? (optional)`,
			validate: (input) => input.length === 0 || isValidURL(input),
		});
	}
}

if (
	await confirm({
		message: 'Does this icon have brand aliases?',
		default: false,
	})
) {
	answers.aliases = await checkbox({
		message: 'What types of aliases do you want to add?',
		choices: aliasTypes,
	})
		// eslint-disable-next-line promise/prefer-await-to-then
		.then(async (aliases) => {
			/** @type {{[_: string]: string[]}} */
			const result = {};
			for (const alias of aliases) {
				// eslint-disable-next-line no-await-in-loop
				result[alias] = await input({
					message: `What ${alias} aliases would you like to add? (separate with commas)`,
				})
					// eslint-disable-next-line promise/prefer-await-to-then
					.then((aliases) => aliases.split(',').map((alias) => alias.trim()));
			}

			return aliases.length > 0 ? result : undefined;
		});
}

process.stdout.write(
	'About to write the following to simple-icons.json:\n' +
		JSON.stringify(answers, null, '\t') +
		'\n',
);

if (
	await confirm({
		message: 'Is this OK?',
	})
) {
	iconsData.push(answers);
	iconsData.sort(sortIconsCompare);
	await writeIconsData(formatIconData(iconsData));
	process.stdout.write(chalk.green('\nData written successfully.\n'));
	process.exit(0);
} else {
	process.stdout.write(chalk.red('\nAborted.\n'));
	process.exit(1);
}
