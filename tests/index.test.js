// The index.mjs file is generated on build before running tests
// @ts-ignore
import * as simpleIcons from '../index.mjs';
import {getIconSlug, getIconsData, slugToVariableName} from '../sdk.mjs';
import {testIcon} from './test-icon.js';

for (const icon of await getIconsData()) {
  const slug = getIconSlug(icon);
  const variableName = slugToVariableName(slug);
  const subject = simpleIcons[variableName];

  testIcon(icon, subject, slug);
}
