import simpleIcons from '../index.js';
import { getIconSlug, getIconData } from '../scripts/utils.js';
import { test, exec } from 'uvu';
import * as assert from 'uvu/assert';

(async () => {
  const icons = await getIconData();

  icons.forEach((icon) => {
    const slug = getIconSlug(icon);

    test(`'Get' ${icon.title} by its slug`, () => {
      const found = simpleIcons.Get(slug);
      assert.ok(found);
      assert.is(found.title, icon.title);
      assert.is(found.hex, icon.hex);
      assert.is(found.source, icon.source);
    });
  });

  test(`Iterating over simpleIcons only exposes icons`, () => {
    const iconArray = Object.values(simpleIcons);
    for (let icon of iconArray) {
      assert.ok(icon);
      assert.type(icon, 'object');
    }
  });

  test.run();

  exec();
})();
