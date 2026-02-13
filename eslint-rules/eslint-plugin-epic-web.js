import preferDisposeInTestsRule from './prefer-dispose-in-tests.js'

const plugin = {
	meta: {
		name: '@epic-web/eslint-plugin',
	},
	rules: {
		'prefer-dispose-in-tests': preferDisposeInTestsRule,
	},
}

export default plugin
export { preferDisposeInTestsRule }
