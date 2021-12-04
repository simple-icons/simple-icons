#!/usr/bin/env node
/**
 * @fileoverview
 * Linters for the package that can't easily be implemented in the existing
 * linters (e.g. jsonlint/svglint).
 */

import fs from 'fs';
import path from 'path';
import fakeDiff from 'fake-diff';
import data from '../../_data/simple-icons.json';
import { fileURLToPath } from 'url';

const UTF8 = 'utf8';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootDir = path.resolve(__dirname, '..', '..');
const dataFile = path.resolve(rootDir, '_data', 'simple-icons.json');

/**
 * Contains our tests so they can be isolated from each other.
 * @type {{[k:string]: () => (string|undefined)}}
 */
const TESTS = {
  /* Tests whether our icons are in alphabetical order */
  alphabetical: () => {
    const collector = (invalidEntries, icon, index, array) => {
      if (index > 0) {
        const prev = array[index - 1];
        const compare = icon.title.localeCompare(prev.title);
        if (compare < 0) {
          invalidEntries.push(icon);
        } else if (compare === 0) {
          if (prev.slug) {
            if (!icon.slug || icon.slug.localeCompare(prev.slug) < 0) {
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
  prettified: () => {
    const dataString = fs.readFileSync(dataFile, UTF8).replace(/\r\n/g, '\n');
    const dataPretty = `${JSON.stringify(data, null, '    ')}\n`;
    if (dataString !== dataPretty) {
      const dataDiff = fakeDiff(dataString, dataPretty);
      return `Data file is formatted incorrectly:\n\n${dataDiff}`;
    }
  },
};

// execute all tests and log all errors
const errors = Object.keys(TESTS)
  .map((k) => TESTS[k]())
  .filter(Boolean);

if (errors.length > 0) {
  errors.forEach((error) => console.error(`\u001b[31m${error}\u001b[0m`));
  process.exit(1);
}
