/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { describe, expect, it } from 'vitest'
import PDFView from '../../src/views/PDFView.vue'

const evaluate = (name, file) => PDFView.computed[name].call({ file })
const lookUp = (fileList) => PDFView.computed.file.call({ fileList, fileid: 42 })

describe('PDFView with a file that is not in the file list', () => {
	const file = lookUp([])

	it('treats the file as downloadable', () => {
		expect(evaluate('isDownloadable', file)).toBe(true)
	})

	it('does not treat the download as hidden', () => {
		expect(evaluate('hideDownload', file)).toBe(false)
	})
})

describe('PDFView with a file in the file list', () => {
	const file = lookUp([{
		fileid: 42,
		hideDownload: true,
		shareAttributes: JSON.stringify([{ scope: 'permissions', key: 'download', value: false }]),
	}])

	it('reads the download share attribute', () => {
		expect(evaluate('isDownloadable', file)).toBe(false)
	})

	it('reads the hidden download flag', () => {
		expect(evaluate('hideDownload', file)).toBe(true)
	})

	it('treats a file without share attributes as downloadable', () => {
		expect(evaluate('isDownloadable', { fileid: 42 })).toBe(true)
	})
})
