/**
 * @file Internal utilities.
 *
 * Here resides all the functionality that does not qualifies to reside
 * in the SDK because is not publicly exposed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {
	collator,
	getDirnameFromImportMeta,
	getIconSlug,
	getIconsDataPath,
} from '../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

/**
 * @typedef {import("../sdk.js").IconData} IconData
 */

/**
 * Get JSON schema data.
 * @param {string} rootDirectory Path to the root directory of the project.
 * @returns {Promise<any>} JSON schema data.
 */
export const getJsonSchemaData = async (
	rootDirectory = path.resolve(__dirname, '..'),
) =>
	JSON.parse(
		await fs.readFile(path.resolve(rootDirectory, '.jsonschema.json'), 'utf8'),
	);

/**
 * Write icons data to _data/simple-icons.json.
 * @param {IconData[]} iconsData Icons data array.
 * @param {string} rootDirectory Path to the root directory of the project.
 * @param {boolean} minify Whether to minify the JSON output.
 */
export const writeIconsData = async (
	iconsData,
	rootDirectory = path.resolve(__dirname, '..'),
	minify,
) => {
	await fs.writeFile(
		getIconsDataPath(rootDirectory),
		`${JSON.stringify(iconsData, null, minify ? 0 : '\t')}\n`,
		'utf8',
	);
};

/**
 * Get SPDX license IDs from `spdx-license-ids` package.
 * @param {string} rootDirectory Path to the root directory of the project.
 * @returns {Promise<string[]>} Set of SPDX license IDs.
 */
export const getSpdxLicenseIds = async (
	rootDirectory = path.resolve(__dirname, '..'),
) =>
	JSON.parse(
		await fs.readFile(
			path.resolve(
				rootDirectory,
				'node_modules',
				'spdx-license-ids',
				'index.json',
			),
			'utf8',
		),
	);

/**
 * The compare function for sortng icons in _data/simple-icons.json.
 * @param {IconData} a Icon A.
 * @param {IconData} b Icon B.
 * @returns {number} Comparison result.
 */
export const sortIconsCompare = (a, b) => {
	return a.title === b.title
		? collator.compare(getIconSlug(a), getIconSlug(b))
		: collator.compare(a.title, b.title);
};
