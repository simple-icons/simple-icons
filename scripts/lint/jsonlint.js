#!/usr/bin/env node
/**
 * @fileoverview
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import { Validator } from 'jsonschema';
import schema from '../../.jsonschema.json';
import { getIconData } from '../utils.js';

(async () => {
  const data = getIconData();
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
