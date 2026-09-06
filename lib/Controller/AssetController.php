<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Files_PDFViewer\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\StreamResponse;
use OCP\IRequest;

/**
 * Serves the data files pdf.js loads at runtime: the localization, the CMaps
 * needed for CJK documents and the standard fonts.
 *
 * pdf.js requests these relative to a base URL, so they cannot go through
 * addScript() and the like. Serving them from a controller instead of as
 * plain files makes them independent of which file extensions the web server
 * passes through directly: with pretty URLs enabled, Apache hands everything
 * that is not on its static extension list to index.php, which used to answer
 * 404 for .json, .ftl, .bcmap and .pfb.
 */
class AssetController extends Controller {
	/**
	 * The directories below js/pdfjs/web/ that may be served, with the
	 * content type of each file extension allowed inside them.
	 */
	private const DIRECTORIES = [
		'locale' => [
			'json' => 'application/json',
			'ftl' => 'text/plain; charset=utf-8',
		],
		'cmaps' => [
			'bcmap' => 'application/octet-stream',
		],
		'standard_fonts' => [
			'pfb' => 'application/x-font-type1',
			'ttf' => 'font/ttf',
		],
	];

	/**
	 * Same lifetime the web server gives the other viewer assets.
	 */
	private const CACHE_SECONDS = 15778463;

	public function __construct(
		IRequest $request,
		private IAppManager $appManager,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * The route also carries a version segment that is not passed in here:
	 * it is a cache buster only. The viewer template puts the same hash there
	 * that it appends to its other assets, so a new app or server version
	 * yields new URLs.
	 *
	 * @param string $path Path below js/pdfjs/web/, for example
	 *                     "locale/de/viewer.ftl" or "cmaps/Adobe-Japan1-UCS2.bcmap"
	 */
	#[PublicPage]
	#[NoCSRFRequired]
	public function serve(string $path): Response {
		$file = $this->resolve($path);
		if ($file === null) {
			return new DataDisplayResponse('', Http::STATUS_NOT_FOUND);
		}

		[$filePath, $contentType] = $file;

		$response = new StreamResponse($filePath, Http::STATUS_OK, [
			'Content-Type' => $contentType,
			'Content-Length' => (string)filesize($filePath),
		]);
		$response->cacheFor(self::CACHE_SECONDS, false, true);

		return $response;
	}

	/**
	 * Maps a request path to a file inside one of the allowed directories.
	 *
	 * @return array{0: string, 1: string}|null The absolute file path and its
	 *                                          content type, or null if the
	 *                                          path does not point to a
	 *                                          servable file
	 */
	private function resolve(string $path): ?array {
		$segments = explode('/', $path);
		$directory = array_shift($segments);

		if (!isset(self::DIRECTORIES[$directory]) || $segments === []) {
			return null;
		}

		foreach ($segments as $segment) {
			if ($segment === '' || $segment === '.' || $segment === '..') {
				return null;
			}
		}

		$extension = strtolower(pathinfo($segments[count($segments) - 1], PATHINFO_EXTENSION));
		$contentType = self::DIRECTORIES[$directory][$extension] ?? null;
		if ($contentType === null) {
			return null;
		}

		$appPath = $this->appManager->getAppPath(Application::APP_ID);
		$directoryPath = realpath($appPath . '/js/pdfjs/web/' . $directory);
		if ($directoryPath === false) {
			return null;
		}

		// realpath() resolves symlinks too, so the prefix check below holds
		// even if a segment survived the checks above in some unexpected form.
		$filePath = realpath($directoryPath . '/' . implode('/', $segments));
		if ($filePath === false
			|| !str_starts_with($filePath, $directoryPath . DIRECTORY_SEPARATOR)
			|| !is_file($filePath)) {
			return null;
		}

		return [$filePath, $contentType];
	}
}
