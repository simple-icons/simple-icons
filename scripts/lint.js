#!/usr/bin/env node
/**
 * @fileoverview Lints for the package that can't be implemented in the existing linters (e.g. jsonlint/svglint)
 */

const { icons } = require("../_data/simple-icons.json");

/**
 * Contains our tests so they can be isolated from eachother; I don't think each test is worth its own file
 * @type {{[k:string]: () => (string|undefined)}}
 */
const TESTS = {
  /** Tests whether our icons are in alphabetical order */
  alphabetical: function() {
    const collector = (invalidEntries, icon, index, array) => {
      if (index > 0) {
        const prev = array[index - 1];
        if (icon.title.localeCompare(prev.title) < 0) {
          invalidEntries.push(icon);
        }
      }
      return invalidEntries;
    };

    const invalids = icons.reduce(collector, []);
    if (invalids.length) {
      return `Some icons aren't in alphabetical order:
        ${invalids.map(icon => icon.title).join(", ")}`;
    }
  }
};

// execute all tests and log potential errors
const errors = Object.keys(TESTS)
  .map(k => TESTS[k]())
  .filter(Boolean);

if (errors.length) {
  errors.forEach(error => {
    console.error(`\u001b[31m${error}\u001b[0m`);
  });
  process.exit(1);
}
