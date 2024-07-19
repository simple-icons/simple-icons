#!/usr/bin/env node
/**
 * @file
 * Linters for the package that can't easily be implemented in the existing
 * linters (e.g. jsonlint/svglint).
 */

/**
 * @typedef {import("../../sdk.mjs").IconData} IconData
 * @typedef {import("../../types.js").CustomLicense} CustomLicense
 * @typedef {IconData[]} IconsData
 */

import process from 'node:process';
import fakeDiff from 'fake-diff';
import {collator, getIconsDataString, normalizeNewlines} from '../../sdk.mjs';

/**
 * Contains our tests so they can be isolated from each other.
 * @type {{[k: string]: (arg0: {icons: IconsData}, arg1: string) => string | undefined}}
 */
const TESTS = {
  /**
   * Tests whether our icons are in alphabetical order
   * @param {{icons: IconsData}} data Icons data
   * @returns {string|undefined} Error message or undefined
   */
  alphabetical(data) {
    /**
     * Collects invalid alphabet ordered icons
     * @param {IconData[]} invalidEntries Invalid icons reference
     * @param {IconData} icon Icon to check
     * @param {number} index Index of the icon
     * @param {IconData[]} array Array of icons
     * @returns {IconData[]} Invalid icons
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
     * Format an icon for display in the error message
     * @param {IconData} icon Icon to format
     * @returns {string} Formatted icon
     */
    const format = (icon) => {
      if (icon.slug) {
        return `${icon.title} (${icon.slug})`;
      }

      return icon.title;
    };

    // eslint-disable-next-line unicorn/no-array-reduce, unicorn/no-array-callback-reference
    const invalids = data.icons.reduce(collector, []);
    if (invalids.length > 0) {
      return `Some icons aren't in alphabetical order:
        ${invalids.map((icon) => format(icon)).join(', ')}`;
    }
  },

  /* Check the formatting of the data file */
  prettified(data, dataString) {
    const normalizedDataString = normalizeNewlines(dataString);
    const dataPretty = `${JSON.stringify(data, null, 4)}\n`;

    if (normalizedDataString !== dataPretty) {
      const dataDiff = fakeDiff(normalizedDataString, dataPretty);
      return `Data file is formatted incorrectly:\n\n${dataDiff}`;
    }
  },

  /* Check redundant trailing slash in URL */
  checkUrl(data) {
    /**
     * Check if an URL has a redundant trailing slash.
     * @param {string} url URL to check
     * @returns {boolean} Whether the URL has a redundant trailing slash
     */
    const hasRedundantTrailingSlash = (url) => {
      const {origin} = new global.URL(url);
      return /^\/+$/.test(url.replace(origin, ''));
    };

    const allUrlFields = [
      ...new Set(
        data.icons.flatMap((icon) => {
          /** @type {string[]} */
          const license =
            icon.license !== undefined && Object.hasOwn(icon.license, 'url')
              ? [
                  // TODO: `hasOwn` is not currently supported by TS.
                  // See https://github.com/microsoft/TypeScript/issues/44253
                  /** @type {string} */
                  // @ts-ignore
                  icon.license.url,
                ]
              : [];
          const guidelines = icon.guidelines ? [icon.guidelines] : [];
          return [icon.source, ...guidelines, ...license];
        }),
      ),
    ];

    const invalidUrls = allUrlFields.filter((url) =>
      hasRedundantTrailingSlash(url),
    );

    if (invalidUrls.length > 0) {
      return `Some URLs have a redundant trailing slash:\n\n${invalidUrls.join(
        '\n',
      )}`;
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
