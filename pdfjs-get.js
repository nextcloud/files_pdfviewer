const path = require('path')
const unzipper = require('unzipper')
const request = require('request')
const progress = require('request-progress')
const cliProgress = require('cli-progress')


// Fetching pdf.js build release
const PDFJSversion = '2.4.456'
console.info('Fetching pdfjs', PDFJSversion)

// Init progress
const pdfjsProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
pdfjsProgress.start(100, 0)

progress(request(`https://github.com/mozilla/pdf.js/releases/download/v${PDFJSversion}/pdfjs-${PDFJSversion}-dist.zip`), {
	throttle: 50,
	delay: 0,
})
	.on('progress', function(state) {
		pdfjsProgress.update(state.size.transferred / state.size.total * 100)
	})
	.on('end', function() {
		pdfjsProgress.update(100)
		pdfjsProgress.stop()
		console.info('Done! \n')
	})
	.on('error', function(err) {
		console.error(err)
		throw new Error('Unable to download pdfjs dist')
	})
	.pipe(unzipper.Extract({ path: path.resolve(__dirname, 'js', 'pdfjs') }))
