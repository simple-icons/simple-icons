import simpleIcons from '../index.js';
import { getIconSlug, getIconsData, titleToSlug } from '../scripts/utils.js';
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

    if (icon.slug) {
      // if an icon data has a slug, it must be different to the
      // slug inferred from the title, which prevents adding
      // unnecessary slugs to icons data
      test(`'${icon.title}' slug must be necessary`, () => {
        assert.notEqual(titleToSlug(icon.title), icon.slug);
      });
    }
  });

  test(`Iterating over simpleIcons only exposes icons`, () => {
    const iconArray = Object.values(simpleIcons);
    for (let icon of iconArray) {
      assert.ok(icon);
      assert.equal(typeof icon, 'object');
    }
  });
})();
