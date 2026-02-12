# Automated Dependency Updates

Date: 2026-02-12

Status: accepted

## Context

This project is intentionally dependency-heavy because it packages shared
tooling configuration. Staying current with ecosystem updates is part of the
value proposition.

Manual dependency upgrades work, but they tend to become sporadic and create
larger, riskier update batches over time.

## Decision

Enable Dependabot for this repository with weekly update checks for:

- npm dependencies (root package)
- GitHub Actions workflow dependencies

## Consequences

- Dependency updates arrive in smaller, more reviewable PRs.
- Security and compatibility updates are surfaced faster.
- Maintainers still need to validate major version updates before merging.
