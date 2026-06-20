// @ts-check
/**
 * @file Tests for the index file of npm package.
 */

// The index.mjs file is generated on build before running tests
// @ts-ignore
import * as rawSimpleIcons from '../index.mjs';
import {getIconSlug, getIconsData, slugToVariableName} from '../sdk.mjs';
import {testIcon} from './test-icon.js';

/** @type {{ [key: string]: import('../types.d.ts').SimpleIcon }} */
const simpleIcons = rawSimpleIcons;

for (const iconData of await getIconsData()) {
	const slug = getIconSlug(iconData);
	const variableName = slugToVariableName(slug);
	const subject = simpleIcons[variableName];

	testIcon(iconData, subject, slug);
}
