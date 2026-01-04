/**
 * @file Internal utilities.
 *
 * Here resides all the functionality that does not qualifies to reside
 * in the SDK because is not publicly exposed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type {DuplicateAlias, IconData} from '../data/simple-icons.d.ts';
import {collator, getIconSlug, getIconsDataPath, titleToSlug} from '../sdk.mts';

/**
 * Get JSON schema data.
 * @returns JSON schema data.
 */
export const getJsonSchemaData = async () =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	JSON.parse(
		await fs.readFile(
			path.resolve(import.meta.dirname, '..', '.jsonschema.json'),
			'utf8',
		),
	);

/**
 * Write icons data to data/simple-icons.json.
 * @param iconsData Icons data array.
 * @param minify Whether to minify the JSON output.
 */
export const writeIconsData = async (iconsData: IconData[], minify = false) => {
	await fs.writeFile(
		getIconsDataPath(),
		`${JSON.stringify(iconsData, null, minify ? 0 : '\t')}\n`,
		'utf8',
	);
};

/**
 * Get SPDX license IDs from `spdx-license-ids` package.
 * @returns Set of SPDX license IDs.
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
	) as string[];

/**
 * The compare function for sorting icons in *data/simple-icons.json*.
 * @param a Icon A.
 * @param b Icon B.
 * @returns Comparison result.
 */
export const sortIconsCompare = (a: IconData, b: IconData) =>
	a.title === b.title
		? collator.compare(getIconSlug(a), getIconSlug(b))
		: collator.compare(a.title, b.title);

/**
 * The compare function for sorting icon duplicate aliases in *data/simple-icons.json*.
 * @param a Duplicate alias A.
 * @param b Duplicate alias B.
 * @returns Comparison result.
 */
const sortDuplicatesCompare = (a: DuplicateAlias, b: DuplicateAlias) =>
	a.title === b.title
		? collator.compare(titleToSlug(a.title), titleToSlug(b.title))
		: collator.compare(a.title, b.title);

/**
 * Sort icon data or duplicate alias object.
 * @param icon The icon data or duplicate alias as it appears in *data/simple-icons.json*.
 * @returns The sorted icon data or duplicate alias.
 */
const sortIconOrDuplicate = <T extends IconData | DuplicateAlias>(icon: T) => {
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

	const sortedIcon = Object.assign(
		Object.fromEntries(
			Object.entries(icon).sort(
				([key1], [key2]) => keyOrder.indexOf(key1) - keyOrder.indexOf(key2),
			),
		),
	) as T;

	return sortedIcon;
};

/**
 * Sort license object.
 * @param license The license object as it appears in *data/simple-icons.json*.
 * @returns The sorted license object.
 */
const sortLicense = (license: IconData['license']) => {
	if (!license) return undefined;
	const keyOrder = ['type', 'url'];

	const sortedLicense = Object.assign(
		Object.fromEntries(
			Object.entries(license).sort(
				([key1], [key2]) => keyOrder.indexOf(key1) - keyOrder.indexOf(key2),
			),
		),
	) as IconData['license'];

	return sortedLicense;
};

/**
 * Sort object key alphabetically.
 * @param object The aliases object as it appears in *data/simple-icons.json*.
 * @returns The sorted aliases object.
 */
const sortAlphabetically = (object: IconData['aliases']) => {
	if (!object) return undefined;
	const sorted = Object.assign(
		Object.fromEntries(
			Object.entries(object).sort(([key1], [key2]) => (key1 > key2 ? 1 : -1)),
		),
	) as Record<string, string>;
	return sorted;
};

/**
 * Sort icons data.
 * @param iconsData The icons data as it appears in *data/simple-icons.json*.
 * @returns The sorted icons data.
 */
export const formatIconData = (iconsData: IconData[]) => {
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
 * @param fpath File path to check.
 * @returns True if the file exists, false otherwise.
 */
export const fileExists = async (fpath: string) => {
	try {
		await fs.access(fpath);
		return true;
	} catch {
		return false;
	}
};
