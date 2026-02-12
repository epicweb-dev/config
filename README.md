<div>
  <h1 align="center"><a href="https://npm.im/@epic-web/config">👮 @epic-web/config</a></h1>
  <strong>
    Reasonable ESLint, Oxlint, Prettier, and TypeScript configs for epic web devs
  </strong>
  <p>
    This makes assumptions about the way you prefer to develop software and gives you configurations that will actually help you in your development.
  </p>
</div>

```
npm install @epic-web/config
```

> Requires Node.js `>=20.19.0`.

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

This is a set of configurations you can use in your web projects to avoid
wasting time.

## Decisions

You can learn about the different decisions made for this project in
[the decision docs](./docs/decisions).
We also automate dependency maintenance with Dependabot (see decision 012).

## Usage

Technically you configure everything yourself, but you can use the configs in
this project as a starter for your projects (and in some cases you don't need to
configure anything more than the defaults).

### Prettier

The easiest way to use this config is in your `package.json`:

```json
"prettier": "@epic-web/config/prettier"
```

<details>
  <summary>Customizing Prettier</summary>

If you want to customize things, you should probably just copy/paste the
built-in config. But if you really want, you can override it using regular
JavaScript stuff.

Create a `.prettierrc.js` file in your project root with the following content:

```js
import defaultConfig from '@epic-web/config/prettier'

/** @type {import("prettier").Options} */
export default {
	...defaultConfig,
	// .. your overrides here...
}
```

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

### ESLint

Create a `eslint.config.js` file in your project root with the following
content:

```js
import { config as defaultConfig } from '@epic-web/config/eslint'

/** @type {import("eslint").Linter.Config[]} */
export default [...defaultConfig]
```

<details>
  <summary>Customizing ESLint</summary>

Learn more from
[the Eslint docs here](https://eslint.org/docs/latest/extend/shareable-configs#overriding-settings-from-shareable-configs).

</details>

There are endless rules we could enable. However, we want to keep our
configurations minimal and only enable rules that catch real problems (the kind
that are likely to happen). This keeps our linting faster and reduces the number
of false positives.

### Oxlint

Create a `.oxlintrc.json` file in your project root with the following content:

```json
{
	"extends": ["./node_modules/@epic-web/config/oxlint-config.json"]
}
```

Note: `typescript/no-misused-promises` and `typescript/no-floating-promises` are
type-aware in Oxlint and require the type-aware setup described in the Oxlint
docs.

#### Unsupported rules

The following ESLint rules/plugins from this config are not yet available in
Oxlint, so they are intentionally omitted:

- `import/order`
- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`
- `@typescript-eslint/no-unused-vars` (falls back to `eslint/no-unused-vars`)
- `testing-library/*`
- `jest-dom/*`
- `vitest/*` (except `vitest/no-import-node-test`)
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
