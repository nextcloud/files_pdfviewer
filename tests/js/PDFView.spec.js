/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { File, Permission } from '@nextcloud/files'
import { afterEach, describe, expect, it, vi } from 'vitest'

const handlers = vi.hoisted(() => new Map())
const open = vi.hoisted(() => vi.fn(async () => {}))
vi.mock('@nextcloud/viewer', () => ({ getHandlers: () => handlers, getViewer: () => ({ open }) }))

const { default: PDFView } = await import('../../src/views/PDFView.vue')

/**
 * A file as the viewer hands it over.
 *
 * @param {string} name the file name
 * @param {number} permissions the permissions the user has
 */
function pdf(name, permissions = Permission.READ) {
	return new File({
		source: `https://cloud.example.com/remote.php/dav/files/alice/${name}`,
		root: '/files/alice',
		owner: 'alice',
		mime: 'application/pdf',
		permissions,
	})
}

describe('PDFView', () => {
	it('hands pdf.js a URL that survives being decoded once', () => {
		// pdf.js decodes its file parameter, and a "#" left bare after that
		// would cut the path short
		const src = PDFView.computed.iframeSrc.call({ file: pdf('my file #1.pdf') })
		const file = new URL(src, 'https://cloud.example.com').searchParams.get('file')

		expect(file).toBe('https://cloud.example.com/remote.php/dav/files/alice/my%20file%20%231.pdf')
	})

	it('lets the user annotate only a file they may write', () => {
		expect(PDFView.computed.isEditable.call({ file: pdf('a.pdf', Permission.READ) })).toBe(false)
		expect(PDFView.computed.isEditable.call({ file: pdf('a.pdf', Permission.READ | Permission.UPDATE) })).toBe(true)
	})

	describe('with richdocuments installed', () => {
		afterEach(() => {
			handlers.clear()
			open.mockClear()
			delete window.OC
		})

		/**
		 * Run mounted() over a file, the way the viewer would mount it.
		 *
		 * @param {object} attributes the node attributes a share sets
		 */
		async function mountOver(attributes) {
			window.OC = { appswebroots: { richdocuments: '/apps/richdocuments' } }
			const doc = pdf('a.pdf')
			doc.attributes['hide-download'] = attributes['hide-download']
			const emitted = []
			const context = {
				file: doc,
				files: [doc],
				$emit: (name) => emitted.push(name),
				$nextTick: () => {},
			}
			for (const [name, computed] of Object.entries(PDFView.computed)) {
				Object.defineProperty(context, name, { get: () => computed.call(context) })
			}
			await PDFView.mounted.call(context)
			return { doc, emitted }
		}

		it('hands a hidden download to its viewer handler', async () => {
			handlers.set('richdocuments', {})
			const { doc, emitted } = await mountOver({ 'hide-download': true })

			expect(open).toHaveBeenCalledWith([doc], doc, undefined, 'richdocuments')
			expect(emitted).toEqual(['loaded'])
		})

		it('keeps the file when richdocuments has no viewer handler to take it', async () => {
			// Not ported to the viewer package yet: as if it were not there
			const { emitted } = await mountOver({ 'hide-download': true })

			// Shown by pdf.js with the download disabled, as without richdocuments
			expect(open).not.toHaveBeenCalled()
			expect(emitted).toEqual(['loaded'])
		})
	})
})
