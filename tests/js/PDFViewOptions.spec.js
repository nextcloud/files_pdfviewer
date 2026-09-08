/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { describe, expect, it } from 'vitest'
import PDFView from '../../src/views/PDFView.vue'

const parameters = {
	workersrc: '/apps/files_pdfviewer/js/pdfjs/build/pdf.worker.mjs',
	sandbox: '/apps/files_pdfviewer/js/pdfjs/build/pdf.sandbox.mjs',
	cmapurl: '/apps/files_pdfviewer/js/pdfjs/web/cmaps/',
	standardfontdataurl: '/apps/files_pdfviewer/js/pdfjs/web/standard_fonts/',
	imageresourcespath: '/apps/files_pdfviewer/js/pdfjs/web/images/',
	enablescripting: 'false',
}

const options = new Map()
PDFView.methods.initializePDFViewerApplicationOptions.call({
	$refs: {
		iframe: {
			contentWindow: {
				PDFViewerApplicationOptions: {
					setAll: (values) => Object.entries(values).forEach(([name, value]) => options.set(name, value)),
					set: (name, value) => options.set(name, value),
				},
			},
		},
	},
	getIframeDocument: () => ({ getElementsByTagName: () => [{}] }),
	getViewerTemplateParameter: (head, name) => parameters[name],
	isEditable: true,
})

// The pdf.js defaults are relative to its own viewer, which is not where the
// app serves the viewer from, so every asset path has to be set explicitly.
describe('PDF.js asset options', () => {
	it.each([
		['standardFontDataUrl', 'standardfontdataurl'],
		['cMapUrl', 'cmapurl'],
		['workerSrc', 'workersrc'],
		['imageResourcesPath', 'imageresourcespath'],
	])('point %s at the app', (option, parameter) => {
		expect(options.get(option)).toBe(parameters[parameter])
	})
})
