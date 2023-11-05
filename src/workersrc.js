
/**
 * @copyright Copyright (c) 2020 Daniel Calviño Sánchez <danxuliu@gmail.com>
 *
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
	PDFViewerApplicationOptions.set('enablePermissions', true)
	PDFViewerApplicationOptions.set('imageResourcesPath', './js/pdfjs/web/images/')
	// AnnotationMode.ENABLE value is 1 in PDF.js, which shows forms, but does
	// not allow to interact with them
	PDFViewerApplicationOptions.set('annotationMode', 1)

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
