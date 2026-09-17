/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [vue()],
	// Provided by the "define" option of vite.config.js when building.
	define: {
		SUPPORTED_LANGUAGES: JSON.stringify(['de', 'en-GB', 'pt-BR']),
	},
	test: {
		environment: 'jsdom',
		include: ['tests/js/**/*.spec.js'],
		setupFiles: ['tests/js/setup.js'],
		server: {
			deps: {
				// The Nextcloud packages ship untranspiled CSS imports.
				inline: [/@nextcloud\//],
			},
		},
	},
})
