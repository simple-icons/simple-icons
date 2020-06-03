#!/usr/bin/env node
/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in icons/{filename}.js.
 * Also generates an index.js that exports all icons by title, but is not tree-shakeable
 */

const fs = require("fs");
const util = require("util");
const minify = require("uglify-js").minify;

const UTF8 = "utf8";

const dataFile = "../_data/simple-icons.json";
const indexFile = `${__dirname}/../index.js`;
const iconsDir = `${__dirname}/../icons`;

const indexTemplateFile = `${__dirname}/templates/index.js`;
const iconObjectTemplateFile = `${__dirname}/templates/icon-object.js`;

const indexTemplate = fs.readFileSync(indexTemplateFile, UTF8);
const iconObjectTemplate = fs.readFileSync(iconObjectTemplateFile, UTF8);

const data = require(dataFile);
const { titleToFilename } = require("./utils");

// Local helper functions
function escape(value) {
  return value.replace(/'/g, "\\'");
}
function iconToKeyValue(icon) {
  const iconTitle = escape(icon.title);
  return `'${iconTitle}':${iconToObject(icon)}`;
}
function iconToObject(icon) {
  return util.format(iconObjectTemplate,
    escape(icon.title),
    escape(icon.slug),
    escape(icon.svg),
    escape(icon.source),
    escape(icon.hex)
  );
}

// 'main'
const icons = [];
data.icons.forEach(icon => {
    const filename = titleToFilename(icon.title);
    icon.svg = fs.readFileSync(`${iconsDir}/${filename}.svg`, UTF8).replace(/\r?\n/, '');
    icon.slug = filename;
    icons.push(icon);

    // write the static .js file for the icon
    const { error, code } = minify(`module.exports=${iconToObject(icon)};`);
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      fs.writeFileSync(`${iconsDir}/${filename}.js`, code);
    }

});

// write our generic index.js
const rawIndexJs = util.format(indexTemplate, icons.map(iconToKeyValue).join(','));
const { error, code } = minify(rawIndexJs);
if (error) {
  console.error(error);
  process.exit(1);
} else {
  fs.writeFileSync(indexFile, code);
}
