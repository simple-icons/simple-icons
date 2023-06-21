/**
 * @fileoverview
 * Simple Icons SDK.
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * @typedef {import("./sdk").ThirdPartyExtension} ThirdPartyExtension
 * @typedef {import("./sdk").IconData} IconData
 */

const TITLE_TO_SLUG_REPLACEMENTS = {
  '+': 'plus',
  '.': 'dot',
  '&': 'and',
  đ: 'd',
  ħ: 'h',
  ı: 'i',
  ĸ: 'k',
  ŀ: 'l',
  ł: 'l',
  ß: 'ss',
  ŧ: 't',
};

const TITLE_TO_SLUG_CHARS_REGEX = RegExp(
  `[${Object.keys(TITLE_TO_SLUG_REPLACEMENTS).join('')}]`,
  'g',
);

const TITLE_TO_SLUG_RANGE_REGEX = /[^a-z0-9]/g;

/**
 * Regex to validate HTTPs URLs.
 */
export const URL_REGEX = /^https:\/\/[^\s]+$/;

/**
 * Get the directory name where this file is located from `import.meta.url`,
 * equivalent to the `__dirname` global variable in CommonJS.
 * @param {String} importMetaUrl import.meta.url
 * @returns {String} Directory name in which this file is located
 */
export const getDirnameFromImportMeta = (importMetaUrl) =>
  path.dirname(fileURLToPath(importMetaUrl));

/**
 * Get the slug/filename for an icon.
 * @param {IconData} icon The icon data as it appears in *_data/simple-icons.json*
 * @returns {String} The slug/filename for the icon
 */
export const getIconSlug = (icon) => icon.slug || titleToSlug(icon.title);

/**
 * Extract the path from an icon SVG content.
 * @param {String} svg The icon SVG content
 * @returns {String} The path from the icon SVG content
 **/
export const svgToPath = (svg) => svg.match(/<path\s+d="([^"]*)/)[1];

/**
 * Converts a brand title into a slug/filename.
 * @param {String} title The title to convert
 * @returns {String} The slug/filename for the title
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
 * @returns {String} The variable name for the slug
 */
export const slugToVariableName = (slug) => {
  const slugFirstLetter = slug[0].toUpperCase();
  const slugRest = slug.slice(1);
  return `si${slugFirstLetter}${slugRest}`;
};

/**
 * Converts a brand title as defined in *_data/simple-icons.json* into a brand
 * title in HTML/SVG friendly format.
 * @param {String} brandTitle The title to convert
 * @returns {String} The brand title in HTML/SVG friendly format
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
 * it is seen in *_data/simple-icons.json*)
 * @param {String} htmlFriendlyTitle The title to convert
 * @returns {String} The brand title in HTML/SVG friendly format
 */
export const htmlFriendlyToTitle = (htmlFriendlyTitle) =>
  htmlFriendlyTitle
    .replace(/&#([0-9]+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(
      /&(quot|amp|lt|gt);/g,
      (_, ref) => ({ quot: '"', amp: '&', lt: '<', gt: '>' }[ref]),
    );

/**
 * Get path of *_data/simpe-icons.json*.
 * @param {String|undefined} rootDir Path to the root directory of the project
 * @returns {String} Path of *_data/simple-icons.json*
 */
export const getIconDataPath = (
  rootDir = getDirnameFromImportMeta(import.meta.url),
) => {
  return path.resolve(rootDir, '_data', 'simple-icons.json');
};

/**
 * Get contents of *_data/simple-icons.json*.
 * @param {String|undefined} rootDir Path to the root directory of the project
 * @returns {String} Content of *_data/simple-icons.json*
 */
export const getIconsDataString = (
  rootDir = getDirnameFromImportMeta(import.meta.url),
) => {
  return fs.readFile(getIconDataPath(rootDir), 'utf8');
};

/**
 * Get icons data as object from *_data/simple-icons.json*.
 * @param {String|undefined} rootDir Path to the root directory of the project
 * @returns {IconData[]} Icons data as array from *_data/simple-icons.json*
 */
export const getIconsData = async (
  rootDir = getDirnameFromImportMeta(import.meta.url),
) => {
  const fileContents = await getIconsDataString(rootDir);
  return JSON.parse(fileContents).icons;
};

/**
 * Replace Windows newline characters by Unix ones.
 * @param {String} text The text to replace
 * @returns {String} The text with Windows newline characters replaced by Unix ones
 */
export const normalizeNewlines = (text) => {
  return text.replace(/\r\n/g, '\n');
};

/**
 * Convert non-6-digit hex color to 6-digit with the character `#` stripped.
 * @param {String} text The color text
 * @returns {String} The color text in 6-digit hex format
 */
export const normalizeColor = (text) => {
  let color = text.replace('#', '').toUpperCase();
  if (color.length < 6) {
    color = [...color.slice(0, 3)].map((x) => x.repeat(2)).join('');
  } else if (color.length > 6) {
    color = color.slice(0, 6);
  }
  return color;
};

/**
 * Get information about third party extensions from the README table.
 * @param {String|undefined} readmePath Path to the README file
 * @returns {Promise<ThirdPartyExtension[]>} Information about third party extensions
 */
export const getThirdPartyExtensions = async (
  readmePath = path.join(
    getDirnameFromImportMeta(import.meta.url),
    'README.md',
  ),
) =>
  normalizeNewlines(await fs.readFile(readmePath, 'utf8'))
    .split('## Third-Party Extensions\n\n')[1]
    .split('\n\n')[0]
    .split('\n')
    .slice(2)
    .map((line) => {
      let [module, author] = line.split(' | ');

      // README shipped with package has not Github theme image links
      module = module.split(
        module.includes('<picture>') ? '<picture>' : '<img src="',
      )[0];
      return {
        module: {
          name: /\[(.+)\]/.exec(module)[1],
          url: /\((.+)\)/.exec(module)[1],
        },
        author: {
          name: /\[(.+)\]/.exec(author)[1],
          url: /\((.+)\)/.exec(author)[1],
        },
      };
    });

/**
 * `Intl.Collator` object ready to be used for icon titles sorting.
 * @type {Intl.Collator}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator Intl.Collator}
 **/
export const collator = new Intl.Collator('en', {
  usage: 'search',
  caseFirst: 'upper',
});
