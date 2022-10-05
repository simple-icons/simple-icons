#!/usr/bin/env node
/**
 * @fileoverview
 * Linters for the package that can't easily be implemented in the existing
 * linters (e.g. jsonlint/svglint).
 */

import fakeDiff from 'fake-diff';
import { getIconsDataString, normalizeNewlines, collator } from '../utils.js';

/**
 * Contains our tests so they can be isolated from each other.
 * @type {{[k:string]: () => (string|undefined)}}
 */
const TESTS = {
  /* Tests whether our icons are in alphabetical order */
  alphabetical: (data) => {
    const collector = (invalidEntries, icon, index, array) => {
      if (index > 0) {
        const prev = array[index - 1];
        const comparison = collator.compare(icon.title, prev.title);
        if (comparison < 0) {
          invalidEntries.push(icon);
        } else if (comparison === 0) {
          if (prev.slug) {
            if (!icon.slug || collator.compare(icon.slug, prev.slug) < 0) {
              invalidEntries.push(icon);
            }
          }
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

    const invalids = data.icons.reduce(collector, []);
    if (invalids.length) {
      return `Some icons aren't in alphabetical order:
        ${invalids.map((icon) => format(icon)).join(', ')}`;
    }
  },

  /* Check the formatting of the data file */
  prettified: async (data, dataString) => {
    const normalizedDataString = normalizeNewlines(dataString);
    const dataPretty = `${JSON.stringify(data, null, 4)}\n`;

    if (normalizedDataString !== dataPretty) {
      const dataDiff = fakeDiff(normalizedDataString, dataPretty);
      return `Data file is formatted incorrectly:\n\n${dataDiff}`;
    }
  },
};

// execute all tests and log all errors
(async () => {
  const dataString = await getIconsDataString();
  const data = JSON.parse(dataString);

  const errors = (
    await Promise.all(
      Object.keys(TESTS).map((test) => TESTS[test](data, dataString)),
    )
  ).filter(Boolean);

  if (errors.length > 0) {
    errors.forEach((error) => console.error(`\u001b[31m${error}\u001b[0m`));
    process.exit(1);
  }
})();
