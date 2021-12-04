import {
  getIconData,
  getIconSlug,
  slugToVariableName,
} from '../scripts/utils.js';
import * as simpleIcons from '../icons.mjs';
import { testIcon } from './test-icon.js';
import { exec } from 'uvu';

(async () => {
  const icons = await getIconData();

  icons.map((icon) => {
    const slug = getIconSlug(icon);
    const variableName = slugToVariableName(slug);
    const subject = simpleIcons[variableName];

    testIcon(icon, subject, slug);
  });

  exec();
})();
