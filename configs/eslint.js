import globals from 'globals'

export default [
	{
		ignores: [
			'**/node_modules/**',
			'**/build/**',
			'**/public/build/**',
			'**/playwright-report/**',
			'**/server-build/**',
		],
	},

	// all files
	{
		plugins: {
			'react-hooks': (await import('eslint-plugin-react-hooks')).default,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
	},

	// JS and JSX files
	{
		files: ['**/*.js', '**/*.jsx'],
		// TODO: rules for non TS files
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
			import: (await import('eslint-plugin-import-x')).default,
		},
		rules: {
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

	// TSX-only files
	{
		files: ['**/*.tsx'],
		languageOptions: {
			parserOptions: {
				jsx: true,
			},
		},
	},
]
