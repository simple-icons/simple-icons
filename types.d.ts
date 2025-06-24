// @ts-check
/**
 * @file Types for Simple Icons package.
 */

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

/**
 * The data for a Simple Icon as is exported by the npm package.
 */
export type SimpleIcon = {
	title: string;
	slug: string;
	svg: string;
	path: string;
	source: string;
	hex: string;
	guidelines?: string;
	license?: License;
};

/**
 * The type data item from the simple-icons.json file.
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
