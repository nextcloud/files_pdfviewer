/**
 * SPDX-FileCopyrightText: 2032 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getLoggerBuilder } from '@nextcloud/logger'

// Set up logger
const logger = getLoggerBuilder()
	.setApp('Files_PDFViewer')
	.detectUser()
	.build()

export default logger
