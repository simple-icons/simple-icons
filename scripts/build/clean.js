/**
 * @fileoverview
 * Clean files built by the build process.
 */

import fs from 'node:fs';
import path from 'node:path';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const rootDirectory = path.resolve(__dirname, '..', '..');
const files = ['index.js', 'index.mjs', 'index.d.ts', 'sdk.js'];

const fileExists = (fpath) =>
  new Promise((r) => fs.access(fpath, fs.constants.F_OK, (e) => r(!e)));

Promise.all(
  files.map(async (file) => {
    const filepath = path.join(rootDirectory, file);
    if (!(await fileExists(filepath))) {
      console.error(`File ${file} does not exist, skipping...`);
      return;
    }
    return fs.promises.unlink(filepath);
  }),
).catch((error) => {
  console.error(`Error cleaning files: ${error.message}`);
  process.exit(1);
});
