/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const webpackConfig = require('@nextcloud/webpack-vue-config')
// eslint-disable-next-line n/no-extraneous-require
const TerserPlugin = require('terser-webpack-plugin')
const WebpackSPDXPlugin = require('./build-js/WebpackSPDXPlugin.js')
const path = require('path')

webpackConfig.entry.workersrc = path.resolve(path.join('src', 'workersrc.js'))
webpackConfig.entry.public = path.resolve(path.join('src', 'public.js'))

// keep pdfjs vendor in the js folder
webpackConfig.output.clean = false

webpackConfig.optimization.minimizer = [new TerserPlugin({
	extractComments: false,
	terserOptions: {
		format: {
			comments: false,
		},
	},
})]

webpackConfig.plugins = [
	...webpackConfig.plugins,
	// Generate reuse license files
	new WebpackSPDXPlugin({
		override: {
			// TODO: Remove if they fixed the license in the package.json
			'@nextcloud/axios': 'GPL-3.0-or-later',
			'@nextcloud/vue': 'AGPL-3.0-or-later',
			'nextcloud-vue-collections': 'AGPL-3.0-or-later',
		}
	}),
]

module.exports = webpackConfig
