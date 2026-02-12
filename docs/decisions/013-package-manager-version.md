# Package Manager Version

Date: 2026-02-12

Status: accepted

## Context

This repository uses npm and maintains a lockfile. Even with a lockfile, npm
minor/patch behavior can differ in subtle ways over time, which can lead to
inconsistent local and CI outcomes.

We recently upgraded a large dependency set and aligned on a modern Node
baseline. At that point, we also want reproducible package-manager behavior.

## Decision

Declare the npm version used by this repo in `package.json` via
`packageManager`:

```json
{
	"packageManager": "npm@10.9.4"
}
```

## Consequences

- Contributors and automation get clearer guidance on expected npm version.
- Tooling that respects `packageManager` can automatically select the right npm
  version.
- Future npm upgrades should be intentional and reviewed like any dependency
  update.
