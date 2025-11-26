#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Simple Icons package build script.
 */

/**
 * @typedef {import('../../types.js').License} License
 */

import {promises as fs} from 'node:fs';
import path from 'node:path';
import {format} from 'node:util';
import {transform as esbuildTransform} from 'esbuild';
import {
	getIconSlug,
	getIconsData,
	slugToVariableName,
	svgToPath,
	titleToHtmlFriendly,
} from '../../sdk.mjs';
import {sortIconsCompare} from '../utils.js';

const UTF8 = 'utf8';

const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
const iconsDirectory = path.resolve(rootDirectory, 'icons');
const indexJsFile = path.resolve(rootDirectory, 'index.js');
const indexMjsFile = path.resolve(rootDirectory, 'index.mjs');
const sdkJsFile = path.resolve(rootDirectory, 'sdk.js');
const sdkMjsFile = path.resolve(rootDirectory, 'sdk.mjs');
const indexDtsFile = path.resolve(rootDirectory, 'index.d.ts');

const templatesDirectory = path.resolve(import.meta.dirname, 'templates');
const iconObjectTemplateFile = path.resolve(
	templatesDirectory,
	'icon-object.js.template',
);

/**
 * Merged type from icon data and icon JS object needed to build by reference
 * to not decrease performance in the build process.
 * @typedef {import('../../types.js').SimpleIcon & import('../../types.d.ts').IconData} IconDataAndObject
 */

const icons = await getIconsData();
const iconObjectTemplate = await fs.readFile(iconObjectTemplateFile, UTF8);

/**
 * Escape a string for use in a JavaScript string.
 * @param {string} value The value to escape.
 * @returns {string} The escaped value.
 */
const escape = (value) => value.replaceAll(/(?<!\\)'/g, String.raw`\'`);

/**
 * Converts a license object to a URL if the URL is not defined.
 * @param {License} license The license object or URL.
 * @returns {License} The license object with a URL.
 */
const licenseToString = (license) => {
	if (license.url === undefined) {
		license.url = `https://spdx.org/licenses/${license.type}`;
	}

	return license;
};

/**
 * Converts an icon object to a JavaScript object.
 * @param {IconDataAndObject} icon The icon object.
 * @returns {string} The JavaScript object.
 */
const iconDataAndObjectToJsRepr = (icon) =>
	format(
		iconObjectTemplate,
		escape(icon.title),
		escape(icon.slug),
		escape(titleToHtmlFriendly(icon.title)),
		escape(icon.path),
		escape(icon.source),
		escape(icon.hex),
		icon.guidelines ? `\n  guidelines: '${escape(icon.guidelines)}',` : '',
		icon.license === undefined
			? ''
			: `\n  license: ${JSON.stringify(licenseToString(icon.license))},`,
	);

/**
 * Write JavaScript content to a file.
 *
 * ESBuild by default uses `ascii` encoding for JavaScript files, so the titles of icons
 * are encoded using escape sequences (eg. "Aerom\xE9xico" instead of "Aeroméxico").
 * See {@link https://esbuild.github.io/api/#charset}.
 * Although this adds a minimal size overhead, it is needed to ensure that our distributed
 * JavaScript files are compatible with all JavaScript environments. Especially, browsers
 * that are not using `<meta charset="utf-8">` in their HTML. As we support browsers
 * without meta charset in SVG `<title>` elements, we need to ensure the same for scripts.
 * @param {string} filepath The path to the file to write.
 * @param {string} rawJavaScript The raw JavaScript content to write to the file.
 * @param {'cjs'} [format] The format of the resulting JavaScript file.
 */
const writeJs = async (filepath, rawJavaScript, format = undefined) => {
	/** @type {import('esbuild').TransformOptions} */
	const options = {minify: true, charset: 'ascii', format};
	const {code} = await esbuildTransform(rawJavaScript, options);
	// ESBuild adds a trailing newline to the end of the file
	await fs.writeFile(filepath, code.trimEnd());
};

/**
 * Write TypeScript content to a file.
 * @param {string} filepath The path to the file to write.
 * @param {string} rawTypeScript The raw TypeScript content to write to the file.
 */
const writeTs = async (filepath, rawTypeScript) => {
	await fs.writeFile(filepath, rawTypeScript);
};

/**
 * Build icons intermediate instances.
 * @returns {Promise<{
 * 	icon: IconDataAndObject,
 * 	iconObjectRepr: string,
 * 	iconExportName: string
 * }[]>} Merged icon data and object instances.
 */
const buildIcons = async () =>
	Promise.all(
		icons.map(async (iconData) => {
			const slug = getIconSlug(iconData);
			const svgFilepath = path.resolve(iconsDirectory, `${slug}.svg`);
			const svg = await fs.readFile(svgFilepath, UTF8);
			/** @type {IconDataAndObject} */
			const icon = {};
			Object.assign(icon, iconData);
			icon.svg = svg;
			icon.path = svgToPath(svg);
			icon.slug = slug;
			const iconObjectRepr = iconDataAndObjectToJsRepr(icon);
			const iconExportName = slugToVariableName(slug);
			return {icon, iconObjectRepr, iconExportName};
		}),
	);

const build = async () => {
	const builtIcons = await buildIcons();

	const iconsBarrelDts = [];
	const iconsBarrelJs = [];
	const iconsBarrelMjs = [];

	builtIcons.sort((a, b) => sortIconsCompare(a.icon, b.icon));
	for (const {iconObjectRepr, iconExportName} of builtIcons) {
		iconsBarrelDts.push(`export const ${iconExportName}:I;`);
		iconsBarrelJs.push(`${iconExportName}:${iconObjectRepr},`);
		iconsBarrelMjs.push(`export const ${iconExportName}=${iconObjectRepr}`);
	}

	// Constants used in templates to reduce package size
	const constantsString = `const a='<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>',b='</title><path d="',c='"/></svg>';`;

	// Write our file containing the exports of all icons in CommonJS ...
	const rawIndexJs = `${constantsString}module.exports={${iconsBarrelJs.join(
		'',
	)}};`;
	await writeJs(indexJsFile, rawIndexJs);
	// ... and ESM
	const rawIndexMjs = constantsString + iconsBarrelMjs.join('');
	await writeJs(indexMjsFile, rawIndexMjs);
	// ... and create a type declaration file
	const rawIndexDts = `import {SimpleIcon} from "./types";export {SimpleIcon};type I=SimpleIcon;${iconsBarrelDts.join(
		'',
	)}`;
	await writeTs(indexDtsFile, rawIndexDts);

	// Create a CommonJS SDK file
	await writeJs(sdkJsFile, await fs.readFile(sdkMjsFile, UTF8), 'cjs');

	// Build deprecated `simple-icons/icons` entrypoint.
	// TODO: This must be removed at v17.
	const deprecatedMessage =
		`⚠️ The entrypoint 'simple-icons/icons' is deprecated and` +
		` will be removed in version 17.0.0`;
	const jsDeprecationMessage =
		`${deprecatedMessage}. Please, import icons from 'simple-icons'` +
		` using \`require('simple-icons')\` instead of \`require('simple-icons/icons')\`.`;
	const iconsIndexJs =
		`console.warn("${jsDeprecationMessage}");` +
		`module.exports=require('./index.js');`;
	const iconsIndexJsFile = path.resolve(rootDirectory, 'index-icons.js');
	await writeJs(iconsIndexJsFile, iconsIndexJs);

	const mjsDeprecationMessage =
		`${deprecatedMessage}. Please, import icons from 'simple-icons'` +
		` using \`import ... from 'simple-icons'\` instead of \`import ... from 'simple-icons/icons'\`.`;
	const iconsIndexMjs =
		`console.warn("${mjsDeprecationMessage}");` +
		`export * from './index.mjs';`;
	const iconsIndexMjsFile = path.resolve(rootDirectory, 'index-icons.mjs');
	await writeJs(iconsIndexMjsFile, iconsIndexMjs);
};

await build();
