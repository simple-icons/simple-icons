const { icons } = require('../_data/simple-icons.json');
const simpleIcons = require('../index.js');
const { getIconSlug } = require('../scripts/utils.cjs');
const { test } = require('uvu');
const assert = require('uvu/assert');

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
