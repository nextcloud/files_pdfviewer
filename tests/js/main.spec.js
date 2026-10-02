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

	it('points at a custom element that is defined', () => {
		expect(window.customElements.get(handler.tagname)).toBeDefined()
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
