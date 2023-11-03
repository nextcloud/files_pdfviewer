<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Charismatic Claire <charismatic.claire@noservice.noreply>
  -
  - @license AGPL-3.0-or-later
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->
<template>
	<iframe ref="iframe"
		:src="iframeSrc" />
</template>

<script>
import { showError } from '@nextcloud/dialogs'
import { generateUrl } from '@nextcloud/router'
import logger from '../services/logger.js'
import uploadPdfFile from '../services/uploadPdfFile.js'
import canDownload from '../utils/canDownload.js'
import isPdf from '../utils/isPdf.js'
import isPublicPage from '../utils/isPublicPage.js'

export default {
	name: 'PDFView',

	data() {
		return {
			// Not all fields are reactive!
			PDFViewerApplication: null,
		}
	},

	computed: {
		iframeSrc() {
			return generateUrl('/apps/files_pdfviewer/?file={file}&canDownload={canDownload}', {
				canDownload: canDownload() ? 1 : 0,
				file: this.source ?? this.davPath,
			})
		},

		file() {
			// fileList and fileid are provided by the Mime mixin of the Viewer.
			return this.fileList.find((file) => file.fileid === this.fileid)
		},

		isEditable() {
			return this.file?.permissions?.indexOf('W') >= 0
		},
	},

	async mounted() {
		document.addEventListener('webviewerloaded', this.handleWebviewerloaded)

		if (isPublicPage() && isPdf()) {
			// Force style for public shares of a single PDF file, as there are
			// no CSS selectors that could be used only for that case.
			this.$refs.iframe.style.height = '100%'
			this.$refs.iframe.style.position = 'absolute'
			this.$refs.iframe.style.marginTop = 'unset'
		}

		this.doneLoading()
		this.$nextTick(function() {
			this.$el.focus()
		})

		if (this.isEditable) {
			this.$refs.iframe.addEventListener('load', () => {
				this.getDownloadElement().removeAttribute('hidden')

				this.getEditorModeButtonsElement().removeAttribute('hidden')
			})
		}
	},

	beforeDestroy() {
		document.removeEventListener('webviewerloaded', this.handleWebviewerloaded)
	},

	methods: {
		getIframeDocument() {
			// $refs are not reactive, so a method is used instead of a computed
			// property for clarity.
			return this.$refs.iframe.contentDocument
		},

		getDownloadElement() {
			return this.getIframeDocument().getElementById('download')
		},

		getEditorModeButtonsElement() {
			return this.getIframeDocument().getElementById('editorModeButtons')
		},

		handleWebviewerloaded() {
			const PDFViewerApplicationOptions = this.$refs.iframe.contentWindow.PDFViewerApplicationOptions

			if (!this.isEditable) {
				// Preferences override options, so they must be disabled for
				// "annotationMode" to take effect.
				PDFViewerApplicationOptions.set('disablePreferences', true)

				// AnnotationMode.ENABLE value is 1 in PDF.js, which shows
				// forms, but does not allow to interact with them
				PDFViewerApplicationOptions.set('annotationMode', 1)
			}

			// PDFViewerApplication can not be set when the "webviewerloaded"
			// event is dispatched, as at this point the application was not
			// initialized yet; some of its getters expect the
			// PDFViewerApplication to have been initialized when called, and
			// assigning the property causes Vue to apply reactivity on its
			// attributes, so this would cause an exception to be thrown (for
			// example, for PDFViewerApplication.page, as its getter expects
			// PDFViewerApplication.pdfViewer to be set already and thus uses it
			// unconditionally).
			this.$refs.iframe.contentWindow.PDFViewerApplication.initializedPromise.then(() => {
				this.PDFViewerApplication = this.$refs.iframe.contentWindow.PDFViewerApplication

				this.PDFViewerApplication.save = this.handleSave

				// Not all fields of PDFViewerApplication are reactive.
				// Specifically, it can not be known if annotations were created
				// by watching "pdfDocument.annotationStorage.size" (maybe
				// because "size" is a getter based on a private field, so it
				// does not work even if the rest of the chain is skipped and
				// "size" is directly watched). However, "annotationStorage" has
				// callbacks used by PDFViewerApplication to know when an
				// annotation was set, so that callback can be wrapped to also
				// enable the save button.
				this.PDFViewerApplication.eventBus.on('documentinit', () => {
					const annotationStorage = this.PDFViewerApplication.pdfDocument.annotationStorage

					const onSetModifiedOriginal = annotationStorage.onSetModified
					annotationStorage.onSetModified = () => {
						onSetModifiedOriginal.apply(null, arguments)

						this.getDownloadElement().removeAttribute('disabled')
					}
				})
			})
		},

		handleSave() {
			const downloadElement = this.getDownloadElement()
			downloadElement.setAttribute('disabled', 'disabled')
			downloadElement.classList.add('icon-loading-small')

			logger.info('PDF Document with annotation is being saved')

			this.PDFViewerApplication.pdfDocument.saveDocument().then((data) => {
				return uploadPdfFile(this.file.filename, data)
			}).then(() => {
				logger.info('File uploaded successfully')
			}).catch(error => {
				logger.error('Error uploading file:', error)

				showError(t('files_pdfviewer', 'File upload failed.'))

				// Enable button again only if the upload failed; if it was
				// successful it will be enabled again when a new annotation is
				// added.
				downloadElement.removeAttribute('disabled')
			}).finally(() => {
				downloadElement.classList.remove('icon-loading-small')
			})
		},
	},
}
</script>

<style lang="scss" scoped>
iframe {
	width: 100%;
	height: calc(100vh - var(--header-height));
	margin-top: var(--header-height);
	position: absolute;
}

</style>
