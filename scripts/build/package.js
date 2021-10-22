#!/usr/bin/env node
/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable. The static .js files go in icons/{filename}.js. Also
 * generates an index.js that exports all icons by title, but is not
 * tree-shakeable
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const minify = require('uglify-js').minify;

const UTF8 = 'utf8';

const rootDir = path.resolve(__dirname, '..', '..');
const dataFile = path.resolve(rootDir, '_data', 'simple-icons.json');
const indexFile = path.resolve(rootDir, 'index.js');
const iconsDir = path.resolve(rootDir, 'icons');

const templatesDir = path.resolve(__dirname, 'templates');
const indexTemplateFile = path.resolve(templatesDir, 'index.js');
const iconObjectTemplateFile = path.resolve(templatesDir, 'icon-object.js');

const indexTemplate = fs.readFileSync(indexTemplateFile, UTF8);
const iconObjectTemplate = fs.readFileSync(iconObjectTemplateFile, UTF8);

const data = require(dataFile);
const { getIconSlug } = require('../utils.js');

// Local helper functions
const escape = (value) => {
  return value.replace(/(?<!\\)'/g, "\\'");
};
const iconToKeyValue = (icon) => {
  return `'${icon.slug}':${iconToObject(icon)}`;
};
const licenseToObject = (license) => {
  if (license === undefined) {
    return;
  }

  if (license.url === undefined) {
    license.url = `https://spdx.org/licenses/${license.type}`;
  }
  return license;
};
const iconToObject = (icon) => {
  return util.format(
    iconObjectTemplate,
    escape(icon.title),
    escape(icon.slug),
    escape(icon.svg),
    escape(icon.source),
    escape(icon.hex),
    icon.guidelines ? `'${escape(icon.guidelines)}'` : undefined,
    licenseToObject(icon.license),
  );
};
const minifyAndWrite = (filepath, rawJavaScript) => {
  const { error, code } = minify(rawJavaScript);
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    fs.writeFileSync(filepath, code);
  }
};

// 'main'
const icons = [];
data.icons.forEach((icon) => {
  const filename = getIconSlug(icon);
  const svgFilepath = path.resolve(iconsDir, `${filename}.svg`);
  icon.svg = fs.readFileSync(svgFilepath, UTF8).replace(/\r?\n/, '');
  icon.slug = filename;
  icons.push(icon);

  // write the static .js file for the icon
  const jsFilepath = path.resolve(iconsDir, `${filename}.js`);
  minifyAndWrite(jsFilepath, `module.exports=${iconToObject(icon)};`);
});

// write our generic index.js
const rawIndexJs = util.format(
  indexTemplate,
  icons.map(iconToKeyValue).join(','),
);
minifyAndWrite(indexFile, rawIndexJs);
