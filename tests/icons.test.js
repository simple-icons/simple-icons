const path = require('path');
const { icons } = require('../_data/simple-icons.json');
const { getIconSlug } = require('../scripts/utils.js');
const testIcon = require('./test-icon.js');

icons.forEach((icon) => {
  const slug = getIconSlug(icon);
  const subject = require(`../icons/${slug}.js`);

  testIcon(icon, subject, slug);
});
