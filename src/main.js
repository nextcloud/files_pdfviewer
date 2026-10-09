/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '@nextcloud/l10n'
import { registerHandler } from '@nextcloud/viewer'

const tagName = 'files-pdfviewer-view'

const mimes = [
	'application/pdf',
	'application/illustrator',
]

// This script runs on every page: the view is only loaded, and its element
// defined, the first time the viewer opens a PDF
registerHandler({
	id: 'pdf',
	displayName: t('files_pdfviewer', 'PDF viewer'),
	tagName,
	enabled: (nodes) => nodes.every((node) => mimes.includes(node.mime)),
	onInit: async () => {
		const [{ defineCustomElement }, { default: PDFView }] = await Promise.all([
			import('vue'),
			import('./views/PDFView.vue'),
			import('./views/PDFView.scss'),
		])
		if (window.customElements.get(tagName) === undefined) {
			// Light DOM, so the server's styles and variables apply inside
			window.customElements.define(tagName, defineCustomElement(PDFView, { shadowRoot: false }))
		}
	},
})
