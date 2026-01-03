/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import AdminSettings from './components/AdminSettings.vue'

Vue.prototype.t = t
Vue.prototype.n = n

const View = Vue.extend(AdminSettings)
new View().$mount('#files_pdfviewer-admin-settings')
