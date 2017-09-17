const dataFile = './_data/simple-icons.json';
const data = require(dataFile);
const fs = require('fs');

const icons = {};

data.icons.forEach(i => {
  const filename = i.title.toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[ .\-!’]/g, '');
  i.svg = fs.readFileSync(`${__dirname}/icons/${filename}.svg`, 'utf8');
  icons[i.title] = i
});

module.exports = icons;
