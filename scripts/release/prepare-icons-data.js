#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Minify data/simple-icons.json file and add slugs to all icons.
 */
import {getIconSlug} from '../../sdk.mjs';
import {
	formatIconData,
	getRawIconsData,
	rawLicenseToLicense,
	writeIconsData,
} from '../utils.js';

const rawIcons = await getRawIconsData();
const icons = rawIcons.map((rawIcon) => {
	const {license, slug, ...restIcon} = rawIcon;
	return {
		...restIcon,
		license: rawLicenseToLicense(license),
		slug: slug === undefined ? getIconSlug(rawIcon) : slug,
	};
});
await writeIconsData(formatIconData(icons), true);
