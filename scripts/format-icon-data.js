/**
 * @file
 * Format _data/simple-icons.json.
 */
import {getIconsDataString} from '../sdk.mjs';
import {sortIconsCompare, writeIconsData} from './utils.js';

const iconsData = JSON.parse(await getIconsDataString());
iconsData.sort(sortIconsCompare);
writeIconsData(iconsData);
