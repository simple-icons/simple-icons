#!/usr/bin/env node
/**
 * @fileoverview
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import fsSync from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { Validator } from 'jsonschema';
import { getIconData } from '../utils.js';

const fs = fsSync.promises;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootDir = path.resolve(__dirname, '..', '..');
const schemaFile = path.resolve(rootDir, '.jsonschema.json');

(async () => {
  const data = getIconData();
  const schema = JSON.parse(await fs.readFile(schemaFile, 'utf8'));

  const validator = new Validator();
  const result = validator.validate(data, schema);
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
