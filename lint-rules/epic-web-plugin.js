import { definePlugin } from '@oxlint/plugins'
import noManualDispose from './no-manual-dispose.js'
import preferDisposeInTests from './prefer-dispose-in-tests.js'

const plugin = definePlugin({
	meta: {
		name: 'epic-web',
	},
	rules: {
		'no-manual-dispose': noManualDispose,
		'prefer-dispose-in-tests': preferDisposeInTests,
	},
})

export default plugin
export { noManualDispose, preferDisposeInTests }
