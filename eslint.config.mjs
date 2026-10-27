/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { recommended } from '@nextcloud/eslint-config'

export default [
	...recommended,
	{
		name: 'files_pdf/config',
		languageOptions: {
			globals: {
				__webpack_public_path__: 'writable',
			},
		},
	},
]
