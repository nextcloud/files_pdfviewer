/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import FilesPdfViewerLoader from './views/FilesPdfViewerLoader.js'

import './views/PDFView.scss'

OCA.Viewer.registerHandler({
	id: 'pdf',

	mimes: [
		'application/pdf',
		'application/illustrator',
	],

	component: FilesPdfViewerLoader,

	canCompare: true,
})
