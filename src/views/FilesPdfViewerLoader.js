/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp, defineAsyncComponent, defineComponent, h } from 'vue'

const AsyncPdfView = defineAsyncComponent(() => import('./PDFView.vue'))

/**
 * Converts a Vue 2 "$listeners" map into Vue 3's "onEventName" props.
 *
 * @param {object} listeners Event name to handler map, from "$listeners".
 * @return {object} The equivalent "onEventName" props.
 */
function toVue3Listeners(listeners) {
	return Object.fromEntries(Object.entries(listeners).map(([name, handler]) => [
		'on' + name.replace(/(^|-)([a-z])/g, (match, separator, letter) => letter.toUpperCase()),
		handler,
	]))
}

/**
 * Thin wrapper rendered by the viewer (still Vue 2). Mounts an independent
 * Vue 3 app for the actual PDF view, sharing only this component's DOM
 * element with the viewer's own component tree.
 *
 * Viewer adds a mixin providing the props handed down to PDFView.
 */
export default defineComponent({
	name: 'FilesPdfViewerLoader',
	render: (h) => {
		// Viewer's "viewer__file--active" class (applied to this element)
		// sets no explicit width; PDFView.vue's own root element needs one.
		return h('div', { style: { width: '100%', height: '100%', position: 'relative' } })
	},
	inheritAttrs: false,
	mounted() {
		this.innerApp = createApp({
			name: 'FilesPdfViewerProxy',
			render: () => {
				return h(AsyncPdfView, {
					// Hand down props as added by the viewers Mime mixin.
					...this.$props,
					davPath: this.davPath,
					...toVue3Listeners(this.$listeners),
					// doneLoading is provided by the viewers Mime mixin.
					onDoneLoading: () => {
						this.doneLoading()
					},
				})
			},
		})
		this.innerApp.mount(this.$el)
	},
	beforeDestroy() {
		this.innerApp.unmount()
	},
})
