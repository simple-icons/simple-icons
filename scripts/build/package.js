#!/usr/bin/env node
/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable. The static .js files go in icons/{filename}.js. Also
 * generates an index.js that exports all icons by title, but is not
 * tree-shakeable
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import { transform as esbuildTransform } from 'esbuild';
import {
  getIconSlug,
  svgToPath,
  titleToHtmlFriendly,
  slugToVariableName,
  getIconsData,
  getDirnameFromImportMeta,
  collator,
} from '../utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const UTF8 = 'utf8';

const rootDir = path.resolve(__dirname, '..', '..');
const indexFile = path.resolve(rootDir, 'index.js');
const iconsDir = path.resolve(rootDir, 'icons');
const iconsJsFile = path.resolve(rootDir, 'icons.js');
const iconsMjsFile = path.resolve(rootDir, 'icons.mjs');
const iconsDtsFile = path.resolve(rootDir, 'icons.d.ts');

const templatesDir = path.resolve(__dirname, 'templates');
const indexTemplateFile = path.resolve(templatesDir, 'index.js');
const iconObjectTemplateFile = path.resolve(templatesDir, 'icon-object.js');

const build = async () => {
  const icons = await getIconsData();
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
  const buildIcons = await Promise.all(
    icons.map(async (icon) => {
      const filename = getIconSlug(icon);
      const svgFilepath = path.resolve(iconsDir, `${filename}.svg`);
      icon.svg = (await fs.readFile(svgFilepath, UTF8)).replace(/\r?\n/, '');
      icon.path = svgToPath(icon.svg);
      icon.slug = filename;
      const iconObject = iconToObject(icon);
      const iconExportName = slugToVariableName(icon.slug);
      return { icon, iconObject, iconExportName };
    }),
  );

  const iconsBarrelDts = [];
  const iconsBarrelJs = [];
  const iconsBarrelMjs = [];

  buildIcons.sort((a, b) => collator.compare(a.icon.title, b.icon.title));
  buildIcons.forEach(({ iconObject, iconExportName }) => {
    iconsBarrelDts.push(`export const ${iconExportName}:I;`);
    iconsBarrelJs.push(`${iconExportName}:${iconObject},`);
    iconsBarrelMjs.push(`export const ${iconExportName}=${iconObject}`);
  });

  // constants used in templates to reduce package size
  const constantsString = `const a='<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>',b='</title><path d="',c='"/></svg>';`;

  // write our generic index.js
  const rawIndexJs = util.format(
    indexTemplate,
    constantsString,
    buildIcons.map(({ icon }) => iconToKeyValue(icon)).join(','),
  );
  await writeJs(indexFile, rawIndexJs);

  // write our file containing the exports of all icons in CommonJS ...
  const rawIconsJs = `${constantsString}module.exports={${iconsBarrelJs.join(
    '',
  )}};`;
  await writeJs(iconsJsFile, rawIconsJs);
  // and ESM
  const rawIconsMjs = constantsString + iconsBarrelMjs.join('');
  await writeJs(iconsMjsFile, rawIconsMjs);
  // and create a type declaration file
  const rawIconsDts = `import {SimpleIcon} from ".";type I = SimpleIcon;${iconsBarrelDts.join(
    '',
  )}`;
  await writeTs(iconsDtsFile, rawIconsDts);
};

build();
