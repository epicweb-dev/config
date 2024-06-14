# Arrow Parens

Date: 2024-06-13

Status: accepted

## Context

Prettier has a configuration option called `arrowParens` which decides whether
to add parentheses around the arguments of arrow functions. The available
options are:

- "always" - Add parentheses around the arguments of arrow functions.
- "avoid" - Only add parentheses around the arguments of arrow functions if it
  improves readability.

The "always" option adds parentheses around the arguments of arrow functions,
even if there's only one argument. This can result in unnecessary parentheses in
the code.

The "avoid" option removes parentheses around the arguments if there is only one
argument (and that one argument is not being destructured or defaulted). This
means that if the argument is a single identifier, it will be printed without
parentheses. However, if the argument is a more complex expression, parentheses
will be added due to syntax requirements.

Just reading those descriptions demonstrates that the rules around when it's ok
to avoid parentheses are more complicated than the simple rule of: "always have
parentheses".

Additionally, consider this: if you have a single argument in an arrow function,
you will not have parentheses around it. If you then decide to destructure it,
add an additional argument, add a type, or add a default value, you will have to
add parentheses.

We want to avoid the extra work required to refactor code as much as possible.
Additionally, simpler rules are often better. The simple rule of "always have
parentheses" around the arguments of arrow functions is much simpler.

## Decision

Update the prettier config from "avoid" to "always."

## Consequences

People will need to reformat their code when they update `@epic-web/config`. In
accordance to our [semver policy](./003-semver.md), we will not be treating this
as a major version bump.
