import { exec } from 'uvu';
import { testIcon } from './test-icon.js';
import { getIconSlug, getIconData } from '../scripts/utils.js';
(async () => {
  console.warn = () => {};

  const icons = await getIconData();

  const tests = icons.map(async (icon) => {
    const slug = getIconSlug(icon);
    const { default: subject } = await import(`../icons/${slug}.js`);

    testIcon(icon, subject, slug);
  });

  await Promise.all(tests);

  exec();
})();
