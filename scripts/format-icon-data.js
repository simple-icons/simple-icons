#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Format data/simple-icons.json.
 */
import {formatIconData, getRawIconsData, writeIconsData} from './utils.js';

const icons = await getRawIconsData();
writeIconsData(formatIconData(icons));
