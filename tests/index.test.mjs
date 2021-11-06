import simpleIconsData from '../_data/simple-icons.json';
import utils from '../scripts/utils.js';
import * as simpleIcons from '../icons.mjs';
import testIcon from './test-icon.js';

const { getIconSlug, slugToVariableName } = utils;

simpleIconsData.icons.forEach((icon) => {
  const slug = getIconSlug(icon);
  const variableName = slugToVariableName(slug);
  const subject = simpleIcons[variableName];

  testIcon(icon, subject, slug);
});

test(`Iterating over simpleIcons only exposes icons`, () => {
  const iconArray = Object.values(simpleIcons);
  for (let icon of iconArray) {
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('object');
  }
});
