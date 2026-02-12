# Immutable Action Pinning

Date: 2026-02-12

Status: accepted

## Context

This project depends on third-party GitHub Actions in its release workflow.
Using mutable version tags (for example `@v6`) is convenient, but it allows the
effective code we run in CI to change without a repository change.

For supply-chain safety and reproducibility, GitHub recommends pinning actions
to immutable commit SHAs.

## Decision

Pin third-party actions in workflows to immutable commit SHAs and keep a comment
with the corresponding version tag for readability.

Example:

```yml
uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

## Consequences

- CI execution becomes deterministic and easier to audit.
- Upgrades require explicit PR changes, which improves visibility.
- We need periodic maintenance to move SHA pins to newer upstream releases.
