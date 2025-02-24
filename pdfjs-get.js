/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const path = require('path')
const AdmZip = require('adm-zip')
const axios = require('axios')
const cliProgress = require('cli-progress')
const npmPackageLock = require('./package-lock.json')

// Fetching pdf.js build release
const PDFJSversion = npmPackageLock.dependencies['pdfjs-dist']['version']
console.info('Fetching pdfjs', PDFJSversion)

// Init progress
const pdfjsProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
pdfjsProgress.start(100, 0)

axios.get(`https://github.com/mozilla/pdf.js/releases/download/v${PDFJSversion}/pdfjs-${PDFJSversion}-dist.zip`, {
	onDownloadProgress: ({loaded, total}) => {
		pdfjsProgress.update(loaded / total * 100)

		if (loaded === total) {
			pdfjsProgress.update(100)
			pdfjsProgress.stop()
			console.info('Done! \n')
		}
	},
	responseType: 'arraybuffer',
}).then(response => {
	const zip = new AdmZip(response.data)
	zip.extractAllTo(path.resolve(__dirname, 'js', 'pdfjs'))
}).catch(err => {
	console.error(err)
	throw new Error('Unable to download pdfjs dist')
})
