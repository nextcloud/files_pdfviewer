const webpackConfig = require('@nextcloud/webpack-vue-config')
const path = require('path')

webpackConfig.entry.workersrc = path.resolve(path.join('src', 'workersrc.js'))
webpackConfig.entry.public = path.resolve(path.join('src', 'public.js'))

// keep pdfjs vendor in the js folder
webpackConfig.output.clean = false

module.exports = webpackConfig
