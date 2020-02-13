const { icons } = require('../_data/simple-icons.json');
const simpleIcons = require('../index.js');
const { titleToFilename } = require("../scripts/utils.js");

icons.forEach(icon => {
  const subject = simpleIcons[icon.title];

  test(`${icon.title} has a "title"`, () => {
    expect(typeof subject.title).toBe('string');
  });

  test(`${icon.title} has a "hex" value`, () => {
    expect(typeof subject.hex).toBe('string');
    expect(subject.hex).toHaveLength(6);
  });

  test(`${icon.title} has a "source"`, () => {
    expect(typeof subject.source).toBe('string');
  });

  test(`${icon.title} has an "svg"`, () => {
    expect(typeof subject.svg).toBe('string');
  });

  test(`${icon.title} has a "path"`, () => {
    expect(typeof subject.path).toBe('string');
    expect(subject.path).toMatch(/^[MmZzLlHhVvCcSsQqTtAa0-9-,.\s]+$/g);
  });

  test(`${icon.title} has a "slug"`, () => {
    expect(typeof subject.slug).toBe('string');
  });

  test(`${icon.title} can be found by it's title`, () => {
    const found = simpleIcons.get(icon.title);
    expect(found).toBeDefined();
    expect(found.title).toEqual(icon.title);
  });

  test(`${icon.title} can be found by it's slug`, () => {
    const name = titleToFilename(icon.title);
    const found = simpleIcons.get(name);
    expect(found).toBeDefined();
    expect(found.title).toEqual(icon.title);
  });
});

test(`Iterating over simpleIcons only exposes icons`, () => {
  const iconArray = Object.values(simpleIcons);
  for (let icon of iconArray) {
    expect(icon).toBeDefined();
    expect(typeof icon).toBe('object');
  }
});
