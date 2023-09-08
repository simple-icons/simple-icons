/**
 * @fileoverview
 * Simple Icons package build script.
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
} from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const UTF8 = 'utf8';

const rootDir = path.resolve(__dirname, '..', '..');
const iconsDir = path.resolve(rootDir, 'icons');
const indexJsFile = path.resolve(rootDir, 'index.js');
const indexMjsFile = path.resolve(rootDir, 'index.mjs');
const sdkJsFile = path.resolve(rootDir, 'sdk.js');
const sdkMjsFile = path.resolve(rootDir, 'sdk.mjs');
const indexDtsFile = path.resolve(rootDir, 'index.d.ts');

const templatesDir = path.resolve(__dirname, 'templates');
const iconObjectTemplateFile = path.resolve(templatesDir, 'icon-object.js');

const build = async () => {
  const icons = await getIconsData();
  const iconObjectTemplate = await fs.readFile(iconObjectTemplateFile, UTF8);

  // Local helper functions
  const escape = (value) => {
    return value.replace(/(?<!\\)'/g, "\\'");
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
      icon.guidelines ? `\n  guidelines: '${escape(icon.guidelines)}',` : '',
      licenseToObject(icon.license)
        ? `\n  license: ${JSON.stringify(licenseToObject(icon.license))},`
        : '',
    );
  };
  const writeJs = async (filepath, rawJavaScript, opts = null) => {
    opts = opts === null ? { minify: true } : opts;
    const { code } = await esbuildTransform(rawJavaScript, opts);
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
      icon.svg = await fs.readFile(svgFilepath, UTF8);
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
  for (const { iconObject, iconExportName } of buildIcons) {
    iconsBarrelDts.push(`export const ${iconExportName}:I;`);
    iconsBarrelJs.push(`${iconExportName}:${iconObject},`);
    iconsBarrelMjs.push(`export const ${iconExportName}=${iconObject}`);
  }

  // constants used in templates to reduce package size
  const constantsString = `const a='<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>',b='</title><path d="',c='"/></svg>';`;

  // write our file containing the exports of all icons in CommonJS ...
  const rawIndexJs = `${constantsString}module.exports={${iconsBarrelJs.join(
    '',
  )}};`;
  await writeJs(indexJsFile, rawIndexJs);
  // and ESM
  const rawIndexMjs = constantsString + iconsBarrelMjs.join('');
  await writeJs(indexMjsFile, rawIndexMjs);
  // and create a type declaration file
  const rawIndexDts = `import {SimpleIcon} from "./types";export {SimpleIcon};type I=SimpleIcon;${iconsBarrelDts.join(
    '',
  )}`;
  await writeTs(indexDtsFile, rawIndexDts);

  // create a CommonJS SDK file
  await writeJs(sdkJsFile, await fs.readFile(sdkMjsFile, UTF8), {
    format: 'cjs',
  });
};

build();
