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

const rootDir = path.resolve(__dirname, "..", "..");
const dataFile = path.resolve(rootDir, "_data", "simple-icons.json");
const indexFile = path.resolve(rootDir, "index.js");
const iconsDir = path.resolve(rootDir, "icons");
const iconsJsFile = path.resolve(rootDir, "icons.js");
const iconsMjsFile = path.resolve(rootDir, "icons.mjs");
const iconsDtsFile = path.resolve(rootDir, "icons.d.ts");

const templatesDir = path.resolve(__dirname, "templates");
const indexTemplateFile = path.resolve(templatesDir, "index.js");
const iconObjectTemplateFile = path.resolve(templatesDir, "icon-object.js");

const indexTemplate = fs.readFileSync(indexTemplateFile, UTF8);
const iconObjectTemplate = fs.readFileSync(iconObjectTemplateFile, UTF8);

const data = require(dataFile);
const { getIconSlug } = require("../utils.js");

// Local helper functions
function escape(value) {
  return value.replace(/(?<!\\)'/g, "\\'");
}
function iconToKeyValue(icon) {
  return `'${icon.slug}':${iconToObject(icon)}`;
}
function licenseToObject(license) {
  if (license === undefined) {
    return;
  }

  if (license.url === undefined) {
    license.url = `https://spdx.org/licenses/${license.type}`;
  }
  return license;
}
function iconToObject(icon) {
  return util.format(
    iconObjectTemplate,
    escape(icon.title),
    escape(icon.slug),
    escape(icon.svg),
    escape(icon.source),
    escape(icon.hex),
    icon.guidelines ? `'${escape(icon.guidelines)}'` : undefined,
    licenseToObject(icon.license)
  );
}
function slugToVariableName(slug) {
  const slugFirstLetter = slug[0].toUpperCase();
  const slugRest = slug.slice(1);
  return `si${slugFirstLetter}${slugRest}`;
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
const iconsBarrelMjs = [];
const iconsBarrelJs = [];
const iconsBarrelDts = [];
const icons = [];
data.icons.forEach((icon) => {
  const filename = getIconSlug(icon);
  const svgFilepath = path.resolve(iconsDir, `${filename}.svg`);
  icon.svg = fs.readFileSync(svgFilepath, UTF8).replace(/\r?\n/, "");
  icon.slug = filename;
  icons.push(icon);

  const iconObject = iconToObject(icon);

  // write the static .js file for the icon
  const jsFilepath = path.resolve(iconsDir, `${filename}.js`);
  minifyAndWrite(jsFilepath, `module.exports=${iconObject};`);

  const dtsFilepath = path.resolve(iconsDir, `${filename}.d.ts`);
  fs.writeFileSync(
    dtsFilepath,
    `declare const i:import("..").I;export default i;`
  );

  // add object to the barrel file
  const iconExportName = slugToVariableName(icon.slug);
  iconsBarrelJs.push(`${iconExportName}:${iconObject},`);
  iconsBarrelMjs.push(`export const ${iconExportName}=${iconObject}`);
  iconsBarrelDts.push(`export const ${iconExportName}:I;`);
});

// write our generic index.js
const rawIndexJs = util.format(
  indexTemplate,
  icons.map(iconToKeyValue).join(",")
);
minifyAndWrite(indexFile, rawIndexJs);

// write our file containing the exports of all icons in CommonJS ...
const rawIconsJs = `module.exports={${iconsBarrelJs.join("")}};`;
minifyAndWrite(iconsJsFile, rawIconsJs);
// and ESM
const rawIconsMjs = iconsBarrelMjs.join("");
minifyAndWrite(iconsMjsFile, rawIconsMjs);
// and create a type declaration file
const rawIconsDts = `import {I} from ".";${iconsBarrelDts.join("")}`;
fs.writeFileSync(iconsDtsFile, rawIconsDts);
