import { RuleTester } from 'eslint'
import { afterEach, beforeEach, describe, expect, it, test } from 'vitest'

import plugin from './epic-web-plugin.js'

const preferDisposeInTestsRule =
	plugin.rules['prefer-dispose-in-tests']

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.itSkip = it.skip
RuleTester.afterEach = afterEach
RuleTester.beforeEach = beforeEach

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
})

test('is oxlint optimized and eslint compatible', () => {
	expect(typeof preferDisposeInTestsRule.createOnce).toBe('function')
	expect(typeof preferDisposeInTestsRule.create).toBe('function')
})

ruleTester.run('prefer-dispose-in-tests', preferDisposeInTestsRule, {
	valid: [
		{
			name: 'allows shared suite hooks for larger suites',
			code: `
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
			`,
		},
		{
			name: 'allows hooks that mutate outer shared state',
			code: `
				describe('user', () => {
					let user

					beforeEach(() => {
						user = createUser()
					})

					test('renders', () => {
						expect(user).toBeDefined()
					})
				})
			`,
		},
		{
			name: 'allows callback parameter hooks',
			code: `
				describe('legacy done callback', () => {
					beforeEach((done) => {
						createUser(() => done())
					})

					test('renders', () => {
						expect(true).toBe(true)
					})
				})
			`,
		},
		{
			name: 'allows hooks that use this context',
			code: `
				describe('mocha style', function () {
					beforeEach(function () {
						this.timeout(1000)
					})

					test('works', function () {
						expect(true).toBe(true)
					})
				})
			`,
		},
		{
			name: 'allows known framework lifecycle helpers by default',
			code: `
				describe('timers', () => {
					beforeEach(() => {
						vi.useFakeTimers()
					})

					afterEach(() => {
						void vi.useRealTimers()
					})

					test('advances time', () => {
						expect(true).toBe(true)
					})
				})
			`,
		},
		{
			name: 'allows setup files with hooks and no tests',
			filename: '/workspace/setup-tests.js',
			code: `
				beforeEach(() => {
					vi.clearAllMocks()
				})
			`,
		},
		{
			name: 'allows beforeEach when suite also has shared beforeAll setup',
			code: `
				describe('http server', () => {
					beforeAll(() => {
						server.listen()
					})

					beforeEach(() => {
						server.resetHandlers()
					})

					afterAll(() => {
						server.close()
					})

					test('request one', () => {
						expect(true).toBe(true)
					})

					test('request two', () => {
						expect(true).toBe(true)
					})
				})
			`,
		},
		{
			name: 'allows suite hooks exactly at default threshold',
			code: `
				describe('two tests is enough for suite hooks', () => {
					beforeAll(() => {
						connectDb()
					})

					afterAll(() => {
						disconnectDb()
					})

					test('first', () => {
						expect(true).toBe(true)
					})

					test('second', () => {
						expect(true).toBe(true)
					})
				})
			`,
		},
	],
	invalid: [
		{
			name: 'reports beforeEach in single-test suite',
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
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'beforeEach' } }],
		},
		{
			name: 'reports afterEach in suite without shared suite hooks',
			code: `
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
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'afterEach' } }],
		},
		{
			name: 'reports beforeAll in single-test suite',
			code: `
				describe('user', () => {
					beforeAll(() => {
						server.listen()
					})

					test('renders', () => {
						expect(true).toBe(true)
					})
				})
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'beforeAll' } }],
		},
		{
			name: 'reports afterAll in single-test suite',
			code: `
				describe('user', () => {
					afterAll(() => {
						server.close()
					})

					test('renders', () => {
						expect(true).toBe(true)
					})
				})
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'afterAll' } }],
		},
		{
			name: 'reports top-level beforeEach when tests are colocated',
			code: `
				beforeEach(() => {
					createUser()
				})

				test('renders', () => {
					expect(true).toBe(true)
				})
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'beforeEach' } }],
		},
		{
			name: 'reports nested suite beforeEach with one local test',
			code: `
				describe('outer', () => {
					test('outer test', () => {
						expect(true).toBe(true)
					})

					describe('inner', () => {
						beforeEach(() => {
							setupInner()
						})

						test('inner test', () => {
							expect(true).toBe(true)
						})
					})
				})
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'beforeEach' } }],
		},
		{
			name: 'reports framework hooks when allowKnownFrameworkHooks is disabled',
			options: [{ allowKnownFrameworkHooks: false }],
			code: `
				describe('timers', () => {
					beforeEach(() => {
						vi.useFakeTimers()
					})

					test('advances time', () => {
						expect(true).toBe(true)
					})
				})
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'beforeEach' } }],
		},
		{
			name: 'reports suite hooks when minimumTestsForSuiteHooks is higher',
			options: [{ minimumTestsForSuiteHooks: 3 }],
			code: `
				describe('two tests not enough when threshold is three', () => {
					beforeAll(() => {
						connectDb()
					})

					test('first', () => {
						expect(true).toBe(true)
					})

					test('second', () => {
						expect(true).toBe(true)
					})
				})
			`,
			errors: [{ messageId: 'preferDisposables', data: { hookName: 'beforeAll' } }],
		},
	],
})
