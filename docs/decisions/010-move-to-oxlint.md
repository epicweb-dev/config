# Move to Oxlint

Date: 2026-03-26

Status: accepted

## Context

This package originally shipped both ESLint and Oxlint configuration. Over time,
the Oxlint side of the package became the simpler path to maintain and consume.

There are a few reasons for that:

1. Oxlint is dramatically faster, which makes local feedback and CI validation
   cheaper.
2. The configuration story is simpler when we only ship one linting toolchain.
3. The Oxlint project has an active and clearly invested team behind it, which
   makes it a good foundation to build on.
4. Oxlint's compatibility with many established ESLint rule IDs makes migration
   straightforward, so moving away from ESLint does not require a wholesale
   rethink of the existing rule set.

Because Oxlint can consume many familiar `eslint/...` rule identifiers and we
already author our custom rules as Oxlint JS plugins, the migration path is
mostly about removing duplicate package surface rather than redesigning the
linting rules themselves.

## Decision

Ship Oxlint as the package's linting solution and remove the published ESLint
configs, ESLint plugin entry points, and ESLint package dependencies.

## Consequences

- Consumers must migrate from the removed ESLint entry points to the Oxlint
  config.
- Some rule IDs may continue to use the `eslint/` namespace inside Oxlint
  config, because that is how Oxlint exposes compatibility rules.
- The package becomes smaller and easier to maintain because it only supports a
  single linting toolchain.
- Linting should be faster for both maintainers and consumers.
