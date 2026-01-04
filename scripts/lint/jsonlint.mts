#!/usr/bin/env node
/**
 * @file
 * CLI tool to run jsonschema on the simple-icons.json data file.
 */

import process from 'node:process';
import {Validator} from 'jsonschema';
import {getIconsData} from '../../sdk.mts';
import {getJsonSchemaData} from '../utils.mts';

const icons = await getIconsData();
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const schema = await getJsonSchemaData();

const validator = new Validator();
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const result = validator.validate(icons, schema);
if (result.errors.length > 0) {
	for (const error of result.errors) console.error(error);
	console.error(`Found ${result.errors.length} error(s) in simple-icons.json`);
	process.exit(1);
}
