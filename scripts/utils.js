import path from 'node:path';
import fs from 'node:fs/promises';
import { getDirnameFromImportMeta, getIconDataPath } from '../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

/**
 * Get JSON schema data.
 * @param {String} rootDir Path to the root directory of the project.
 */
export const getJsonSchemaData = async (
  rootDir = path.resolve(__dirname, '..'),
) => {
  const jsonSchemaPath = path.resolve(rootDir, '.jsonschema.json');
  const jsonSchemaString = await fs.readFile(jsonSchemaPath, 'utf8');
  return JSON.parse(jsonSchemaString);
};

/**
 * Write icons data to _data/simple-icons.json.
 * @param {Object} iconsData Icons data object.
 * @param {String} rootDir Path to the root directory of the project.
 */
export const writeIconsData = async (
  iconsData,
  rootDir = path.resolve(__dirname, '..'),
) => {
  await fs.writeFile(
    getIconDataPath(rootDir),
    `${JSON.stringify(iconsData, null, 4)}\n`,
    'utf8',
  );
};
