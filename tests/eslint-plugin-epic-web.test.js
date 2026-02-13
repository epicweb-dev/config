import { ESLint } from 'eslint'
import { describe, expect, test } from 'vitest'

import epicWebEslintPlugin from '../eslint-plugin-epic-web.js'

async function lintWithRule(code, { filePath = '/virtual/example.test.ts' } = {}) {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: [
			{
				languageOptions: {
					ecmaVersion: 'latest',
					sourceType: 'module',
				},
				plugins: {
					'epic-web': epicWebEslintPlugin,
				},
				rules: {
					'epic-web/prefer-dispose-in-tests': 'error',
				},
			},
		],
	})

	const [result] = await eslint.lintText(code, { filePath })
	return result.messages.filter(
		(message) => message.ruleId === 'epic-web/prefer-dispose-in-tests',
	)
}

describe('epic-web/prefer-dispose-in-tests', () => {
	test('reports beforeEach hooks in single-test suites', async () => {
		const messages = await lintWithRule(`
			describe('user', () => {
				beforeEach(() => {
					createUser()
				})

				test('renders', () => {
					expect(true).toBe(true)
				})
			})
		`)

		expect(messages).toHaveLength(1)
		expect(messages[0]?.message).toContain('beforeEach')
	})

	test('reports afterEach hooks in multi-test suites without suite hooks', async () => {
		const messages = await lintWithRule(`
			describe('user', () => {
				afterEach(() => {
					cleanupUser()
				})

				test('renders', () => {
					expect(true).toBe(true)
				})

				test('updates', () => {
					expect(true).toBe(true)
				})
			})
		`)

		expect(messages).toHaveLength(1)
		expect(messages[0]?.message).toContain('afterEach')
	})

	test('reports beforeAll hooks when a suite has only one test', async () => {
		const messages = await lintWithRule(`
			describe('user', () => {
				beforeAll(() => {
					server.listen()
				})

				test('renders', () => {
					expect(true).toBe(true)
				})
			})
		`)

		expect(messages).toHaveLength(1)
		expect(messages[0]?.message).toContain('beforeAll')
	})

	test('allows suite hooks for shared setup when suite has many tests', async () => {
		const messages = await lintWithRule(`
			describe('server', () => {
				beforeAll(() => {
					server.listen()
				})

				afterEach(() => {
					server.resetHandlers()
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
		`)

		expect(messages).toHaveLength(0)
	})

	test('allows hooks that rely on mutable shared outer state', async () => {
		const messages = await lintWithRule(`
			describe('user', () => {
				let user

				beforeEach(() => {
					user = createUser()
				})

				test('renders', () => {
					expect(user).toBeDefined()
				})
			})
		`)

		expect(messages).toHaveLength(0)
	})

	test('allows known framework-wide lifecycle hooks', async () => {
		const messages = await lintWithRule(`
			describe('timers', () => {
				beforeEach(() => {
					vi.useFakeTimers()
				})

				afterEach(() => {
					vi.useRealTimers()
				})

				test('advances time', () => {
					expect(true).toBe(true)
				})
			})
		`)

		expect(messages).toHaveLength(0)
	})

	test('allows setup files with hooks but no colocated tests', async () => {
		const messages = await lintWithRule(
			`
				beforeEach(() => {
					vi.clearAllMocks()
				})
			`,
			{ filePath: '/virtual/setup-tests.ts' },
		)

		expect(messages).toHaveLength(0)
	})
})
