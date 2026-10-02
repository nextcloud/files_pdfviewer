/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Whether the share the file comes from hides its download button.
 *
 * The dav property arrives as a boolean or as its string form, depending on
 * who built the node.
 *
 * @param {import('@nextcloud/files').IFile} file the file to check
 * @return {boolean}
 */
export function isDownloadHidden(file) {
	const hidden = file.attributes?.['hide-download']
	return hidden === true || hidden === 'true'
}

/**
 * Whether the share the file comes from allows downloading it.
 *
 * @param {import('@nextcloud/files').IFile} file the file to check
 * @return {boolean}
 */
export function isDownloadable(file) {
	const attributes = file.attributes?.['share-attributes']
	if (!attributes) {
		return true
	}

	const shareAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes
	const download = shareAttributes.find(({ scope, key }) => scope === 'permissions' && key === 'download')
	return download ? download.value : true
}
