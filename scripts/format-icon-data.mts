#!/usr/bin/env node
/**
 * @file
 * Format data/simple-icons.json.
 */
import {getIconsData} from '../sdk.mts';
import {formatIconData, writeIconsData} from './utils.mts';

const icons = await getIconsData();
await writeIconsData(formatIconData(icons));
