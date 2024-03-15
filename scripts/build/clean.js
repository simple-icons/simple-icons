/**
 * @fileoverview
 * Clean files built by the build process.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const rootDirectory = path.resolve(__dirname, '..', '..');

Promise.all([
  fs.unlink(path.join(rootDirectory, 'index.js')),
  fs.unlink(path.join(rootDirectory, 'index.mjs')),
  fs.unlink(path.join(rootDirectory, 'index.d.ts')),
  fs.unlink(path.join(rootDirectory, 'sdk.js')),
]).catch((error) => {
  console.error(`Error cleaning files: ${error.message}`);
  process.exit(1);
});
