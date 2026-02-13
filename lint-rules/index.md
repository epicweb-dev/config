# Lint rules

Custom lint rules for this package live in this directory.

Each rule should have:

- implementation: `*.js`
- tests: `*.test.js`
- documentation: `*.md`

Rules are registered through [`epic-web-plugin.js`](./epic-web-plugin.js), which
uses `eslintCompatPlugin(...)` so rules can use Oxlint's `createOnce` API while
remaining ESLint-compatible.

## Rules

- [`epic-web/no-manual-dispose`](./no-manual-dispose.md)
- [`epic-web/prefer-dispose-in-tests`](./prefer-dispose-in-tests.md)
