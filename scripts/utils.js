import fs from 'node:fs/promises';
import path from 'node:path';
import {getDirnameFromImportMeta, getIconDataPath} from '../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

/**
 * Get JSON schema data.
 * @param {String} rootDirectory Path to the root directory of the project.
 */
export const getJsonSchemaData = async (
  rootDirectory = path.resolve(__dirname, '..'),
) => {
  const jsonSchemaPath = path.resolve(rootDirectory, '.jsonschema.json');
  const jsonSchemaString = await fs.readFile(jsonSchemaPath, 'utf8');
  return JSON.parse(jsonSchemaString);
};

/**
 * Write icons data to _data/simple-icons.json.
 * @param {Object} iconsData Icons data object.
 * @param {String} rootDirectory Path to the root directory of the project.
 */
export const writeIconsData = async (
  iconsData,
  rootDirectory = path.resolve(__dirname, '..'),
) => {
  await fs.writeFile(
    getIconDataPath(rootDirectory),
    `${JSON.stringify(iconsData, null, 4)}\n`,
    'utf8',
  );
};
