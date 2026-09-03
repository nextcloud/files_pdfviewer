/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const template = readFileSync('templates/viewer.php', 'utf8')
const component = readFileSync('src/views/PDFView.vue', 'utf8')

describe('viewer template parameters', () => {
	const names = [...component.matchAll(/getViewerTemplateParameter\(head, '([a-z]+)'\)/g)].map(([, name]) => name)

	it('are read by the component', () => {
		expect(names.length).toBeGreaterThan(0)
	})

	it.each(names)('are provided by the template: %s', (name) => {
		expect(template).toContain(`data-${name}=`)
	})
})

describe('viewer template', () => {
	it('is a copy of the pdf.js viewer with the same elements', () => {
		const ids = (source) => new Set([...source.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id))
		const pdfjs = ids(readFileSync('js/pdfjs/web/viewer.html', 'utf8'))
		const ours = ids(template)

		expect([...pdfjs].filter((id) => !ours.has(id))).toEqual([])
		expect([...ours].filter((id) => !pdfjs.has(id))).toEqual([])
	})
})
