/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'

/**
 * Get the current dav root path
 * e.g /remote.php/dav/files/USERID
 * or /public.php/webdav for public shares
 */
export const getRootPath = function() {
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
export const getUserRoot = function() {
	if (isPublic()) {
		throw new Error('No user logged in')
	}

	return `/files/${getCurrentUser()?.uid}`
}

/**
 * Is the current user an unauthenticated user?
 */
export const isPublic = function() {
	return !getCurrentUser()
}

/**
 * Get the current share link token
 */
export const getToken = function() {
	const tokenInput = document.getElementById('sharingToken')
	return tokenInput && tokenInput.value
}
