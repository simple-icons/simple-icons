#!/usr/bin/env node
/**
 * @fileoverview
 * Linters for the package that can't easily be implemented in the existing
 * linters (e.g. jsonlint/svglint).
 */

import process from 'node:process';
import fakeDiff from 'fake-diff';
import {getIconsDataString, normalizeNewlines, collator} from '../utils.js';

/**
 * Contains our tests so they can be isolated from each other.
 * @type {{[k:string]: () => (string|undefined)}}
 */
const TESTS = {
  /* Tests whether our icons are in alphabetical order */
  alphabetical(data) {
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
  async prettified(data, dataString) {
    const normalizedDataString = normalizeNewlines(dataString);
    const dataPretty = `${JSON.stringify(data, null, 4)}\n`;

    if (normalizedDataString !== dataPretty) {
      const dataDiff = fakeDiff(normalizedDataString, dataPretty);
      return `Data file is formatted incorrectly:\n\n${dataDiff}`;
    }
  },
};

// Execute all tests and log all errors
const dataString = await getIconsDataString();
const data = JSON.parse(dataString);

const testSets = await Promise.all(
  Object.keys(TESTS).map((test) => TESTS[test](data, dataString)),
);
const errors = testSets.filter(Boolean);

if (errors.length > 0) {
  for (const error of errors) console.error(`\u001B[31m${error}\u001B[0m`);
  process.exit(1);
}
