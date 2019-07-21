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

const dataFile = "../_data/simple-icons.json";
const indexFile = `${__dirname}/../index.js`;
const iconsDir = `${__dirname}/../icons`;
const indexTemplateFile = `${__dirname}/templates/index.js`;

const data = require(dataFile);
const { titleToFilename } = require("./utils");

// Local helper functions
function escape(value) {
  return value.replace(/'/g, "\\'");
}
function iconToKeyValue(icon) {
  return `'${icon.title}':${iconToObject(icon)}`;
}
function iconToObject(icon) {
  return `{title:'${escape(icon.title)}',slug:'${escape(icon.slug)}',svg:'${escape(icon.svg)}',get path(){return this.svg.match(/<path\\s+d="([^"]*)/)[1];},source:'${escape(icon.source)}',hex:'${icon.hex}'}`;
}

// 'main'
const icons = [];
data.icons.forEach(icon => {
    const filename = titleToFilename(icon.title);
    icon.svg = fs.readFileSync(`${iconsDir}/${filename}.svg`, "utf8");
    icon.slug = filename;
    icons.push(icon)

    // write the static .js file for the icon
    fs.writeFileSync(
        `${iconsDir}/${filename}.js`,
        `module.exports=${iconToObject(icon)};`
    );
});

// write our generic index.js
const indexTemplate = fs.readFileSync(indexTemplateFile, "utf8");
const { error, code } = minify(util.format(indexTemplate, icons.map(iconToKeyValue).join(',')));
if (error) {
  console.error(error);
  process.exit(1);
} else {
  fs.writeFileSync(indexFile, code);
}
