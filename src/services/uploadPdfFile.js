/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getRequestToken } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { isPublic } from '../utils/davUtils.js'

/**
 * Upload the given contents of a PDF file to the given dav URL.
 *
 * @param {string} url the encoded dav URL of the file, as the viewer hands it over.
 * @param {Uint8Array} data the contents of the PDF file to upload.
 */
export default async function(url, data) {
	const blob = new Blob([data], { type: 'application/pdf' })

	const requestConfig = {
		headers: {
			'Content-Type': 'application/pdf',
			// requesttoken is only needed for authenticated users (CSRF protection).
			// Public shares authenticate via the token in the DAV URL path.
			...(!isPublic() && { requesttoken: getRequestToken() }),
		},
	}

	// Uploading file with nextcloud axios. This will create a new file version
	// if versions app is installed.
	return axios.put(url, blob, requestConfig)
}
