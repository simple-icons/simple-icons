#!/usr/bin/env node
/**
 * @fileoverview
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Validator } from 'jsonschema';
import { getDirnameFromImportMeta, getIconsData } from '../utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..', '..');
const schemaFile = path.resolve(rootDir, '.jsonschema.json');

(async () => {
  const icons = await getIconsData();
  const schema = JSON.parse(await fs.readFile(schemaFile, 'utf8'));

  const validator = new Validator();
  const result = validator.validate({ icons }, schema);
  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      console.error(error);
    });

    console.error(
      `Found ${result.errors.length} error(s) in simple-icons.json`,
    );
    process.exit(1);
  }
})();
