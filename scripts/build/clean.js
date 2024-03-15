/**
 * @fileoverview
 * Clean files built by the build process.
 */

import fs from 'node:fs/promises';

Promise.all([
  fs.unlink('index.js'),
  fs.unlink('index.mjs'),
  fs.unlink('index.d.ts'),
  fs.unlink('sdk.js'),
]).catch((error) => {
  console.error(`Error cleaning files: ${error.message}`);
  process.exit(1);
});
