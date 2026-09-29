/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { describe, expect, it } from 'vitest'
import { isDownloadable, isDownloadHidden } from '../../src/utils/downloadRestrictions.js'

const file = (attributes) => ({ attributes })
const forbidden = [{ scope: 'permissions', key: 'download', value: false }]

describe('isDownloadHidden', () => {
	it('reads the flag however it is spelled', () => {
		expect(isDownloadHidden(file({ 'hide-download': true }))).toBe(true)
		expect(isDownloadHidden(file({ 'hide-download': 'true' }))).toBe(true)
		expect(isDownloadHidden(file({ 'hide-download': false }))).toBe(false)
		expect(isDownloadHidden(file({}))).toBe(false)
	})
})

describe('isDownloadable', () => {
	it('allows a file that says nothing about it', () => {
		expect(isDownloadable(file({}))).toBe(true)
		expect(isDownloadable(file({ 'share-attributes': '[]' }))).toBe(true)
	})

	it('refuses a file whose share forbids it, parsed or not', () => {
		expect(isDownloadable(file({ 'share-attributes': JSON.stringify(forbidden) }))).toBe(false)
		expect(isDownloadable(file({ 'share-attributes': forbidden }))).toBe(false)
	})
})
