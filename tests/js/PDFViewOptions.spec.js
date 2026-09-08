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
	iccurl: '/apps/files_pdfviewer/js/pdfjs/web/iccs/',
	wasmurl: '/apps/files_pdfviewer/js/pdfjs/web/wasm/',
	enablescripting: 'false',
}

const head = document.createElement('head')
for (const [name, value] of Object.entries(parameters)) {
	head.setAttribute(`data-${name}`, value)
}

const options = {}
PDFView.methods.initializePDFViewerApplicationOptions.call({
	$refs: {
		iframe: {
			contentWindow: {
				PDFViewerApplicationOptions: {
					set: (name, value) => Object.assign(options, { [name]: value }),
					setAll: (all) => Object.assign(options, all),
				},
			},
		},
	},
	getIframeDocument: () => ({ getElementsByTagName: () => [head] }),
	// The real lookup, so that a change to its signature is caught here
	getViewerTemplateParameter: PDFView.methods.getViewerTemplateParameter,
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
		['sandboxBundleSrc', 'sandbox'],
		['iccUrl', 'iccurl'],
		['wasmUrl', 'wasmurl'],
	])('point %s at the app', (option, parameter) => {
		expect(options[option]).toBe(parameters[parameter])
	})
})
