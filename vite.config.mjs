/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { createAppConfig } from '@nextcloud/vite-config'

const l10nContent = readdirSync(path.resolve(import.meta.dirname, 'js', 'pdfjs', 'web', 'locale'))

export default createAppConfig({
	main: path.resolve(path.join('src', 'main.js')),
	admin: path.resolve(path.join('src', 'admin.js')),
	workersrc: path.resolve(path.join('src', 'workersrc.js')),
}, {
	// "js/pdfjs" is fetched separately by the "prebuild" script and must
	// survive the build.
	emptyOutputDirectory: false,
	extractLicenseInformation: {
		includeSourceMaps: true,
		overwriteLicenses: {
			// TODO: Remove if they fixed the license in the package.json
			'@nextcloud/axios': 'GPL-3.0-or-later',
			'@nextcloud/vue': 'AGPL-3.0-or-later',
			'nextcloud-vue-collections': 'AGPL-3.0-or-later',
		},
	},
	config: {
		// Strip comments; the extracted ".license" files above cover REUSE.
		esbuild: {
			legalComments: 'none',
		},
		// Add list of PDFjs supported languages.
		define: {
			SUPPORTED_LANGUAGES: JSON.stringify(l10nContent),
		},
	},
})
