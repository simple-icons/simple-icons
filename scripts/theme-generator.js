#!/usr/bin/env node
// @ts-nocheck
/**
 * @file
 * Simple Icons Theme Generator
 * Generates themed versions of icons with different visual styles
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {input, select, checkbox, confirm} from '@inquirer/prompts';
import chalk from 'chalk';
import {
	getIconsData,
	getIconSlug,
	titleToSlug,
	normalizeColor,
	svgToPath,
} from '../sdk.mjs';

/**
 * @typedef {import("../types.js").IconData} IconData
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {string} name - Theme name
 * @property {string} type - Theme type
 * @property {Object} options - Theme-specific options
 */

/**
 * @typedef {Object} GenerationResult
 * @property {string} originalPath - Original icon file path
 * @property {string} themedPath - Generated themed icon file path
 * @property {string} themeName - Applied theme name
 * @property {boolean} success - Whether generation was successful
 * @property {string} [error] - Error message if generation failed
 */

// Theme definitions
const THEME_TYPES = {
	monochrome: {
		name: 'Monochrome',
		description: 'Single color versions of icons',
		options: {
			color: {type: 'string', default: '#000000', description: 'Target color'},
		},
	},
	outlined: {
		name: 'Outlined',
		description: 'Stroke-only versions with customizable stroke width',
		options: {
			strokeWidth: {type: 'number', default: 1.5, description: 'Stroke width'},
			color: {type: 'string', default: '#000000', description: 'Stroke color'},
		},
	},
	inverted: {
		name: 'Inverted',
		description: 'Background/foreground color inverted',
		options: {
			backgroundColor: {type: 'string', default: '#FFFFFF', description: 'Background color'},
		},
	},
	gradient: {
		name: 'Gradient',
		description: 'Gradient color schemes',
		options: {
			startColor: {type: 'string', default: '#FF0000', description: 'Start color'},
			endColor: {type: 'string', default: '#0000FF', description: 'End color'},
			direction: {type: 'string', default: 'linear', description: 'Gradient direction'},
		},
	},
	accessibility: {
		name: 'High Contrast',
		description: 'High contrast versions for accessibility',
		options: {
			contrastRatio: {type: 'number', default: 4.5, description: 'Minimum contrast ratio'},
		},
	},
	brandVariant: {
		name: 'Brand Variant',
		description: 'Light/dark theme variations',
		options: {
			variant: {type: 'string', default: 'dark', description: 'Theme variant (light/dark)'},
		},
	},
};

/**
 * Get the root directory of the project
 * @returns {string} Root directory path
 */
const getRootDirectory = () => path.resolve(import.meta.dirname, '..');

/**
 * Get the icons directory path
 * @returns {string} Icons directory path
 */
const getIconsDirectory = () => path.resolve(getRootDirectory(), 'icons');

/**
 * Get the themed icons output directory path
 * @returns {string} Themed icons directory path
 */
const getThemedIconsDirectory = () => path.resolve(getRootDirectory(), 'themed-icons');

/**
 * Ensure the themed icons directory exists
 */
const ensureThemedIconsDirectory = async () => {
	const themedDir = getThemedIconsDirectory();
	try {
		await fs.access(themedDir);
	} catch {
		await fs.mkdir(themedDir, {recursive: true});
	}
};

/**
 * Apply monochrome theme to an SVG
 * @param {string} svgContent - Original SVG content
 * @param {{color?: string}} options - Theme options
 * @returns {string} Themed SVG content
 */
const applyMonochromeTheme = (svgContent, options) => {
	const {color = '#000000'} = options;
	const normalizedColor = normalizeColor(color);
	
	// Replace the fill attribute in the path with the target color
	return svgContent.replace(
		/<path d="([^"]*)"([^>]*)>/g,
		`<path d="$1" fill="#${normalizedColor}"$2>`
	);
};

/**
 * Apply outlined theme to an SVG
 * @param {string} svgContent - Original SVG content
 * @param {{strokeWidth?: number, color?: string}} options - Theme options
 * @returns {string} Themed SVG content
 */
const applyOutlinedTheme = (svgContent, options) => {
	const {strokeWidth = 1.5, color = '#000000'} = options;
	const normalizedColor = normalizeColor(color);
	
	// Convert filled path to outlined path
	return svgContent.replace(
		/<path d="([^"]*)"([^>]*)>/g,
		`<path d="$1" fill="none" stroke="#${normalizedColor}" stroke-width="${strokeWidth}"$2>`
	);
};

/**
 * Apply inverted theme to an SVG
 * @param {string} svgContent - Original SVG content
 * @param {{backgroundColor?: string}} options - Theme options
 * @returns {string} Themed SVG content
 */
const applyInvertedTheme = (svgContent, options) => {
	const {backgroundColor = '#FFFFFF'} = options;
	const normalizedBgColor = normalizeColor(backgroundColor);
	
	// Add background rectangle and invert path colors
	const backgroundRect = `<rect width="24" height="24" fill="#${normalizedBgColor}"/>`;
	
	return svgContent.replace(
		/<svg([^>]*)>/,
		`<svg$1>${backgroundRect}`
	).replace(
		/<path d="([^"]*)"([^>]*)>/g,
		`<path d="$1" fill="#${normalizedBgColor === 'FFFFFF' ? '000000' : 'FFFFFF'}"$2>`
	);
};

/**
 * Apply gradient theme to an SVG
 * @param {string} svgContent - Original SVG content
 * @param {{startColor?: string, endColor?: string, direction?: string}} options - Theme options
 * @returns {string} Themed SVG content
 */
const applyGradientTheme = (svgContent, options) => {
	const {startColor = '#FF0000', endColor = '#0000FF', direction = 'linear'} = options;
	const normalizedStartColor = normalizeColor(startColor);
	const normalizedEndColor = normalizeColor(endColor);
	
	// Generate gradient ID
	const gradientId = `gradient-${Date.now()}`;
	
	// Create gradient definition
	const gradientDef = `<defs>
		<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" style="stop-color:#${normalizedStartColor}"/>
			<stop offset="100%" style="stop-color:#${normalizedEndColor}"/>
		</linearGradient>
	</defs>`;
	
	return svgContent.replace(
		/<svg([^>]*)>/,
		`<svg$1>${gradientDef}`
	).replace(
		/<path d="([^"]*)"([^>]*)>/g,
		`<path d="$1" fill="url(#${gradientId})"$2>`
	);
};

/**
 * Apply accessibility theme to an SVG
 * @param {string} svgContent - Original SVG content
 * @param {{contrastRatio?: number}} options - Theme options
 * @returns {string} Themed SVG content
 */
const applyAccessibilityTheme = (svgContent, options) => {
	const {contrastRatio = 4.5} = options;
	
	// For high contrast, use pure black on white background
	const backgroundColor = '#FFFFFF';
	const foregroundColor = '#000000';
	
	const backgroundRect = `<rect width="24" height="24" fill="${backgroundColor}"/>`;
	
	return svgContent.replace(
		/<svg([^>]*)>/,
		`<svg$1>${backgroundRect}`
	).replace(
		/<path d="([^"]*)"([^>]*)>/g,
		`<path d="$1" fill="${foregroundColor}"$2>`
	);
};

/**
 * Apply brand variant theme to an SVG
 * @param {string} svgContent - Original SVG content
 * @param {{variant?: string}} options - Theme options
 * @param {IconData} iconData - Icon metadata
 * @returns {string} Themed SVG content
 */
const applyBrandVariantTheme = (svgContent, options, iconData) => {
	const {variant = 'dark'} = options;
	const originalColor = iconData.hex;
	
	// Apply different color treatments based on variant
	if (variant === 'dark') {
		// Darken the original color
		const darkColor = darkenColor(originalColor, 0.3);
		return applyMonochromeTheme(svgContent, {color: `#${darkColor}`});
	} else {
		// Lighten the original color
		const lightColor = lightenColor(originalColor, 0.3);
		return applyMonochromeTheme(svgContent, {color: `#${lightColor}`});
	}
};

/**
 * Darken a hex color by a given factor
 * @param {string} hex - Hex color without #
 * @param {number} factor - Factor to darken by (0-1)
 * @returns {string} Darkened hex color
 */
const darkenColor = (hex, factor) => {
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	
	const darkenedR = Math.round(r * (1 - factor));
	const darkenedG = Math.round(g * (1 - factor));
	const darkenedB = Math.round(b * (1 - factor));
	
	return `${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
};

/**
 * Lighten a hex color by a given factor
 * @param {string} hex - Hex color without #
 * @param {number} factor - Factor to lighten by (0-1)
 * @returns {string} Lightened hex color
 */
const lightenColor = (hex, factor) => {
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	
	const lightenedR = Math.round(r + (255 - r) * factor);
	const lightenedG = Math.round(g + (255 - g) * factor);
	const lightenedB = Math.round(b + (255 - b) * factor);
	
	return `${lightenedR.toString(16).padStart(2, '0')}${lightenedG.toString(16).padStart(2, '0')}${lightenedB.toString(16).padStart(2, '0')}`;
};

/**
 * Apply a theme to an SVG based on theme type
 * @param {string} svgContent - Original SVG content
 * @param {string} themeType - Theme type
 * @param {Record<string, any>} options - Theme options
 * @param {IconData} iconData - Icon metadata
 * @returns {string} Themed SVG content
 */
const applyTheme = (svgContent, themeType, options, iconData) => {
	switch (themeType) {
		case 'monochrome':
			return applyMonochromeTheme(svgContent, options);
		case 'outlined':
			return applyOutlinedTheme(svgContent, options);
		case 'inverted':
			return applyInvertedTheme(svgContent, options);
		case 'gradient':
			return applyGradientTheme(svgContent, options);
		case 'accessibility':
			return applyAccessibilityTheme(svgContent, options);
		case 'brandVariant':
			return applyBrandVariantTheme(svgContent, options, iconData);
		default:
			throw new Error(`Unknown theme type: ${themeType}`);
	}
};

/**
 * Generate themed version of a single icon
 * @param {IconData} iconData - Icon metadata
 * @param {ThemeConfig} themeConfig - Theme configuration
 * @returns {Promise<GenerationResult>} Generation result
 */
const generateThemedIcon = async (iconData, themeConfig) => {
	try {
		const slug = getIconSlug(iconData);
		const originalPath = path.join(getIconsDirectory(), `${slug}.svg`);
		const themedPath = path.join(
			getThemedIconsDirectory(),
			`${slug}-${themeConfig.name.toLowerCase().replace(/\s+/g, '-')}.svg`
		);
		
		// Read original SVG
		const originalSvg = await fs.readFile(originalPath, 'utf8');
		
		// Apply theme
		const themedSvg = applyTheme(originalSvg, themeConfig.type, themeConfig.options, iconData);
		
		// Write themed SVG
		await fs.writeFile(themedPath, themedSvg, 'utf8');
		
		return {
			originalPath,
			themedPath,
			themeName: themeConfig.name,
			success: true,
		};
	} catch (error) {
		return {
			originalPath: '',
			themedPath: '',
			themeName: themeConfig.name,
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};

/**
 * Main CLI function
 */
const main = async () => {
	try {
		console.log(chalk.blue.bold('🎨 Simple Icons Theme Generator'));
		console.log(chalk.gray('Generate themed versions of Simple Icons\n'));
		
		// Ensure themed icons directory exists
		await ensureThemedIconsDirectory();
		
		// Get icons data
		const iconsData = await getIconsData();
		
		// Select theme type
		const themeType = await select({
			message: 'Select theme type:',
			choices: Object.entries(THEME_TYPES).map(([key, value]) => ({
				name: value.name,
				value: key,
				description: value.description,
			})),
		});
		
		// Configure theme options
		const themeConfig = THEME_TYPES[themeType];
		const options = {};
		
		console.log(chalk.yellow(`\nConfiguring ${themeConfig.name} theme:`));
		
		for (const [optionKey, optionConfig] of Object.entries(themeConfig.options)) {
			const value = await input({
				message: `${optionConfig.description}:`,
				default: optionConfig.default.toString(),
			});
			
			options[optionKey] = optionConfig.type === 'number' ? parseFloat(value) : value;
		}
		
		// Select icons to theme
		const iconSelection = await select({
			message: 'Select icons to theme:',
			choices: [
				{name: 'All icons', value: 'all'},
				{name: 'Specific icons', value: 'specific'},
				{name: 'Random sample', value: 'sample'},
			],
		});
		
		let selectedIcons = iconsData;
		
		if (iconSelection === 'specific') {
			const iconTitle = await input({
				message: 'Enter icon title or slug (comma-separated for multiple):',
			});
			
			const titles = iconTitle.split(',').map(t => t.trim());
			selectedIcons = iconsData.filter(icon => 
				titles.some(title => 
					icon.title.toLowerCase().includes(title.toLowerCase()) ||
					getIconSlug(icon).includes(titleToSlug(title))
				)
			);
		} else if (iconSelection === 'sample') {
			const sampleSize = await input({
				message: 'How many random icons to generate?',
				default: '10',
			});
			
			const shuffled = [...iconsData].sort(() => 0.5 - Math.random());
			selectedIcons = shuffled.slice(0, parseInt(sampleSize));
		}
		
		if (selectedIcons.length === 0) {
			console.log(chalk.red('No icons selected. Exiting.'));
			process.exit(1);
		}
		
		// Confirm generation
		const confirmed = await confirm({
			message: `Generate ${themeConfig.name} theme for ${selectedIcons.length} icons?`,
		});
		
		if (!confirmed) {
			console.log(chalk.yellow('Operation cancelled.'));
			process.exit(0);
		}
		
		// Generate themed icons
		console.log(chalk.green(`\nGenerating ${themeConfig.name} themed icons...`));
		
		const theme = {
			name: themeConfig.name,
			type: themeType,
			options,
		};
		
		const results = [];
		const total = selectedIcons.length;
		
		for (let i = 0; i < selectedIcons.length; i++) {
			const icon = selectedIcons[i];
			const result = await generateThemedIcon(icon, theme);
			results.push(result);
			
			if (result.success) {
				console.log(chalk.green(`✓ ${icon.title} (${i + 1}/${total})`));
			} else {
				console.log(chalk.red(`✗ ${icon.title}: ${result.error} (${i + 1}/${total})`));
			}
		}
		
		// Summary
		const successful = results.filter(r => r.success).length;
		const failed = results.filter(r => !r.success).length;
		
		console.log(chalk.blue.bold('\n📊 Generation Summary:'));
		console.log(chalk.green(`✓ Successful: ${successful}`));
		if (failed > 0) {
			console.log(chalk.red(`✗ Failed: ${failed}`));
		}
		console.log(chalk.gray(`📁 Output directory: ${getThemedIconsDirectory()}`));
		
		process.exit(0);
	} catch (error) {
		console.error(chalk.red('Error:', error instanceof Error ? error.message : 'Unknown error'));
		process.exit(1);
	}
};

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export {
	applyTheme,
	generateThemedIcon,
	THEME_TYPES,
	getThemedIconsDirectory,
}; 