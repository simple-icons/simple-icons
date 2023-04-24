/**
 * @fileoverview
 * Types for Simple Icons SDK.
 */

/**
 * The data for a third-party extension.
 *
 * Includes the module and author of the extension,
 * both including a name and URL.
 *
 * @see {@link https://github.com/simple-icons/simple-icons#third-party-extensions Third-Party Extensions}
 */
export type ThirdPartyExtension = {
  module: ThirdPartyExtensionSubject;
  author: ThirdPartyExtensionSubject;
};

type ThirdPartyExtensionSubject = {
  name: string;
  url: string;
};

/**
 * The license for a Simple Icon.
 *
 * Corresponds to the `license` property in the *_data/simple-icons.json* file.
 *
 * @see {@link https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md#optional-data Optional Data}
 */
export type License = SPDXLicense | CustomLicense;

type SPDXLicense = {
  type: string;
  url?: string;
};

type CustomLicense = {
  type: 'custom';
  url: string;
};

/**
 * The aliases for a Simple Icon.
 *
 * Corresponds to the `aliases` property in the *_data/simple-icons.json* file.
 *
 * @see {@link https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md#aliases Aliases}
 */
export type Aliases = {
  aka?: string[];
  dup?: DuplicateAlias[];
  loc?: { [key: string]: string };
};

type DuplicateAlias = {
  title: string;
  hex?: string;
  guidelines?: string;
};

/**
 * The data for a Simple Icon.
 *
 * Corresponds to the data stored for each icon in the *_data/simple-icons.json* file.
 *
 * @see {@link https://github.com/mondeja/simple-icons/blob/utils-entrypoint/CONTRIBUTING.md#7-update-the-json-data-for-simpleiconsorg Update the JSON Data for SimpleIcons.org}
 */
export type IconData = {
  title: string;
  hex: string;
  source: string;
  slug?: string;
  guidelines?: string;
  license?: License;
  aliases?: Aliases;
};

export const URL_REGEX: RegExp;

export function getDirnameFromImportMeta(importMetaUrl: string): string;
export function getIconSlug(icon: IconData): string;
export function svgToPath(svg: string): string;
export function titleToSlug(title: string): string;
export function slugToVariableName(slug: string): string;
export function titleToHtmlFriendly(brandTitle: string): string;
export function htmlFriendlyToTitle(htmlFriendlyTitle: string): string;
export function getIconDataPath(rootDir?: string): string;
export function getIconsDataString(rootDir?: string): string;
export function getIconsData(rootDir?: string): IconData[];
export function normalizeNewlines(text: string): string;
export function normalizeColor(text: string): string;
export function getThirdPartyExtensions(
  readmePath?: string,
): Promise<ThirdPartyExtension[]>;
export const collator: Intl.Collator;
