# `epic-web/no-prettier-ignore`

Prefer
[`oxfmt-ignore`](https://oxc.rs/docs/guide/usage/formatter/ignore-comments.html)
over `prettier-ignore` in JavaScript and TypeScript source comments when using
Oxfmt.

Oxfmt still accepts `prettier-ignore` for compatibility, but `oxfmt-ignore` is
the preferred directive for JS/TS. Non-JS regions (for example Vue `<template>`
/ `<style>` or HTML) should continue to use `prettier-ignore` as documented by
Oxfmt.

## Rule details

This rule is **auto-fixable**: it renames directives in matched comments,
including:

- `prettier-ignore-next` → `oxfmt-ignore` (Oxfmt applies to the next statement)
- `prettier-ignore-start` / `prettier-ignore-end` → `oxfmt-ignore-start` /
  `oxfmt-ignore-end`

Verify range comments against current Oxfmt behavior after migrating.

## When not to use this rule

Disable this rule for files or comments where `prettier-ignore` must stay for
non-JS formatters or embedded languages.
