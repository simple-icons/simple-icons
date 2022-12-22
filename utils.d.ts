type ThirdPartyExtensionSubject = {
  name: string;
  url: string;
};

export type ThirdPartyExtension = {
  module: ThirdPartyExtensionSubject;
  author: ThirdPartyExtensionSubject;
};

export type IconData = {
  title: string;
  hex: string;
  source: string;
  slug: string | undefined;
  guidelines: string | undefined;
  license: string | any | undefined;
  aliases: any | undefined;
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
