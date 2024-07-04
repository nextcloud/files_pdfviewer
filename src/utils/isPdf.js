/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const mimetypeElmt = document.getElementById('mimetype')
export default () => mimetypeElmt && mimetypeElmt.value === 'application/pdf'
