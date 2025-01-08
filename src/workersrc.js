/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2014-2016 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import logger from './services/logger.js'
import redirectIfNotIframe from './utils/redirectIfNotIframe.js'

// Checks if the page is displayed in an iframe. If not redirect to /.
redirectIfNotIframe()

// Retrieve the canDownload from the url, this is
// the most easy way to pass the prop to this iframe
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const canDownload = urlParams.get('canDownload')

function initializeCustomPDFViewerApplication() {
	const head = document.getElementsByTagName('head')[0]

	// Preferences override options, so they must be disabled for
	// "externalLinkTarget" to take effect.
	PDFViewerApplicationOptions.set('disablePreferences', true)
	// TODO https://github.com/mozilla/pdf.js/pull/14424#issuecomment-1092947792
	PDFViewerApplicationOptions.set('externalLinkTarget', 2)
	PDFViewerApplicationOptions.set('isEvalSupported', false)
	PDFViewerApplicationOptions.set('workerSrc', head.getAttribute('data-workersrc'))
	PDFViewerApplicationOptions.set('cMapUrl', head.getAttribute('data-cmapurl'))
	PDFViewerApplicationOptions.set('sandboxBundleSrc', head.getAttribute('data-sandbox'))
	PDFViewerApplicationOptions.set('enablePermissions', true)
	PDFViewerApplicationOptions.set('imageResourcesPath', head.getAttribute('data-imageresourcespath'))
	PDFViewerApplicationOptions.set('enableScripting', head.getAttribute('data-enableScripting') === true)

	if (canDownload === '0') {
		const pdfViewer = window.document.querySelector('.pdfViewer')

		if (pdfViewer) {
			pdfViewer.classList.add('disabledTextSelection')
		}

		if (PDFViewerApplication) {
			// Disable download function when downloads are hidden, as even if the
			// buttons in the UI are hidden the download could still be triggered
			// with Ctrl|Meta+S.
			PDFViewerApplication.download = function() {
			}

			// Disable printing service when downloads are hidden, as even if the
			// buttons in the UI are hidden the printing could still be triggered
			// with Ctrl|Meta+P.
			// Abuse the "supportsPrinting" parameter, which signals that the
			// browser does not fully support printing, to make PDFViewer disable
			// the printing service.
			// "supportsPrinting" is a getter function, so it needs to be deleted
			// before replacing it with a simple value.
			delete PDFViewerApplication.supportsPrinting
			PDFViewerApplication.supportsPrinting = false

			// When printing is not supported a warning is shown by the default
			// "beforePrint" function when trying to print. That function needs to
			// be replaced with an empty one to prevent that warning to be shown.
			PDFViewerApplication.beforePrint = function() {
			}
		}

		logger.info('Download, print and user interaction disabled')
	} else {
		logger.info('Download and print available')
	}

	logger.debug('Initialized files_pdfviewer', PDFViewerApplicationOptions.getAll())
}

document.addEventListener('DOMContentLoaded', initializeCustomPDFViewerApplication, true)
