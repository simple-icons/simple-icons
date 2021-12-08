#!/usr/bin/env node
/**
 * @fileoverview
 * Replaces the SVG count milestone "Over <NUMBER> Free SVG icons..." located
 * at README every time the number of current icons is more than `updateRange`
 * more than the previous milestone.
 */

const fs = require('fs');
const path = require('path');

const regexMatcher = /Over\s(\d+)\s/;
const updateRange = 100;

const rootDir = path.resolve(__dirname, '..', '..');
const dataFile = path.resolve(rootDir, '_data', 'simple-icons.json');
const readmeFile = path.resolve(rootDir, 'README.md');
const readmeContent = fs.readFileSync(readmeFile, 'utf-8');

let overNIconsInReadme;
try {
  overNIconsInReadme = parseInt(regexMatcher.exec(readmeContent)[1]);
} catch (err) {
  console.error(
    'Failed to obtain number of SVG icons of current milestone in README:',
    err,
  );
  process.exit(1);
}

const nIcons = require(dataFile).icons.length,
  newNIcons = overNIconsInReadme + updateRange;
if (nIcons <= newNIcons) {
  process.exit(0);
}

const newContent = readmeContent.replace(regexMatcher, `Over ${newNIcons} `);
fs.writeFileSync(readmeFile, newContent);
