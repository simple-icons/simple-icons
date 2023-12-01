import path from 'node:path';
import fs from 'node:fs/promises';
import { getDirnameFromImportMeta, getIconDataPath } from '../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

/**
 * Get the slug/filename for an icon.
 * @param {Object} icon The icon data as it appears in _data/simple-icons.json
 */
export const getIconSlug = (icon) => icon.slug || titleToSlug(icon.title);

/**
 * Extract the path from an icon SVG content.
 * @param {Object} svg The icon SVG content
 **/
export const svgToPath = (svg) => svg.match(/<path\s+d="([^"]*)/)[1];

/**
 * Converts a brand title into a slug/filename.
 * @param {String} title The title to convert
 */
export const titleToSlug = (title) =>
  title
    .toLowerCase()
    .replace(
      TITLE_TO_SLUG_CHARS_REGEX,
      (char) => TITLE_TO_SLUG_REPLACEMENTS[char],
    )
    .normalize('NFD')
    .replace(TITLE_TO_SLUG_RANGE_REGEX, '');

/**
 * Converts a slug into a variable name that can be exported.
 * @param {String} slug The slug to convert
 */
export const slugToVariableName = (slug) => {
  const slugFirstLetter = slug[0].toUpperCase();
  const slugRest = slug.slice(1);
  return `si${slugFirstLetter}${slugRest}`;
};

/**
 * Converts a brand title (as it is seen in simple-icons.json) into a brand
 * title in HTML/SVG friendly format.
 * @param {String} brandTitle The title to convert
 */
export const titleToHtmlFriendly = (brandTitle) =>
  brandTitle
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/./g, (char) => {
      const charCode = char.charCodeAt(0);
      return charCode > 127 ? `&#${charCode};` : char;
    });

/**
 * Converts a brand title in HTML/SVG friendly format into a brand title (as
 * it is seen in simple-icons.json)
 * @param {String} htmlFriendlyTitle The title to convert
 */
export const htmlFriendlyToTitle = (htmlFriendlyTitle) =>
  htmlFriendlyTitle
    .replace(/&#([0-9]+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(
      /&(quot|amp|lt|gt);/g,
      (_, ref) => ({ quot: '"', amp: '&', lt: '<', gt: '>' })[ref],
    );

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
