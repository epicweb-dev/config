# Title

Date: 2024-05-27

Status: accepted

## Context

Import order matters. It determines the order in which modules will be
evaluated. Most of the time this doesn't make an impact on the user experience.
So the import order normally doesn't actually matter.

Having a pre-defined way to sort imports can reduce the amount of noise in PRs,
especially when people's editors handle automatic imports differently.

Having the editor yell at you because the import order is not correct is super
annoying, but having the editor do this automatically is nice. If it's something
you don't even have to think about then it's fine.

Prettier is often used for formatting. Changing the import order isn't really
formatting though, so even though there is
[a plugin](https://npm.im/prettier-plugin-organize-imports) to make prettier
format the import order, it has a few limitations and it's philosophically
counter to the purpose of prettier because changing the import order technically
affects the semantics of the code.

ESLint on the other hand can handle this for us automatically and allows us to
customize the order itself a bit better. Additionally, if you have a side-effect
import (like `import './foo.js'`), it doesn't enforce the import order.

## Decision

Use the `eslint-plugin-import-x` plugin to sort imports.

## Consequences

People who don't like the sorting will need to disable it either inline or in
their own config.
