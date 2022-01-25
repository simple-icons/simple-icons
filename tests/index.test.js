import simpleIcons from '../index.js';
import { getIconSlug, getIconsData } from '../scripts/utils.js';
import { test } from 'mocha';
import { strict as assert } from 'node:assert';

(async () => {
  const icons = await getIconsData();

  icons.forEach((icon) => {
    const slug = getIconSlug(icon);

    test(`'Get' ${icon.title} by its slug`, () => {
      const found = simpleIcons.Get(slug);
      assert.ok(found);
      assert.equal(found.title, icon.title);
      assert.equal(found.hex, icon.hex);
      assert.equal(found.source, icon.source);
    });
  });

  test(`Iterating over simpleIcons only exposes icons`, () => {
    const iconArray = Object.values(simpleIcons);
    for (let icon of iconArray) {
      assert.ok(icon);
      assert.equal(typeof icon, 'object');
    }
  });
})();
