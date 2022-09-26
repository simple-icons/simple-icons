import {
  getIconsData,
  getIconSlug,
  slugToVariableName,
} from '../scripts/utils.js';
import * as simpleIcons from '../icons.mjs';
import {testIcon} from './test-icon.js';

(async () => {
  const icons = await getIconsData();

  for (const icon of icons) {
    const slug = getIconSlug(icon);
    const variableName = slugToVariableName(slug);
    const subject = simpleIcons[variableName];

    testIcon(icon, subject, slug);
  }
})();
