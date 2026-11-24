/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// The modern pdf.js build calls the Map and WeakMap upsert methods that
// Firefox ships from version 144 on, while the supported Firefox ESR 140
// does not provide them yet. This module is loaded before pdf.js in the
// viewer page (see templates/viewer.php) and prepended to the worker file
// at build time (see pdfjs-get.js), so every context executing pdf.js
// code gets the shims. It stays idle where the methods already exist.

/**
 * Defines the upsert methods on the given Map or WeakMap prototype when
 * the engine does not provide them.
 *
 * @param {object} prototype the Map or WeakMap prototype to extend
 */
function defineUpserts(prototype) {
	if (typeof prototype.getOrInsert !== 'function') {
		prototype.getOrInsert = function(key, value) {
			if (this.has(key)) {
				return this.get(key)
			}

			this.set(key, value)
			return value
		}
	}

	if (typeof prototype.getOrInsertComputed !== 'function') {
		prototype.getOrInsertComputed = function(key, callbackfn) {
			if (this.has(key)) {
				return this.get(key)
			}

			if (typeof callbackfn !== 'function') {
				throw new TypeError('callbackfn is not callable')
			}

			const value = callbackfn(key)
			this.set(key, value)
			return value
		}
	}
}

defineUpserts(Map.prototype)
defineUpserts(WeakMap.prototype)
