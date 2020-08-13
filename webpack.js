const webpackConfig = require('@nextcloud/webpack-vue-config')
const path = require('path')
const unzipper = require('unzipper')
const request = require('request')

// Fetching pdf.js build release
const PDFJSversion = '2.4.456'
request(`https://github.com/mozilla/pdf.js/releases/download/v${PDFJSversion}/pdfjs-${PDFJSversion}-dist.zip`)
	.pipe(unzipper.Extract({ path: path.resolve(__dirname, 'js', 'pdfjs') }))
console.info('Downloading pdf.js', PDFJSversion, '\n')

webpackConfig.entry.workersrc = path.resolve(path.join('src', 'workersrc.js'))
webpackConfig.entry.public = path.resolve(path.join('src', 'public.js'))
module.exports = webpackConfig
