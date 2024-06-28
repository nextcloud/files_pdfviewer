/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
export default function() {
	// Not within iframe
	if (window.location !== window.parent.location) {
		return
	}

	window.location.href = '/'
}
