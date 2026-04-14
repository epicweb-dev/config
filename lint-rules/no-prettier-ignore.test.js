import { describe, expect, test } from 'vitest'

import { runOxlint } from './oxlint-test-utils.js'

function noPrettierIgnoreDiagnostics(result) {
	return result.diagnostics.filter(
		(d) => d.code === 'epic-web(no-prettier-ignore)',
	)
}

describe('epic-web/no-prettier-ignore', () => {
	test('allows oxfmt-ignore comments', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `// oxfmt-ignore\nconst x    = 1\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(0)
	})

	test('allows prose that mentions prettier-ignore', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `// mention prettier-ignore in docs\nconst x = 1\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(0)
	})

	test('allows prettier-ignore inside a string literal', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `const s = 'prettier-ignore'\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(0)
	})

	test('reports line prettier-ignore before a statement', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `// prettier-ignore\nconst x    = 1\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		const hits = noPrettierIgnoreDiagnostics(result)
		expect(hits).toHaveLength(1)
		expect(hits[0]?.message).toContain('oxfmt-ignore')
	})

	test('reports block prettier-ignore', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `/* prettier-ignore */\nconst x    = 1\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(1)
	})

	test('reports prettier-ignore-next', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `// prettier-ignore-next\nconst x    = 1\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(1)
	})

	test('reports start and end directives', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `// prettier-ignore-start\nconst x    = 1\n// prettier-ignore-end\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(2)
	})

	test('reports trailing line prettier-ignore', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `const a = 1 // prettier-ignore\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(1)
	})

	test('reports jsx block comment', async () => {
		const result = await runOxlint({
			filename: 'sample.tsx',
			code: `export default () => (\n  <div>\n    {/* prettier-ignore */}\n    <span   a b />\n  </div>\n)\n`,
			rules: { 'epic-web/no-prettier-ignore': 'warn' },
		})
		expect(noPrettierIgnoreDiagnostics(result)).toHaveLength(1)
	})
})
