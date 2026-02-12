# Minimum Node Version

Date: 2026-02-12

Status: accepted

## Context

Recent dependency upgrades raised the effective Node.js baseline for this
package:

- `eslint@10` requires Node `^20.19.0 || ^22.13.0 || >=24`
- `prettier-plugin-tailwindcss@0.7.x` requires Node `>=20.19`
- `vitest@4` requires Node `>=20`

Historically, this package did not declare an explicit `engines.node` field.
That can lead to confusing install/runtime failures for consumers running older
Node versions.

## Decision

Set the package engine requirement to:

```json
{
	"engines": {
		"node": ">=20.19.0"
	}
}
```

## Consequences

- Consumers get earlier and clearer feedback when using unsupported Node
  versions.
- This raises the documented minimum Node support for the package.
- According to our semver policy, changes to minimum Node support should be
  treated as a major version boundary when released.
