/**
 * The license for a Simple Icon.
 *
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
