/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const webpack = require('webpack')
const webpackConfig = require('@nextcloud/webpack-vue-config')
const path = require('path')
const { readdirSync } = require('fs')

const l10nContent = readdirSync(path.resolve(__dirname, 'js', 'pdfjs', 'web', 'locale'))

webpackConfig.entry.workersrc = path.resolve(path.join('src', 'workersrc.js'))
webpackConfig.entry.public = path.resolve(path.join('src', 'public.js'))

// keep pdfjs vendor in the js folder
webpackConfig.output.clean = false

// Add list of PDFjs supported languages
webpackConfig.plugins.push(
	new webpack.DefinePlugin({
		SUPPORTED_LANGUAGES: JSON.stringify(l10nContent),
	}),
)

module.exports = webpackConfig
