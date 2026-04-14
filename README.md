<div>
  <h1 align="center"><a href="https://npm.im/@epic-web/config">👮 @epic-web/config</a></h1>
  <strong>
    Reasonable Oxlint, Oxfmt, and TypeScript configs for epic web devs
  </strong>
  <p>
    This makes assumptions about the way you prefer to develop software and gives you configurations that will actually help you in your development.
  </p>
</div>

```
npm install @epic-web/config
```

<div align="center">
  <a
    alt="Epic Web logo"
    href="https://www.epicweb.dev"
  >
    <img
      width="300px"
      src="https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/257881576-fd66040b-679f-4f25-b0d0-ab886a14909a.png"
    />
  </a>
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![MIT License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## The problem

You're a professional, but you're mature enough to know that even professionals
can make mistakes, and you value your time enough to not want to waste time
configuring code quality tools or babysitting them.

## This solution

This package provides shared defaults for the tools this repo currently ships:

- Oxlint
- Oxfmt
- TypeScript

## Decisions

You can learn about the different decisions made for this project in
[the decision docs](./docs/decisions).

## Usage

Technically you configure everything yourself, but you can use the configs in
this project as a starter for your projects (and in some cases you don't need to
configure anything more than the defaults).

### Oxfmt (formatter)

Install [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) alongside this
package (it is listed in `peerDependencies`).

The `@epic-web/config/oxfmt` entry resolves to a plain `.mjs` preset so Node
does not need to strip TypeScript from files under `node_modules` when you
extend it.

Create an `oxfmt.config.ts` file in your project root:

```ts
import epicOxfmt from '@epic-web/config/oxfmt'
import { defineConfig } from 'oxfmt'

export default defineConfig({
	...epicOxfmt,
	printWidth: 100,
})
```

Oxfmt does not have an `extends` field; spreading the preset and setting any
top-level option afterward is how you override it (same idea for
`ignorePatterns`: spread `epicOxfmt.ignorePatterns` and append paths).

Add scripts (see the
[migration guide](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html)):

```json
{
	"scripts": {
		"format": "oxfmt",
		"format:check": "oxfmt --check"
	}
}
```

The shared config sets 80 `printWidth`, tabs (spaces only in `package.json`
overrides), no semicolons, single quotes, `trailingComma: "all"`, Tailwind class
sorting via native `sortTailwindcss`, and MDX overrides for `proseWrap` /
`htmlWhitespaceSensitivity`. Options that Oxfmt does not support
(`insertPragma`, `requirePragma`) are omitted.

[`ignorePatterns`](https://oxc.rs/docs/guide/usage/formatter/ignore-files.html)
covers common build, cache, Playwright, Prisma, and lockfile paths used across
Epic projects. Adjust in your `defineConfig` if your layout differs.

<details>
  <summary>Customizing Oxfmt</summary>

If you want to customize things heavily, you can copy the options from
[`oxfmt-preset.mjs`](./oxfmt-preset.mjs) into your own config. For small tweaks,
keep spreading `epicOxfmt` and override or extend fields as in the example
above.

Use `"type": "module"` in your `package.json` when your `oxfmt.config.ts` uses
`import` / `export` syntax (same as for other ESM tooling).

</details>

### TypeScript

Create a `tsconfig.json` file in your project root with the following content:

```json
{
	"extends": ["@epic-web/config/typescript"],
	"include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
	"compilerOptions": {
		"paths": {
			"#app/*": ["./app/*"],
			"#tests/*": ["./tests/*"]
		}
	}
}
```

Create a `reset.d.ts` file in your project with these contents:

```typescript
import '@epic-web/config/reset.d.ts'
```

<details>
  <summary>Customizing TypeScript</summary>

Learn more from
[the TypeScript docs here](https://www.typescriptlang.org/tsconfig/#extends).

</details>

### Oxlint

Create a `.oxlintrc.json` file in your project root with the following content:

```json
{
	"extends": ["./node_modules/@epic-web/config/oxlint-config.json"]
}
```

This config includes the custom `epic-web/*` rules documented in
[`lint-rules/index.md`](./lint-rules/index.md).

Note: `typescript/no-misused-promises` and `typescript/no-floating-promises` are
type-aware in Oxlint and require the type-aware setup described in the Oxlint
docs.

Some Oxlint rule IDs still use the `eslint/` namespace because that is how
Oxlint exposes those compatibility rules. You do not need to install ESLint to
use them.

The `epic-web/no-prettier-ignore` rule warns on `prettier-ignore` in JavaScript
and TypeScript comments and can auto-fix them to `oxfmt-ignore` for Oxfmt. Keep
`prettier-ignore` where Oxfmt still recommends it (for example non-JS regions in
Vue); see the
[inline ignore comments](https://oxc.rs/docs/guide/usage/formatter/ignore-comments.html)
docs.

#### Not yet covered

The following rule families are intentionally omitted because they are not yet
part of the Oxlint config this package ships:

- `import/order`
- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`
- `testing-library/*`
- `jest-dom/*`
- most `vitest/*` rules
- `playwright/*`

## License

MIT

<!-- prettier-ignore-start -->
[build-badge]: https://img.shields.io/github/actions/workflow/status/epicweb-dev/config/release.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/epicweb-dev/config/actions?query=workflow%3Arelease
[license-badge]: https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square
[license]: https://github.com/epicweb-dev/config/blob/main/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://kentcdodds.com/conduct
<!-- prettier-ignore-end -->

<!-- manual releases: 1 -->
