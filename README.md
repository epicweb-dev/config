<div>
  <h1 align="center"><a href="https://npm.im/@epic-web/config">👮 @epic-web/config</a></h1>
  <strong>
    Reasonable ESLint, Prettier, and TypeScript configs for epic web devs
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
can make mistakes and you value your time enough to not want to waste time
configuring code quality tools or babysitting them.

## This solution

This is a set of configurations you can use in your web projects to avoid
wasting time.

## Usage

### Prettier

The easiest way to use this config is in your `package.json`:

```json
"prettier": "@epic-web/config/prettier"
```

<details>
  <summary>Customizing prettier</summary>

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
		"types": ["@epic-web/config/reset.d.ts"],
		"paths": {
			"#app/*": ["./app/*"],
			"#tests/*": ["./tests/*"]
		}
	}
}
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
import defaultConfig from '@epic-web/config/eslint'

/** @type {import("eslint").Linter.Config} */
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
