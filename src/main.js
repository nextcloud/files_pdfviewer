/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '@nextcloud/l10n'
import { registerHandler } from '@nextcloud/viewer'
import { defineCustomElement } from 'vue'
import PDFViewElement from './views/PDFViewElement.js'

import './views/PDFView.scss'

const tagname = 'files-pdfviewer-view'

const mimes = [
	'application/pdf',
	'application/illustrator',
]

// Light DOM, so the server's styles and variables apply inside
window.customElements.define(tagname, defineCustomElement(PDFViewElement, { shadowRoot: false }))

registerHandler({
	id: 'pdf',
	displayName: t('files_pdfviewer', 'PDF viewer'),
	tagname,
	enabled: (nodes) => nodes.every((node) => mimes.includes(node.mime)),
})
