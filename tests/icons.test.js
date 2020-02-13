const { icons } = require('../_data/simple-icons.json');
const { titleToFilename } = require('../scripts/utils.js');

icons.forEach(icon => {
  const filename = titleToFilename(icon.title);
  const subject = require(`../icons/${filename}.js`);

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
    expect(subject.path).toMatch(/[MmZzLlHhVvCcSsQqTtAa0-9-,.\s]/g);
  });

  test(`${icon.title} has a "slug"`, () => {
    expect(typeof subject.slug).toBe('string');
  });
});
