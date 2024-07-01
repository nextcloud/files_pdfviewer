/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const isPublicElmt = document.getElementById('isPublic')
export default () => !!(isPublicElmt && isPublicElmt.value === '1')
