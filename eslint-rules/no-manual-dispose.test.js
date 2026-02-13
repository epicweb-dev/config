import { RuleTester } from 'eslint'
import plugin from './epic-web-plugin.js'

const rule = plugin.rules['no-manual-dispose']

const tester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
})

tester.run('no-manual-dispose', rule, {
	valid: [
		`
		test('reads a temp file', () => {
			using tempFile = createTempFile()
			return Bun.file(tempFile.path).text()
		})
		`,
		`
		async function setup() {
			await using db = await createDisposableDatabase()
			return db
		}
		`,
		`
		function cleanup(resource) {
			resource.dispose()
		}
		`,
		`
		class TempFile {
			[Symbol.dispose]() {
				closeFileHandle()
			}
			async [Symbol.asyncDispose]() {
				await closeFileHandle()
			}
		}
		`,
		`
		let tempFile
		try {
			tempFile = createTempFile()
		} finally {
			logCleanup(tempFile)
		}
		`,
	],
	invalid: [
		{
			code: `
			let tempFile
			try {
				tempFile = createTempFile()
			} finally {
				tempFile?.[Symbol.dispose]()
			}
			`,
			errors: [{ messageId: 'avoidManualSymbolDispose' }],
		},
		{
			code: `
			let tempFile
			try {
				tempFile = createTempFile()
			} finally {
				if (tempFile) {
					tempFile['dispose']()
				}
			}
			`,
			errors: [{ messageId: 'preferUsingInFinally' }],
		},
		{
			code: `
			let tempFile
			try {
				tempFile = createTempFile()
			} finally {
				tempFile?.dispose()
			}
			`,
			errors: [{ messageId: 'preferUsingInFinally' }],
		},
		{
			code: `
			async function closeResource() {
				let tempFile
				try {
					tempFile = await createTempFile()
				} finally {
					await tempFile?.[Symbol.asyncDispose]()
				}
			}
			`,
			errors: [{ messageId: 'avoidManualSymbolDispose' }],
		},
		{
			code: `
			const tempFile = createTempFile()
			tempFile[Symbol.dispose]()
			`,
			errors: [{ messageId: 'avoidManualSymbolDispose' }],
		},
		{
			code: `
			const tempFile = createTempFile()
			tempFile?.[Symbol.disposeAsync]()
			`,
			errors: [{ messageId: 'avoidManualSymbolDispose' }],
		},
	],
})
