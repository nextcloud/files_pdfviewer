/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const hideDownloadElmt = document.getElementById('hideDownload')
export default () => hideDownloadElmt && hideDownloadElmt.value === 'true'
