/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const axios = require('axios')
const cliProgress = require('cli-progress')
const npmPackageLock = require('./package-lock.json')

// Fetching pdf.js build release
const PDFJSversion = npmPackageLock.packages['node_modules/pdfjs-dist'].version
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
	// The worker runs in its own context, which never sees the viewer
	// page where the polyfill module built from src/pdfjs-polyfills.js
	// is loaded before pdf.js. Prepending the same source gives the
	// worker the shims too, before its first call, while every other
	// file of the dist stays untouched. The guard keeps repeated runs
	// from extracting over the patched file and prepending twice.
	zip.extractAllTo(path.resolve(__dirname, 'js', 'pdfjs'))
	const polyfills = fs.readFileSync(path.resolve(__dirname, 'src', 'pdfjs-polyfills.js'), 'utf8')
	const worker = path.resolve(__dirname, 'js', 'pdfjs', 'build', 'pdf.worker.mjs')
	const content = fs.readFileSync(worker, 'utf8')
	if (!content.startsWith(polyfills)) {
		fs.writeFileSync(worker, `${polyfills}\n${content}`)
	}
}).catch(err => {
	console.error(err)
	throw new Error('Unable to download pdfjs dist')
})
