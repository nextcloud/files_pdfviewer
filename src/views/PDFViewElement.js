/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineAsyncComponent, defineComponent, h } from 'vue'

const PDFView = defineAsyncComponent(() => import('./PDFView.vue'))

/**
 * What the viewer renders as a custom element. PDFView is loaded only once
 * a PDF is opened, so the script registering the handler on every page
 * stays small.
 */
export default defineComponent({
	name: 'PDFViewElement',
	props: {
		file: {
			type: Object,
			required: true,
		},
		files: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['loaded'],
	setup(props, { emit }) {
		return () => h(PDFView, {
			file: props.file,
			files: props.files,
			onLoaded: () => emit('loaded'),
		})
	},
})
