#!/usr/bin/env node
/**
 * @file
 * Linters for the package that can't easily be implemented in the existing ones.
 */

/**
 * @typedef {import("../../sdk.mjs").IconData} IconData
 * @typedef {import("../../types.js").CustomLicense} CustomLicense
 */

import path from 'node:path';
import process from 'node:process';
import fakeDiff from 'fake-diff';
import {
	collator,
	getIconSlug,
	getIconsDataString,
	normalizeNewlines,
} from '../../sdk.mjs';
import {getSpdxLicenseIds, sortIconsCompare} from '../utils.js';

/**
 * Contains our tests so they can be isolated from each other.
 * @type {{[k: string]: (data: IconData[], dataString: string) => Promise<string | undefined> | string | undefined}}
 */
const TESTS = {
	/**
	 * Tests whether our icons are in alphabetical order.
	 * @param {IconData[]} icons Icons data.
	 * @returns {string|undefined} Error message or undefined.
	 */
	alphabetical(icons) {
		/**
		 * Collects invalid alphabet ordered icons.
		 * @param {IconData[]} invalidEntries Invalid icons reference.
		 * @param {IconData} icon Icon to check.
		 * @param {number} index Index of the icon.
		 * @param {IconData[]} array Array of icons.
		 * @returns {IconData[]} Invalid icons.
		 */
		const collector = (invalidEntries, icon, index, array) => {
			if (index > 0) {
				const previous = array[index - 1];
				const comparison = collator.compare(icon.title, previous.title);
				if (comparison < 0) {
					invalidEntries.push(icon);
				} else if (
					comparison === 0 &&
					previous.slug &&
					(!icon.slug || collator.compare(icon.slug, previous.slug) < 0)
				) {
					invalidEntries.push(icon);
				}
			}

			return invalidEntries;
		};

		/**
		 * Format an icon for display in the error message.
		 * @param {IconData} icon Icon to format.
		 * @returns {string} Formatted icon.
		 */
		const format = (icon) => {
			if (icon.slug) {
				return `${icon.title} (${icon.slug})`;
			}

			return icon.title;
		};

		/**
		 * Find the expected position of an icon.
		 * @param {IconData[]} expectedOrder Expected order of the icons.
		 * @param {IconData} targetIcon Icon to find.
		 * @returns {string} Expected position of the icon.
		 */
		const findPositon = (expectedOrder, targetIcon) => {
			const foundIndex = expectedOrder.findIndex(
				(icon) =>
					targetIcon.title === icon.title && targetIcon.slug === icon.slug,
			);
			const before = expectedOrder[foundIndex - 1];
			const after = expectedOrder[foundIndex + 1];
			if (before) return `should be after ${format(before)}`;
			if (after) return `should be before ${format(after)}`;
			return 'not found';
		};

		// eslint-disable-next-line unicorn/no-array-reduce, unicorn/no-array-callback-reference
		const invalids = icons.reduce(collector, []);
		if (invalids.length > 0) {
			const expectedOrder = [...icons].sort(sortIconsCompare);

			return `Some icons aren't in alphabetical order:
${invalids.map((icon) => `${format(icon)} ${findPositon(expectedOrder, icon)}`).join('\n')}`;
		}
	},

	/* Check the formatting of the data file */
	prettified(data, dataString) {
		const normalizedDataString = normalizeNewlines(dataString);
		const dataPretty = `${JSON.stringify(data, null, '\t')}\n`;

		if (normalizedDataString !== dataPretty) {
			const dataDiff = fakeDiff(normalizedDataString, dataPretty);
			return `Data file is formatted incorrectly:\n\n${dataDiff}`;
		}
	},

	/* Check redundant trailing slash in URL */
	checkUrl(icons) {
		/**
		 * Check if an URL has a redundant trailing slash.
		 * @param {URL} $url URL instance.
		 * @param {string} url Original URL string.
		 * @returns {boolean} Whether the URL has a redundant trailing slash.
		 */
		const hasRedundantTrailingSlash = ($url, url) => url === $url.origin + '/';

		/**
		 * Check if an URL is static wikimedia asset URL.
		 * @param {URL} $url URL instance.
		 * @returns {boolean} Whether the URL is static wikimedia asset URL.
		 */
		const isStaticWikimediaAssetUrl = ($url) =>
			$url.hostname === 'upload.wikimedia.org';

		/**
		 * Check if an URL is raw GitHub asset URL.
		 * @param {URL} $url URL instance.
		 * @returns {boolean} Whether the URL is raw GitHub asset URL.
		 */
		const isRawGithubAssetUrl = ($url) =>
			$url.hostname === 'raw.githubusercontent.com';

		/**
		 * Check if an URL is a GitHub URL.
		 * @param {URL} $url URL instance.
		 * @returns {boolean} Whether the URL is a GitHub URL.
		 */
		const isGitHubUrl = ($url) => $url.hostname === 'github.com';

		/**
		 * Regex to match a permalink GitHub URL for a file.
		 */
		const permalinkGitHubRegex =
			/^https:\/\/github\.com\/[^/]+\/[^/]+\/(blob\/[a-f\d]{40}\/\S+)|(tree\/[a-f\d]{40}(\/\S+)?)|(((issues)|(pull)|(discussions))\/\d+#((issuecomment)|(discussioncomment))-\d+)|(wiki\/\S+\/[a-f\d]{40})$/;

		/**
		 * URLs excluded from the GitHub URL check as are used by GitHub brands.
		 */
		const gitHubExcludedUrls = new Set([
			'https://github.com/logos',
			'https://github.com/features/actions',
			'https://github.com/sponsors',
		]);

		/**
		 * Check if an URL is a permanent GitHub URL for a file.
		 * @param {string} url URL string.
		 * @returns {boolean} Whether the URL is a GitHub URL for a file.
		 */
		const isPermalinkGitHubFileUrl = (url) => permalinkGitHubRegex.test(url);

		/**
		 * Url fields with a boolean indicating if is an icon source URL.
		 * @type {[boolean, string][]}
		 */
		const allUrlFields = [];
		for (const icon of icons) {
			allUrlFields.push([true, icon.source]);
			if (icon.guidelines) {
				allUrlFields.push([false, icon.guidelines]);
			}

			if (icon.license !== undefined && Object.hasOwn(icon.license, 'url')) {
				allUrlFields.push([
					false,
					// TODO: `hasOwn` is not currently supported by TS.
					// See https://github.com/microsoft/TypeScript/issues/44253
					/** @type {string} */
					// @ts-ignore
					icon.license.url,
				]);
			}
		}

		const invalidUrls = [];
		for (const [isSourceUrl, url] of allUrlFields) {
			const $url = new globalThis.URL(url);

			if (hasRedundantTrailingSlash($url, url)) {
				invalidUrls.push(fakeDiff(url, $url.origin));
			}

			if (isStaticWikimediaAssetUrl($url)) {
				const expectedUrl = `https://commons.wikimedia.org/wiki/File:${path.basename($url.pathname)}`;
				invalidUrls.push(fakeDiff(url, expectedUrl));
			}

			if (isRawGithubAssetUrl($url)) {
				const [, owner, repo, hash, ...directory] = $url.pathname.split('/');
				const expectedUrl = `https://github.com/${owner}/${repo}/blob/${hash}/${directory.join('/')}`;
				invalidUrls.push(fakeDiff(url, expectedUrl));
			}

			if (
				isSourceUrl &&
				isGitHubUrl($url) &&
				!isPermalinkGitHubFileUrl(url) &&
				!gitHubExcludedUrls.has(url)
			) {
				invalidUrls.push(
					`'${url}' must be a permalink GitHub URL. Expecting something like` +
						" 'https://github.com/<owner>/<repo>/blob/<hash>/<file/path.ext>'.",
				);
			}
		}

		if (invalidUrls.length > 0) {
			return `Invalid URLs:\n\n${invalidUrls.join('\n\n')}`;
		}
	},

	/* Check if all licenses are valid SPDX identifiers */
	async checkLicense(icons) {
		const spdxLicenseIds = new Set(await getSpdxLicenseIds());
		const badLicenses = [];
		for (const {title, slug, license} of icons) {
			if (
				license &&
				license.type !== 'custom' &&
				!spdxLicenseIds.has(license.type)
			) {
				badLicenses.push(
					`${title} (${getIconSlug({title, slug})}) has not a valid SPDX license.`,
				);
			}
		}

		if (badLicenses.length > 0) {
			return `Bad licenses:\n\n${badLicenses.join('\n')}\n\nSee the valid license indentifiers at https://spdx.org/licenses`;
		}
	},

	/* Ensure that fields are sorted in the same way for all icons */
	fieldsSorted(icons) {
		const expectedOrder = [
			'title',
			'slug',
			'hex',
			'source',
			'guidelines',
			'license',
			'aliases',
		];

		const errors = [];
		for (const icon of icons) {
			const fields = Object.keys(icon);
			const previousFields = [...fields];
			fields.sort(
				(a, b) => expectedOrder.indexOf(a) - expectedOrder.indexOf(b),
			);
			const previousFieldsString = JSON.stringify(previousFields);
			const fieldsString = JSON.stringify(fields);
			if (previousFieldsString !== fieldsString) {
				const subject = icon.slug ? `${icon.title} (${icon.slug})` : icon.title;
				errors.push(
					`${subject} fields are not sorted.` +
						` Found ${previousFieldsString.replaceAll(',', ', ')},` +
						` but expected ${fieldsString.replaceAll(',', ', ')}`,
				);
			}
		}

		if (errors.length > 0) {
			return (
				'Wrong order of fields in _data/simple-icons.json icons:\n' +
				`- ${errors.join('\n- ')}`
			);
		}
	},
};

const iconsDataString = await getIconsDataString();
const iconsData = JSON.parse(iconsDataString);

const errors = (
	await Promise.all(
		Object.values(TESTS).map((test) => test(iconsData, iconsDataString)),
	)
)
	// eslint-disable-next-line unicorn/no-await-expression-member
	.filter(Boolean);

if (errors.length > 0) {
	for (const error of errors) console.error(`\u001B[31m${error}\u001B[0m`);
	process.exit(1);
}
