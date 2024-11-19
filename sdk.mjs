/**
 * @file
 * Simple Icons SDK.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/**
 * @typedef {import("./sdk.d.ts").ThirdPartyExtension} ThirdPartyExtension
 * @typedef {import("./sdk.d.ts").IconData} IconData
 */

/** @type {{ [key: string]: string }} */
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

const TITLE_TO_SLUG_CHARS_REGEX = new RegExp(
  `[${Object.keys(TITLE_TO_SLUG_REPLACEMENTS).join('')}]`,
  'g',
);

const TITLE_TO_SLUG_RANGE_REGEX = /[^a-z\d]/g;

/**
 * Regex to validate SVG paths.
 */
export const SVG_PATH_REGEX = /^m[-mzlhvcsqtae\d,. ]+$/i;

/**
 * Get the directory name where this file is located from `import.meta.url`,
 * equivalent to the `__dirname` global variable in CommonJS.
 * @param {string} importMetaUrl Relative `import.meta.url` value of the caller.
 * @returns {string} Directory name in which this file is located.
 */
export const getDirnameFromImportMeta = (importMetaUrl) =>
  path.dirname(fileURLToPath(importMetaUrl));

/**
 * Build a regex to validate HTTPs URLs.
 * @param {string} jsonschemaPath Path to the *.jsonschema.json* file.
 * @returns {Promise<RegExp>} Regex to validate HTTPs URLs.
 */
export const urlRegex = async (
  jsonschemaPath = path.join(
    getDirnameFromImportMeta(import.meta.url),
    '.jsonschema.json',
  ),
) => {
  return new RegExp(
    JSON.parse(
      await fs.readFile(jsonschemaPath, 'utf8'),
    ).definitions.url.pattern,
  );
};

/**
 * Get the slug/filename for an icon.
 * @param {IconData} icon The icon data as it appears in *_data/simple-icons.json*.
 * @returns {string} The slug/filename for the icon.
 */
export const getIconSlug = (icon) => icon.slug || titleToSlug(icon.title);

/**
 * Extract the path from an icon SVG content.
 * @param {string} svg The icon SVG content.
 * @returns {string} The path from the icon SVG content.
 */
export const svgToPath = (svg) => svg.split('"', 8)[7];

/**
 * Converts a brand title into a slug/filename.
 * @param {string} title The title to convert.
 * @returns {string} The slug/filename for the title.
 */
export const titleToSlug = (title) =>
  title
    .toLowerCase()
    .replaceAll(
      TITLE_TO_SLUG_CHARS_REGEX,
      (char) => TITLE_TO_SLUG_REPLACEMENTS[char],
    )
    .normalize('NFD')
    .replaceAll(TITLE_TO_SLUG_RANGE_REGEX, '');

/**
 * Converts a slug into a variable name that can be exported.
 * @param {string} slug The slug to convert.
 * @returns {string} The variable name for the slug.
 */
export const slugToVariableName = (slug) => {
  const slugFirstLetter = slug[0].toUpperCase();
  return `si${slugFirstLetter}${slug.slice(1)}`;
};

/**
 * Converts a brand title as defined in *_data/simple-icons.json* into a brand
 * title in HTML/SVG friendly format.
 * @param {string} brandTitle The title to convert.
 * @returns {string} The brand title in HTML/SVG friendly format.
 */
export const titleToHtmlFriendly = (brandTitle) =>
  brandTitle
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll(/./g, (char) => {
      /** @type {number} */
      // @ts-ignore
      const charCode = char.codePointAt(0);
      return charCode > 127 ? `&#${charCode};` : char;
    });

/**
 * Converts a brand title in HTML/SVG friendly format into a brand title (as
 * it is seen in *_data/simple-icons.json*).
 * @param {string} htmlFriendlyTitle The title to convert.
 * @returns {string} The brand title in HTML/SVG friendly format.
 */
export const htmlFriendlyToTitle = (htmlFriendlyTitle) =>
  htmlFriendlyTitle
    .replaceAll(/&#(\d+);/g, (_, number_) =>
      String.fromCodePoint(Number.parseInt(number_, 10)),
    )
    .replaceAll(
      /&(quot|amp|lt|gt);/g,
      /**
       * Replace HTML entity references with their respective decoded characters.
       * @param {string} _ Full match.
       * @param {'quot' | 'amp' | 'lt' | 'gt'} reference Reference to replace.
       * @returns {string} Replacement for the reference.
       */
      (_, reference) => ({quot: '"', amp: '&', lt: '<', gt: '>'})[reference],
    );

/**
 * Get path of *_data/simple-icons.json*.
 * @param {string} rootDirectory Path to the root directory of the project.
 * @returns {string} Path of *_data/simple-icons.json*.
 */
export const getIconDataPath = (
  rootDirectory = getDirnameFromImportMeta(import.meta.url),
) => {
  return path.resolve(rootDirectory, '_data', 'simple-icons.json');
};

/**
 * Get contents of *_data/simple-icons.json*.
 * @param {string} rootDirectory Path to the root directory of the project.
 * @returns {Promise<string>} Content of *_data/simple-icons.json*.
 */
export const getIconsDataString = (
  rootDirectory = getDirnameFromImportMeta(import.meta.url),
) => {
  return fs.readFile(getIconDataPath(rootDirectory), 'utf8');
};

/**
 * Get icons data as object from *_data/simple-icons.json*.
 * @param {string} rootDirectory Path to the root directory of the project.
 * @returns {Promise<IconData[]>} Icons data as array from *_data/simple-icons.json*.
 */
export const getIconsData = async (
  rootDirectory = getDirnameFromImportMeta(import.meta.url),
) => {
  const fileContents = await getIconsDataString(rootDirectory);
  return JSON.parse(fileContents).icons;
};

/**
 * Replace Windows newline characters by Unix ones.
 * @param {string} text The text to replace.
 * @returns {string} The text with Windows newline characters replaced by Unix ones.
 */
export const normalizeNewlines = (text) => {
  return text.replaceAll('\r\n', '\n');
};

/**
 * Convert non-6-digit hex color to 6-digit with the character `#` stripped.
 * @param {string} text The color text.
 * @returns {string} The color text in 6-digit hex format.
 */
export const normalizeColor = (text) => {
  let color = text.replace('#', '').toUpperCase();
  if (color.length < 6) {
    // eslint-disable-next-line unicorn/no-useless-spread
    color = [...color.slice(0, 3)].map((x) => x.repeat(2)).join('');
  } else if (color.length > 6) {
    color = color.slice(0, 6);
  }

  return color;
};

/**
 * Get information about third party extensions from the README table.
 * @param {string} readmePath Path to the README file.
 * @returns {Promise<ThirdPartyExtension[]>} Information about third party extensions.
 */
export const getThirdPartyExtensions = async (
  readmePath = path.join(
    getDirnameFromImportMeta(import.meta.url),
    'README.md',
  ),
) =>
  normalizeNewlines(await fs.readFile(readmePath, 'utf8'))
    .split('## Third-Party Extensions')[1]
    .split('|\n\n')[0]
    .split('|\n|')
    .slice(2)
    .map((line) => {
      const [module_, author] = line.split(' | ');
      const module = module_.split('<img src="')[0];
      const moduleName = /\[(.+)]/.exec(module)?.[1];
      if (moduleName === undefined) {
        throw new Error(`Module name improperly parsed from line: ${line}`);
      }

      const moduleUrl = /\((.+)\)/.exec(module)?.[1];
      if (moduleUrl === undefined) {
        throw new Error(`Module URL improperly parsed from line: ${line}`);
      }

      const authorName = /\[(.+)]/.exec(author)?.[1];
      if (authorName === undefined) {
        throw new Error(`Author improperly parsed from line: ${line}`);
      }

      const authorUrl = /\((.+)\)/.exec(author)?.[1];
      if (authorUrl === undefined) {
        throw new Error(`Author URL improperly parsed from line: ${line}`);
      }

      return {
        module: {
          name: moduleName,
          url: moduleUrl,
        },
        author: {
          name: authorName,
          url: authorUrl,
        },
      };
    });

/**
 * Get information about third party libraries from the README table.
 * @param {string} readmePath Path to the README file.
 * @returns {Promise<ThirdPartyExtension[]>} Information about third party libraries.
 */
export const getThirdPartyLibraries = async (
  readmePath = path.join(
    getDirnameFromImportMeta(import.meta.url),
    'README.md',
  ),
) =>
  normalizeNewlines(await fs.readFile(readmePath, 'utf8'))
    .split('## Third-Party Libraries')[1]
    .split('|\n\n')[0]
    .split('|\n|')
    .slice(2)
    .map((line) => {
      let [module, author] = line.split(' | ');
      module = module.split('<img src="')[0];
      const moduleName = /\[(.+)]/.exec(module)?.[1];
      if (moduleName === undefined) {
        throw new Error(`Module name improperly parsed from line: ${line}`);
      }

      const moduleUrl = /\((.+)\)/.exec(module)?.[1];
      if (moduleUrl === undefined) {
        throw new Error(`Module URL improperly parsed from line: ${line}`);
      }

      const authorName = /\[(.+)]/.exec(author)?.[1];
      if (authorName === undefined) {
        throw new Error(`Author improperly parsed from line: ${line}`);
      }

      const authorUrl = /\((.+)\)/.exec(author)?.[1];
      if (authorUrl === undefined) {
        throw new Error(`Author URL improperly parsed from line: ${line}`);
      }

      return {
        module: {
          name: moduleName,
          url: moduleUrl,
        },
        author: {
          name: authorName,
          url: authorUrl,
        },
      };
    });

/**
 * `Intl.Collator` object ready to be used for icon titles sorting.
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator Intl.Collator}
 */
export const collator = new Intl.Collator('en', {
  usage: 'search',
  caseFirst: 'upper',
});
