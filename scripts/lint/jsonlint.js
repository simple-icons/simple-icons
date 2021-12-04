#!/usr/bin/env node
/**
 * @fileoverview
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import path from 'path';
import { Validator } from 'jsonschema';
import { fileURLToPath } from 'url';
import schema from '../../.jsonschema.json';
import data from '../../_data/simple-icons.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const validator = new Validator();
const result = validator.validate(data, schema);
if (result.errors.length > 0) {
  result.errors.forEach((error) => {
    console.error(error);
  });

  console.error(`Found ${result.errors.length} error(s) in simple-icons.json`);
  process.exit(1);
}
