import {strict as assert} from 'node:assert';
import {test} from 'mocha';
import simpleIcons from '../index.js';
import {getIconSlug, getIconsData, titleToSlug} from '../scripts/utils.js';

(async () => {
  const icons = await getIconsData();

  for (const icon of icons) {
    const slug = getIconSlug(icon);

    test(`'Get' ${icon.title} by its slug`, () => {
      // eslint-disable-next-line new-cap
      const found = simpleIcons.Get(slug);
      assert.ok(found);
      assert.equal(found.title, icon.title);
      assert.equal(found.hex, icon.hex);
      assert.equal(found.source, icon.source);
    });

    if (icon.slug) {
      // If an icon data has a slug, it must be different to the
      // slug inferred from the title, which prevents adding
      // unnecessary slugs to icons data
      test(`'${icon.title}' slug must be necessary`, () => {
        assert.notEqual(titleToSlug(icon.title), icon.slug);
      });
    }
  }

  test(`Iterating over simpleIcons only exposes icons`, () => {
    const iconArray = Object.values(simpleIcons);
    for (const icon of iconArray) {
      assert.ok(icon);
      assert.equal(typeof icon, 'object');
    }
  });
})();
