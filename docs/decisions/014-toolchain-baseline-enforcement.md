# Toolchain Baseline Enforcement

Date: 2026-02-12

Status: accepted

## Context

This repository now depends on a modern JavaScript toolchain baseline:

- Node.js `>=20.19.0`
- npm `10.9.4`

Declaring requirements is useful, but we also want those requirements enforced
consistently across local development and CI.

## Decision

Use multiple reinforcing controls:

- `package.json`:
  - `engines.node = ">=20.19.0"`
  - `packageManager = "npm@10.9.4"`
- `.npmrc`:
  - `engine-strict=true`
- `node-version`:
  - pinned to `20.19.0` and used by GitHub Actions via `node-version-file`

## Consequences

- Install/runtime mismatches are detected earlier.
- CI and local environments are more reproducible.
- Toolchain upgrades require explicit repository changes and validation.
