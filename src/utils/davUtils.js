/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getCurrentUser } from '@nextcloud/auth'

/**
 * Is the current user an unauthenticated user?
 */
export function isPublic() {
	return !getCurrentUser()
}
