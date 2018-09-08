const { icons } = require('../_data/simple-icons.json');
const { titleToFilename } = require('../scripts/utils.js');

test('can import index.js', () => {
  expect(() => require('../index.js')).not.toThrow();
});

icons.forEach(icon => {
  test(`can import ${icon.title}`, () => {
    let filename = titleToFilename(icon.title);
    expect(() => require(`../icons/${filename}.js`)).not.toThrow();
  });
});
