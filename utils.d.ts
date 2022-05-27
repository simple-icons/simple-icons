import { SimpleIcon } from '.';

/**
 * Converts a brand title (as it is seen in simple-icons.json) into a brand
 * title in HTML/SVG friendly format.
 * @param brandTitle The title to convert
 */
export declare const titleToHtmlFriendly: (brandTitle: string) => string;

/**
 * Converts a brand title in HTML/SVG friendly format into a brand title (as
 * it is seen in simple-icons.json)
 * @param htmlFriendlyTitle The title to convert
 */
export const htmlFriendlyToTitle = (htmlFriendlyTitle: string) => string;

/**
 * Gets the SVG string from an icon object.
 */
export declare const getSvg: (icon: SimpleIcon) => string;
