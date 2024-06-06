#!/usr/bin/env node
/**
 * @fileoverview
 * Replaces the SVG count milestone "Over <NUMBER> Free SVG icons..." located
 * at README every time the number of current icons is more than `updateRange`
 * more than the previous milestone.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {getDirnameFromImportMeta, getIconsData} from '../../sdk.mjs';

const regexMatcher = /Over\s(\d+)\s/;
const updateRange = 100;

const __dirname = getDirnameFromImportMeta(import.meta.url);
const rootDirectory = path.resolve(__dirname, '..', '..');
const readmeFile = path.resolve(rootDirectory, 'README.md');

const readmeContent = await fs.readFile(readmeFile, 'utf8');

try {
  /** @type {RegExpExecArray | null} */
  const match = regexMatcher.exec(readmeContent);
  if (match === null) {
    console.error(
      'Failed to obtain number of SVG icons of current milestone in README:',
      'No match found',
    );
    process.exit(1);
  } else {
    const overNIconsInReadme = Number.parseInt(match[1], 10);
    const iconsData = await getIconsData();
    const nIcons = iconsData.length;
    const newNIcons = overNIconsInReadme + updateRange;

    if (nIcons > newNIcons) {
      const newContent = readmeContent.replace(
        regexMatcher,
        `Over ${newNIcons} `,
      );
      await fs.writeFile(readmeFile, newContent);
    }
  }
} catch (error) {
  console.error(
    'Failed to update number of SVG icons of current milestone in README:',
    // TODO: type error
    // @ts-ignore
    error,
  );
  process.exit(1);
}
