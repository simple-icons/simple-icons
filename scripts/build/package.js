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
const indexFile = path.resolve(rootDir, 'index.js');
const iconsDir = path.resolve(rootDir, 'icons');
const iconsJsFile = path.resolve(rootDir, 'icons.js');
const iconsMjsFile = path.resolve(rootDir, 'icons.mjs');
const iconsDtsFile = path.resolve(rootDir, 'icons.d.ts');

const templatesDir = path.resolve(__dirname, 'templates');
const indexTemplateFile = path.resolve(templatesDir, 'index.js');
const iconObjectTemplateFile = path.resolve(templatesDir, 'icon-object.js');

const indexTemplate = fs.readFileSync(indexTemplateFile, UTF8);
const iconObjectTemplate = fs.readFileSync(iconObjectTemplateFile, UTF8);

const data = require(dataFile);
const {
  getIconSlug,
  svgToPath,
  titleToHtmlFriendly,
  slugToVariableName,
} = require('../utils.js');

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
    escape(titleToHtmlFriendly(icon.title)),
    escape(icon.path),
    escape(icon.source),
    escape(icon.hex),
    icon.guidelines ? `'${escape(icon.guidelines)}'` : undefined,
    licenseToObject(icon.license),
  );
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
  icon.path = svgToPath(icon.svg);
  icon.slug = filename;
  icons.push(icon);

  const iconObject = iconToObject(icon);
  const iconExportName = slugToVariableName(icon.slug);

  // write the static .js file for the icon
  const jsFilepath = path.resolve(iconsDir, `${filename}.js`);
  const newImportMessage = `use "const { ${iconExportName} } = require('simple-icons/icons');" instead`;
  const message = JSON.stringify(
    `This way of importing icons has been deprecated in v6.0.0 and will no longer work from v7.0.0, use ${newImportMessage}`,
  );
  writeJs(
    jsFilepath,
    `console.warn("warn -", ${message});module.exports=${iconObject};`,
  );

  const dtsFilepath = path.resolve(iconsDir, `${filename}.d.ts`);
  writeTs(
    dtsFilepath,
    `/**@deprecated ${newImportMessage}*/declare const i:import("../alias").I;export default i;`,
  );

  // add object to the barrel file
  iconsBarrelJs.push(`${iconExportName}:${iconObject},`);
  iconsBarrelMjs.push(`export const ${iconExportName}=${iconObject}`);
  iconsBarrelDts.push(`export const ${iconExportName}:I;`);
});

// write our generic index.js
const rawIndexJs = util.format(
  indexTemplate,
  icons.map(iconToKeyValue).join(','),
);
writeJs(indexFile, rawIndexJs);

// write our file containing the exports of all icons in CommonJS ...
const rawIconsJs = `module.exports={${iconsBarrelJs.join('')}};`;
writeJs(iconsJsFile, rawIconsJs);
// and ESM
const rawIconsMjs = iconsBarrelMjs.join('');
writeJs(iconsMjsFile, rawIconsMjs);
// and create a type declaration file
const rawIconsDts = `import {I} from "./alias";${iconsBarrelDts.join('')}`;
writeTs(iconsDtsFile, rawIconsDts);
