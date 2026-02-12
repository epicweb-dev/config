# Dependency Health Checks

Date: 2026-02-12

Status: accepted

## Context

Dependabot and dependency review workflows improve update safety, but we also
need ongoing visibility into dependency status between PRs.

Two basic checks provide strong signal:

- vulnerability audit (`npm audit`)
- outdated package reporting (`npm outdated`)

Running those checks on a schedule helps maintainers react quickly when the
ecosystem changes.

## Decision

Add a dedicated dependency health workflow that runs weekly (and manually) and
executes:

- `npm run audit`
- `npm run deps:outdated`

via `npm run deps:check`.

## Consequences

- Dependency risk and drift are surfaced proactively.
- Failures create an actionable maintenance queue.
- Maintainers can keep dependency upgrades incremental instead of bursty.
