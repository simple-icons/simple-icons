/**
 * @fileoverview
 * Some common utilities for scripts.
 */

import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

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
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/&/g, 'and')
    .replace(/đ/g, 'd')
    .replace(/ħ/g, 'h')
    .replace(/ı/g, 'i')
    .replace(/ĸ/g, 'k')
    .replace(/ŀ/g, 'l')
    .replace(/ł/g, 'l')
    .replace(/ß/g, 'ss')
    .replace(/ŧ/g, 't')
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');

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
 * Get contents of _data/simple-icons.json.
 */
export const getIconDataString = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, '..');
  const iconDataPath = path.resolve(rootDir, '_data', 'simple-icons.json');
  return fs.readFile(iconDataPath, 'utf8');
};

/**
 * Get icon data as object from _data/simple-icons.json.
 */
export const getIconData = async () => {
  const fileContents = await getIconDataString();
  return JSON.parse(fileContents).icons;
};
