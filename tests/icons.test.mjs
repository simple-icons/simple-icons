import fs from 'fs';
import path from 'path';
import simpleIconsData from '../_data/simple-icons.json';
import utils from '../scripts/utils.js';
import * as simpleIcons from '../icons.mjs';
import testIcon from './test-icon.js';

const { getIconSlug, slugToVariableName } = utils;

const iconsDir = path.resolve(process.cwd(), 'icons');

simpleIconsData.icons.forEach((icon) => {
  const slug = getIconSlug(icon);
  const variableName = slugToVariableName(slug);
  const subject = simpleIcons[variableName];

  testIcon(icon, subject, slug);

  const svgPath = path.resolve(iconsDir, `${slug}.svg`);

  test(`${icon.title} has a valid svg value`, () => {
    const svgFileContents = fs
      .readFileSync(svgPath, 'utf8')
      .replace(/\r?\n/, '');

    expect(subject.svg.substring(subject.svg.indexOf('<title>'))).toEqual(
      svgFileContents.substring(svgFileContents.indexOf('<title>')),
    );
  });
});
