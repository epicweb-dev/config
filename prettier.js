import { has } from './utils.js'

const hasTailwind = has('tailwindcss')

/** @type {import("prettier").Options} */
export const config = {
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxSingleQuote: false,
	printWidth: 80,
	proseWrap: 'always',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: false,
	singleAttributePerLine: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		// formatting the package.json with anything other than spaces will cause
		// issues when running install...
		{
			files: ['**/package.json'],
			options: {
				useTabs: false,
			},
		},
		{
			files: ['**/*.mdx'],
			options: {
				// This stinks, if you don't do this, then an inline component on the
				// end of the line will end up wrapping, then the next save Prettier
				// will add an extra line break. Super annoying and probably a bug in
				// Prettier, but until it's fixed, this is the best we can do.
				proseWrap: 'preserve',
				htmlWhitespaceSensitivity: 'ignore',
			},
		},
	],
	...(hasTailwind && {
		plugins: ['prettier-plugin-tailwindcss'],
		tailwindAttributes: ['class', 'className', 'ngClass', '.*[cC]lassName'],
		tailwindFunctions: ['clsx', 'cn', 'cva'],
	}),
}

// this is for backward compatibility
export default config
