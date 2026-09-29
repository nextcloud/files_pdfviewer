/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { describe, expect, it, vi } from 'vitest'

const registerHandler = vi.hoisted(() => vi.fn())
vi.mock('@nextcloud/viewer', () => ({ registerHandler }))

await import('../../src/main.js')

describe('the handler', () => {
	const [[handler]] = registerHandler.mock.calls

	// The view stays out of the script that registers the handler on every
	// page, until the viewer first opens a PDF
	it('defines its element only once the viewer asks for it', async () => {
		expect(window.customElements.get(handler.tagName)).toBeUndefined()

		await handler.onInit()
		expect(window.customElements.get(handler.tagName)).toBeDefined()
	})

	it('keeps the id other apps look the pdf handler up by', () => {
		expect(handler.id).toBe('pdf')
	})

	it('only takes a list it can open all of', () => {
		const file = (mime) => ({ mime, attributes: {} })
		expect(handler.enabled([file('application/pdf'), file('application/pdf')])).toBe(true)
		expect(handler.enabled([file('application/pdf'), file('image/png')])).toBe(false)
	})
})
