#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Linters for the package that can't easily be implemented in the existing ones.
 */

/**
 * @typedef {import("../../types.js").IconData} IconData
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
	titleToSlug,
} from '../../sdk.mjs';
import {
	fileExists,
	formatIconData,
	getSpdxLicenseIds,
	sortIconsCompare,
} from '../utils.js';

const iconsDirectory = path.resolve(import.meta.dirname, '..', '..', 'icons');

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
	checkUrls(icons) {
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
		 * Check if URl is user attachment URL.
		 * @param {URL} $url URL instance.
		 * @returns {boolean} Whether the URL is user attachment URL.
		 */
		const isGitHubUserAttachmentUrl = ($url) =>
			$url.hostname === 'github.com' &&
			$url.pathname.startsWith('/user-attachments/assets');

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
			/^https:\/\/github\.com\/[^/]+\/[^/]+\/(blob\/[a-f\d]{40}\/\S+)|(tree\/[a-f\d]{40}(\/\S+)?)|(((issues)|(pull)|(discussions))\/\d+#((issue)|(issuecomment)|(discussioncomment))-\d+)|(wiki\/\S+\/[a-f\d]{40})$/;

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
					// @ts-expect-error
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

			if (isGitHubUserAttachmentUrl($url)) continue;

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
		for (const icon of icons) {
			if (
				icon.license &&
				icon.license.type !== 'custom' &&
				!spdxLicenseIds.has(icon.license.type)
			) {
				badLicenses.push(
					`${icon.title} (${getIconSlug(icon)}) has not a valid SPDX license.`,
				);
			}
		}

		if (badLicenses.length > 0) {
			return `Bad licenses:\n\n${badLicenses.join('\n')}\n\nSee the valid license indentifiers at https://spdx.org/licenses`;
		}
	},

	/* Ensure that fields are sorted in the same way for all icons */
	fieldsSorted(icons) {
		const formatted = formatIconData(icons);
		const previous = JSON.stringify(icons, null, '\t');
		const sorted = JSON.stringify(formatted, null, '\t');
		if (previous !== sorted) {
			const diff = fakeDiff(previous, sorted);
			return `Fields are not sorted in the same way for all icons:\n\n${diff}`;
		}
	},

	/* Ensure that aliases constraints are enforced. */
	checkAliases(icons) {
		const errors = [];

		for (const icon of icons) {
			// Old aliases must be different from the title
			const oldAliases = icon.aliases?.old || [];
			for (const oldAlias of oldAliases) {
				if (oldAlias === icon.title) {
					errors.push(
						`Icon "${icon.title}" has an alias "old" that is the same as its title.` +
							' Please remove the alias or change the title.',
					);
				}
			}

			// AKA aliases must be different from the title
			const akaAliases = icon.aliases?.aka || [];
			for (const akaAlias of akaAliases) {
				if (akaAlias === icon.title) {
					errors.push(
						`Icon "${icon.title}" has an alias "aka" that is the same as its title.` +
							' Please remove the alias or change the title.',
					);
				}
			}

			// Duplicate aliases titles must be different from the title
			const duplicateAliases = icon.aliases?.dup || [];
			for (const {title: duplicateAliasTitle} of duplicateAliases) {
				if (duplicateAliasTitle === icon.title) {
					errors.push(
						`Icon "${icon.title}" has a duplicate alias "${duplicateAliasTitle}" that is the same as its title.` +
							' Please remove the alias or change the title.',
					);
				}
			}

			// Duplicate aliases must be different from each other
			// based on the title of each one.
			const duplicateAliasesTitles = duplicateAliases.map(
				(duplicateAlias) => duplicateAlias.title,
			);
			const uniqueDuplicateAliasesTitles = new Set(duplicateAliasesTitles);
			if (uniqueDuplicateAliasesTitles.size !== duplicateAliasesTitles.length) {
				errors.push(
					`Icon "${icon.title}" has duplicate aliases with the same title.` +
						' Please ensure that all duplicate aliases have unique titles.',
				);
			}

			// Localized aliases must be different from the title
			const locAliases = icon.aliases?.loc || {};
			for (const [lang, locAlias] of Object.entries(locAliases)) {
				if (locAlias === icon.title) {
					errors.push(
						`Icon "${icon.title}" has a localized alias "${lang}" that is the same as its title.` +
							' Please remove the alias or change the title.',
					);
				}
			}
		}

		return errors.join('\n') || undefined;
	},

	/* Ensure that titles constraints are enforced. */
	checkTitles(icons) {
		const titles = new Set();
		const duplicateTitles = [];
		for (const icon of icons) {
			const {title, slug} = icon;

			// Titles of icons that do not have slug must be unique.
			if (slug === undefined) {
				if (titles.has(title)) {
					duplicateTitles.push(title);
				} else {
					titles.add(title);
				}
			}
		}

		const errors = [];
		if (duplicateTitles.length > 0) {
			const message =
				`Found duplicate title for icons that do not have slug: ${duplicateTitles.join(', ')}.` +
				`\nPlease, ensure that all titles are unique or these icons have proper slugs.`;
			errors.push(message);
		}

		return errors.join('\n') || undefined;
	},

	/* Ensure that slugs constraints are enforced. */
	async checkSlugs(icons) {
		const errors = [];

		for (const icon of icons) {
			const {slug, title} = icon;

			if (slug === undefined) {
				continue;
			}

			// Custom slugs must be necessary. If a title is converted to a slug
			// and it is the same as the slug, then it is not necessary.
			if (titleToSlug(title) === slug) {
				errors.push(
					`Icon "${title}" has a slug "${slug}" that is the same as the slug inferred from its title.` +
						' Please, remove the slug.',
				);
				continue;
			}

			// Custom slugs must be normalized with almost the same rules that
			// are used for slugs inferred from titles. We allow underscores in
			// custom slugs to ensure that they are unique.
			const normalizedSlug = titleToSlug(slug);
			const slugWithoutUnderscores = slug.replaceAll('_', '');
			if (normalizedSlug !== slugWithoutUnderscores) {
				errors.push(
					`Icon "${title}" has a slug "${slug}" that is not normalized according to the rules used for titles.` +
						` Please, rewrite as "${normalizedSlug}" or use another slug.`,
				);
				continue;
			}

			// Icons with custom slugs must have the corresponding icon file.
			const iconFilePath = path.resolve(iconsDirectory, `${slug}.svg`);
			// eslint-disable-next-line no-await-in-loop
			const iconFilePathExists = await fileExists(iconFilePath);
			if (!iconFilePathExists) {
				errors.push(
					`Icon "${title}" has a slug "${slug}" but the corresponding icon file "icons/${slug}.svg" does not exist.` +
						' Please, create the icon file or remove the slug.',
				);
				continue;
			}

			for (const otherIcon of icons) {
				if (otherIcon.title === title) {
					continue;
				}

				// Custom slugs must be unique.
				if (otherIcon.slug === slug) {
					errors.push(
						`Icon "${title}" has a slug "${slug}" that is not unique.` +
							` It is already used by "${otherIcon.title}". Please, ensure that all slugs are unique.`,
					);
				}

				// Custom slugs must be different from slugs inferred from titles.
				if (slug === titleToSlug(otherIcon.title)) {
					errors.push(
						`Icon "${title}" has a slug "${slug}" that is the same as the slug inferred from the title of the icon "${otherIcon.title}".` +
							' Please, ensure that all slugs are unique.',
					);
				}
			}
		}

		return errors.join('\n') || undefined;
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
