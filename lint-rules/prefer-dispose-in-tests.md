# `epic-web/prefer-dispose-in-tests`

Prefer disposable setup (`using`/`await using` with `dispose`/`disposeAsync`)
instead of `beforeEach`/`afterEach`/`beforeAll`/`afterAll` when cleanup can
reasonably live in each test body.

This rule is enabled as `warn` in test files by the shared config.

## Runtime compatibility

This rule is authored in Oxlint's optimized style (`createOnce` + `before`),
then exposed to ESLint via `eslintCompatPlugin` from `@oxlint/plugins`.

That gives:

- faster execution path in Oxlint JS plugins
- unchanged behavior in ESLint

## Why

Disposable test setup keeps setup and cleanup in the same lexical scope and
reduces hidden global lifecycle behavior in flat tests.

## What it reports

The rule reports lifecycle hooks that can usually be moved to disposable setup
inside each test.

## What it intentionally allows

To avoid noisy false positives, the rule skips reporting when disposable
refactors are often not straightforward:

- setup files with hooks but no colocated tests
- hooks that use callback params (for example, `done`) or `this`
- hooks that mutate shared outer state
- common framework-level timer/mock lifecycle hooks
- suite-level shared setup in larger suites

## Options

```js
{
	allowKnownFrameworkHooks: true,
	minimumTestsForSuiteHooks: 2,
}
```

- `allowKnownFrameworkHooks` (boolean, default `true`)
  - Allows known framework lifecycle calls like `vi.useFakeTimers()`.
- `minimumTestsForSuiteHooks` (integer, default `2`)
  - Minimum test count before suite-level shared hooks are considered
    reasonable.

## Example override

```js
import { config as defaultConfig } from '@epic-web/config/eslint'
import epicWebPlugin from '@epic-web/config/eslint-plugin'

/** @type {import("eslint").Linter.Config[]} */
export default [
	...defaultConfig,
	{
		files: ['**/*.test.*', '**/*.spec.*'],
		plugins: { 'epic-web': epicWebPlugin },
		rules: {
			'epic-web/prefer-dispose-in-tests': [
				'warn',
				{ minimumTestsForSuiteHooks: 3 },
			],
		},
	},
]
```

## Source files

- implementation: [`prefer-dispose-in-tests.js`](./prefer-dispose-in-tests.js)
- tests: [`prefer-dispose-in-tests.test.js`](./prefer-dispose-in-tests.test.js)
