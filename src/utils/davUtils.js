/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getCurrentUser } from '@nextcloud/auth'
import { generateRemoteUrl } from '@nextcloud/router'
import { getSharingToken } from '@nextcloud/sharing/public'

/**
 * Get the current dav root path
 * e.g /remote.php/dav/files/USERID
 * or /public.php/dav/files/SHARING_TOKEN for public shares
 */
export function getRootPath() {
	const davUrl = generateRemoteUrl('dav')
	if (isPublic()) {
		return davUrl.replace('/remote.php', '/public.php') + `/files/${getSharingToken()}`
	}
	return davUrl + `/files/${getCurrentUser().uid}`
}

/**
 * Is the current user an unauthenticated user?
 */
export function isPublic() {
	return !getCurrentUser()
}
