import simpleIconsData from '../_data/simple-icons.json';
import utils from '../scripts/utils.cjs';
import * as simpleIcons from '../icons.mjs';
import testIcon from './test-icon.js';

const { getIconSlug, slugToVariableName } = utils;

simpleIconsData.icons.forEach((icon) => {
  const slug = getIconSlug(icon);
  const variableName = slugToVariableName(slug);
  const subject = simpleIcons[variableName];

  testIcon(icon, subject, slug);
});
