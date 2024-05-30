# Title

Date: 2024-05-30

Status: accepted

## Context

The best context for this can be gathered by reading
[the TypeScript docs on `verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax).

The short version of this is that it helps TypeScript (and other compilers that
strip types) to know whether to keep a module import or not.

The idea is: If the import is only there to import types, then it's removed. If
it imports values then it is not.

## Decision

Because it's more predictable behavior (and recommended by TypeScript) we will
enable this rule.

## Consequences

The only change people should experience with this change is a more consistent
and correct behavior. It's unlikely anyone will notice this change, but if they
do it will probably be because it fixed a bug.
