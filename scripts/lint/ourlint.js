#!/usr/bin/env node
/**
 * @fileoverview
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
 * @type {{[k:string]: (arg0: {icons: IconsData}, arg1: String) => String | undefined}}
 */
const TESTS = {
  /**
   * Tests whether our icons are in alphabetical order
   */
  alphabetical(data, _) {
    /**
     *
     * @param {IconData[]} invalidEntries
     * @param {IconData} icon
     * @param {number} index
     * @param {IconData[]} array
     * @returns IconData[]
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

    /** @param {IconData} icon */
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
        ${invalids
          .map(
            /** @param {IconData} icon */
            (icon) => format(icon),
          )
          .join(', ')}`;
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
    /** @param {string} url */
    const hasRedundantTrailingSlash = (url) => {
      const {origin} = new global.URL(url);
      return /^\/+$/.test(url.replace(origin, ''));
    };

    const allUrlFields = [
      ...new Set(
        data.icons
          .flatMap((icon) => {
            // TODO: `Omit` is not working smoothly here
            const license =
              // @ts-ignore
              icon.license && icon.license.url
                ? // @ts-ignore
                  [icon.license.url]
                : [];
            return [icon.source, icon.guidelines, ...license];
          })

          .filter(Boolean),
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
