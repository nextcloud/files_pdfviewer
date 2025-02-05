/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2014-2016 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import redirectIfNotIframe from './utils/redirectIfNotIframe.js'

// Checks if the page is displayed in an iframe. If not redirect to /.
redirectIfNotIframe()
