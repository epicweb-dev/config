# Reset

Date: 2024-05-25

Status: accepted

## Context

There are some things I want "fixed" in every TypeScript project. For details
and examples, check
[the docs for `@total-typescript/ts-reset`](https://www.totaltypescript.com/ts-reset).

In addition to what's available in the `ts-reset` package, I also want to have
css variable support in the `style` prop of React elements.

I want to handle that automatically in the tsconfig, but the problem is you
can't disable it, so it's all or nothing and there could be situations where you
wouldn't want the reset to be applied.

## Decision

We'll create a `reset.d.ts` file and consumers will have to include it in their
`includes` manually.

## Consequences

It's a bit of extra work, and it's an extra file we have to expose, but it
strikes the best balance.
