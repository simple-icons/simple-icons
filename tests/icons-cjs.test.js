import { testIcon } from './test-icon.js';
import { getIconSlug, getIconsData } from '../scripts/utils.js';
(async () => {
  console.warn = () => {};

  const icons = await getIconsData();

  const tests = icons.map(async (icon) => {
    const slug = getIconSlug(icon);
    const { default: subject } = await import(`../icons/${slug}.js`);

    testIcon(icon, subject, slug);
  });

  await Promise.all(tests);
})();
