<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->
<template>
	<NcSettingsSection
		:name="t('files_pdfviewer', 'PDF Viewer')"
		:description="t('files_pdfviewer', 'Configure PDF viewer settings')">
		<NcCheckboxRadioSwitch
			:checked="enableScripting"
			:loading="loading"
			@update:checked="setEnableScripting">
			{{ t('files_pdfviewer', 'Enable PDF form scripting') }}
		</NcCheckboxRadioSwitch>
		<NcNoteCard type="warning">
			{{ t('files_pdfviewer', 'Enabling PDF scripting allows JavaScript execution within PDF documents. This enables form calculations and dynamic content, but may pose security risks with untrusted PDFs. PDF scripts run in a sandboxed environment.') }}
		</NcNoteCard>
	</NcSettingsSection>
</template>

<script>
import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { generateUrl } from '@nextcloud/router'
import { NcCheckboxRadioSwitch, NcNoteCard, NcSettingsSection } from '@nextcloud/vue'
import logger from '../services/logger.js'

export default {
	name: 'AdminSettings',

	components: {
		NcCheckboxRadioSwitch,
		NcNoteCard,
		NcSettingsSection,
	},

	data() {
		return {
			enableScripting: false,
			loading: true,
		}
	},

	async mounted() {
		await this.loadSettings()
	},

	methods: {
		async loadSettings() {
			this.loading = true
			try {
				const response = await axios.get(generateUrl('/apps/files_pdfviewer/settings'))
				this.enableScripting = response.data.enableScripting
			} catch (error) {
				showError(t('files_pdfviewer', 'Failed to load settings'))
				logger.error('Failed to load PDF viewer settings:', { error })
			} finally {
				this.loading = false
			}
		},

		async setEnableScripting(value) {
			this.loading = true
			try {
				await axios.post(generateUrl('/apps/files_pdfviewer/settings'), {
					enableScripting: value,
				})
				this.enableScripting = value
				showSuccess(t('files_pdfviewer', 'Settings saved'))
			} catch (error) {
				showError(t('files_pdfviewer', 'Failed to save settings'))
				logger.error('Failed to save PDF viewer settings:', { error })
			} finally {
				this.loading = false
			}
		},
	},
}
</script>
