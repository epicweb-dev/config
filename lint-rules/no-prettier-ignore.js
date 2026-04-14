/**
 * @param {import('eslint').AST.Token} comment
 */
function isPrettierIgnoreDirective(comment) {
	const v = comment.value
	if (comment.type === 'Line') {
		return /^\s*prettier-ignore(?:-next|-start|-end)?(?:\s|$)/.test(v)
	}
	return /^\s*prettier-ignore(?:-next|-start|-end)?(?:\s|$)/m.test(v)
}

/**
 * @param {string} text
 */
function replacePrettierIgnoreWithOxfmt(text) {
	return text
		.replace(/prettier-ignore-next/g, 'oxfmt-ignore')
		.replace(/prettier-ignore-start/g, 'oxfmt-ignore-start')
		.replace(/prettier-ignore-end/g, 'oxfmt-ignore-end')
		.replace(/prettier-ignore/g, 'oxfmt-ignore')
}

const rule = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Prefer `oxfmt-ignore` over `prettier-ignore` in JS/TS comments formatted by Oxfmt',
		},
		schema: [],
		fixable: 'code',
		messages: {
			useOxfmtIgnore:
				'Use `oxfmt-ignore` instead of `prettier-ignore` for Oxfmt. Keep `prettier-ignore` only for non-JS regions (for example Vue template/style or HTML) per Oxfmt docs.',
		},
	},
	createOnce(context) {
		return {
			Program() {
				const sourceCode = context.sourceCode
				for (const comment of sourceCode.getAllComments()) {
					if (!isPrettierIgnoreDirective(comment)) continue

					const range = /** @type {[number, number]} */ (comment.range)
					const raw = sourceCode.text.slice(range[0], range[1])
					const next = replacePrettierIgnoreWithOxfmt(raw)
					if (next === raw) continue

					context.report({
						loc: comment.loc,
						messageId: 'useOxfmtIgnore',
						fix(fixer) {
							return fixer.replaceTextRange(range, next)
						},
					})
				}
			},
		}
	},
}

export default rule
