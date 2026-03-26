import { describe, expect, it } from 'vitest'

import {
	runOxlint,
	writeOxlintFixture,
} from './oxlint-test-utils.js'

async function cleanupFixture(fixture) {
	// oxlint-disable-next-line epic-web/no-manual-dispose
	await fixture[Symbol.asyncDispose]()
}

describe('epic-web/prefer-dispose-in-tests', () => {
	it('reports lifecycle hooks that can move into a test body', async () => {
		const fixture = await writeOxlintFixture({
			filename: 'sample.test.js',
			code: `
				describe('user', () => {
					beforeEach(() => {
						createUser()
					})

					test('renders', () => {
						expect(true).toBe(true)
					})
				})
			`,
			rules: {
				'epic-web/prefer-dispose-in-tests': 'warn',
			},
		})
		try {
			const result = await runOxlint(fixture)
			expect(result.diagnostics).toHaveLength(1)
			expect(result.diagnostics[0]).toMatchObject({
				code: 'epic-web(prefer-dispose-in-tests)',
				severity: 'warning',
			})
			expect(result.diagnostics[0].message).toContain('instead of beforeEach')
		} finally {
		await cleanupFixture(fixture)
		}
	})

	it('allows larger shared suites and known framework hooks', async () => {
		const fixture = await writeOxlintFixture({
			filename: 'sample.test.js',
			code: `
				describe('timers', () => {
					beforeAll(() => {
						server.listen()
					})

					beforeEach(() => {
						vi.useFakeTimers()
					})

					afterAll(() => {
						server.close()
					})

					test('first', () => {
						expect(true).toBe(true)
					})

					test('second', () => {
						expect(true).toBe(true)
					})
				})
			`,
			rules: {
				'epic-web/prefer-dispose-in-tests': 'warn',
			},
		})
		try {
			const result = await runOxlint(fixture)
			expect(result.diagnostics).toHaveLength(0)
		} finally {
		await cleanupFixture(fixture)
		}
	})

	it('honors rule options in overrides', async () => {
		const fixture = await writeOxlintFixture({
			filename: 'sample.test.js',
			code: `
				describe('timers', () => {
					beforeEach(() => {
						vi.useFakeTimers()
					})

					test('works', () => {
						expect(true).toBe(true)
					})
				})
			`,
			rules: {
				'epic-web/prefer-dispose-in-tests': [
					'warn',
					{ allowKnownFrameworkHooks: false },
				],
			},
		})
		try {
			const result = await runOxlint(fixture)
			expect(result.diagnostics).toHaveLength(1)
			expect(result.diagnostics[0].message).toContain('instead of beforeEach')
		} finally {
		await cleanupFixture(fixture)
		}
	})
})
