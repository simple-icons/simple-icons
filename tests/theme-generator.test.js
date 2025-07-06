// @ts-nocheck
/**
 * @file
 * Tests for the Icon Theme Generator
 */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, it, before, after } from 'mocha';
import {
	applyTheme,
	generateThemedIcon,
	THEME_TYPES,
	getThemedIconsDirectory,
} from '../scripts/theme-generator.js';

const testIconData = {
	title: 'Test Icon',
	hex: 'FF0000',
	source: 'https://example.com',
};

const testSvgContent = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Test Icon</title><path d="M12 0L24 12L12 24L0 12Z"/></svg>';

describe('Icon Theme Generator', () => {
	describe('Theme Types', () => {
		it('should have all required theme types', () => {
			const expectedThemes = [
				'monochrome',
				'outlined', 
				'inverted',
				'gradient',
				'accessibility',
				'brandVariant'
			];
			
			expectedThemes.forEach(theme => {
				assert.ok(THEME_TYPES[theme], `Theme type ${theme} should exist`);
				assert.ok(THEME_TYPES[theme].name, `Theme ${theme} should have a name`);
				assert.ok(THEME_TYPES[theme].description, `Theme ${theme} should have a description`);
				assert.ok(THEME_TYPES[theme].options, `Theme ${theme} should have options`);
			});
		});
	});

	describe('Monochrome Theme', () => {
		it('should apply black monochrome theme correctly', () => {
			const options = { color: '#000000' };
			const result = applyTheme(testSvgContent, 'monochrome', options, testIconData);
			
			assert.ok(result.includes('fill="#000000"'), 'Should contain black fill');
			assert.ok(result.includes('<title>Test Icon</title>'), 'Should preserve title');
		});

		it('should apply custom color monochrome theme', () => {
			const options = { color: '#FF6B6B' };
			const result = applyTheme(testSvgContent, 'monochrome', options, testIconData);
			
			assert.ok(result.includes('fill="#FF6B6B"'), 'Should contain custom color fill');
		});

		it('should normalize color codes', () => {
			const options = { color: 'F00' }; // Short hex without #
			const result = applyTheme(testSvgContent, 'monochrome', options, testIconData);
			
			assert.ok(result.includes('fill="#FF0000"'), 'Should normalize to full hex');
		});
	});

	describe('Outlined Theme', () => {
		it('should apply outlined theme with default settings', () => {
			const options = { strokeWidth: 1.5, color: '#000000' };
			const result = applyTheme(testSvgContent, 'outlined', options, testIconData);
			
			assert.ok(result.includes('fill="none"'), 'Should remove fill');
			assert.ok(result.includes('stroke="#000000"'), 'Should add stroke color');
			assert.ok(result.includes('stroke-width="1.5"'), 'Should add stroke width');
		});

		it('should apply custom stroke settings', () => {
			const options = { strokeWidth: 2.0, color: '#0066CC' };
			const result = applyTheme(testSvgContent, 'outlined', options, testIconData);
			
			assert.ok(result.includes('stroke="#0066CC"'), 'Should use custom stroke color');
			assert.ok(result.includes('stroke-width="2"'), 'Should use custom stroke width');
		});
	});

	describe('Inverted Theme', () => {
		it('should apply inverted theme with background', () => {
			const options = { backgroundColor: '#FFFFFF' };
			const result = applyTheme(testSvgContent, 'inverted', options, testIconData);
			
			assert.ok(result.includes('<rect width="24" height="24" fill="#FFFFFF"/>'), 'Should add background rect');
			assert.ok(result.includes('fill="#000000"'), 'Should invert to black');
		});

		it('should handle dark background correctly', () => {
			const options = { backgroundColor: '#000000' };
			const result = applyTheme(testSvgContent, 'inverted', options, testIconData);
			
			assert.ok(result.includes('fill="#000000"'), 'Should add black background');
			assert.ok(result.includes('fill="#FFFFFF"'), 'Should use white for path');
		});
	});

	describe('Gradient Theme', () => {
		it('should apply gradient theme with defaults', () => {
			const options = { startColor: '#FF0000', endColor: '#0000FF', direction: 'linear' };
			const result = applyTheme(testSvgContent, 'gradient', options, testIconData);
			
			assert.ok(result.includes('<defs>'), 'Should add defs section');
			assert.ok(result.includes('<linearGradient'), 'Should add linear gradient');
			assert.ok(result.includes('stop-color:#FF0000'), 'Should include start color');
			assert.ok(result.includes('stop-color:#0000FF'), 'Should include end color');
			assert.ok(result.includes('fill="url(#gradient-'), 'Should reference gradient');
		});

		it('should generate unique gradient IDs', () => {
			const options = { startColor: '#FF0000', endColor: '#0000FF' };
			const result1 = applyTheme(testSvgContent, 'gradient', options, testIconData);
			
			// Wait a moment to ensure different timestamp
			setTimeout(() => {
				const result2 = applyTheme(testSvgContent, 'gradient', options, testIconData);
				assert.notEqual(result1, result2, 'Should generate different gradient IDs');
			}, 10);
		});
	});

	describe('Accessibility Theme', () => {
		it('should apply high contrast theme', () => {
			const options = { contrastRatio: 4.5 };
			const result = applyTheme(testSvgContent, 'accessibility', options, testIconData);
			
			assert.ok(result.includes('<rect width="24" height="24" fill="#FFFFFF"/>'), 'Should add white background');
			assert.ok(result.includes('fill="#000000"'), 'Should use black for high contrast');
		});
	});

	describe('Brand Variant Theme', () => {
		it('should apply dark variant', () => {
			const options = { variant: 'dark' };
			const result = applyTheme(testSvgContent, 'brandVariant', options, testIconData);
			
			// Should darken the original FF0000 color
			assert.ok(result.includes('fill="#'), 'Should include fill attribute');
			assert.ok(!result.includes('fill="#FF0000'), 'Should not be original color');
		});

		it('should apply light variant', () => {
			const options = { variant: 'light' };
			const result = applyTheme(testSvgContent, 'brandVariant', options, testIconData);
			
			// Should lighten the original FF0000 color
			assert.ok(result.includes('fill="#'), 'Should include fill attribute');
			assert.ok(!result.includes('fill="#FF0000'), 'Should not be original color');
		});
	});

	describe('Theme Generator Integration', () => {
		let testOutputDir;

		before(async () => {
			// Create test output directory
			testOutputDir = path.join(process.cwd(), 'test-themed-icons');
			try {
				await fs.mkdir(testOutputDir, { recursive: true });
			} catch (error) {
				// Directory might already exist
			}
		});

		after(async () => {
			// Clean up test output directory
			try {
				await fs.rm(testOutputDir, { recursive: true, force: true });
			} catch (error) {
				// Ignore cleanup errors
			}
		});

		it('should generate themed icon file', async () => {
			const themeConfig = {
				name: 'Test-Monochrome',
				type: 'monochrome',
				options: { color: '#000000' }
			};

			// Mock the icon file by creating a temporary one
			const testIconPath = path.join(process.cwd(), 'icons', 'test-icon.svg');
			const testIconSlug = 'test-icon';
			
			// Create test icon data
			const testIcon = {
				title: 'Test Icon',
				hex: 'FF0000',
				source: 'https://example.com',
				slug: testIconSlug
			};

			try {
				// Create test icon file
				await fs.writeFile(testIconPath, testSvgContent, 'utf8');
				
				const result = await generateThemedIcon(testIcon, themeConfig);
				
				assert.ok(result.success, 'Should generate successfully');
				assert.ok(result.themedPath, 'Should have themed path');
				assert.ok(result.themedPath.includes('test-icon-test-monochrome.svg'), 'Should have correct filename');
				
				// Check if themed file was created
				const themedExists = await fs.access(result.themedPath).then(() => true).catch(() => false);
				assert.ok(themedExists, 'Themed file should be created');
				
				// Check themed file content
				const themedContent = await fs.readFile(result.themedPath, 'utf8');
				assert.ok(themedContent.includes('fill="#000000"'), 'Themed content should have correct fill');
				
			} finally {
				// Clean up test files
				try {
					await fs.unlink(testIconPath);
					await fs.unlink(result.themedPath);
				} catch (error) {
					// Ignore cleanup errors
				}
			}
		});

		it('should handle generation errors gracefully', async () => {
			const themeConfig = {
				name: 'Test-Theme',
				type: 'monochrome',
				options: { color: '#000000' }
			};

			const invalidIcon = {
				title: 'Non-Existent Icon',
				hex: 'FF0000',
				source: 'https://example.com',
			};

			const result = await generateThemedIcon(invalidIcon, themeConfig);
			
			assert.ok(!result.success, 'Should fail gracefully');
			assert.ok(result.error, 'Should have error message');
		});
	});

	describe('Output Directory', () => {
		it('should return correct themed icons directory path', () => {
			const dir = getThemedIconsDirectory();
			assert.ok(dir.endsWith('themed-icons'), 'Should end with themed-icons');
			assert.ok(path.isAbsolute(dir), 'Should be absolute path');
		});
	});

	describe('Error Handling', () => {
		it('should throw error for unknown theme type', () => {
			assert.throws(() => {
				applyTheme(testSvgContent, 'unknown-theme', {}, testIconData);
			}, /Unknown theme type/, 'Should throw error for unknown theme');
		});

		it('should handle malformed SVG gracefully', () => {
			const malformedSvg = '<svg><path d="invalid"/>';
			
			// Should not throw, but may not transform correctly
			const result = applyTheme(malformedSvg, 'monochrome', { color: '#000000' }, testIconData);
			assert.ok(typeof result === 'string', 'Should return string result');
		});
	});
}); 