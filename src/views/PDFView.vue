<!--
  - SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
  -->
<template>
	<iframe v-if="isDownloadable"
		ref="iframe"
		:src="iframeSrc"
		@load="onIFrameLoaded" />
	<div v-else id="emptycontent">
		<div class="icon-error" />
		<h3>{{ t('files_pdfviewer', 'To view a shared PDF file, the download needs to be allowed for this file share') }}</h3>
	</div>
</template>

<script>
import { showError } from '@nextcloud/dialogs'
import { getLanguage } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import logger from '../services/logger.js'
import uploadPdfFile from '../services/uploadPdfFile.js'
import hideDownload from '../utils/hideDownload.js'
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
			return generateUrl('/apps/files_pdfviewer/?file={file}', {
				file: this.source ?? this.davPath,
			})
		},

		file() {
			// fileList and fileid are provided by the Mime mixin of the Viewer.
			return this.fileList.find((file) => file.fileid === this.fileid)
		},

		isDownloadable() {
			if (!this.file.shareAttributes) {
				return true
			}

			const shareAttributes = JSON.parse(this.file.shareAttributes)
			const downloadPermissions = shareAttributes.find(({ scope, key }) => scope === 'permissions' && key === 'download')
			if (downloadPermissions) {
				return downloadPermissions.value
			}

			return true
		},

		isEditable() {
			return this.file?.permissions?.indexOf('W') >= 0
		},
	},

	async mounted() {
		if (!this.isDownloadable) {
			this.doneLoading()

			return
		}

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
	},

	beforeDestroy() {
		document.removeEventListener('webviewerloaded', this.handleWebviewerloaded)
	},

	methods: {
		onIFrameLoaded() {
			if (this.isEditable) {
				this.$nextTick(() => {
					this.getDownloadElement().removeAttribute('hidden')
				})
			}
		},

		getIframeDocument() {
			// $refs are not reactive, so a method is used instead of a computed
			// property for clarity.
			return this.$refs.iframe.contentDocument
		},

		getDownloadElement() {
			return this.getIframeDocument().getElementById('download')
		},

		getViewerTemplateParameter(parameterName) {
			// templates/viewer.php provides the PDF viewer parameters in the
			// data attributes of the head element.
			return this.getIframeDocument().getElementsByTagName('head')[0].getAttribute('data-' + parameterName)
		},

		initializePDFViewerApplicationOptions() {
			const PDFViewerApplicationOptions = this.$refs.iframe.contentWindow.PDFViewerApplicationOptions

			// Preferences override options, so they must be disabled for
			// "externalLinkTarget" and "annotationMode" to take effect.
			PDFViewerApplicationOptions.set('disablePreferences', true)
			// TODO https://github.com/mozilla/pdf.js/pull/14424#issuecomment-1092947792
			PDFViewerApplicationOptions.set('externalLinkTarget', 2)
			PDFViewerApplicationOptions.set('isEvalSupported', false)
			PDFViewerApplicationOptions.set('workerSrc', this.getViewerTemplateParameter('workersrc'))
			PDFViewerApplicationOptions.set('cMapUrl', this.getViewerTemplateParameter('cmapurl'))
			PDFViewerApplicationOptions.set('sandboxBundleSrc', this.getViewerTemplateParameter('sandbox'))
			PDFViewerApplicationOptions.set('enablePermissions', true)
			PDFViewerApplicationOptions.set('imageResourcesPath', this.getViewerTemplateParameter('imageresourcespath'))
			PDFViewerApplicationOptions.set('enableScripting', this.getViewerTemplateParameter('enableScripting') === true)

			const language = getLanguage()
			const supportedLanguages = SUPPORTED_LANGUAGES
			// If the user language is supported we use that language,
			// if the unflavored language is supported we use that,
			// and if nothing is supported we do not set it as that would fallback to English but we let PDFjs use the browser language.
			if (supportedLanguages.includes(language)) {
				// Set the language (they misused "locale") to the user configured value
				// instead of defaulting to the browser language
				PDFViewerApplicationOptions.set('locale', language)
			} else {
				// Sometimes a flavored language is not named correctly (PDFjs uses iso639-2 and Nextcloud iso639-1)
				const unflavoredLanguage = language.split('-')[0]
				if (supportedLanguages.includes(unflavoredLanguage) || supportedLanguages.find((language) => language.startsWith(`${unflavoredLanguage}-`))) {
					PDFViewerApplicationOptions.set('locale', unflavoredLanguage)
				}
			}

			if (!this.isEditable) {
				// AnnotationMode.ENABLE value is 1 in PDF.js, which shows
				// forms, but does not allow to interact with them
				PDFViewerApplicationOptions.set('annotationMode', 1)

				// AnnotationEditorType.DISABLE value is -1 in PDF.js, which
				// prevents editing annotations
				PDFViewerApplicationOptions.set('annotationEditorMode', -1)
			}
		},

		initializePDFViewerApplication() {
			this.PDFViewerApplication = this.$refs.iframe.contentWindow.PDFViewerApplication

			this.PDFViewerApplication.save = this.handleSave

			// Not all fields of PDFViewerApplication are reactive.
			// Specifically, it can not be known if annotations were created by
			// watching "pdfDocument.annotationStorage.size" (maybe because
			// "size" is a getter based on a private field, so it does not work
			// even if the rest of the chain is skipped and "size" is directly
			// watched). However, "annotationStorage" has callbacks used by
			// PDFViewerApplication to know when an annotation was set, so that
			// callback can be wrapped to also enable the save button.
			this.PDFViewerApplication.eventBus.on('documentinit', () => {
				const annotationStorage = this.PDFViewerApplication.pdfDocument.annotationStorage

				const onSetModifiedOriginal = annotationStorage.onSetModified
				annotationStorage.onSetModified = () => {
					onSetModifiedOriginal.apply(null, arguments)

					this.getDownloadElement().removeAttribute('disabled')
				}
			})

			if (hideDownload()) {
				const pdfViewer = this.getIframeDocument().querySelector('.pdfViewer')

				if (pdfViewer) {
					pdfViewer.classList.add('disabledTextSelection')
				}

				// Disable download function when downloads are hidden, as even
				// if the buttons in the UI are hidden the download could still
				// be triggered with Ctrl|Meta+S.
				this.PDFViewerApplication.download = () => {
				}

				// Disable printing service when downloads are hidden, as even
				// if the buttons in the UI are hidden the printing could still
				// be triggered with Ctrl|Meta+P.
				// Abuse the "supportsPrinting" parameter, which signals that
				// the browser does not fully support printing, to make
				// PDFViewer disable the printing service.
				// "supportsPrinting" is a getter function, so it needs to be
				// deleted before replacing it with a simple value.
				delete this.PDFViewerApplication.supportsPrinting
				this.PDFViewerApplication.supportsPrinting = false

				// When printing is not supported a warning is shown by the
				// default "beforePrint" function when trying to print. That
				// function needs to be replaced with an empty one to prevent
				// that warning to be shown.
				this.PDFViewerApplication.beforePrint = () => {
				}

				logger.info('Download, print and user interaction disabled')
			} else {
				logger.info('Download and print available')
			}

			const PDFViewerApplicationOptions = this.$refs.iframe.contentWindow.PDFViewerApplicationOptions

			logger.debug('Initialized files_pdfviewer', PDFViewerApplicationOptions.getAll())
		},

		handleWebviewerloaded() {
			this.initializePDFViewerApplicationOptions()

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
				this.initializePDFViewerApplication()
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
#emptycontent {
	margin: 0;
	padding: 10% 5%;
	background-color: var(--color-main-background);
}

iframe {
	width: 100%;
	height: calc(100vh - var(--header-height));
	margin-top: var(--header-height);
	position: absolute;
}

</style>
