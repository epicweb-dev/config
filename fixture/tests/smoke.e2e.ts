import { test } from '@playwright/test'

test('hello', async ({ page }) => {
	await page.goto('http://localhost:5173')
})
