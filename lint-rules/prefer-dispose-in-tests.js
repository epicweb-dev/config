const TEST_CALL_ROOTS = new Set(['test', 'it'])
const SUITE_CALL_ROOTS = new Set(['describe', 'suite', 'context'])
const HOOK_NAMES = new Set(['beforeEach', 'afterEach', 'beforeAll', 'afterAll'])
const SUITE_HOOK_NAMES = new Set(['beforeAll', 'afterAll'])

const KNOWN_FRAMEWORK_HOOK_CALLS = new Set([
	'vi.useFakeTimers',
	'vi.useRealTimers',
	'vi.clearAllMocks',
	'vi.resetAllMocks',
	'vi.restoreAllMocks',
	'jest.useFakeTimers',
	'jest.useRealTimers',
	'jest.clearAllMocks',
	'jest.resetAllMocks',
	'jest.restoreAllMocks',
])

const DEFAULT_OPTIONS = {
	allowKnownFrameworkHooks: true,
	minimumTestsForSuiteHooks: 2,
}

function getCallPath(node) {
	if (!node) return null

	if (node.type === 'ChainExpression') {
		return getCallPath(node.expression)
	}

	if (node.type === 'CallExpression') {
		return getCallPath(node.callee)
	}

	if (node.type === 'Identifier') {
		return [node.name]
	}

	if (node.type === 'MemberExpression') {
		if (node.computed || node.property.type !== 'Identifier') return null
		const objectPath = getCallPath(node.object)
		if (!objectPath) return null
		return [...objectPath, node.property.name]
	}

	return null
}

function isDescribeCallExpression(node) {
	if (!node || node.type !== 'CallExpression') return false
	const callPath = getCallPath(node)
	if (!callPath || callPath.length === 0) return false

	const lastSegment = callPath.at(-1)

	if (SUITE_CALL_ROOTS.has(callPath[0])) {
		if (lastSegment === 'each') return node.callee.type === 'CallExpression'
		return true
	}

	if (callPath.includes('describe')) {
		if (lastSegment === 'each') return node.callee.type === 'CallExpression'
		return true
	}

	return false
}

function isTestCallExpression(node) {
	if (!node || node.type !== 'CallExpression') return false
	const callPath = getCallPath(node)
	if (!callPath || callPath.length === 0) return false
	if (!TEST_CALL_ROOTS.has(callPath[0])) return false
	if (callPath.includes('describe')) return false

	const lastSegment = callPath.at(-1)
	if (HOOK_NAMES.has(lastSegment)) return false
	if (lastSegment === 'step') return false
	if (lastSegment === 'each') return node.callee.type === 'CallExpression'

	return true
}

function getHookName(node) {
	if (!node || node.type !== 'CallExpression') return null
	const callPath = getCallPath(node)
	if (!callPath || callPath.length === 0) return null
	const lastSegment = callPath.at(-1)
	if (!HOOK_NAMES.has(lastSegment)) return null

	if (callPath.length === 1) return lastSegment

	if (
		callPath.length === 2 &&
		(TEST_CALL_ROOTS.has(callPath[0]) || SUITE_CALL_ROOTS.has(callPath[0]))
	) {
		return lastSegment
	}

	return null
}

function isFunctionNode(node) {
	return (
		node?.type === 'FunctionExpression' ||
		node?.type === 'ArrowFunctionExpression'
	)
}

function getHookCallback(node) {
	return node.arguments.find((argument) => isFunctionNode(argument)) ?? null
}

function walk(node, callback) {
	const nodesToVisit = [node]
	while (nodesToVisit.length > 0) {
		const currentNode = nodesToVisit.pop()
		if (!currentNode || typeof currentNode.type !== 'string') continue
		callback(currentNode)

		for (const [key, value] of Object.entries(currentNode)) {
			if (key === 'parent') continue

			if (Array.isArray(value)) {
				for (let index = value.length - 1; index >= 0; index -= 1) {
					nodesToVisit.push(value[index])
				}
				continue
			}

			if (value && typeof value.type === 'string') {
				nodesToVisit.push(value)
			}
		}
	}
}

function containsThisExpression(node) {
	let foundThisExpression = false
	walk(node, (currentNode) => {
		if (currentNode.type === 'ThisExpression') {
			foundThisExpression = true
		}
	})
	return foundThisExpression
}

function isNodeInsideRange(node, containerNode) {
	return (
		Array.isArray(node.range) &&
		Array.isArray(containerNode.range) &&
		node.range[0] >= containerNode.range[0] &&
		node.range[1] <= containerNode.range[1]
	)
}

function isVariableDefinedInNode(variable, containerNode) {
	return variable.defs.some((definition) => {
		if (!definition.name) return false
		return isNodeInsideRange(definition.name, containerNode)
	})
}

function findVariableInScope(scope, variableName) {
	let currentScope = scope
	while (currentScope) {
		if (currentScope.set?.has(variableName)) {
			return currentScope.set.get(variableName)
		}
		currentScope = currentScope.upper
	}
	return null
}

function getRootIdentifiers(node) {
	if (!node) return []

	if (node.type === 'ChainExpression') {
		return getRootIdentifiers(node.expression)
	}

	if (node.type === 'Identifier') {
		return [node]
	}

	if (node.type === 'MemberExpression') {
		return getRootIdentifiers(node.object)
	}

	if (node.type === 'ObjectPattern') {
		let identifiers = []
		for (const property of node.properties) {
			if (!property) continue
			if (property.type === 'Property') {
				identifiers = identifiers.concat(getRootIdentifiers(property.value))
			} else if (property.type === 'RestElement') {
				identifiers = identifiers.concat(getRootIdentifiers(property.argument))
			}
		}
		return identifiers
	}

	if (node.type === 'ArrayPattern') {
		let identifiers = []
		for (const element of node.elements) {
			if (!element) continue
			identifiers = identifiers.concat(getRootIdentifiers(element))
		}
		return identifiers
	}

	if (node.type === 'AssignmentPattern') {
		return getRootIdentifiers(node.left)
	}

	if (node.type === 'RestElement') {
		return getRootIdentifiers(node.argument)
	}

	return []
}

function writesOuterState(callbackNode, sourceCode) {
	let writesOuterValue = false

	walk(callbackNode.body, (currentNode) => {
		if (writesOuterValue) return

		let writeTarget = null
		if (currentNode.type === 'AssignmentExpression') {
			writeTarget = currentNode.left
		} else if (currentNode.type === 'UpdateExpression') {
			writeTarget = currentNode.argument
		}

		if (!writeTarget) return
		const rootIdentifiers = getRootIdentifiers(writeTarget)
		if (!rootIdentifiers.length) return

		for (const rootIdentifier of rootIdentifiers) {
			const identifierScope = sourceCode.getScope(rootIdentifier)
			const variable = findVariableInScope(identifierScope, rootIdentifier.name)

			// If this is an unresolved/global write, treat it as shared mutable state.
			if (!variable) {
				writesOuterValue = true
				return
			}

			if (!isVariableDefinedInNode(variable, callbackNode)) {
				writesOuterValue = true
				return
			}
		}
	})

	return writesOuterValue
}

function findContainingSuiteNode(node) {
	let currentNode = node.parent
	while (currentNode) {
		if (currentNode.type === 'Program') return currentNode

		if (
			isFunctionNode(currentNode) &&
			currentNode.parent?.type === 'CallExpression' &&
			currentNode.parent.arguments.includes(currentNode) &&
			isDescribeCallExpression(currentNode.parent)
		) {
			return currentNode.body.type === 'BlockStatement'
				? currentNode.body
				: currentNode.body
		}

		currentNode = currentNode.parent
	}

	return null
}

function getSuiteStatements(suiteNode) {
	if (!suiteNode) return []
	if (suiteNode.type === 'Program') return suiteNode.body
	if (suiteNode.type === 'BlockStatement') return suiteNode.body
	return []
}

function analyzeSuiteNode(suiteNode) {
	let testCount = 0
	let hasDirectSuiteHooks = false

	walk(suiteNode, (currentNode) => {
		if (currentNode.type === 'CallExpression' && isTestCallExpression(currentNode)) {
			testCount += 1
		}
	})

	for (const statement of getSuiteStatements(suiteNode)) {
		if (statement.type !== 'ExpressionStatement') continue
		if (statement.expression.type !== 'CallExpression') continue
		const hookName = getHookName(statement.expression)
		if (hookName && SUITE_HOOK_NAMES.has(hookName)) {
			hasDirectSuiteHooks = true
			break
		}
	}

	return { testCount, hasDirectSuiteHooks }
}

function getTopLevelCallNames(callbackNode) {
	const statements =
		callbackNode.body.type === 'BlockStatement'
			? callbackNode.body.body
			: [{ type: 'ExpressionStatement', expression: callbackNode.body }]

	const callNames = []

	for (const statement of statements) {
		if (statement.type !== 'ExpressionStatement') return null

		let expressionNode = statement.expression

		if (expressionNode.type === 'UnaryExpression' && expressionNode.operator === 'void') {
			expressionNode = expressionNode.argument
		}

		if (expressionNode.type === 'AwaitExpression') {
			expressionNode = expressionNode.argument
		}

		if (expressionNode.type !== 'CallExpression') return null
		const callPath = getCallPath(expressionNode)
		if (!callPath) return null
		callNames.push(callPath.join('.'))
	}

	return callNames
}

function isKnownFrameworkHookCallback(callbackNode) {
	const callNames = getTopLevelCallNames(callbackNode)
	if (!callNames || callNames.length === 0) return false
	return callNames.every((callName) => KNOWN_FRAMEWORK_HOOK_CALLS.has(callName))
}

function createRuleVisitors(context, state) {
	function getSuiteAnalysis(suiteNode) {
		const existingAnalysis = state.suiteAnalysisCache.get(suiteNode)
		if (existingAnalysis) return existingAnalysis

		const nextAnalysis = analyzeSuiteNode(suiteNode)
		state.suiteAnalysisCache.set(suiteNode, nextAnalysis)
		return nextAnalysis
	}

	return {
		CallExpression(node) {
			const hookName = getHookName(node)
			if (!hookName) return

			const callbackNode = getHookCallback(node)
			if (!callbackNode) return

			const suiteNode = findContainingSuiteNode(node)
			if (!suiteNode) return

			const suiteAnalysis = getSuiteAnalysis(suiteNode)
			if (suiteAnalysis.testCount === 0) {
				// Setup files often have hooks but no colocated tests.
				return
			}

			// Hooks that rely on runner context, callback completion, or shared state
			// are intentionally allowed because disposable refactors are less direct.
			if (callbackNode.params.length > 0) return
			if (containsThisExpression(callbackNode.body)) return
			if (writesOuterState(callbackNode, state.sourceCode)) return

			const isSuiteHook = SUITE_HOOK_NAMES.has(hookName)

			if (
				isSuiteHook &&
				suiteAnalysis.testCount >= state.options.minimumTestsForSuiteHooks
			) {
				return
			}

			if (
				!isSuiteHook &&
				suiteAnalysis.hasDirectSuiteHooks &&
				suiteAnalysis.testCount >= state.options.minimumTestsForSuiteHooks
			) {
				return
			}

			if (
				state.options.allowKnownFrameworkHooks &&
				isKnownFrameworkHookCallback(callbackNode)
			) {
				return
			}

			context.report({
				node,
				messageId: 'preferDisposables',
				data: { hookName },
			})
		},
	}
}

const preferDisposeInTestsRule = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Prefer disposable objects over lifecycle hooks when cleanup can be scoped to a test body',
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowKnownFrameworkHooks: { type: 'boolean' },
					minimumTestsForSuiteHooks: {
						type: 'integer',
						minimum: 1,
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			preferDisposables:
				'Prefer disposable setup (`using`/`await using` with `dispose`/`disposeAsync`) instead of {{hookName}} when cleanup can live in each test body.',
		},
	},
	createOnce(context) {
		const state = {
			sourceCode: null,
			suiteAnalysisCache: new WeakMap(),
			options: DEFAULT_OPTIONS,
		}

		return {
			before() {
				state.sourceCode = context.sourceCode
				state.suiteAnalysisCache = new WeakMap()
				const userOptions = Array.isArray(context.options)
					? (context.options[0] ?? {})
					: (context.options ?? {})
				state.options = {
					...DEFAULT_OPTIONS,
					...userOptions,
				}
			},
			...createRuleVisitors(context, state),
		}
	},
}

export default preferDisposeInTestsRule
export { preferDisposeInTestsRule }
