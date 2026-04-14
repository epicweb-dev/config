import { defineConfig } from 'oxfmt'

/**
 * Shared Oxfmt preset for `@epic-web/config` consumers (plain `.js` under this
 * package’s `"type": "module"` so Node does not execute TypeScript from
 * `node_modules`).
 *
 * @see https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html
 */
export default defineConfig({
	$schema: './node_modules/oxfmt/configuration_schema.json',
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	jsxSingleQuote: false,
	printWidth: 80,
	proseWrap: 'always',
	quoteProps: 'as-needed',
	semi: false,
	singleAttributePerLine: false,
	singleQuote: true,
	sortPackageJson: false,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	ignorePatterns: [
		'.cache/**',
		'**/.cache/**',
		'**/.DS_Store',
		'**/.env*',
		'!**/.env.example',
		'**/.netlify/**',
		'**/.next/**',
		'**/.vercel/**',
		'**/.vscode/**',
		'**/*.log',
		'**/build/**',
		'**/coverage/**',
		'**/dist/**',
		'**/node_modules/**',
		'**/package-lock.json',
		'**/playwright-report/**',
		'**/playwright/.cache/**',
		'**/pnpm-lock.yaml',
		'**/prisma/migrations/**',
		'**/public/build/**',
		'**/public/client-entry.js',
		'**/server-build/**',
		'**/test-results/**',
		'**/tests/fixtures/email/*.json',
		'**/worker-configuration.d.ts',
		'**/yarn.lock',
	],
	sortTailwindcss: {
		// Oxfmt does not support regex attribute names yet; `class` / `className` are built-in.
		attributes: ['ngClass'],
		functions: ['clsx', 'cn', 'cva'],
	},
	overrides: [
		{
			files: ['**/package.json'],
			options: {
				useTabs: false,
			},
		},
		{
			files: ['**/*.mdx'],
			options: {
				proseWrap: 'preserve',
				htmlWhitespaceSensitivity: 'ignore',
			},
		},
	],
})
