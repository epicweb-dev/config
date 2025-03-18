# Epic Programming Style Guide

This style guide is a collection of recommendations for writing code that is
easy to understand, maintain, and scale.

It goes hand-in-hand with the
[Epic Programming Principles](https://www.epicweb.dev/principles) and the
[Epic Web Config](https://github.com/epicweb-dev/config).

This is an opinionated style guide that's most useful for people who:

1. Don't have a lot of experience writing code and want some guidance on how to
   write code that's easy to understand, maintain, and scale.
2. Have experience writing code but want a set of standards to align on for
   working in a team.

Much of this is subjective, but most opinions are thought through and based on
years of experience working with large codebases and teams.

Note: Not every possible formatting opinion is mentioned because they are
handled automatically by [Prettier](https://prettier.io) anyway.

## JavaScript

This section will include TypeScript guidelines as well.

### Variables

#### References

Use `const` by default. Only use `let` when you need to reassign. Never use
`var`.

Remember that `const` does not mean "constant" in the sense of "unchangeable".
It means "constant reference". So if the value is an object, you can still
change the properties of the object.

#### Naming conventions

Use descriptive, clear names that explain the value's purpose. Avoid
single-letter names except in small loops or reducers where the value is obvious
from context.

```tsx
// ✅ Good
const workshopTitle = 'Web App Fundamentals'
const instructorName = 'Kent C. Dodds'
const isEnabled = true
const sum = numbers.reduce((total, n) => total + n, 0)
const names = people.map((p) => p.name)

// ❌ Avoid
const t = 'Web App Fundamentals'
const n = 'Kent C. Dodds'
const e = true
```

Follow [the naming cheatsheet](https://github.com/kettanaito/naming-cheatsheet)
by [Artem Zakharchenko](https://github.com/kettanaito) for more specifics on
naming conventions.

#### Constants

For truly constant values used across files, use uppercase with underscores:

```tsx
const BASE_URL = 'https://epicweb.dev'
const DEFAULT_PORT = 3000
```

### Objects

#### Literal syntax

Use object literal syntax for creating objects. Use property shorthand when the
property name matches the variable name.

```tsx
// ✅ Good
const name = 'Kent'
const age = 36
const person = { name, age }

// ❌ Avoid
const name = 'Kent'
const age = 36
const person = { name: name, age: age }
```

#### Computed property names

Use computed property names when creating objects with dynamic property names.

```tsx
// ✅ Good
const key = 'name'
const obj = {
	[key]: 'Kent',
}

// ❌ Avoid
const key = 'name'
const obj = {}
obj[key] = 'Kent'
```

#### Method shorthand

Use object method shorthand:

```tsx
// ✅ Good
const obj = {
	method() {
		// ...
	},
	async asyncMethod() {
		// ...
	},
}

// ❌ Avoid
const obj = {
	method: function () {
		// ...
	},
	asyncMethod: async function () {
		// ...
	},
}
```

> **Note**: Ordering of properties is not important (and not specified by the
> spec) and it's not a priority for this style guide either.

#### Accessors

Don't use them. When I do this:

```ts
console.log(person.name)
person.name = 'Bob'
```

All I expect to happen is to get the person's name and pass it to the `log`
function and to set the person's name to `'Bob'`.

Once you start using property accessors (getters and setters) then those
guarantees are off.

```ts
// ✅ Good
const person = {
	name: 'Hannah',
}

// ❌ Avoid
const person = {
	get name() {
		// haha! Now I can do something more than just return the name! 😈
		return this.name
	},
	set name(value) {
		// haha! Now I can do something more than just set the name! 😈
		this.name = value
	},
}
```

This violates the principle of least surprise.

### Arrays

#### Literal syntax

Use Array literal syntax for creating arrays.

```tsx
// ✅ Good
const items = [1, 2, 3]

// ❌ Avoid
const items = new Array(1, 2, 3)
```

#### Filtering falsey values

Use `.filter(Boolean)` to remove falsey values from an array.

```tsx
// ✅ Good
const items = [1, null, 2, undefined, 3]
const filteredItems = items.filter(Boolean)

// ❌ Avoid
const filteredItems = items.filter(
	(item) => item !== null && item !== undefined,
)
```

#### Array methods over loops

Use Array methods over loops when transforming arrays with pure functions. Use
`for` loops when imperative code is necessary. Never use `forEach` because it's
never more readable than a `for` loop and there's not situation where the
`forEach` callback function could be pure and useful. Prefer `for...of` over
`for` loops with an index unless the index is needed.

```tsx
// ✅ Good
const items = [1, 2, 3]
const doubledItems = items.map((n) => n * 2)

// ❌ Avoid
const doubledItems = []
for (const n of items) {
	doubledItems.push(n * 2)
}
```

```tsx
// ✅ Good
for (const n of items) {
	// ...
}

// ❌ Avoid
for (let i = 0; i < items.length; i++) {
	const n = items[i]
	// ...
}

// ❌ Avoid
items.forEach((n) => {
	// ...
})
```
```tsx
// ✅ Good
for (let i = 0; i < items.length; i++) {
	const n = items[i]
	console.log(`${n} at index ${i}`)
}

// ❌ Avoid
for (const n of items) {
	const i = items.indexOf(n)
	console.log(`${n} at index ${i}`)
}
```

#### Favor simple chains over `.reduce`

Favor simple `.filter` and `.map` chains over complex `.reduce` callbacks unless
performance is an issue.

```tsx
// ✅ Good
const items = [1, 2, 3, 4, 5]
const doubledGreaterThanTwoItems = items.filter((n) => n > 2).map((n) => n * 2)

// ❌ Avoid
const doubledItems = items.reduce((acc, n) => {
	acc.push(n * 2)
	return acc
}, [])
```

#### Spread to copy

Prefer the spread operator to copy an array:

```tsx
// ✅ Good
const itemsCopy = [...items]
const combined = [...array1, ...array2]

// ❌ Avoid
const itemsCopy = items.slice()
const combined = array1.concat(array2)
```

#### Non-mutative array methods

Prefer non-mutative array methods like `toReversed()`, `toSorted()`, and
`toSpliced()` when available. Otherwise, create a new array. Unless performance
is an issue or the original array is not referenced (as in a chain of method
calls).

```tsx
// ✅ Good
const reversedItems = items.toReversed()
const mappedFilteredSortedItems = items
	.filter((n) => n > 2)
	.map((n) => n * 2)
	.sort((a, b) => a - b)

// ❌ Avoid
const reversedItems = items.reverse()
```

#### Use `with`

Use `with` to create a new object with some properties replaced.

```tsx
// ✅ Good
const people = [{ name: 'Kent' }, { name: 'Sarah' }]
const personIndex = 0
const peopleWithKentReplaced = people.with(personIndex, { name: 'John' })

// ❌ Avoid (mutative)
const peopleWithKentReplaced = [...people]
peopleWithKentReplaced[personIndex] = { name: 'John' }
```

#### TypeScript array generic

Prefer the Array generic syntax over brackets for TypeScript types:

```tsx
// ✅ Good
const items: Array<string> = []
function transform(numbers: Array<number>) {}

// ❌ Avoid
const items: string[] = []
function transform(numbers: number[]) {}
```

Learn more about the reasoning behind the Array generic syntax in the
[Array Types in TypeScript](https://tkdodo.eu/blog/array-types-in-type-script)
article by [Dominik Dorfmeister](https://github.com/tkdodo). 

### Destructuring

#### Destructure objects and arrays

Use destructuring to make your code more terse.

```tsx
// ✅ Good
const { name, avatar, 𝕏: xHandle } = instructor
const [first, second] = items

// ❌ Avoid
const name = instructor.name
const avatar = instructor.avatar
const xHandle = instructor.𝕏
```

Destructuring multiple levels is fine when formatted properly by a formatter,
but can definitely get out of hand, so use your best judgement. As usual, try
both and choose the one you hate the least.

```tsx
// ✅ Good (nesting, but still readable)
const {
	name,
	avatar,
	𝕏: xHandle,
	address: [{ city, state, country }],
} = instructor

// ❌ Avoid (too much nesting)
const [
	{
		name,
		avatar,
		𝕏: xHandle,
		address: [
			{
				city: {
					latitude: firstCityLatitude,
					longitude: firstCityLongitude,
					label: firstCityLabel,
				},
				state: { label: firstStateLabel },
				country: { label: firstCountryLabel },
			},
		],
	},
] = instructor
```

### Strings

#### Interpolation

Prefer template literals over string concatenation.

```tsx
// ✅ Good
const name = 'Kent'
const greeting = `Hello ${name}`

// ❌ Avoid
const greeting = 'Hello ' + name
```

#### Multi-line strings

Use template literals for multi-line strings.

```tsx
// ✅ Good
const html = `
<div>
	<h1>Hello</h1>
</div>
`.trim()

// ❌ Avoid
const html = '<div>' + '\n' + '<h1>Hello</h1>' + '\n' + '</div>'
```

### Functions

#### Function declarations

Use function declarations over function expressions. Name your functions
descriptively.

This is important because it allows the function definition to be hoisted to the
top of the block, which means it's callable anywhere which frees your mind to
think about other things.

```tsx
// ✅ Good
function calculateTotal(items: Array<number>) {
	return items.reduce((sum, item) => sum + item, 0)
}

// ❌ Avoid
const calculateTotal = function (items: Array<number>) {
	return items.reduce((sum, item) => sum + item, 0)
}

const calculateTotal = (items: Array<number>) =>
	items.reduce((sum, item) => sum + item, 0)
```

#### Limit single-use functions

Limit creating single-use functions. By taking a large function and breaking it
down into many smaller functions, you reduce benefits of type inference and have
to define types for each function and make additional decisions about the number
and format of arguments. Instead, extract logic only when it needs to be reused
or when a portion of the logic is clearly part of a unique concern.

```tsx
// ✅ Good
function doStuff() {
	// thing 1
	// ...
	// thing 2
	// ...
	// thing 3
	// ...
	// thing N
}

// ❌ Avoid
function doThing1(param1: string, param2: number) {}
function doThing2(param1: boolean, param2: User) {}
function doThing3(param1: string, param2: Array<User>, param3: User) {}
function doThing4(param1: User) {}

function doStuff() {
	doThing1()
	// ...
	doThing2()
	// ...
	doThing3()
	// ...
	doThing4()
}
```

#### Default parameters

Prefer default parameters over short-circuiting.

```tsx
// ✅ Good
function createUser(name: string, role = 'user') {
	return { name, role }
}

// ❌ Avoid
function createUser(name: string, role: string) {
	role ??= 'user'
	return { name, role }
}
```

#### Early return

Return early to avoid deep nesting. Use guard clauses:

```tsx
// ✅ Good
function getMinResolutionValue(resolution: number | undefined) {
	if (!resolution) return undefined
	if (resolution <= 480) return MinResolution.noLessThan480p
	if (resolution <= 540) return MinResolution.noLessThan540p
	return MinResolution.noLessThan1080p
}

// ❌ Avoid
function getMinResolutionValue(resolution: number | undefined) {
	if (resolution) {
		if (resolution <= 480) {
			return MinResolution.noLessThan480p
		} else if (resolution <= 540) {
			return MinResolution.noLessThan540p
		} else {
			return MinResolution.noLessThan1080p
		}
	} else {
		return undefined
	}
}
```

#### Async/await

Prefer async/await over promise chains:

```tsx
// ✅ Good
async function fetchUserData(userId: string) {
	const user = await getUser(userId)
	const posts = await getUserPosts(user.id)
	return { user, posts }
}

// ✅ Fine, because wrapping in try/catch is annoying
function sendAnalytics(event: string) {
	return fetch('/api/analytics', {
		method: 'POST',
		body: JSON.stringify({ event }),
	}).catch(() => null)
}

// ❌ Avoid
function fetchUserData(userId: string) {
	return getUser(userId).then((user) => {
		return getUserPosts(user.id).then((posts) => ({ user, posts }))
	})
}

// ❌ Avoid
async function sendAnalytics(event: string) {
	try {
		return await fetch('/api/analytics', {
			method: 'POST',
			body: JSON.stringify({ event }),
		})
	} catch {
		// ignore
		return null
	}
}
```

#### Inline Callbacks

Anonymous inline callbacks should be arrow functions:

```tsx
// ✅ Good
const items = [1, 2, 3]
const doubledGreaterThanTwoItems = items.filter((n) => n > 2).map((n) => n * 2)

// ❌ Avoid
const items = [1, 2, 3]
const doubledGreaterThanTwoItems = items
	.filter(function (n) {
		return n > 2
	})
	.map(function (n) {
		return n * 2
	})
```

#### Arrow Parens

Arrow functions should include parentheses even with a single parameter:

<!-- prettier-ignore -->
```tsx
// ✅ Good
const items = [1, 2, 3]
const doubledGreaterThanTwoItems = items.filter((n) => n > 2).map((n) => n * 2)

// ❌ Avoid
const items = [1, 2, 3]
const doubledGreaterThanTwoItems = items.filter(n => n > 2).map(n => n * 2)
```

This makes it easier to add/remove parameters without having to futz around with
parentheses.

### Classes & Constructors

#### Avoid Classes

Avoid classes. Use objects and functions instead.

```tsx
type Role = 'admin' | 'user'

type User = {
	name: string
	role: Role
}

// ✅ Good
const user: User = {
	name: 'Brittany',
	role: 'admin',
}

function userHasAccess(user: User, requiredRole: Role) {
	return user.role === requiredRole
}

// ❌ Avoid
class User {
	name: string
	role: Role
	constructor(name: string, role: Role) {
		this.name = name
		this.role = role
	}
	hasAccess(requiredRole: Role) {
		return this.role === requiredRole
	}
}
```

#### Use as a performance optimization

Use classes as a performance optimization when you need to create a large number
of objects and you need to avoid the overhead of creating those objects with
functions. It's even better to use simple objects and functions, but if for some
reason you need the function to be attached to the object, then use a class.

```tsx
// ✅ Good
class Point {
	x: number
	y: number
	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
	distanceTo(other: Point) {
		const dx = this.x - other.x
		const dy = this.y - other.y
		return Math.sqrt(dx * dx + dy * dy)
	}
}

// ✅ Better
function distanceBetweenPoints(point1: Point, point2: Point) {
	const dx = point1.x - point2.x
	const dy = point1.y - point2.y
	return Math.sqrt(dx * dx + dy * dy)
}
const point1 = { x: 0, y: 0 }
const point2 = { x: 1, y: 1 }
const distance = distanceBetweenPoints(point1, point2)

// ❌ Avoid
function createPoint(x: number, y: number) {
	return {
		x,
		y,
		distanceTo(other: Point) {
			const dx = this.x - other.x
			const dy = this.y - other.y
			return Math.sqrt(dx * dx + dy * dy)
		},
	}
}
```

#### Avoid Inheritance

Avoid inheritance. If you need to extend a class, use duplication or composition
instead of inheritance.

```tsx
// ✅ Good
class User {
	name: string
	role: string
	constructor(name: string, role: string) {
		this.name = name
		this.role = role
	}
}

// ❌ Avoid
class User extends Person {
	role: string
	constructor(name: string, role: string) {
		super(name)
		this.role = role
	}
}
```

### Modules

#### File Organization

In general, files that change together should be located close to each other. In
Breaking a single file into multiple files should be avoided unless absolutely
necessary.

Specifics around file structure depends on a multitude of factors:

- Framework conventions
- Project size
- Team size

Strive to keep the file structure as flat as possible.

#### Module Exports

Framework and other tool conventions sometimes require default exports, but
prefer named exports in all other cases.

```tsx
// ✅ Good
export function add(a: number, b: number) {
	return a + b
}

export function subtract(a: number, b: number) {
	return a - b
}

// ❌ Avoid
export default function add(a: number, b: number) {
	return a + b
}
```

#### Barrel Files

Do **not** use barrel files. If you don't know what they are, good. If you do
and you like them, it's probably because you haven't experienced their issues
just yet, but you will. Just avoid them.

#### Pure Modules

In general, strive to keep modules pure (read more about this in
[Pure Modules](https://kentcdodds.com/blog/pure-modules)). This will make your
application start faster and be easier to understand and test.

```tsx
// ✅ Good
let serverData
export function init(a: number, b: number) {
	const el = document.getElementById('server-data')
	const json = el.textContent
	serverData = JSON.parse(json)
}

export function getServerData() {
	if (!serverData) throw new Error('Server data not initialized')
	return serverData
}

// ❌ Avoid
let serverData
const el = document.getElementById('server-data')
const json = el.textContent
export const serverData = JSON.parse(json)
```

> **Note**: In practice, you can't avoid some modules having side-effects (you
> gotta kick off the app somewhere), but most modules should be pure.

#### Import Conventions

Import order has semantic meaning (modules are executed in the order they're
imported), but if you keep most modules pure, then order shouldn't matter. For
this reason, having your imports grouped can make things a bit easier to read.

```ts
// Group imports in this order:
import 'node:fs' // Built-in
import 'match-sorter' // external packages
import '#app/components' // Internal absolute imports
import '../other-folder' // Internal relative imports
import './local-file' // Local imports
```

#### Type Imports

Each module imported should have a single import statement:

```tsx
// ✅ Good
import { type MatchSorterOptions, matchSorter } from 'match-sorter'

// ❌ Avoid
import { type MatchSorterOptions } from 'match-sorter'
import { matchSorter } from 'match-sorter'
```

#### Import Location

All static imports are executed at the top of the file so they should appear
there as well to avoid confusion.

```tsx
// ✅ Good
import { matchSorter } from 'match-sorter'

function doStuff() {
	// ...
}

// ❌ Avoid
function doStuff() {
	// ...
}

import { matchSorter } from 'match-sorter'
```

#### Export Location

All exports should be inline with the function/type/etc they are exporting. This
avoids duplication of the export identifier and having to keep it updated when
changing the name of the exported thing.

```tsx
// ✅ Good
export function add(a: number, b: number) {
	return a + b
}

// ❌ Avoid
function add(a: number, b: number) {
	return a + b
}
export { add }
```

#### Module Type

Use ECMAScript modules for everything. The age of CommonJS is over.

✅ Good **package.json**:

```json
{
	"type": "module"
}
```

Use **exports** field in **package.json** to explicitly declare module entry
points.

✅ Good **package.json**:

```json
{
	"exports": {
		"./utils": "./src/utils.js"
	}
}
```

#### Import Aliases

Use import aliases to avoid long relative paths. Use the standard `imports`
config field in **package.json** to declare import aliases.

✅ Good **package.json**:

```json
{
	"imports": {
		"#app/*": "./app/*",
		"#tests/*": "./tests/*"
	}
}
```

```tsx
import { add } from '#app/utils/math.ts'
```

> **Note**: Latest versions of TypeScript support this syntax natively.

#### Include file extensions

The ECMAScript module spec requires file extensions to be included in import
paths. Even though TypeScript doesn't require it, always include the file
extension in your imports. An exception to this is when importing a module which
has `exports` defined in its **package.json**.

```tsx
// ✅ Good
import { redirect } from 'react-router'
import { add } from './math.ts'

// ❌ Avoid
import { add } from './math'
```

### Properties

#### Use dot-notation

When accessing properties on objects, use dot-notation unless you can't
syntactically (like if it's dynamic or uses special characters).

```tsx
const user = { name: 'Brittany', 'data-id': '123' }

// ✅ Good
const name = user.name
const id = user['data-id']
function getUserProperty(user: User, property: string) {
	return user[property]
}

// ❌ Avoid
const name = user['name']
```

### Comparison Operators & Equality

#### Triple equals

Use triple equals (`===` and `!==`) for comparisons. This will ensure you're not
falling prey to type coercion.

That said, when comparing against `null` or `undefined`, using double equals
(`==` and `!=`) is just fine.

```tsx
// ✅ Good
const user = { id: '123' }
if (user.id === '123') {
	// ...
}
const a = null
if (a === null) {
	// ...
}
if (b != null) {
	// ...
}

// ❌ Avoid
if (a == null) {
	// ...
}
if (b !== null && b !== undefined) {
	// ...
}
```

#### Rely on truthiness

Rely on truthiness instead of comparison operators.

```tsx
// ✅ Good
if (user) {
	// ...
}

// ❌ Avoid
if (user === true) {
	// ...
}
```

#### Do not render falsiness

In JSX, do not render falsy values other than `null`.

```tsx
// ✅ Good
<div>
	{contacts.length ? <div>You have {contacts.length} contacts</div> : null}
</div>

// ❌ Avoid
<div>
	{contacts.length && <div>You have {contacts.length} contacts</div>}
</div>
```

#### Use ternaries

Use ternaries for simple conditionals. When automatically formatted, they should
be plenty readable, even on multiple lines. Ternaries are also the only
conditional in the spec (currently) which are expressions and can be used in
return statements and other places expressions are used.

```tsx
// ✅ Good
const isAdmin = user.role === 'admin'
const access = isAdmin ? 'granted' : 'denied'

function App({ user }: { user: User }) {
	return (
		<div className="App">
			{user.role === 'admin' ? <Link to="/admin">Admin</Link> : null}
		</div>
	)
}
```

#### Switch statement braces

Using braces in switch statements is recommended because it helps clarify the
scope of each case and it avoids variable declarations from leaking into other
cases.

```tsx
// ✅ Good
switch (action.type) {
	case 'add': {
		const { amount } = action
		add(amount)
		break
	}
	case 'remove': {
		const { removal } = action
		remove(removal)
		break
	}
}

// ❌ Avoid
switch (action.type) {
	case 'add':
		const { amount } = action
		add(amount)
		break
	case 'remove':
		const { removal } = action
		remove(removal)
		break
}
```

#### Avoid unnecessary ternaries

```tsx
// ✅ Good
const isAdmin = user.role === 'admin'
const value = input ?? defaultValue

// ❌ Avoid
const isAdmin = user.role === 'admin' ? true : false
const value = input != null ? input : defaultValue
```

### Blocks

#### Use braces for multi-line blocks

Use braces for multi-line blocks even when the block is the body of a single
statement.

```tsx
// ✅ Good
if (!user) return
if (user.role === 'admin') {
	abilities = ['add', 'remove', 'edit', 'create', 'modify', 'fly', 'sing']
}

// ❌ Avoid
if (user.role === 'admin')
	abilities = ['add', 'remove', 'edit', 'create', 'modify', 'fly', 'sing']
```

### Control Statements

#### Use statements

Unless you're using the value of the condition in an expression, prefer using
statements instead of expressions.

```tsx
// ✅ Good
if (user) {
	makeUserHappy(user)
}

// ❌ Avoid
user && makeUserHappy(user)
```

### Comments

#### Use comments to explain "why" not "what"

Comments should explain why something is done a certain way, not what the code
does. The names you use for variables and functions are "self-documenting" in a
sense that they explain what the code does. But if you're doing something in a
way that's non-obvious, comments can be helpful.

```tsx
// ✅ Good
// We need to sanitize lineNumber to prevent malicious use on win32
// via: https://example.com/link-to-issue-or-something
if (lineNumber && !(Number.isInteger(lineNumber) && lineNumber > 0)) {
	return { status: 'error', message: 'lineNumber must be a positive integer' }
}

// ❌ Avoid
// Check if lineNumber is valid
if (lineNumber && !(Number.isInteger(lineNumber) && lineNumber > 0)) {
	return { status: 'error', message: 'lineNumber must be a positive integer' }
}
```

#### Use TODO comments for future improvements

Use TODO comments to mark code that needs future attention or improvement.

```tsx
// ✅ Good
// TODO: figure out how to send error messages as JSX from here...
function getErrorMessage() {
	// ...
}

// ❌ Avoid
// FIXME: this is broken
function getErrorMessage() {
	// ...
}
```

#### Use FIXME comments for immediate problems

Use FIXME comments to mark code that needs immediate attention or improvement.

```tsx
// ✅ Good
// FIXME: this is broken
function getErrorMessage() {
	// ...
}
```

> **Note**: The linter should lint against FIXME comments, so this is useful if
> you are testing things out and want to make sure you don't accidentally commit
> your work in progress.

#### Use @ts-expect-error for TypeScript workarounds

When you need to work around TypeScript limitations (or your own knowledge gaps
with TypeScript), use `@ts-expect-error` with a comment explaining why.

```tsx
// ✅ Good
// @ts-expect-error no idea why this started being an issue suddenly 🤷‍♂️
if (jsxEl.name !== 'EpicVideo') return

// ❌ Avoid
// @ts-ignore
if (jsxEl.name !== 'EpicVideo') return
```

#### Use JSDoc for public APIs

Use JSDoc comments for documenting public APIs and their types.

```tsx
// ✅ Good
/**
 * This function generates a TOTP code from a configuration
 * and this comment will explain a few things that are important for you to
 * understand if you're using this function
 *
 * @param {OTPConfig} config - The configuration for the TOTP
 * @returns {string} The TOTP code
 */
export function generateTOTP(config: OTPConfig) {
	// ...
}
```

#### Avoid redundant comments

Don't add comments that just repeat what the code already clearly expresses.

```tsx
// ✅ Good
function calculateTotal(items: Array<number>) {
	return items.reduce((sum, item) => sum + item, 0)
}

// ❌ Avoid
// This function calculates the total of all items in the array
function calculateTotal(items: Array<number>) {
	return items.reduce((sum, item) => sum + item, 0)
}
```

### Semicolons

#### Don't use unnecessary semicolons

Don't use semicolons. The rules for when you should use semicolons are more
complicated than the rules for when you must use semicolons. With the right
eslint rule
([`no-unexpected-multiline`](https://eslint.org/docs/latest/rules/no-unexpected-multiline))
and a formatter that will format your code funny for you if you mess up, you can
avoid the pitfalls. Read more about this in
[Semicolons in JavaScript: A preference](https://kentcdodds.com/blog/semicolons-in-javascript-a-preference).

<!-- prettier-ignore -->
```tsx
// ✅ Good
const name = 'Kent'
const age = 36
const person = { name, age }
const getPersonAge = () => person.age
function getPersonName() {
	return person.name
}

// ❌ Avoid
const name = 'Kent';
const age = 36;
const person = { name, age };
const getPersonAge = () => person.age;
function getPersonName() {
	return person.name
}
```

The only time you need semicolons is when you have a statement that starts with
`(`, `[`, or `` ` ``. Instances where you do that are few and far between. You
can prefix that with a `;` if you need to and a code formatter will format your
code funny if you forget to do so (and the linter rule will bug you about it
too).

```tsx
// ✅ Good
const name = 'Kent'
const age = 36
const person = { name, age }

// The formatter will add semicolons here automatically
;(async () => {
	const result = await fetch('/api/user')
	return result.json()
})()

// ❌ Avoid
const name = 'Kent'
const age = 36
const person = { name, age }

// Don't manually add semicolons
;(async () => {
	const result = await fetch('/api/user')
	return result.json()
})()
```

### Types

#### Type Inference

Let TypeScript do the heavy lifting with type inference when possible:

```ts
// ✅ Good
function add(a: number, b: number) {
	return a + b // TypeScript infers return type as number
}

// ❌ Avoid
function add(a: number, b: number): number {
	return a + b
}
```

#### Generics

Use generics to create reusable components and functions. And treat type names
in generics the same way you treat any other kind of variable or parameter
(because a generic type is basically a parameter!):

```tsx
// ✅ Good
function createArray<Value>(length: number, value: Value): Array<Value> {
	return Array(length).fill(value)
}

// ❌ Avoid
function createStringArray(length: number, value: string) {
	return Array(length).fill(value)
}
```

#### Type Assertions

Avoid type assertions (`as`) when possible. Instead, use type guards or runtime
validation.

```tsx
// ✅ Good
function isError(maybeError: unknown): maybeError is Error {
	return (
		maybeError &&
		typeof maybeError === 'object' &&
		'message' in maybeError &&
		typeof maybeError.message === 'string'
	)
}

// ❌ Avoid
const error = caughtError as Error
```

#### Type Guards

Use type guards to narrow types and provide runtime type safety. Type guards are
functions that check if a value is of a specific type. The most common way to
create a type guard is using a type predicate.

```tsx
// ✅ Good - Using type predicate
function isError(maybeError: unknown): maybeError is Error {
	return (
		maybeError &&
		typeof maybeError === 'object' &&
		'message' in maybeError &&
		typeof maybeError.message === 'string'
	)
}

// ✅ Good - Using type predicate with schema validation
function isApp(app: unknown): app is App {
	return AppSchema.safeParse(app).success
}

// ✅ Good - Using type predicate with composition
function isExampleApp(app: unknown): app is ExampleApp {
	return isApp(app) && app.type === 'example'
}

// ❌ Avoid - Not using type predicate
function isApp(app: unknown): boolean {
	return typeof app === 'object' && app !== null
}
```

Type predicates use the syntax `parameterName is Type` to tell TypeScript that
the function checks if the parameter is of the specified type. This allows
TypeScript to narrow the type in code blocks where the function returns true.

```tsx
// Usage example:
const maybeApp: unknown = getSomeApp()
if (isExampleApp(maybeApp)) {
	// TypeScript now knows that maybeApp is definitely an ExampleApp
	maybeApp.type // TypeScript knows this is 'example'
}
```

#### Schema Validation

Use schema validation (like Zod) for runtime type checking and type inference
when working with something that crosses the boundary of your codebase.

```tsx
// ✅ Good
const OAuthData = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	expiresAt: z.date(),
})
type OAuthData = z.infer<typeof OAuthDataSchema>

const oauthData = OAuthDataSchema.parse(rawData)

// ❌ Avoid
type OAuthData = {
	accessToken: string
	refreshToken: string
	expiresAt: Date
}
const oauthData = rawData as OAuthData
```

#### Unknown Type

Use `unknown` instead of `any` for values of unknown type. This forces you to
perform type checking before using the value.

```tsx
// ✅ Good
function handleError(error: unknown) {
	if (isError(error)) {
		console.error(error.message)
	} else {
		console.error('An unknown error occurred')
	}
}

// ❌ Avoid
function handleError(error: any) {
	console.error(error.message)
}
```

#### Type Coercion

Avoid implicit type coercion. Use explicit type conversion when needed. An
exception to this is working with truthiness.

```tsx
// ✅ Good
const number = Number(stringValue)
const string = String(numberValue)
if (user) {
	// ...
}

// ❌ Avoid
const number = +stringValue
const string = '' + numberValue
if (Boolean(user)) {
	// ...
}
```

### Naming Conventions

Learn and follow [Artem's](https://github.com/kettanaito)
[Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet). Here's a
summary:

```tsx
// ✅ Good
const firstName = 'Kent'
const friends = ['Kate', 'John']
const pageCount = 5
const hasPagination = postCount > 10
const shouldPaginate = postCount > 10

// ❌ Avoid
const primerNombre = 'Kent'
const amis = ['Kate', 'John']
const page_count = 5
const isPaginatable = postCount > 10
const onItmClk = () => {}
```

Key principles:

1. Use English for all names
2. Be consistent with naming convention (camelCase, PascalCase, etc.)
3. Names should be Short, Intuitive, and Descriptive (S-I-D)
4. Avoid contractions and context duplication
5. Function names should follow the A/HC/LC pattern:
   - Action (get, set, handle, etc.)
   - High Context (what it operates on)
   - Low Context (optional additional context)

For example: `getUserMessages`, `handleClickOutside`, `shouldDisplayMessage`

### Events

#### Event Constants

Define event constants using a const object. Use uppercase with underscores for
event names.

```tsx
// ✅ Good
export const EVENTS = {
	USER_CODE_RECEIVED: 'USER_CODE_RECEIVED',
	AUTH_RESOLVED: 'AUTH_RESOLVED',
	AUTH_REJECTED: 'AUTH_REJECTED',
} as const

// ❌ Avoid
export const events = {
	userCodeReceived: 'userCodeReceived',
	authResolved: 'authResolved',
	authRejected: 'authRejected',
}
```

#### Event Types

Use TypeScript to define event types based on the event constants.

```tsx
// ✅ Good
export type EventTypes = keyof typeof EVENTS

// ❌ Avoid
export type EventTypes =
	| 'USER_CODE_RECEIVED'
	| 'AUTH_RESOLVED'
	| 'AUTH_REJECTED'
```

#### Event Schemas

Define Zod schemas for event payloads to ensure type safety and runtime
validation.

```tsx
// ✅ Good
const CodeReceivedEventSchema = z.object({
	type: z.literal(EVENTS.USER_CODE_RECEIVED),
	code: z.string(),
	url: z.string(),
})

// ❌ Avoid
type CodeReceivedEvent = {
	type: 'USER_CODE_RECEIVED'
	code: string
	url: string
}
```

> **Note**: This is primarily useful because in event systems, you're typically
> crossing a boundary of your codebase (network etc.).

#### Event Cleanup

Always clean up event listeners when they're no longer needed.

```tsx
// ✅ Good
authEmitter.on(EVENTS.USER_CODE_RECEIVED, handleCodeReceived)
return () => {
	authEmitter.off(EVENTS.USER_CODE_RECEIVED, handleCodeReceived)
}

// ❌ Avoid
authEmitter.on(EVENTS.USER_CODE_RECEIVED, handleCodeReceived)
// No cleanup
```

#### Event Error Handling

Make certain to cover error cases and emit events for those.

```tsx
// ✅ Good
try {
	// event handling logic
} catch (error) {
	authEmitter.emit(EVENTS.AUTH_REJECTED, {
		error: getErrorMessage(error),
	})
}

// ❌ Avoid
try {
	// event handling logic
} catch (error) {
	console.error(error)
}
```

### Testing

#### Test User Interactions

Test components based on how users actually interact with them, not
implementation details:

> The more your tests resemble the way your software is used, the more
> confidence they can give you. -
> [Kent C. Dodds](https://x.com/kentcdodds/status/977018512689455106)

```tsx
// ✅ Good
test('User can add items to cart', async () => {
	render(<ProductList />)
	await userEvent.click(screen.getByRole('button', { name: /add to cart/i }))
	await expect(screen.getByText(/1 item in cart/i)).toBeInTheDocument()
})

// ❌ Avoid
test('Cart state updates when addToCart is called', () => {
	const { container } = render(<ProductList />)
	const addButton = container.querySelector('[data-testid="add-button"]')
	fireEvent.click(addButton)
	expect(
		container.querySelector('[data-testid="cart-count"]'),
	).toHaveTextContent('1')
})
```

#### Avoid Unnecessary Mocks

Only mock what's absolutely necessary. Most of the time, you don't need to mock
any of your own code or even dependency code.

```tsx
// ✅ Good
function Greeting({ name }: { name: string }) {
	return <div>Hello {name}</div>
}

test('Greeting displays the name', () => {
	render(<Greeting name="Kent" />)
	expect(screen.getByText('Hello Kent')).toBeInTheDocument()
})

// ❌ Avoid
test('Greeting displays the name', () => {
	const mockName = 'Kent'
	vi.mock('./greeting.tsx', () => ({
		Greeting: () => <div>Hello {mockName}</div>,
	}))
	render(<Greeting name={mockName} />)
	expect(container).toHaveTextContent('Hello Kent')
})
```

#### Mock External Services

Use MSW (Mock Service Worker) to mock external services. This allows you to test
your application's integration with external APIs without actually making
network requests.

```tsx
// ✅ Good
import { setupServer } from 'msw/node'
import { http } from 'msw'

const server = setupServer(
	http.get('/api/user', async ({ request }) => {
		return HttpResponse.json({
			name: 'Kent',
			role: 'admin',
		})
	}),
)

test('User data is fetched and displayed', async () => {
	render(<UserProfile />)
	await expect(await screen.findByText('Kent')).toBeInTheDocument()
})

// ❌ Avoid
test('User data is fetched and displayed', async () => {
	vi.spyOn(global, 'fetch').mockResolvedValue({
		json: () => Promise.resolve({ name: 'Kent', role: 'admin' }),
	})
	render(<UserProfile />)
	await expect(await screen.findByText('Kent')).toBeInTheDocument()
})
```

#### Use Test Function

Use the `test` function instead of `describe` and `it`. This makes tests more
straightforward and easier to understand.

```tsx
// ✅ Good
test('User can log in with valid credentials', async () => {
	render(<LoginForm />)
	await userEvent.type(
		screen.getByRole('textbox', { name: /email/i }),
		'kent@example.com',
	)
	await userEvent.type(
		screen.getByRole('textbox', { name: /password/i }),
		'password123',
	)
	await userEvent.click(screen.getByRole('button', { name: /login/i }))
	await expect(await screen.findByText('Welcome back!')).toBeInTheDocument()
})

// ❌ Avoid
describe('LoginForm', () => {
	it('should allow user to log in with valid credentials', async () => {
		render(<LoginForm />)
		await userEvent.type(
			screen.getByRole('textbox', { name: /email/i }),
			'kent@example.com',
		)
		await userEvent.type(
			screen.getByRole('textbox', { name: /password/i }),
			'password123',
		)
		await userEvent.click(screen.getByRole('button', { name: /login/i }))
		await expect(await screen.findByText('Welcome back!')).toBeInTheDocument()
	})
})
```

#### Avoid Nesting Tests

Keep your tests flat. Nesting makes tests harder to understand and maintain.

```tsx
// ✅ Good
test('User can log in', async () => {
	render(<LoginForm />)
	await userEvent.type(
		screen.getByRole('textbox', { name: /email/i }),
		'kent@example.com',
	)
	await userEvent.type(
		screen.getByRole('textbox', { name: /password/i }),
		'password123',
	)
	await userEvent.click(screen.getByRole('button', { name: /login/i }))
	await expect(await screen.findByText('Welcome back!')).toBeInTheDocument()
})

// ❌ Avoid
describe('LoginForm', () => {
	describe('when user enters valid credentials', () => {
		it('should show welcome message', async () => {
			render(<LoginForm />)
			await userEvent.type(
				screen.getByRole('textbox', { name: /email/i }),
				'kent@example.com',
			)
			await userEvent.type(
				screen.getByRole('textbox', { name: /password/i }),
				'password123',
			)
			await userEvent.click(screen.getByRole('button', { name: /login/i }))
			await expect(await screen.findByText('Welcome back!')).toBeInTheDocument()
		})
	})
})
```

#### Avoid shared setup/teardown variables

```tsx
// ✅ Good
test('renders a greeting', () => {
	render(<Greeting name="Kent" />)
	expect(screen.getByText('Hello Kent')).toBeInTheDocument()
})

// ❌ Avoid
let utils
beforeEach(() => {
	utils = render(<Greeting name="Kent" />)
})

test('renders a greeting', () => {
	expect(utils.getByText('Hello Kent')).toBeInTheDocument()
})
```

> **Note**: Most of the time your individual tests can avoid the use of
> `beforeEach` and `afterEach` altogether and it's only global setup that needs
> it (like mocking out `console.log` or setting up a mock server).

#### Avoid Testing Implementation Details

Test your components based on how they're used, not how they're implemented.

```tsx
// ✅ Good
function Counter() {
	const [count, setCount] = useState(0)
	return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
}

test('Counter increments when clicked', async () => {
	render(<Counter />)
	const button = screen.getByRole('button')
	await userEvent.click(button)
	expect(getByText('Count: 1')).toBeInTheDocument()
})

// ❌ Avoid
test('Counter increments when clicked', () => {
	const { container } = render(<Counter />)
	const button = container.querySelector('button')
	fireEvent.click(button)
	const state = container.querySelector('[data-testid="count"]')
	expect(state).toHaveTextContent('1')
})
```

#### Keep Assertions Specific

Make your assertions as specific as possible to catch the exact behavior you're
testing.

```tsx
// ✅ Good
test('Form shows error for invalid email', async () => {
	render(<LoginForm />)
	await userEvent.type(
		screen.getByRole('textbox', { name: /email/i }),
		'invalid-email',
	)
	await userEvent.click(screen.getByRole('button', { name: /login/i }))
	await expect(
		await screen.findByText(/enter a valid email/i),
	).toBeInTheDocument()
})

// ❌ Avoid
test('Form shows error for invalid email', async () => {
	const { container } = render(<LoginForm />)
	await userEvent.type(
		screen.getByRole('textbox', { name: /email/i }),
		'invalid-email',
	)
	await userEvent.click(screen.getByRole('button', { name: /login/i }))
	expect(container).toMatchSnapshot()
})
```

#### Follow the Testing Trophy

Prioritize your tests according to the Testing Trophy:

1. Static Analysis (TypeScript, ESLint)
2. Unit Tests (Pure Functions)
3. Integration Tests (Component Integration)
4. E2E Tests (Critical User Flows)

```tsx
// ✅ Good
// 1. Static Analysis
function add(a: number, b: number): number {
	return a + b
}

// 2. Unit Tests
test('add function adds two numbers', () => {
	expect(add(1, 2)).toBe(3)
})

// 3. Integration Tests
test('Calculator component adds numbers', async () => {
	render(<Calculator />)
	await userEvent.click(screen.getByRole('button', { name: '1' }))
	await userEvent.click(screen.getByRole('button', { name: '+' }))
	await userEvent.click(screen.getByRole('button', { name: '2' }))
	await userEvent.click(screen.getByRole('button', { name: '=' }))
	expect(getByText('3')).toBeInTheDocument()
})

// 4. E2E Tests (using Playwright)
await page.goto('/calculator')
await expect(page.getByRole('button', { name: '0' })).toBeInTheDocument()
await page.getByRole('button', { name: '1' }).click()
await page.getByRole('button', { name: '+' }).click()
await page.getByRole('button', { name: '2' }).click()
await page.getByRole('button', { name: '=' }).click()
await expect(page.getByRole('button', { name: '3' })).toBeInTheDocument()

// ❌ Avoid
// Don't write E2E tests for everything
test('every button click updates display', () => {
	render(<Calculator />)
	// Testing every possible button combination...
})
```
