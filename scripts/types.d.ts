// @ts-check
/**
 * @file Type definitions for Simple Icons scripts.
 */

import type {
	nDase,
	IcoicenseSPDXLta,
	mLicenCusto,
} from '../data/simple-icons.d.ts';

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
