# `epic-web/no-manual-dispose`

Warns when disposable resources are cleaned up manually in patterns that should
use `using` or `await using`.

## Why

Manual cleanup with `try/finally` and disposal calls is easier to get wrong and
less readable than language-level disposables.

## What it warns on

- direct calls to `[Symbol.dispose]`
- direct calls to `[Symbol.asyncDispose]`
- direct calls to `[Symbol.disposeAsync]`
- `.dispose()` and `['dispose']()` calls inside `finally` blocks

## Examples

### Invalid

```js
let tempFile
try {
	tempFile = createTempFile()
} finally {
	tempFile?.[Symbol.dispose]()
}
```

```js
let tempFile
try {
	tempFile = createTempFile()
} finally {
	tempFile?.dispose()
}
```

### Valid

```js
using tempFile = createTempFile()
```

```js
await using db = await createDisposableDatabase()
```

```js
function cleanup(resource) {
	resource.dispose()
}
```
