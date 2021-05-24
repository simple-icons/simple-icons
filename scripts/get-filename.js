#!/usr/bin/env node
/**
 * @fileoverview
 * Takes a brand name as argument and outputs the corresonding filename to
 * standard output.
 */

const utils = require('./utils.js');

if (process.argv.length < 3) {
  console.error("Provide a brand name as argument")
} else {
  let brandName = "";
  for (let i = 2; i < process.argv.length; i++) {
    brandName += ` ${process.argv[i]}`;
  }

  brandName = brandName.substring(1);

  const filename = utils.titleToFilename(brandName);
  console.log(`For '${brandName}' use the filename '${filename}.svg'`);
}
