# Types Packages

Date: 2024-05-25

Status: accepted

## Context

Epic Web projects use Node.js and React. It would be really handy if this
project included the types for these packages by default.

However, doing this means the consumer doesn't get to choose the version of the
types which is a major issue.

## Decision

Don't include the types in dependencies.

## Consequences

Consumers will have to install `@types/` packages themselves.
