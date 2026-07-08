import { expect, test } from 'vitest'

export const MockAccordion = () => <div>Accordion</div>

// oxlint-disable-next-line vitest/no-disabled-tests -- fixture intentionally exercises test-file linting.
test.skip('hello', () => {
	expect(true).toBe(true)
})
