<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Charismatic Claire <charismatic.claire@noservice.noreply>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->
<template>
	<iframe :src="iframeSrc" />
</template>

<script>
import { generateUrl } from '@nextcloud/router'

export default {
	name: 'PDFView',

	computed: {
		iframeSrc() {
			return generateUrl('/apps/files_pdfviewer/?file={file}', {
				file: this.encodedDavPath,
			})
		},

		encodedDavPath() {
			const hasScheme = this.davPath.indexOf('://') !== -1

			const pathSections = this.davPath.split('/')

			// Ignore scheme and domain in the loop (note that the scheme
			// delimiter, "//", creates an empty section when split by "/").
			const initialSection = hasScheme ? 3 : 0

			let encodedDavPath = ''
			for (let i = initialSection; i < pathSections.length; i++) {
				if (pathSections[i] !== '') {
					encodedDavPath += '/' + encodeURIComponent(pathSections[i])
				}
			}

			if (hasScheme) {
				encodedDavPath = pathSections[0] + '//' + pathSections[2] + encodedDavPath
			}

			return encodedDavPath
		},
	},

	async mounted() {
		this.doneLoading()
		this.$nextTick(function() {
			this.$el.focus()
		})
	},
}
</script>

<style lang="scss" scoped>
iframe {
	width: 100%;
	height: 100%;
}
</style>
