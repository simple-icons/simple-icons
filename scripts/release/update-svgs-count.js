#!/usr/bin/env node
/**
 * @fileoverview
 * Replaces the SVG count milestone "Over <NUMBER> Free SVG icons..." located
 * at README every time the number of current icons is more than `updateRange`
 * more than the previous milestone.
 */
import {promises as fs} from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import {getDirnameFromImportMeta, getIconsData} from '../utils.js';

const regexMatcher = /Over\s(\d+)\s/;
const updateRange = 100;

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..', '..');
const readmeFile = path.resolve(rootDir, 'README.md');

(async () => {
  const readmeContent = await fs.readFile(readmeFile, 'utf8');

  let overNIconsInReadme;
  try {
    overNIconsInReadme = Number.parseInt(
      regexMatcher.exec(readmeContent)[1],
      10,
    );
  } catch (error) {
    console.error(
      'Failed to obtain number of SVG icons of current milestone in README:',
      error,
    );
    process.exit(1);
  }

  const iconsData = await getIconsData();
  const nIcons = iconsData.length;
  const newNIcons = overNIconsInReadme + updateRange;

  if (nIcons <= newNIcons) {
    process.exit(0);
  }

  const newContent = readmeContent.replace(regexMatcher, `Over ${newNIcons} `);
  await fs.writeFile(readmeFile, newContent);
})();
