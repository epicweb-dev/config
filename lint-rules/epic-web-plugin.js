import { eslintCompatPlugin } from '@oxlint/plugins'
import noManualDispose from './no-manual-dispose.js'

const plugin = eslintCompatPlugin({
	meta: {
		name: 'epic-web',
	},
	rules: {
		'no-manual-dispose': noManualDispose,
	},
})

export default plugin
