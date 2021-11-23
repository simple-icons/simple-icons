#!/usr/bin/env node
/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable. The static .js files go in icons/{filename}.js. Also
 * generates an index.js that exports all icons by title, but is not
 * tree-shakeable
 */

const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const { transform: esbuildTransform } = require('esbuild');

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

const data = require(dataFile);
const {
  getIconSlug,
  svgToPath,
  titleToHtmlFriendly,
  slugToVariableName,
} = require('../utils.js');

const build = async () => {
  const indexTemplate = await fs.readFile(indexTemplateFile, UTF8);
  const iconObjectTemplate = await fs.readFile(iconObjectTemplateFile, UTF8);

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
  const writeJs = async (filepath, rawJavaScript) => {
    const { code } = await esbuildTransform(rawJavaScript, {
      minify: true,
    });
    await fs.writeFile(filepath, code);
  };
  const writeTs = async (filepath, rawTypeScript) => {
    await fs.writeFile(filepath, rawTypeScript);
  };

  // 'main'
  const iconsBarrelMjs = [];
  const iconsBarrelJs = [];
  const iconsBarrelDts = [];
  const icons = [];

  await Promise.all(
    data.icons.map(async (icon) => {
      const filename = getIconSlug(icon);
      const svgFilepath = path.resolve(iconsDir, `${filename}.svg`);
      icon.svg = (await fs.readFile(svgFilepath, UTF8)).replace(/\r?\n/, '');
      icon.path = svgToPath(icon.svg);
      icon.slug = filename;
      icons.push(icon);

      const iconObject = iconToObject(icon);

      // write the static .js file for the icon
      const jsFilepath = path.resolve(iconsDir, `${filename}.js`);
      const dtsFilepath = path.resolve(iconsDir, `${filename}.d.ts`);
      await Promise.all([
        writeJs(jsFilepath, `module.exports=${iconObject};`),
        writeTs(
          dtsFilepath,
          'declare const i:import("../alias").I;export default i;',
        ),
      ]);

      // add object to the barrel file
      const iconExportName = slugToVariableName(icon.slug);
      iconsBarrelJs.push(`${iconExportName}:${iconObject},`);
      iconsBarrelMjs.push(`export const ${iconExportName}=${iconObject}`);
      iconsBarrelDts.push(`export const ${iconExportName}:I;`);
    }),
  );

  // write our generic index.js
  const rawIndexJs = util.format(
    indexTemplate,
    icons.map(iconToKeyValue).join(','),
  );
  await writeJs(indexFile, rawIndexJs);

  // write our file containing the exports of all icons in CommonJS ...
  const rawIconsJs = `module.exports={${iconsBarrelJs.join('')}};`;
  await writeJs(iconsJsFile, rawIconsJs);
  // and ESM
  const rawIconsMjs = iconsBarrelMjs.join('');
  await writeJs(iconsMjsFile, rawIconsMjs);
  // and create a type declaration file
  const rawIconsDts = `import {I} from "./alias";${iconsBarrelDts.join('')}`;
  await writeTs(iconsDtsFile, rawIconsDts);
};

build();
