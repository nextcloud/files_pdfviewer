/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'

// The server provides this global to every app script, and src/admin.js puts it
// on the Vue prototype so that it can be used from the templates.
globalThis.t = (app, text) => text
Vue.prototype.t = globalThis.t
