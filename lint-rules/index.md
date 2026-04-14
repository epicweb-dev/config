# Lint rules

Custom lint rules for this package live in this directory.

Each rule should have:

- implementation: `*.js`
- tests: `*.test.js`
- documentation: `*.md`

Rules are registered through [`epic-web-plugin.js`](./epic-web-plugin.js) as
Oxlint JS plugin rules.

## Rules

- [`epic-web/no-manual-dispose`](./no-manual-dispose.md)
- [`epic-web/no-prettier-ignore`](./no-prettier-ignore.md)
- [`epic-web/prefer-dispose-in-tests`](./prefer-dispose-in-tests.md)
