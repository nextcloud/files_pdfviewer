/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminSettings from '../../src/components/AdminSettings.vue'

vi.mock('@nextcloud/axios', () => ({ default: { get: vi.fn(), put: vi.fn() } }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const axios = (await import('@nextcloud/axios')).default

afterEach(() => {
	vi.clearAllMocks()
})

describe('AdminSettings', () => {
	const mountWith = async (enableScripting) => {
		axios.get.mockResolvedValue({ data: { ocs: { data: { enableScripting } } } })
		const wrapper = mount(AdminSettings)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		return wrapper
	}

	const toggle = async (wrapper) => {
		await wrapper.find('input[type="checkbox"]').trigger('change')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
	}

	const isChecked = (wrapper) => wrapper.find('input[type="checkbox"]').element.checked

	it('shows the value returned by the server', async () => {
		expect(isChecked(await mountWith(true))).toBe(true)
	})

	it('keeps the switch on the saved value when saving fails', async () => {
		const wrapper = await mountWith(false)
		axios.put.mockRejectedValue(new Error('nope'))

		await toggle(wrapper)

		expect(axios.put).toHaveBeenCalled()
		expect(isChecked(wrapper)).toBe(false)
	})

	it('moves the switch once the value was saved', async () => {
		const wrapper = await mountWith(false)
		axios.put.mockResolvedValue({ data: { ocs: { data: { enableScripting: true } } } })

		await toggle(wrapper)

		expect(isChecked(wrapper)).toBe(true)
	})
})
