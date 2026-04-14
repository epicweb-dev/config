import { definePlugin } from '@oxlint/plugins'
import noManualDispose from './no-manual-dispose.js'
import noPrettierIgnore from './no-prettier-ignore.js'
import preferDisposeInTests from './prefer-dispose-in-tests.js'

const plugin = definePlugin({
	meta: {
		name: 'epic-web',
	},
	rules: {
		'no-manual-dispose': noManualDispose,
		'no-prettier-ignore': noPrettierIgnore,
		'prefer-dispose-in-tests': preferDisposeInTests,
	},
})

export default plugin
export { noManualDispose, noPrettierIgnore, preferDisposeInTests }
