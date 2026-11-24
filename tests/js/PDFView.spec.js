/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { File, Permission } from '@nextcloud/files'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
		/**
		 * The probe of the content read, stubbed per test.
		 *
		 * @type {ReturnType<typeof vi.fn>}
		 */
		let fetchProbe

		beforeEach(() => {
			fetchProbe = vi.fn()
			vi.stubGlobal('fetch', fetchProbe)
		})

		afterEach(() => {
			handlers.clear()
			open.mockClear()
			vi.unstubAllGlobals()
			delete window.OC
		})

		/**
		 * Run mounted() over a file, the way the viewer would mount it.
		 *
		 * @param {object} attributes the node attributes a share sets
		 * @param {object} [options] how the content probe answers
		 * @param {number} [options.status] HTTP status of the probe response
		 */
		async function mountOver(attributes, { status = 403 } = {}) {
			window.OC = { appswebroots: { richdocuments: '/apps/richdocuments' } }
			fetchProbe.mockResolvedValue({ ok: status >= 200 && status < 300, status })
			const doc = pdf('a.pdf')
			doc.attributes['hide-download'] = attributes['hide-download']
			const emitted = []
			const context = {
				file: doc,
				files: [doc],
				renderState: 'pending',
				$emit: (name) => emitted.push(name),
				$nextTick: () => {},
				$el: { focus: () => {} },
			}
			for (const [name, computed] of Object.entries(PDFView.computed)) {
				Object.defineProperty(context, name, { get: () => computed.call(context) })
			}
			for (const [name, method] of Object.entries(PDFView.methods)) {
				context[name] = method.bind(context)
			}
			await PDFView.mounted.call(context)
			return { doc, emitted, context }
		}

		it('hands a hidden download to its viewer handler when the content read is blocked', async () => {
			handlers.set('richdocuments', {})
			const { doc, emitted, context } = await mountOver({ 'hide-download': true })

			expect(fetchProbe).toHaveBeenCalledTimes(1)
			expect(open).toHaveBeenCalledWith([doc], doc, undefined, 'richdocuments')
			expect(emitted).toEqual(['loaded'])
			expect(context.renderState).toBe('handed-over')
		})

		it('keeps the file when richdocuments has no viewer handler to take it', async () => {
			// Not ported to the viewer package yet: as if it were not there
			const { emitted, context } = await mountOver({ 'hide-download': true })

			// Shown as an error: the content read is blocked and there is no
			// handler to render the file instead
			expect(open).not.toHaveBeenCalled()
			expect(emitted).toEqual(['loaded'])
			expect(context.renderState).toBe('blocked')
		})

		it('renders a restricted file the server lets pdf.js read', async () => {
			handlers.set('richdocuments', {})
			const { context } = await mountOver({ 'hide-download': true }, { status: 206 })

			expect(fetchProbe).toHaveBeenCalledTimes(1)
			expect(open).not.toHaveBeenCalled()
			expect(context.renderState).toBe('render')
		})

		it('renders a regular file without probing', async () => {
			handlers.set('richdocuments', {})
			const { context } = await mountOver({})

			expect(fetchProbe).not.toHaveBeenCalled()
			expect(open).not.toHaveBeenCalled()
			expect(context.renderState).toBe('render')
		})
	})
})
