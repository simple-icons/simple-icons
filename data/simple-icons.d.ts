// @ts-check
/**
 * @file Type definitions for icons JSON data.
 */

/**
 * The data for a Simple Icon.
 */
export type IconData = {
	title: string;
	hex: string;
	source: string;
	slug: string;
	guidelines?: string;
	license?: SPDXLicense | CustomLicense;
	aliases?: Aliases;
};

/**
 * Raw icon data as it is defined in the data/simple-icons.json file before being
 * processed for publishing.
 *
 * The properties slug and license are added during the build process.
 */
export type RawIconData = Omit<IconData, 'slug' | 'license'> & {
	slug?: string;
	license?: Omit<SPDXLicense, 'url'> | CustomLicense;
};

/**
 * The aliases for a Simple Icon.
 *
 * Corresponds to the `aliases` property in the *data/simple-icons.json* file.
 * @see {@link https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md#aliases Aliases}
 */
export type Aliases = {
	aka?: string[];
	dup?: DuplicateAlias[];
	loc?: Record<string, string>;
	old?: string[];
};

export type DuplicateAlias = {
	title: string;
	hex?: string;
	guidelines?: string;
	loc?: Record<string, string>;
};

/**
 * The license for a Simple Icon.
 * @see {@link https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md#optional-data Optional Data}
 */
export type License = SPDXLicense | CustomLicense;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type SPDXLicense = {
	type: string;
	url: string;
};

export type CustomLicense = {
	type: 'custom';
	url: string;
};

declare const icons: IconData[];

export default icons;
export = icons;
