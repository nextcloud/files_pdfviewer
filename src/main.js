/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import PDFView from './views/PDFView.vue'

OCA.Viewer.registerHandler({
	id: 'pdf',

	mimes: [
		'application/pdf',
		'application/illustrator',
	],

	component: PDFView,

	canCompare: true,
})
