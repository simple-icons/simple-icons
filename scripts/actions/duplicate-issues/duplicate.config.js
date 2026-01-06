// @ts-check
/**
 * @file Duplicate checker configuration for marking icon request issues as possible duplicates.
 */

/** @type {import('./duplicate.app.js').Config} */
const config = {
	threshold: 0.85,
	exclude: [
		'adding',
		'add',
		'could',
		'unavailable',
		'creating',
		'create',
		'icons',
		'icon',
		'logos',
		'logo',
		'missing',
		'miss',
		'needing',
		'need',
		'new',
		'please',
		'requesting',
		'request',
		'project',
		'updated',
		'outdated',
		'brand',
		'assets',
		'for',
		'from',
	],
};

export default config;
