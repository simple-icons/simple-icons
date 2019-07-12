const { icons } = require('../_data/simple-icons.json');
const simpleIcons = require('../index.js');

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

  test(`${icon.title} has a "name"`, () => {
    expect(typeof subject.name).toBe('string');
  });
});
