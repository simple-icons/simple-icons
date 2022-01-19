/**
 * @fileoverview
 * Some common utilities for scripts.
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';

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
  // Special characters such as '+' and '.' must be escaped
  Object.keys(TITLE_TO_SLUG_REPLACEMENTS)
    .map((char) => {
      return ['+', '.'].includes(char) ? `\\${char}` : char;
    })
    .join('|'),
  'g',
);

const TITLE_TO_SLUG_RANGE_REGEX = /[^a-z0-9]/g;

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
      (_, ref) => ({ quot: '"', amp: '&', lt: '<', gt: '>' }[ref]),
    );

/**
 * Get contents of _data/simple-icons.json.
 */
export const getIconsDataString = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, '..');
  const iconDataPath = path.resolve(rootDir, '_data', 'simple-icons.json');
  return fs.readFile(iconDataPath, 'utf8');
};

/**
 * Get icon data as object from _data/simple-icons.json.
 */
export const getIconsData = async () => {
  const fileContents = await getIconsDataString();
  return JSON.parse(fileContents).icons;
};

/**
 * Get the directory name from import.meta.url.
 * @param {String} importMetaUrl import.meta.url
 */
export const getDirnameFromImportMeta = (importMetaUrl) =>
  path.dirname(fileURLToPath(importMetaUrl));
