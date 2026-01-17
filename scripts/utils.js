// @ts-check
/* eslint jsdoc/reject-any-type: off */
/**
 * @file Internal utilities.
 *
 * Here resides all the functionality that does not qualifies to reside
 * in the SDK because is not publicly exposed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {collator, getIconSlug, getIconsDataPath, titleToSlug} from '../sdk.mjs';

/**
 * @typedef {import("../types.js").IconData} IconData
 * @typedef {import("../types.js").DuplicateAlias} DuplicateAlias
 */

/**
 * Get JSON schema data.
 * @returns {Promise<any>} JSON schema data.
 */
export const getJsonSchemaData = async () =>
	JSON.parse(
		await fs.readFile(
			path.resolve(import.meta.dirname, '..', '.jsonschema.json'),
			'utf8',
		),
	);

/**
 * Write icons data to data/simple-icons.json.
 * @param {IconData[]} iconsData Icons data array.
 * @param {boolean} [minify] Whether to minify the JSON output.
 */
export const writeIconsData = async (iconsData, minify = false) => {
	await fs.writeFile(
		getIconsDataPath(),
		`${JSON.stringify(iconsData, null, minify ? 0 : '\t')}\n`,
		'utf8',
	);
};

/**
 * Get SPDX license IDs from `spdx-license-ids` package.
 * @returns {Promise<string[]>} Set of SPDX license IDs.
 */
export const getSpdxLicenseIds = async () =>
	JSON.parse(
		await fs.readFile(
			path.resolve(
				import.meta.dirname,
				'..',
				'node_modules',
				'spdx-license-ids',
				'index.json',
			),
			'utf8',
		),
	);

/**
 * The compare function for sorting icons in *data/simple-icons.json*.
 * @param {IconData} a Icon A.
 * @param {IconData} b Icon B.
 * @returns {number} Comparison result.
 */
export const sortIconsCompare = (a, b) =>
	a.title === b.title
		? collator.compare(getIconSlug(a), getIconSlug(b))
		: collator.compare(a.title, b.title);

/**
 * The compare function for sorting icon duplicate aliases in *data/simple-icons.json*.
 * @param {DuplicateAlias} a Duplicate alias A.
 * @param {DuplicateAlias} b Duplicate alias B.
 * @returns {number} Comparison result.
 */
const sortDuplicatesCompare = (a, b) =>
	a.title === b.title
		? collator.compare(titleToSlug(a.title), titleToSlug(b.title))
		: collator.compare(a.title, b.title);

/**
 * Sort icon data or duplicate alias object.
 * @template {IconData | DuplicateAlias} T Either icon data or duplicate alias.
 * @param {T} icon The icon data or duplicate alias as it appears in *data/simple-icons.json*.
 * @returns {T} The sorted icon data or duplicate alias.
 */
const sortIconOrDuplicate = (icon) => {
	const keyOrder = [
		'title',
		'slug',
		'hex',
		'source',
		'guidelines',
		'license',
		'aliases',
		// This is not appears in icon data but it's in the alias object.
		'loc',
	];

	/** @type {T} */
	const sortedIcon = Object.assign(
		Object.fromEntries(
			Object.entries(icon).sort(
				([key1], [key2]) => keyOrder.indexOf(key1) - keyOrder.indexOf(key2),
			),
		),
	);

	return sortedIcon;
};

/**
 * Sort license object.
 * @param {IconData['license']} license The license object as it appears in *data/simple-icons.json*.
 * @returns {IconData['license']} The sorted license object.
 */
const sortLicense = (license) => {
	if (!license) {
		return undefined;
	}

	const keyOrder = ['type', 'url'];

	/** @type {IconData['license']} */
	const sortedLicense = Object.assign(
		Object.fromEntries(
			Object.entries(license).sort(
				([key1], [key2]) => keyOrder.indexOf(key1) - keyOrder.indexOf(key2),
			),
		),
	);

	return sortedLicense;
};

/**
 * Sort object key alphabetically.
 * @param {IconData['aliases']} object The aliases object as it appears in *data/simple-icons.json*.
 * @returns {{[_: string]: string} | undefined} The sorted aliases object.
 */
const sortAlphabetically = (object) => {
	if (!object) {
		return undefined;
	}

	const sorted = Object.assign(
		Object.fromEntries(
			Object.entries(object).sort(([key1], [key2]) => (key1 > key2 ? 1 : -1)),
		),
	);
	return sorted;
};

/**
 * Sort icons data.
 * @param {IconData[]} iconsData The icons data as it appears in *data/simple-icons.json*.
 * @returns {IconData[]} The sorted icons data.
 */
export const formatIconData = (iconsData) => {
	const iconsDataCopy = structuredClone(iconsData);
	const icons = iconsDataCopy.map((icon) =>
		sortIconOrDuplicate({
			...icon,
			license: sortLicense(icon.license),
			aliases: icon.aliases
				? sortAlphabetically({
						aka: icon.aliases.aka?.sort(collator.compare),
						dup: icon.aliases.dup
							? icon.aliases.dup.sort(sortDuplicatesCompare).map((d) =>
									sortIconOrDuplicate({
										...d,
										loc: sortAlphabetically(d.loc),
									}),
								)
							: undefined,
						loc: sortAlphabetically(icon.aliases.loc),
						old: icon.aliases.old?.sort(collator.compare),
					})
				: undefined,
		}),
	);
	icons.sort(sortIconsCompare);
	return icons;
};

/**
 * Check if a file exists.
 * @param {string} fpath File path to check.
 * @returns {Promise<boolean>} True if the file exists, false otherwise.
 */
export const fileExists = async (fpath) => {
	try {
		await fs.access(fpath);
		return true;
	} catch {
		return false;
	}
};

/**
 * Get labels file content.
 * @returns {Promise<string>} Labels file content.
 */
const getLabelsFileContent = async () => {
	const labelsPath = path.resolve(
		import.meta.dirname,
		'..',
		'.github',
		'labels.yml',
	);
	return fs.readFile(labelsPath, 'utf8');
};

/**
 * Get labels from .github/labels.yml file.
 * @returns {Promise<Set<string>>} Label names.
 */
export const getLabels = async () => {
	const content = await getLabelsFileContent();
	const labels = new Set();
	for (const line of content.split('\n')) {
		if (line.startsWith('- name: ')) {
			const labelName = line.slice(8);
			labels.add(labelName);
		}
	}

	return labels;
};

/**
 * Get labeler file content.
 * @returns {Promise<string>} Labeler file content.
 */
const getLabelerFileContent = async () => {
	const labelersPath = path.resolve(
		import.meta.dirname,
		'..',
		'.github',
		'labeler.yml',
	);
	return fs.readFile(labelersPath, 'utf8');
};

/**
 * Get labeler's labels.
 * @returns {Promise<Set<string>>} Labeler's labels.
 */
export const getLabelerLabels = async () => {
	const content = await getLabelerFileContent();
	const labels = new Set();
	for (const line of content.split('\n')) {
		if (line.startsWith(' ')) {
			continue;
		}

		const trimmedLine = line.trim();
		if (trimmedLine.endsWith(':')) {
			const labelName = trimmedLine.slice(0, -1);
			labels.add(labelName);
		}
	}

	return labels;
};

/**
 * Convert an unknown error to a string.
 * @param {unknown} error The error to convert.
 * @returns {string} The error message.
 */
export const unknownErrorToString = (error) =>
	error instanceof Error ? error.message : String(error);
