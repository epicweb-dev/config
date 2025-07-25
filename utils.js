/**
 * Check if a package is installed by attempting to resolve it
 * @param {string} pkg - The package name to check
 * @returns {boolean} - True if the package is installed, false otherwise
 */
export const has = (pkg) => {
	try {
		import.meta.resolve(pkg, import.meta.url)
		return true
	} catch {
		return false
	}
}