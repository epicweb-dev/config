# Oxfmt over Prettier

Date: 2026-04-14

Status: accepted

## Context

This package previously shipped a shared [Prettier](https://prettier.io)
configuration (`prettier.js`) and documented the `"prettier"` field in
`package.json` as the primary way to adopt consistent formatting across Epic Web
projects.

We already recommend [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) from
the same [Oxc](https://oxc.rs) project for fast linting.
[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) is Oxc’s formatter: it
targets Prettier-compatible output for many options, runs as a single native
CLI, and implements common needs (for example Tailwind class sorting) without
Prettier’s plugin ecosystem.

Teams were maintaining Prettier plus `prettier-plugin-tailwindcss` and separate
ignore files; lockfiles and generated paths were duplicated across
`.prettierignore` and formatter-adjacent tooling.

## Decision

Adopt **Oxfmt** as the shared formatter for `@epic-web/config`:

- Replace the Prettier entry point with a published `oxfmt-preset.mjs` (via
  `defineConfig`) and document `oxfmt` as a peer dependency.
- Map the old Prettier options into Oxfmt where supported; document gaps (for
  example `insertPragma` / `requirePragma`, and regex-based Tailwind attribute
  names).
- Centralize formatter-only ignores in `ignorePatterns` alongside `.gitignore`
  behavior described in the Oxfmt docs.
- Encourage `oxfmt-ignore` over `prettier-ignore` in JS/TS via the
  `epic-web/no-prettier-ignore` lint rule, while keeping `prettier-ignore` where
  Oxfmt still recommends it for non-JS regions.

## Consequences

**Positive**

- One vendor (Oxc) for lint + format, fewer moving parts and clearer upgrade
  paths.
- Faster formatting at scale; no Prettier plugin install for Tailwind sorting.
- Simpler consumer setup: `oxfmt` scripts and a single TypeScript config export.

**Negative / tradeoffs**

- Prettier plugins are not supported; anything that relied on an unsupported
  plugin needs another tool or must be dropped.
- Output is “Prettier-like” but not identical everywhere; teams should expect a
  one-time format churn when switching.
- Some Prettier options and comment forms have no equivalent; those are called
  out in `oxfmt-preset.mjs` and the readme.

Historical decision docs that mention Prettier remain valid as context for
_formatting style_; this decision supersedes the _tool choice_ for applying that
style in new work.
