/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue, { defineComponent } from 'vue'

/**
 *
 */
function AsyncPDFViewComponent() {
	return import('./PDFView.vue')
}

// The vue instance used inside text constructed with the import above.
let innerVue

/**
 * This thin Component wrapper can be rendered inside the viewer.
 *
 * The viewers vue instance is used to render this component
 * based on the options provided here for the options api.
 *
 * When mounted this component constructs the vue instance
 * used inside pdfviewer based on pdvviewers vue import.
 *
 * Viewer adds a mixin to the component that adds a bunch of props.
 * These are all handed down to the PDFView component.
 */
export default defineComponent({
	name: 'ViewerView',
	render: (h) => h('div'),
	inheritAttrs: false,
	mounted() {
		innerVue = new Vue({
			render: (h) => {
				return h(AsyncPDFViewComponent, {
					// Hand down props as added by the viewers Mime mixin.
					props: {
						...this.$props,
						davPath: this.davPath,
					},
					on: {
						...this.$listeners,
						// doneLoading is provided by the viewers Mime mixin.
						doneLoading: () => this.doneLoading(),
					},
				})
			},
		})
		innerVue.$mount(this.$el)
	},
	beforeDestroy() {
		innerVue.$destroy()
	},
})
