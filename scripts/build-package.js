#!/usr/bin/env node
/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable. The static .js files go in icons/{filename}.js. Also
 * generates an index.js that exports all icons by title, but is not
 * tree-shakeable
 */

const fs = require("fs");
const path = require("path");
const util = require("util");
const minify = require("uglify-js").minify;

const UTF8 = "utf8";

const dataFile = path.resolve(__dirname, "..", "_data", "simple-icons.json");
const indexFile = path.resolve(__dirname, "..", "index.js");
const iconsDir = path.resolve(__dirname, "..", "icons");

const indexTemplateFile = path.resolve(__dirname, "templates", "index.js");
const iconObjectTemplateFile = path.resolve(__dirname, "templates", "icon-object.js");

const indexTemplate = fs.readFileSync(indexTemplateFile, UTF8);
const iconObjectTemplate = fs.readFileSync(iconObjectTemplateFile, UTF8);

const data = require(dataFile);
const { getIconSlug } = require("./utils.js");

// Local helper functions
function escape(value) {
  return value.replace(/(?<!\\)'/g, "\\'");
}
function iconToKeyValue(icon) {
  let iconName = escape(icon.title);
  if (icon.slug !== getIconSlug({ title: icon.title })) {
    iconName = icon.slug;
  }

  return `'${iconName}':${iconToObject(icon)}`;
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
function minifyAndWrite(filepath, rawJavaScript) {
  const { error, code } = minify(rawJavaScript);
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    fs.writeFileSync(filepath, code);
  }
}

// 'main'
const icons = [];
data.icons.forEach(icon => {
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
const rawIndexJs = util.format(indexTemplate, icons.map(iconToKeyValue).join(','));
minifyAndWrite(indexFile, rawIndexJs);
