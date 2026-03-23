/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect } from '@playwright/test'
import { runOcc } from '@nextcloud/e2e-test-server'
import { test } from '../support/fixtures/random-user'

const PDF_FILE_NAME = 'test.pdf'

// Minimal valid PDF file content
const PDF_CONTENT = Buffer.from(
	'%PDF-1.0\n'
	+ '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
	+ '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
	+ '3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\n'
	+ 'xref\n'
	+ '0 4\n'
	+ '0000000000 65535 f \n'
	+ '0000000009 00000 n \n'
	+ '0000000058 00000 n \n'
	+ '0000000115 00000 n \n'
	+ 'trailer<</Size 4/Root 1 0 R>>\n'
	+ 'startxref\n'
	+ '190\n'
	+ '%%EOF\n',
)

test.describe('PDF viewer', () => {
	test.beforeEach(async ({ request, user }) => {
		// Upload a minimal PDF file to the user's home directory via WebDAV.
		// HTTP Basic Auth is used with the standalone request fixture (no session cookies)
		// because Nextcloud's WebDAV endpoint rejects state-changing requests that carry
		// session cookies but lack a CSRF token.
		const response = await request.put(
			`/remote.php/dav/files/${user.userId}/${PDF_FILE_NAME}`,
			{
				headers: {
					'Authorization': 'Basic ' + Buffer.from(`${user.userId}:${user.password}`).toString('base64'),
					'Content-Type': 'application/pdf',
				},
				data: PDF_CONTENT,
			},
		)
		expect(response.ok()).toBeTruthy()
	})

	test('opens when clicking a PDF file in the files app', async ({ page }) => {
		await page.goto('apps/files')
		await page.waitForURL(/apps\/files/)

		// Click on the PDF file name link to open it in the viewer.
		// In NC34 the files app requires clicking the [data-cy-files-list-row-name-link]
		// element inside the row (the file name button) rather than the row itself.
		await page.locator(`[data-cy-files-list-row-name="${PDF_FILE_NAME}"] [data-cy-files-list-row-name-link]`).click()

		// The PDF viewer renders an iframe pointing to files_pdfviewer
		await expect(
			page.locator('iframe[src*="files_pdfviewer"]'),
		).toBeVisible({ timeout: 30000 })
	})

	test('opens via public share without download', async ({ request, page, baseURL, user }) => {
		// Enable the admin setting that allows viewing shared files without download
		await runOcc([
			'config:app:set',
			'core',
			'shareapi_allow_view_without_download',
			'--value=yes',
		])

		// Create a public link share (shareType=3) with read-only permissions (permissions=1)
		// and with download disabled (hideDownload=true).
		// HTTP Basic Auth is used with the standalone request fixture (no session cookies)
		// for the same reason as the WebDAV upload above.
		const shareResponse = await request.post(
			'/ocs/v2.php/apps/files_sharing/api/v1/shares',
			{
				headers: {
					'Authorization': 'Basic ' + Buffer.from(`${user.userId}:${user.password}`).toString('base64'),
					'OCS-APIREQUEST': 'true',
					Accept: 'application/json',
				},
				form: {
					path: `/${PDF_FILE_NAME}`,
					shareType: '3',
					permissions: '1',
					hideDownload: '1',
				},
			},
		)
		expect(shareResponse.ok()).toBeTruthy()

		const shareData = await shareResponse.json()
		const shareToken: string = shareData.ocs.data.token

		// Derive the server root from the baseURL (strip the /index.php/ suffix)
		const serverRoot = (baseURL ?? '').replace(/\/index\.php\/?$/, '')

		// Open the public share in a new browser context (no authentication)
		const publicContext = await page.context().browser()!.newContext({
			storageState: undefined,
		})
		const publicPage = await publicContext.newPage()

		try {
			await publicPage.goto(`${serverRoot}/index.php/s/${shareToken}`)

			// The PDF viewer should open automatically for a single-file public share
			await expect(
				publicPage.locator('iframe[src*="files_pdfviewer"]'),
			).toBeVisible({ timeout: 30000 })
		} finally {
			await publicPage.close()
			await publicContext.close()
		}
	})
})
