#!/usr/bin/env node
/**
 * @file
 * Clean files built by the build process.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {getDirnameFromImportMeta} from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const rootDirectory = path.resolve(__dirname, '..', '..');
const files = ['index.js', 'index.mjs', 'index.d.ts', 'sdk.js'];

/**
 * Check if a file exists.
 * @param {string} fpath File path to check.
 * @returns {Promise<boolean>} True if the file exists, false otherwise.
 */
const fileExists = async (fpath) => {
  try {
    await fs.access(fpath);
    return true;
  } catch {
    return false;
  }
};

try {
  Promise.all(
    files.map(async (file) => {
      const filepath = path.join(rootDirectory, file);
      if (!(await fileExists(filepath))) {
        console.error(`File ${file} does not exist, skipping...`);
        return;
      }

      return fs.unlink(filepath);
    }),
  );
} catch (error) {
  console.error('Error cleaning files:', error);
  process.exit(1);
}
