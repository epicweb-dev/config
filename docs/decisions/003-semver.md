# Semantic Versioning

Date: 2024-05-25

Status: accepted

## Context

When you make a change that could break people's existing code, that should be
treated as a "breaking change" which corresponds to the first number in a semver
version number (called the "major version number").

For some people "breaking change" means "if it could break their build, it
should be a major version bump." Unfortunately for this project, that means
pretty much every change could be a breaking change. Doing things this way would
not only be annoying as a project maintainer, but also it diminishes the meaning
of a major version bump so if there really were an important major change we
couldn't communicate that effectively.

Some configurations in this project will affect the coming project's runtime
code (like how TypeScript is configured), but most of it will not (like how
prettier or ESLing is configured).

## Decision

Instead, in this project, we'll define breaking changes as:

1. If you have to change the way you consume the package
2. If the config changes your project's runtime

## Consequences

This means most version bumps will be patch/minor version bumps. Major version
bumps will happen if we change the name of a file, what the config module
exports, or the minimum version of Node/TypeScript that's supported.
