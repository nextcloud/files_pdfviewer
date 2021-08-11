
/**
 * @copyright Copyright (c) 2020 Daniel Calviño Sánchez <danxuliu@gmail.com>
 *
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

import logger from './services/logger'
import redirectIfNotIframe from './utils/redirectIfNotIframe'

// Checks if the page is displayed in an iframe. If not redirect to /.
redirectIfNotIframe()

// When "PDFViewerApplication.webViewerInitialized" is executed (once
// "PDFViewerApplication.initialize" is done) it opens the PDF file via URL,
// which requires the PDFViewerApplication to be properly configured, so the
// custom initialization has to be executed before that. This can be done by
// listening to the "webviewerloaded" event, which is emitted after
// "PDFViewerApplication" and "PDFViewerApplicationOptions" are globally set and
// before "PDFViewerApplication.initialize" is executed.
function initializeCustomPDFViewerApplication() {
	// Preferences override options, so they must be disabled for
	// "externalLinkTarget" to take effect.
	PDFViewerApplicationOptions.set('disablePreferences', true)
	PDFViewerApplicationOptions.set('externalLinkTarget', pdfjsLib.LinkTarget.BLANK)
	PDFViewerApplicationOptions.set('isEvalSupported', false)
	PDFViewerApplicationOptions.set('workerSrc', document.getElementsByTagName('head')[0].getAttribute('data-workersrc'))
	PDFViewerApplicationOptions.set('cMapUrl', document.getElementsByTagName('head')[0].getAttribute('data-cmapurl'))
	PDFViewerApplicationOptions.set('enablePermissions', true)

	logger.debug('Initialized files_pdfviewer', PDFViewerApplicationOptions.getAll())
}

document.addEventListener('DOMContentLoaded', initializeCustomPDFViewerApplication, true)
