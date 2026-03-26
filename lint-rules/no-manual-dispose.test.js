import { describe, expect, test } from 'vitest'

import { runOxlint } from './oxlint-test-utils.js'

describe('epic-web/no-manual-dispose', () => {
	test('allows using declarations and ordinary cleanup helpers', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `
				test('reads a temp file', () => {
					using tempFile = createTempFile()
					return Bun.file(tempFile.path).text()
				})

				function cleanup(resource) {
					resource.dispose()
				}
			`,
			rules: {
				'epic-web/no-manual-dispose': 'warn',
			},
		})

		expect(result.diagnostics).toHaveLength(0)
	})

	test('reports direct symbol dispose calls', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `
				const tempFile = createTempFile()
				tempFile[Symbol.dispose]()
			`,
			rules: {
				'epic-web/no-manual-dispose': 'warn',
			},
		})

		expect(result.diagnostics).toHaveLength(1)
		expect(result.diagnostics[0]?.code).toBe('epic-web(no-manual-dispose)')
		expect(result.diagnostics[0]?.message).toContain('Do not call')
	})

	test('reports manual dispose calls inside finally blocks', async () => {
		const result = await runOxlint({
			filename: 'sample.js',
			code: `
				let tempFile
				try {
					tempFile = createTempFile()
				} finally {
					tempFile?.dispose()
				}
			`,
			rules: {
				'epic-web/no-manual-dispose': 'warn',
			},
		})

		expect(result.diagnostics).toHaveLength(1)
		expect(result.diagnostics[0]?.message).toContain(
			'Avoid manual disposal in `finally`',
		)
	})
})
