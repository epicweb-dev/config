# verbatimModuleSyntax

Date: 2024-05-30

Status: deprecated

Deprecation date: 2024-05-31

## Deprecation Note

Turns out in Remix that `verbatimModuleSyntax` will cause issues if you try to
import a `type` from a `.server` file into a non `.server` file. Like what we do
in the Epic Stack for our toast utilities:

```tsx
import { useEffect } from 'react'
import { toast as showToast } from 'sonner'
import { type Toast } from '#app/utils/toast.server.ts' // <-- the build is very unhappy about this with verbatimModuleSyntax

export function useToast(toast?: Toast | null) {
	useEffect(() => {
		if (toast) {
			setTimeout(() => {
				showToast[toast.type](toast.title, {
					id: toast.id,
					description: toast.description,
				})
			}, 0)
		}
	}, [toast])
}
```

For that reason, this has been removed from the config.

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
