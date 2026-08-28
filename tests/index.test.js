// @ts-check
/**
 * @file Tests for the index file of npm package.
 */

// The index.mjs file is generated on build before running tests
// @ts-ignore
import * as rawSimpleIcons from '../index.mjs';
import {getIconSlug, getRawIconsData} from '../scripts/utils.js';
import {slugToVariableName} from '../sdk.mjs';
import {testIcon} from './test-icon.js';

/** @type {{ [key: string]: import('../types.d.ts').SimpleIcon }} */
const simpleIcons = rawSimpleIcons;

for (const iconData of await getRawIconsData()) {
	const slug = getIconSlug(iconData);
	const variableName = slugToVariableName(slug);
	const subject = simpleIcons[variableName];

	testIcon(iconData, subject, slug);
}
