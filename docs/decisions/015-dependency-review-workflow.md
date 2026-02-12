# Dependency Review Workflow

Date: 2026-02-12

Status: accepted

## Context

Automated dependency update PRs improve maintenance cadence, but they also
increase the frequency of dependency graph changes. We want PR-time protection
against introducing known vulnerable packages.

GitHub provides a dedicated dependency review action that evaluates dependency
changes in pull requests and can fail checks based on vulnerability severity.

## Decision

Add a pull-request workflow that runs dependency review and fails for
vulnerabilities at `moderate` severity or above.

Also pin the action dependencies to immutable SHAs to keep workflow execution
deterministic.

## Consequences

- Vulnerable dependency changes are detected before merge.
- Security review is automated and consistently enforced in PRs.
- False positives may occasionally require manual review/overrides.
