/**
 * @file XO Flat config file.
 */
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';

const xoConfig = [
	{
		prettier: true,
	},
	jsdoc.configs['flat/recommended'],
	{
		plugins: {jsdoc, import: importPlugin},
		rules: {
			'sort-imports': [
				'error',
				{
					ignoreCase: false,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					allowSeparatedGroups: false,
				},
			],
			'n/no-extraneous-import': 'off',
			'import-x/no-extraneous-dependencies': 'off',
			'import/no-named-as-default': 'off',
			'import/extensions': 'off',
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					warnOnUnassignedImports: true,
					'newlines-between': 'never',
				},
			],
			'no-console': ['error', {allow: ['warn', 'error']}],
			'no-warning-comments': [
				'warn',
				{
					terms: ['fixme', 'xxx'],
				},
			],
			'jsdoc/require-file-overview': 'error',
			'jsdoc/require-description': 'error',
			'jsdoc/no-bad-blocks': 'error',
			'jsdoc/no-blank-blocks': 'error',
			'jsdoc/no-blank-block-descriptions': 'error',
			'jsdoc/check-syntax': 'error',
			'jsdoc/require-asterisk-prefix': 'error',
			'jsdoc/require-description-complete-sentence': 'error',
			'jsdoc/require-hyphen-before-param-description': ['error', 'never'],
		},
	},
	{
		files: ['sdk.mjs', 'sdk.d.ts'],
		nodeVersion: '>=14.13.1',
		rules: {
			'@eslint-community/eslint-comments/disable-enable-pair': 'off',
			'unicorn/no-abusive-eslint-disable': 'off',
		},
	},
	{
		files: [
			'scripts/**/*',
			'tests/**/*',
			'svglint.config.mjs',
			'svgo.config.mjs',
		],
		nodeVersion: '>=18',
	},
	{
		files: ['svglint.config.mjs'],
		rules: {
			'max-depth': 'off',
		},
	},
];

export default xoConfig;
