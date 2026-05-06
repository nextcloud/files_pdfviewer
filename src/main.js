/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCSPNonce } from '@nextcloud/auth'
import { generateFilePath } from '@nextcloud/router'
import ViewerView from './views/ViewerView.js'

__webpack_nonce__ = getCSPNonce()
__webpack_public_path__ = generateFilePath('files_pdfviewer', '', 'js/')

OCA.Viewer.registerHandler({
	id: 'pdf',

	mimes: [
		'application/pdf',
		'application/illustrator',
	],

	component: ViewerView,

	canCompare: true,
})
