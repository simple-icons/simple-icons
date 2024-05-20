/**
 * @fileoverview
 * Types for Simple Icons SDK.
 */

import type {CustomLicense, SPDXLicense} from './types';

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
 * The aliases for a Simple Icon.
 *
 * Corresponds to the `aliases` property in the *_data/simple-icons.json* file.
 *
 * @see {@link https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md#aliases Aliases}
 */
export type Aliases = {
  aka?: string[];
  dup?: DuplicateAlias[];
  loc?: Record<string, string>;
};

type DuplicateAlias = {
  title: string;
  hex?: string;
  guidelines?: string;
  loc?: Record<string, string>;
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
  license?: Omit<SPDXLicense, 'url'> | CustomLicense;
  aliases?: Aliases;
};

/* The next code is autogenerated from sdk.mjs */
/* eslint-disable */

export const SVG_PATH_REGEX: RegExp;
export function getDirnameFromImportMeta(importMetaUrl: string): string;
export function urlRegex(jsonschemaPath?: string): Promise<RegExp>;
export function getIconSlug(icon: IconData): string;
export function svgToPath(svg: string): string;
export function titleToSlug(title: string): string;
export function slugToVariableName(slug: string): string;
export function titleToHtmlFriendly(brandTitle: string): string;
export function htmlFriendlyToTitle(htmlFriendlyTitle: string): string;
export function getIconDataPath(rootDir?: string): string;
export function getIconsDataString(rootDir?: string): Promise<string>;
export function getIconsData(rootDir?: string): Promise<IconData[]>;
export function normalizeNewlines(text: string): string;
export function normalizeColor(text: string): string;
export function getThirdPartyExtensions(
  readmePath?: string,
): Promise<ThirdPartyExtension[]>;
export function getThirdPartyLibraries(
  readmePath?: string,
): Promise<ThirdPartyExtension[]>;
export const collator: Intl.Collator;
