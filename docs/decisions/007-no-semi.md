# No Semicolons

Date: 2024-06-14

Status: accepted

## Context

First off, I want to call out that by not using semicolons, we are not relying
on
[automatic semicolon insertion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion).
We have build tools and things that are going to compile our code and minify it
and everything, they'll add the semicolons for us automatically.

Another issue people have with leaving off semicolons is you can start a line
with a bracket or a parentheses and that can cause problems if the previous line
doesn't have a semicolon. We're not gonna have those problems because we use the
[`no-unexpected-multiline`](https://eslint.org/docs/latest/rules/no-unexpected-multiline)
rule from ESLint (not to mention prettier makes the code look funny if you try
that). For example, if you were to write something like this:

<!-- prettier-ignore -->
```js
let firstPerson
const people = [
	{ id: 1, name: 'Bob', age: 8 },
	{ id: 2, name: 'Alice', age: 11 },
	{ id: 3, name: 'Charlie', age: 15 },
	{ id: 4, name: 'Dave', age: 7 },
	{ id: 5, name: 'Eve', age: 13 }
]
[firstPerson] = people
```

Prettier would rewrite it to look like this:

```js
let firstPerson
const people = ([
	{ id: 1, name: 'Bob', age: 8 },
	{ id: 2, name: 'Alice', age: 11 },
	{ id: 3, name: 'Charlie', age: 15 },
	{ id: 4, name: 'Dave', age: 7 },
	{ id: 5, name: 'Eve', age: 13 },
][firstPerson] = people)
```

Which makes it much more obvious something weird is happening. This is just a
non-issue.

Sure, ok, so the problems aren't really problems. Great. But why turn off
semicolons? Turning off semicolons makes the process of refactoring our code
easier by not having to babysit the semicolons. For example:

<!-- prettier-ignore -->
```js
const people = [
	{ id: 1, name: 'Bob', age: 8 },
	{ id: 2, name: 'Alice', age: 11 },
	{ id: 3, name: 'Charlie', age: 15 },
	{ id: 4, name: 'Dave', age: 7 },
	{ id: 5, name: 'Eve', age: 13 },
];

const olderThanTenAges = people
	.map((person) => person.age)
	.filter((age) => age > 10);
```

Notice that the final chained operation has a semicolon. If I decided to do the
filter before the map I have to first remove the semicolon, then move the line.
I call this "semicolon babysitting". However, if I don't have semicolons then I
simply move the line.

It's small, but it's also just one less thing to worry about when refactoring
code and it shows up in enough situations like this one and others that it's
enough reason to set `semi` to `false`.

## Decision

Set the prettier config to `semi: false`.

## Consequences

This is the way the config was from the beginning so it won't affect existing
users. Anyone who wants to use this config and wants to use semicolons can
override that option.
