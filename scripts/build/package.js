#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Simple Icons package build script.
 */

/**
 * @typedef {import('../../types.js').License} License
 * @typedef {import('esbuild').TransformOptions} EsBuildTransformOptions
 */

import {promises as fs} from 'node:fs';
import path from 'node:path';
import {format} from 'node:util';
import {transform as esbuildTransform} from 'esbuild';
import {
	getDirnameFromImportMeta,
	getIconSlug,
	getIconsData,
	slugToVariableName,
	svgToPath,
	titleToHtmlFriendly,
} from '../../sdk.mjs';
import {sortIconsCompare} from '../utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const UTF8 = 'utf8';

const rootDirectory = path.resolve(__dirname, '..', '..');
const iconsDirectory = path.resolve(rootDirectory, 'icons');
const indexJsFile = path.resolve(rootDirectory, 'index.js');
const indexMjsFile = path.resolve(rootDirectory, 'index.mjs');
const sdkJsFile = path.resolve(rootDirectory, 'sdk.js');
const sdkMjsFile = path.resolve(rootDirectory, 'sdk.mjs');
const indexDtsFile = path.resolve(rootDirectory, 'index.d.ts');

const templatesDirectory = path.resolve(__dirname, 'templates');
const iconObjectTemplateFile = path.resolve(
	templatesDirectory,
	'icon-object.js.template',
);

/**
 * Merged type from icon data and icon JS object needed to build by reference
 * to not decrease performance in the build process.
 * @typedef {import('../../types.js').SimpleIcon & import('../../sdk.d.ts').IconData} IconDataAndObject
 */

const icons = await getIconsData();
const iconObjectTemplate = await fs.readFile(iconObjectTemplateFile, UTF8);

/**
 * Escape a string for use in a JavaScript string.
 * @param {string} value The value to escape.
 * @returns {string} The escaped value.
 */
const escape = (value) => {
	return value.replaceAll(/(?<!\\)'/g, "\\'");
};

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
const iconDataAndObjectToJsRepr = (icon) => {
	return format(
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
};

/**
 * Write JavaScript content to a file.
 * @param {string} filepath The path to the file to write.
 * @param {string} rawJavaScript The raw JavaScript content to write to the file.
 * @param {EsBuildTransformOptions} [options] The options to pass to esbuild.
 */
const writeJs = async (filepath, rawJavaScript, options = undefined) => {
	options = options === undefined ? {minify: true} : options;
	const {code} = await esbuildTransform(rawJavaScript, options);
	await fs.writeFile(filepath, code);
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
	await writeJs(sdkJsFile, await fs.readFile(sdkMjsFile, UTF8), {
		format: 'cjs',
	});
};

await build();
