// @ts-check
/**
 * @file Tests for the documentation.
 */

import {strict as assert} from 'node:assert';
import {test} from 'mocha';
import {getThirdPartyExtensions, getThirdPartyLibraries} from '../sdk.mjs';

for (const extensionType of /** @type {const} */ ([
	'extensions',
	'libraries',
])) {
	const testSubject = `README third-party ${extensionType}`;

	const key =
		/** @type {`getThirdParty${Capitalize<typeof extensionType>}`} */ (
			`getThirdParty${extensionType[0].toUpperCase()}${extensionType.slice(1)}`
		);
	const getters = {getThirdPartyExtensions, getThirdPartyLibraries};
	// eslint-disable-next-line no-await-in-loop
	const extensions = await getters[key]();

	test(`${testSubject} can be parsed`, () => {
		assert.ok(extensions.length > 0);
	});

	test(`${testSubject} must be alphabetically sorted`, () => {
		const names = extensions.map((item) => item.module.name);
		assert.deepEqual(
			names,
			names.toSorted(),
			`Wrong alphabetical order of third-party ${extensionType} in README.`,
		);
	});

	test(`${testSubject} images must be consumed from the Simple Icons CDN`, () => {
		for (const extension of extensions) {
			assert.ok(
				extension.module.image.url.startsWith('https://cdn.simpleicons.org/'),
				`Wrong image URL for third-party ${extensionType.slice(0, -1)} ${extension.module.name} in README.`,
			);
		}
	});
}
