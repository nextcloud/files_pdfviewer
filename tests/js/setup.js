/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// The server provides this global to every app script. Tests that mount a
// component need to pass it explicitly, e.g.
// `global: { config: { globalProperties: { t } } }`.
globalThis.t = (app, text) => text
