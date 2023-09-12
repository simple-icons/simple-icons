/**
 * @fileoverview
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import process from 'node:process';
import { Validator } from 'jsonschema';
import { getIconsData } from '../../sdk.mjs';
import { getJsonSchemaData } from '../utils.js';
import ignored from '../../.jsonlint-ignored.json' assert { type: 'json' };

const icons = await getIconsData();
const schema = await getJsonSchemaData();

const validator = new Validator();
const result = validator.validate({ icons }, schema);
if (result.errors.length > 0) {
  let loggedErrors = [];
  result.errors.forEach((error) => {
    if (error.schema === '#url') {
      if (
        !Object.values(ignored[error.schema]).includes(
          icons[error.path[1]].source,
        )
      ) {
        loggedErrors.push(error);
        console.log(error);
      }
    } else {
      loggedErrors.push(error);
      console.log(error);
    }
  });
  console.error(`Found ${loggedErrors.length} error(s) in simple-icons.json`);
  process.exit(1);
}
