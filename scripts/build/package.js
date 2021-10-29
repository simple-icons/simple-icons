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
const { minify } = require('uglify-js');

const UTF8 = 'utf8';

const rootDir = path.resolve(__dirname, '..', '..');
const dataFile = path.resolve(rootDir, '_data', 'simple-icons.json');
const iconsDir = path.resolve(rootDir, 'icons');
const indexJsFile = path.resolve(rootDir, 'index.js');
const indexMjsFile = path.resolve(rootDir, 'index.mjs');
const indexDtsFile = path.resolve(rootDir, 'index.d.ts');

const templatesDir = path.resolve(__dirname, 'templates');
const iconObjectTemplateFile = path.resolve(templatesDir, 'icon-object.js');

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
const slugToVariableName = (slug) => {
  const slugFirstLetter = slug[0].toUpperCase();
  const slugRest = slug.slice(1);
  return `si${slugFirstLetter}${slugRest}`;
};
const writeJs = (filepath, rawJavaScript) => {
  const { error, code } = minify(rawJavaScript);
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    fs.writeFileSync(filepath, code);
  }
};
const writeTs = (filepath, rawTypeScript) => {
  fs.writeFileSync(filepath, rawTypeScript);
};

// 'main'
const iconsBarrelMjs = [];
const iconsBarrelJs = [];
const iconsBarrelDts = [];
const icons = [];
data.icons.forEach((icon) => {
  const filename = getIconSlug(icon);
  const svgFilepath = path.resolve(iconsDir, `${filename}.svg`);
  icon.svg = fs.readFileSync(svgFilepath, UTF8).replace(/\r?\n/, '');
  icon.slug = filename;
  icons.push(icon);

  const iconObject = iconToObject(icon);

  // write the static .js file for the icon
  const jsFilepath = path.resolve(iconsDir, `${filename}.js`);
  writeJs(jsFilepath, `module.exports=${iconObject};`);

  const dtsFilepath = path.resolve(iconsDir, `${filename}.d.ts`);
  writeTs(
    dtsFilepath,
    'declare const i:import("../alias").I;export default i;',
  );

  // add object to the barrel file
  const iconExportName = slugToVariableName(icon.slug);
  iconsBarrelJs.push(`${iconExportName}:${iconObject},`);
  iconsBarrelMjs.push(`export const ${iconExportName}=${iconObject}`);
  iconsBarrelDts.push(`export const ${iconExportName}:I;`);
});

// write our file containing the exports of all icons in CommonJS ...
const rawIndexJs = `module.exports={${iconsBarrelJs.join('')}};`;
writeJs(indexJsFile, rawIndexJs);
// and ESM
const rawIndexMjs = iconsBarrelMjs.join('');
writeJs(indexMjsFile, rawIndexMjs);
// and create a type declaration file
const rawIndexDts = `import {SimpleIcon} from "./types";export {SimpleIcon};type I=SimpleIcon;${iconsBarrelDts.join(
  '',
)}`;
writeTs(indexDtsFile, rawIndexDts);
