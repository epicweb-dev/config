import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach } from 'vitest'

const rootDirectory = fileURLToPath(new URL('..', import.meta.url))
const oxlintBinary = path.join(
	rootDirectory,
	'node_modules',
	'.bin',
	process.platform === 'win32' ? 'oxlint.cmd' : 'oxlint',
)
const epicWebPluginPath = path.join(
	rootDirectory,
	'lint-rules',
	'epic-web-plugin.js',
)

const temporaryDirectories = new Set()

afterEach(async () => {
	await Promise.all(
		[...temporaryDirectories].map(cleanupTemporaryDirectory),
	)
})

async function cleanupTemporaryDirectory(directory) {
	temporaryDirectories.delete(directory)
	await rm(directory, { recursive: true, force: true })
}

export async function writeOxlintFixture({
	code,
	filename = 'sample.js',
	rules,
	typeAware = false,
}) {
	const directory = await mkdtemp(path.join(tmpdir(), 'epic-web-oxlint-'))
	temporaryDirectories.add(directory)

	const filePath = path.join(directory, filename)
	const configPath = path.join(directory, 'oxlint.json')

	await writeFile(filePath, code)
	await writeFile(
		configPath,
		JSON.stringify({
			jsPlugins: [epicWebPluginPath],
			rules,
		}),
	)

	return {
		configPath,
		directory,
		filePath,
		typeAware,
		[Symbol.asyncDispose]() {
			return cleanupTemporaryDirectory(directory)
		},
	}
}

export async function runOxlint(input) {
	const fixture =
		'filePath' in input && 'configPath' in input
			? input
			: await writeOxlintFixture(input)

	const args = ['--config', fixture.configPath, '--format', 'json', fixture.filePath]

	if (fixture.typeAware) args.unshift('--type-aware')

	const result = await new Promise((resolve, reject) => {
		const child = spawn(oxlintBinary, args, {
			cwd: rootDirectory,
			stdio: ['ignore', 'pipe', 'pipe'],
		})
		let stdout = ''
		let stderr = ''

		child.stdout.on('data', (chunk) => {
			stdout += chunk
		})
		child.stderr.on('data', (chunk) => {
			stderr += chunk
		})
		child.on('error', reject)
		child.on('close', (exitCode) => {
			resolve({ exitCode, stderr, stdout })
		})
	})

	if (result.stderr) {
		throw new Error(result.stderr)
	}

	if (result.exitCode && result.exitCode !== 0) {
		throw new Error(result.stdout || `Oxlint exited with code ${result.exitCode}`)
	}

	const stdout = result.stdout.trim()
	return stdout ? JSON.parse(stdout) : { diagnostics: [] }
}

export async function readLockfile() {
	return readFile(path.join(rootDirectory, 'package-lock.json'), 'utf8')
}
