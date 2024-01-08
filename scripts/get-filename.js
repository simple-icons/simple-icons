/**
 * @fileoverview
 * Script that takes a brand name as argument and outputs the corresponding
 * icon SVG filename to standard output.
 */

import process from 'node:process';
import { titleToSlug } from '../sdk.mjs';

if (process.argv.length < 3) {
  console.error('Provide a brand name as argument');
  process.exit(1);
} else {
  const brandName = process.argv
    .slice(3)
    .reduce((acc, arg) => `${acc} ${arg}`, process.argv[2]);

  const filename = titleToSlug(brandName);
  console.log(`For '${brandName}' use the file 'icons/${filename}.svg'`);
}
