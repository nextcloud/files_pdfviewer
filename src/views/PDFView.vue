<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Charismatic Claire <charismatic.claire@noservice.noreply>
  -
  - @license AGPL-3.0-or-later
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
	<iframe ref="iframe"
		:src="iframeSrc" />
</template>

<script>
import { generateUrl } from '@nextcloud/router'
import canDownload from '../utils/canDownload.js'
import isPdf from '../utils/isPdf.js'
import isPublicPage from '../utils/isPublicPage.js'

export default {
	name: 'PDFView',

	computed: {
		iframeSrc() {
			return generateUrl('/apps/files_pdfviewer/?file={file}&canDownload={canDownload}', {
				canDownload: canDownload() ? 1 : 0,
				file: this.source ?? this.davPath,
			})
		},
	},

	async mounted() {
		if (isPublicPage() && isPdf()) {
			// Force style for public shares of a single PDF file, as there are
			// no CSS selectors that could be used only for that case.
			this.$refs.iframe.style.height = '100%'
			this.$refs.iframe.style.position = 'absolute'
			this.$refs.iframe.style.marginTop = 'unset'
		}

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
	height: calc(100vh - var(--header-height));
	margin-top: var(--header-height);
}

</style>
