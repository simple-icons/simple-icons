import { getIconsData, getIconSlug, slugToVariableName } from '../sdk.mjs';
import * as simpleIcons from '../index.mjs';
import { testIcon } from './test-icon.js';

for (const icon of await getIconsData()) {
  const slug = getIconSlug(icon);
  const variableName = slugToVariableName(slug);
  const subject = simpleIcons[variableName];

  testIcon(icon, subject, slug);
}
