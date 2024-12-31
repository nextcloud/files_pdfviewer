/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { registerDavProperty } from '@nextcloud/files'

import isPublicPage from './utils/isPublicPage.js'
import isPdf from './utils/isPdf.js'
import isSecureViewerAvailable from './utils/isSecureViewerAvailable.js'

// The "share-attributes" DAV property needs to be explicitly registered so the
// viewer returns it in the file info. This is implicitly done by the Files app,
// so it does not need to be explicitly done by the PDF viewer when it is opened
// in the Files app, only for public shares pages.
if (isPublicPage() && isPdf() && !isSecureViewerAvailable()) {
	registerDavProperty('nc:share-attributes', { nc: 'http://nextcloud.org/ns' })
}
