const { icons } = require('../_data/simple-icons.json');
const simpleIcons = require('../index.js');
const { getIconSlug } = require('../scripts/utils');

icons.forEach((icon) => {
  const slug = getIconSlug(icon);

  test(`'Get' ${icon.title} by its slug`, () => {
    const found = simpleIcons.Get(slug);
    expect(found).toBeDefined();
    expect(found.title).toEqual(icon.title);
    expect(found.hex).toEqual(icon.hex);
    expect(found.source).toEqual(icon.source);
  });

  test(`'get' ${icon.title} by its slug`, () => {
    const found = simpleIcons.get(slug);
    expect(found).toBeDefined();
    expect(found.title).toEqual(icon.title);
    expect(found.hex).toEqual(icon.hex);
    expect(found.source).toEqual(icon.source);
  });
});

test(`Iterating over simpleIcons only exposes icons`, () => {
  const iconArray = Object.values(simpleIcons);
  for (let icon of iconArray) {
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('object');
  }
});
