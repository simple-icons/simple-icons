import { getIconsData, getIconSlug, slugToVariableName } from '../sdk.mjs';
import * as simpleIcons from '../index.mjs';
import { testIcon } from './test-icon.js';

(async () => {
  const icons = await getIconsData();

  icons.map((icon) => {
    const slug = getIconSlug(icon);
    const variableName = slugToVariableName(slug);
    const subject = simpleIcons[variableName];

    testIcon(icon, subject, slug);
  });
})();
