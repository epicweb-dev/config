import globals from 'globals'

export default [
	{
		ignores: [
			'**/.cache/**',
			'**/node_modules/**',
			'**/build/**',
			'**/public/build/**',
			'**/playwright-report/**',
			'**/server-build/**',
			'**/dist/**',
		],
	},

	// all files
	{
		plugins: {
			'react-hooks': (await import('eslint-plugin-react-hooks')).default,
			react: (await import('eslint-plugin-react')).default,
			import: (await import('eslint-plugin-import-x')).default,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'import/no-duplicates': ['warn', { 'prefer-inline': true }],
			'import/order': [
				'warn',
				{
					alphabetize: { order: 'asc', caseInsensitive: true },
					pathGroups: [{ pattern: '#*/**', group: 'internal' }],
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
				},
			],
		},
	},

	// JS and JSX files
	{
		files: ['**/*.js?(x)'],
		rules: {
			// most of these rules are useful for JS but not TS because TS handles these better
			// if it weren't for https://github.com/import-js/eslint-plugin-import/issues/2132
			// we could enable this :(
			// 'import/no-unresolved': 'error',
			'no-unused-vars': [
				'warn',
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^ignored',
				},
			],
		},
	},

	// TS and TSX files
	{
		files: ['**/*.ts?(x)'],
		languageOptions: {
			parser: await import('@typescript-eslint/parser'),
			parserOptions: {
				project: true,
			},
		},
		plugins: {
			'@typescript-eslint': (await import('@typescript-eslint/eslint-plugin'))
				.default,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^ignored',
				},
			],
			'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: true,
					fixStyle: 'inline-type-imports',
				},
			],
		},
	},

	// JSX/TSX files
	{
		files: ['**/*.tsx', '**/*.jsx'],
		languageOptions: {
			parserOptions: {
				jsx: true,
			},
		},
		rules: {
			'react/jsx-key': 'warn',
		},
	},
]
