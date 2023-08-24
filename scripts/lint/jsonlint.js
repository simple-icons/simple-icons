/**
 * @fileoverview
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import process from 'node:process';
import { Validator } from 'jsonschema';
import { getIconsData } from '../../sdk.mjs';
import { getJsonSchemaData } from '../utils.js';

const icons = await getIconsData();
const schema = await getJsonSchemaData();

const validator = new Validator();
const result = validator.validate({ icons }, schema);
if (result.errors.length > 0) {
  result.errors.forEach((error) => console.error(error));
  console.error(`Found ${result.errors.length} error(s) in simple-icons.json`);
  process.exit(1);
}
