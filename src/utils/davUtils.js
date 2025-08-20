/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getCurrentUser } from '@nextcloud/auth'
import { generateRemoteUrl } from '@nextcloud/router'

/**
 * Get the current dav root path
 * e.g /remote.php/dav/files/USERID
 * or /public.php/webdav for public shares
 */
export function getRootPath() {
	if (!isPublic()) {
		return generateRemoteUrl(`dav${getUserRoot()}`)
	} else {
		return generateRemoteUrl('webdav').replace('/remote.php', '/public.php')
	}
}

/**
 * Get the user root path relative to
 * the dav service endpoint
 */
export function getUserRoot() {
	if (isPublic()) {
		throw new Error('No user logged in')
	}

	return `/files/${getCurrentUser()?.uid}`
}

/**
 * Is the current user an unauthenticated user?
 */
export function isPublic() {
	return !getCurrentUser()
}
