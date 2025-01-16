/**
 * @file
 * Format _data/simple-icons.json.
 */
import {getIconsData} from '../sdk.mjs';
import {sortIconsCompare, writeIconsData} from './utils.js';

const iconsData = await getIconsData();
iconsData.sort(sortIconsCompare);
writeIconsData(iconsData);
