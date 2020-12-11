const fs = require("fs");
const path = require("path");

const jsonDataObject = require('../_data/simple-icons.json');
const jsonDataFile = path.resolve(
  __dirname, '..', '_data', 'simple-icons.json');

describe('Data file must be consistent', () => {
  let jsonDataString = '';

  beforeAll(() => {
    jsonDataString = fs.readFileSync(jsonDataFile, 'utf8');
  });

  test(`Data file is prettified`, () => {
    const prettyObject = `${JSON.stringify(jsonDataObject, null, '    ')}\n`;
    expect(jsonDataString).toEqual(prettyObject);
  });
})
