const SYMBOL_DISPOSE_PROPERTY_NAMES = new Set([
	'dispose',
	'asyncDispose',
	'disposeAsync',
])

function unwrapChainExpression(node) {
	if (node?.type === 'ChainExpression') {
		return node.expression
	}
	return node
}

function isSymbolDisposeProperty(node) {
	const candidate = unwrapChainExpression(node)

	if (candidate?.type !== 'MemberExpression') return false
	if (candidate.computed || candidate.optional) return false
	if (candidate.object.type !== 'Identifier') return false
	if (candidate.object.name !== 'Symbol') return false
	if (candidate.property.type !== 'Identifier') return false

	return SYMBOL_DISPOSE_PROPERTY_NAMES.has(candidate.property.name)
}

function getManualDisposeCallKind(node) {
	const callee = unwrapChainExpression(node.callee)

	if (callee?.type !== 'MemberExpression') return null
	if (isSymbolDisposeProperty(callee.property)) return 'symbol'

	if (
		!callee.computed &&
		callee.property.type === 'Identifier' &&
		callee.property.name === 'dispose'
	) {
		return 'method'
	}

	if (
		callee.computed &&
		callee.property.type === 'Literal' &&
		callee.property.value === 'dispose'
	) {
		return 'method'
	}

	return null
}

function isFunctionBoundary(node) {
	return (
		node?.type === 'FunctionDeclaration' ||
		node?.type === 'FunctionExpression' ||
		node?.type === 'ArrowFunctionExpression'
	)
}

function isInFinallyBlock(node) {
	let current = node

	while (current?.parent) {
		if (isFunctionBoundary(current.parent)) {
			return false
		}

		if (
			current.parent.type === 'TryStatement' &&
			current.parent.finalizer === current
		) {
			return true
		}

		current = current.parent
	}

	return false
}

const rule = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Prefer `using`/`await using` over manual disposable cleanup patterns',
		},
		schema: [],
		messages: {
			preferUsingInFinally:
				'Avoid manual disposal in `finally`; prefer `using` or `await using`.',
			avoidManualSymbolDispose:
				'Do not call `[Symbol.dispose]`/`[Symbol.asyncDispose]` directly; prefer `using` or `await using`.',
		},
	},
	createOnce(context) {
		return {
			CallExpression(node) {
				const callKind = getManualDisposeCallKind(node)
				if (callKind === null) return

				if (callKind === 'symbol') {
					context.report({
						node,
						messageId: 'avoidManualSymbolDispose',
					})
					return
				}

				if (isInFinallyBlock(node)) {
					context.report({
						node,
						messageId: 'preferUsingInFinally',
					})
				}
			},
		}
	},
}

export default rule
