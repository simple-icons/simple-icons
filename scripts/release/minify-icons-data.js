/**
 * @file
 * Minify _data/simple-icons.json file.
 */
import {getIconsData} from '../../sdk.mjs';
import {writeIconsData} from '../utils.js';

const icons = await getIconsData();
await writeIconsData({icons}, undefined, true);
