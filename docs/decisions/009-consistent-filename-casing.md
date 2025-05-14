# Title

Date: 2025-05-14

Status: accepted
[0005](0005-example.md)

## Context

TypeScript follows the case sensitivity rules of the file system it’s running on.
This can be problematic if some developers are working in a case-sensitive file system and others aren’t.
If a file attempts to import fileManager.ts by specifying ./FileManager.ts the file will be found
in a case-insensitive file system, but not on a case-sensitive file system.

When this option is set, TypeScript will issue an error if a program tries to include a file
by a casing different from the casing on disk.

## Decision

set [forceConsistentCasingInFileNames](https://www.typescriptlang.org/tsconfig/forceConsistentCasingInFileNames.html) to true in Typescript

## Consequences

Ensure seamless workflow between developers with different operating systems.