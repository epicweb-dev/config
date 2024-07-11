# New TS ESLint Rules

Date: 2024-07-08

Status: accepted

## Context

In [./002-minimal-eslint.md](002-minimal-eslint.md), it was stated:

> At the current time, we're probably over-minimal and more rules should
> probably be added.

[@onemen](https://github.com/onemen)
[created a discussion](https://github.com/epicweb-dev/config/discussions/7) to
enable more rules for TypeScript. As a result, some rules were enabled.

## Decision

Below is the justification for the rules being enabled:

- `@typescript-eslint/no-misused-promises` - It's pretty easy to forget to add
  `await` to a promise when doing a `if (condition) { ... }` (or similar).
- `@typescript-eslint/no-floating-promises` - It's pretty easy to forget to add
  `await` to a promise value. If you don't care about the return value, simply
  add `void` like so: `void deleteExpiredSessions()`.

And here's the justification for those which will not be enabled:

- `@typescript-eslint/require-await` - sometimes you really do want async
  without await to make a function async. TypeScript will ensure it's treated as
  an async function by consumers and that's enough for me.
- @typescript-eslint/prefer-promise-reject-errors - sometimes you aren't the one
  creating the error and you just want to propogate an error object with an
  unknown type.
- `@typescript-eslint/only-throw-error` - same reason as above. However this
  rule supports options to allow you to throw `any` and `unknown`.
  Unfortunately, in Remix you can throw Response objects and we don't want to
  enable this rule for those cases.
- `@typescript-eslint/no-unsafe-declaration-merging` - this is a rare enough
  problem (especially if you focus on types over interfaces) that it's not worth
  enabling.
- `@typescript-eslint/no-unsafe-enum-comparison` - enums are not recommended or
  used in epic projects, so it's not worth enabling.
- `@typescript-eslint/no-unsafe-unary-minus` - this is a rare enough problem
  that it's not worth enabling.
- `@typescript-eslint/no-base-to-string` - this doesn't handle when your object
  actually does implement toString unless you do so with a class which is not
  100% of the time. For example, the timings object in the epic stack uses
  defineProperty to implement toString. It's not high enough risk/impact to
  enable.
- `@typescript-eslint/no-non-null-assertion` - normally you should not use ! to
  tell TS to ignore the null case, but you're a responsible adult and if you're
  going to do that, the linter shouldn't yell at you about it.
- `@typescript-eslint/restrict-template-expressions` - toString is a feature of
  many built-in objects and custom ones. It's not worth enabling.
- `@typescript-eslint/no-confusing-void-expression` - what's confusing to one
  person isn't necessarily confusing to others. Arrow functions that call
  something that returns void is not confusing and the types will make sure you
  don't mess something up.

These each protect you from `any` and while it's best to avoid using `any`, it's
not worth having a lint rule yell at you when you do:

- `@typescript-eslint/no-unsafe-argument`
- `@typescript-eslint/no-unsafe-call`
- `@typescript-eslint/no-unsafe-member-access`
- `@typescript-eslint/no-unsafe-return`
- `@typescript-eslint/no-unsafe-assignment`

## Consequences

It's possible some projects are breaking some of the rules we enable. It's
unlikely that fixing those cases will pose much of a challenge.
