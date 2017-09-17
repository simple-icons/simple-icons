const dataFile = './_data/simple-icons.json';
const data = require(dataFile);
const fs = require('fs');

let Icons = {};

data.icons.forEach(i => {
  i.name = i.title.toLowerCase().replace(/[^a-z0-9]/gim, '');
  i.svg = fs.readFileSync(`./icons/${i.name}.svg`, 'utf8');
  Icons[i.name] = i
});

module.exports = Icons;
