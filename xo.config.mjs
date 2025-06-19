// @ts-check
/**
 * @file XO Flat config file.
 */
import headers from 'eslint-plugin-headers';
import jsdoc from 'eslint-plugin-jsdoc';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
	{
		prettier: true,
	},
	/** @type {import('xo').XoConfigItem} */
	(jsdoc.configs['flat/recommended']),
	{
		plugins: {jsdoc, headers},
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
			'import-x/no-named-as-default': 'off',
			'import-x/extensions': 'off',
			'import-x/order': [
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
			'headers/header-format': [
				'error',
				{
					source: 'string',
					content: '@ts-check',
					style: 'line',
				},
			],
		},
	},
	{
		files: ['sdk.mjs', 'sdk.d.ts'],
		rules: {
			'@eslint-community/eslint-comments/disable-enable-pair': 'off',
			'unicorn/no-abusive-eslint-disable': 'off',
		},
	},
	{
		files: ['svglint.config.mjs'],
		rules: {
			'max-depth': 'off',
		},
	},
];

export default xoConfig;
