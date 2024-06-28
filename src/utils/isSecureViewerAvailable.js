/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import canDownload from './canDownload.js'

export default () => !canDownload() && typeof OCA.RichDocuments !== 'undefined'
