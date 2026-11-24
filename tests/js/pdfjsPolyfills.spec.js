/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { afterAll, describe, expect, it, vi } from 'vitest'

const polyfill = readFileSync('src/pdfjs-polyfills.js', 'utf8')
const vendored = (file) => readFileSync(`js/pdfjs/${file}`, 'utf8')
const upstream = (file) => readFileSync(`node_modules/pdfjs-dist/${file}`, 'utf8')

// Node ships the upsert methods, so they are removed before the module
// is imported to exercise the shims, and restored afterwards.
const natives = []
for (const prototype of [Map.prototype, WeakMap.prototype]) {
	for (const name of ['getOrInsert', 'getOrInsertComputed']) {
		if (typeof prototype[name] === 'function') {
			natives.push([prototype, name, prototype[name]])
			delete prototype[name]
		}
	}
}
afterAll(() => {
	for (const [prototype, name, method] of natives) {
		prototype[name] = method
	}
})

await import('../../src/pdfjs-polyfills.js')

describe('map upsert polyfills', () => {
	it('inserts the value and returns it for a missing key', () => {
		const map = new Map()
		expect(map.getOrInsert('key', 'value')).toBe('value')
		expect(map.get('key')).toBe('value')
	})

	it('returns the existing value without overwriting it', () => {
		const map = new Map([['key', 'old']])
		expect(map.getOrInsert('key', 'new')).toBe('old')
		expect(map.get('key')).toBe('old')
	})

	it('computes the value with the key for a missing entry', () => {
		const map = new Map()
		expect(map.getOrInsertComputed('key', (key) => `${key}-value`)).toBe('key-value')
		expect(map.get('key')).toBe('key-value')
	})

	it('returns the existing value without calling the callback', () => {
		const map = new Map([['key', 'old']])
		const callback = vi.fn(() => 'new')
		expect(map.getOrInsertComputed('key', callback)).toBe('old')
		expect(callback).not.toHaveBeenCalled()
	})

	it('upserts weak maps as well', () => {
		const key = {}
		const weakMap = new WeakMap()
		expect(weakMap.getOrInsert(key, 'value')).toBe('value')
		expect(weakMap.getOrInsert(key, 'other')).toBe('value')
		expect(weakMap.getOrInsertComputed(key, () => 'computed')).toBe('value')
	})
})

describe('vendored pdf.js artifacts', () => {
	it('keep the library byte-identical to the upstream modern build', () => {
		expect(vendored('build/pdf.mjs')).toBe(upstream('build/pdf.mjs'))
	})

	it('keep the viewer app byte-identical to the fetched dist', () => {
		// The viewer app is not part of the npm package, so its checksum
		// pins the file as fetched. When pdf.js is bumped, compare the
		// new artifact against the release zip and update the checksum.
		const checksum = createHash('sha256').update(vendored('web/viewer.mjs')).digest('hex')
		expect(checksum).toBe('7a4f3cc69047a98057d72a69cb16212159c500e230cef3c9e54a9ecd339903d3')
	})

	it('carry the worker as the polyfill prepended to the upstream modern build', () => {
		expect(vendored('build/pdf.worker.mjs')).toBe(`${polyfill}\n${upstream('build/pdf.worker.mjs')}`)
	})
})

// Upsert methods the polyfill has to provide when called: Firefox ships
// them from version 144 on, so all supported browsers below that lack
// them.
const UPSERT_METHODS = ['getOrInsert', 'getOrInsertComputed']

// Newer collection builtins pdf.js may call without a shim: the Set
// methods shipped with Firefox 122, Chrome 122 and Safari 17.2, well
// below the supported browser floor. Both lists keep a pdf.js bump that
// adopts another new builtin visible here: extend the polyfill when
// engines lack it, or move it here after checking its engine floor.
const OLD_ENOUGH_METHODS = ['union', 'intersection', 'difference', 'symmetricDifference', 'isSubsetOf', 'isSupersetOf', 'isDisjointFrom']

describe('new collection builtins called by the vendored pdf.js', () => {
	it.each(['build/pdf.mjs', 'build/pdf.worker.mjs', 'web/viewer.mjs'])('are polyfilled or old enough in %s', (file) => {
		const called = new Set([...vendored(file).matchAll(/\.([a-zA-Z]+)\(/g)].map(([, method]) => method))
		const calledNew = [...called].filter((method) => UPSERT_METHODS.includes(method) || OLD_ENOUGH_METHODS.includes(method))
		// A called upsert method the polyfill does not define would
		// break the viewer at runtime on engines without native
		// support, which is what failed on Firefox ESR before.
		const missing = calledNew.filter((method) => UPSERT_METHODS.includes(method) && !polyfill.includes(`prototype.${method} = function`))
		expect(missing).toEqual([])
	})
})

describe('viewer template', () => {
	it('loads the polyfills before the pdf.js modules', () => {
		const template = readFileSync('templates/viewer.php', 'utf8')
		const polyfillsAt = template.indexOf('files_pdfviewer-pdfjs-polyfills.mjs')
		const pdfjsAt = template.indexOf('js/pdfjs/build/pdf.mjs')
		// Module scripts execute in document order, so the shims are
		// installed before the pdf.js code runs.
		expect(polyfillsAt).toBeGreaterThan(-1)
		expect(polyfillsAt).toBeLessThan(pdfjsAt)
	})
})
