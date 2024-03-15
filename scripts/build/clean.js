/**
 * @fileoverview
 * Clean files built by the build process.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const rootDirectory = path.resolve(__dirname, '..', '..');
const files = ['index.js', 'index.mjs', 'index.d.ts', 'sdk.js'];

Promise.all(
  files.map(file => fs.unlink(path.join(rootDirectory, file)))
).catch((error) => {
  console.error(`Error cleaning files: ${error.message}`);
  process.exit(1);
});
