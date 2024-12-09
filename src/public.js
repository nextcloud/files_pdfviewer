/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { generateUrl } from '@nextcloud/router'

import logger from './services/logger.js'
import hideDownload from './utils/hideDownload.js'
import isPublicPage from './utils/isPublicPage.js'
import isPdf from './utils/isPdf.js'
import isSecureViewerAvailable from './utils/isSecureViewerAvailable.js'

window.addEventListener('DOMContentLoaded', function() {
	logger.debug('Initializing for public page', {
		isPublicPage: isPublicPage(),
		hideDownload: hideDownload(),
		isSecureViewerAvailable: isSecureViewerAvailable(),
	})

	// If we display a folder, we don't have anything more to do here
	if (isPublicPage() && !isPdf()) {
		logger.debug('But this is not a single pdf share')
		return
	}

	// If we display a single PDF and we don't use the richdocument secureViewer
	if (isPublicPage() && isPdf() && !isSecureViewerAvailable()) {
		const page = location.hash.split('page=')[1] || 0
		const contentElmt = document.getElementById('files-public-content')
		const sharingTokenElmt = document.getElementById('sharingToken')
		// By default the footer is a direct child of the body, but if the Talk
		// sidebar is loaded it is moved into the app content. In all cases the
		// footer is hidden to give the PDF viewer the full height.
		const footerElmt = document.querySelector('body > footer') || document.querySelector('#app-content > footer')
		const mainContent = document.querySelector('#content')

		const sharingToken = sharingTokenElmt.value
		const downloadUrl = generateUrl('/s/{token}/download', { token: sharingToken })
		const viewerUrl = generateUrl('/apps/files_pdfviewer/?file={downloadUrl}&hideDownload={hideDownload}#page={page}', {
			hideDownload: hideDownload() ? 1 : 0,
			downloadUrl,
			page,
		})

		// Inject viewer
		if (contentElmt) {
			contentElmt.innerHTML = ''

			if (OCA.Viewer) {
				OCA.Viewer.setRootElement('#files-public-content')
				OCA.Viewer.open({ path: '/' })
			} else {
				logger.error('Viewer not available, PDF viewer directly injected')

				// Create viewer frame
				const viewerNode = document.createElement('iframe')
				viewerNode.style.height = '100%'
				viewerNode.style.width = '100%'
				viewerNode.style.position = 'absolute'

				contentElmt.appendChild(viewerNode)
				viewerNode.src = viewerUrl
			}

			footerElmt.style.display = 'none'
			mainContent.style.minHeight = 'calc(100% - var(--header-height))' // Make the viewer take the whole height as the footer is now hidden.
			// overwrite style in order to fix the viewer on public pages
			mainContent.style.marginLeft = '0'
			mainContent.style.marginRight = '0'
			mainContent.style.width = '100%'
			mainContent.style.borderRadius = 'unset'
		} else {
			logger.error('Unable to inject the PDF Viewer')
		}
	} else {
		logger.error('But this does not appear to be a public page')
	}
})
