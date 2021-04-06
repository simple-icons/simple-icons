const { icons } = require('../_data/simple-icons.json');
const simpleIcons = require('../index.js');
const { getIconSlug } = require("../scripts/utils.js");

icons.forEach(icon => {
  const name = icon.slug || icon.title;
  const subject = simpleIcons[name];

  test(`${icon.title} has the correct "title"`, () => {
    expect(typeof subject.title).toBe('string');
    expect(subject.title).toEqual(icon.title);
  });

  test(`${icon.title} has the correct "slug"`, () => {
    expect(typeof subject.slug).toBe('string');
    expect(subject.slug).toEqual(getIconSlug(icon));
  });

  test(`${icon.title} has the correct "hex" value`, () => {
    expect(typeof subject.hex).toBe('string');
    expect(subject.hex).toEqual(icon.hex);
  });

  test(`${icon.title} has the correct "source"`, () => {
    expect(typeof subject.source).toBe('string');
    expect(subject.source).toEqual(icon.source);
  });

  test(`${icon.title} has an "svg" value`, () => {
    expect(typeof subject.svg).toBe('string');
  });

  test(`${icon.title} has a valid "path" value`, () => {
    expect(typeof subject.path).toBe('string');
    expect(subject.path).toMatch(/^[MmZzLlHhVvCcSsQqTtAaEe0-9-,.\s]+$/g);
  });

  test(`${icon.title} has ${icon.guidelines ? "the correct" : "no"} "guidelines"`, () => {
    if (icon.guidelines) {
      expect(typeof subject.guidelines).toBe('string');
      expect(subject.guidelines).toEqual(icon.guidelines);
    } else {
      expect(subject.guidelines).toBeUndefined();
    }
  });

  test(`${icon.title} has ${icon.license ? "the correct" : "no"} "license"`, () => {
    if (icon.license) {
      expect(typeof subject.license).toBe('object');
      expect(subject.license).toHaveProperty('type', icon.license.type);
      if (icon.license.type === "custom") {
        expect(subject.license).toHaveProperty('url', icon.license.url);
      } else {
        expect(typeof subject.license.url).toBe('string');
      }
    } else {
      expect(subject.license).toBeUndefined();
    }
  });

  // NOTE: Icons with custom slugs have a custom slug because their title is
  // already taken, so they should not be findable by their title.
  if (icon.slug === undefined) {
    test(`${icon.title} can be found by it's title`, () => {
      const found = simpleIcons.get(icon.title);
      expect(found).toBeDefined();
      expect(found.title).toEqual(icon.title);
      expect(found.hex).toEqual(icon.hex);
      expect(found.source).toEqual(icon.source);
    });
  }

  test(`${icon.title} can be found by it's slug`, () => {
    const name = getIconSlug(icon);
    const found = simpleIcons.get(name);
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
