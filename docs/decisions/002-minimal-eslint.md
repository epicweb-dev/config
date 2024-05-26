# Minimal ESLint

Date: 2024-05-25

Status: accepted

## Context

There are endless ESLint rules you can enable for your project (no really,
because you can make custom ones there is no end to them). Each rule you enable
does three things:

1. Helps catch potential issues
2. Slows down running ESLint
3. Increases the number of annoying false positives

Two of these things are costs and one is a benefit. As professional developers,
we need to evaluate each rule based on whether that rule's benefit outweighs the
cost.

We determine this by evaluating the risk of an issue slipping through and the
impact on the user. This is going to be relatively subjective for everyone.

There are some rules which cover high impact issues, but are so unlikely to
happen in any project that they are not worth including. For example,
`no-compare-neg-zero` is protecting you from a pretty odd behavior, but the
liklihood of it catching a real issue is so low it's not worth including.

Another thing to consider is for TypeScript files, there are many rules which
are completely redudant. For example, `no-setter-return` is a redudant rule in a
TypeScript project because TypeScript will give a compiler error if you try to
return from a setter.

## Decision

We keep the rule set as minimal as reasonable.

At the current time, we're probably over-minimal and more rules should probably
be added.

## Consequences

People wanting a more strict ESLint will have to add more rules themselves. This
is very easy to do (especially with ESLint v9's flat config).
