/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import hideDownload from './hideDownload.js'

export default () => hideDownload() && typeof OCA.RichDocuments !== 'undefined'
