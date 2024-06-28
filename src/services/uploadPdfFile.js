/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getRequestToken } from '@nextcloud/auth'
import axios from '@nextcloud/axios'

import { getRootPath, getToken } from '../utils/davUtils.js'

/**
 * Upload the given contents of a PDF file to the given filename.
 *
 * The full upload URL will depend on whether the PDF viewer is opened as a
 * registered user or from a public share page.
 *
 * The filename is expected to be got from the Mime mixin, which takes into
 * account the difference in the paths between files of registered users and
 * public shares. The root path will be internally set depending on those
 * differences as well.
 *
 * @param {string} filename the filename to upload to.
 * @param {Uint8Array} data the contents of the PDF file to upload.
 */
export default async function(filename, data) {
	// getRootPath takes into account the differences between files of
	// registered users and public shares.
	const filePath = getRootPath() + filename

	const blob = new Blob([data], { type: 'application/pdf' })

	const requestConfig = {
		headers: {
			'Content-Type': 'application/pdf',
			// Not needed for public pages, although there is no problem if it
			// is set.
			requesttoken: getRequestToken(),
		},
	}
	if (getToken()) {
		requestConfig.auth = {
			// Password is not needed due to "public_link_authenticated" being
			// set in the session when the share was loaded.
			username: getToken(),
		}
	}

	// Uploading file with nextcloud axios. This will create a new file version
	// if versions app is installed.
	return axios.put(filePath, blob, requestConfig)
}
