#!/usr/bin/env node
/**
 * @file
 * Minify data/simple-icons.json file.
 */
import {getIconSlug, getIconsData} from '../../sdk.mts';
import {formatIconData, writeIconsData} from '../utils.mts';

const plainIcons = await getIconsData();
const iconsWithSlugs = plainIcons.map((icon) =>
	icon.slug ? icon : {...icon, slug: getIconSlug(icon)},
);
await writeIconsData(formatIconData(iconsWithSlugs), true);
