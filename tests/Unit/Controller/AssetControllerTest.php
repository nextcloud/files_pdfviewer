<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Files_PDFViewer\Tests\Unit\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Files_PDFViewer\Controller\AssetController;
use OCP\App\IAppManager;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use Test\TestCase;

class AssetControllerTest extends TestCase {
	/**
	 * Files created below a temporary app directory, relative to it. The ones
	 * outside js/pdfjs/web/{locale,cmaps,standard_fonts} must never be served.
	 */
	private const FILES = [
		'js/pdfjs/web/locale/locale.json',
		'js/pdfjs/web/locale/de/viewer.ftl',
		'js/pdfjs/web/locale/README.md',
		'js/pdfjs/web/cmaps/Adobe-Japan1-UCS2.bcmap',
		'js/pdfjs/web/standard_fonts/FoxitSans.pfb',
		'js/pdfjs/web/standard_fonts/LiberationSans-Regular.ttf',
		'js/pdfjs/web/viewer.mjs',
		'js/pdfjs/build/pdf.mjs',
		'appinfo/info.xml',
	];

	private string $appPath;

	private AssetController $controller;

	protected function setUp(): void {
		parent::setUp();

		$this->appPath = sys_get_temp_dir() . '/files_pdfviewer-asset-test-' . uniqid();
		foreach (self::FILES as $file) {
			$path = $this->appPath . '/' . $file;
			if (!is_dir(dirname($path))) {
				mkdir(dirname($path), 0700, true);
			}
			file_put_contents($path, $file);
		}

		$appManager = $this->createMock(IAppManager::class);
		$appManager->method('getAppPath')
			->with(Application::APP_ID)
			->willReturn($this->appPath);

		$this->controller = new AssetController(
			$this->createMock(IRequest::class),
			$appManager,
		);
	}

	protected function tearDown(): void {
		$this->removeDirectory($this->appPath);

		parent::tearDown();
	}

	public static function dataServe(): array {
		return [
			['locale/locale.json', 'application/json'],
			['locale/de/viewer.ftl', 'text/plain; charset=utf-8'],
			['cmaps/Adobe-Japan1-UCS2.bcmap', 'application/octet-stream'],
			['standard_fonts/FoxitSans.pfb', 'application/x-font-type1'],
			['standard_fonts/LiberationSans-Regular.ttf', 'font/ttf'],
		];
	}

	#[DataProvider('dataServe')]
	public function testServe(string $path, string $contentType): void {
		$response = $this->controller->serve($path);

		$this->assertInstanceOf(StreamResponse::class, $response);
		$this->assertSame(Http::STATUS_OK, $response->getStatus());

		$headers = $response->getHeaders();
		$this->assertSame($contentType, $headers['Content-Type']);
		// The file content is its own relative path, see setUp()
		$this->assertSame((string)strlen('js/pdfjs/web/' . $path), $headers['Content-Length']);
		$this->assertStringContainsString('immutable', $headers['Cache-Control']);
		$this->assertStringContainsString('max-age=15778463', $headers['Cache-Control']);
	}

	public static function dataNotFound(): array {
		return [
			'file outside the allowed directories' => ['viewer.mjs'],
			'directory outside the allowed directories' => ['build/pdf.mjs'],
			'traversal out of the app' => ['locale/../../../../appinfo/info.xml'],
			'traversal inside js/pdfjs' => ['locale/de/../../viewer.mjs'],
			'current directory segment' => ['locale/./locale.json'],
			'extension not allowed in the directory' => ['locale/README.md'],
			'extension allowed elsewhere' => ['locale/de/viewer.pfb'],
			'allowed directory itself' => ['locale'],
			'allowed directory with trailing slash' => ['locale/'],
			'subdirectory' => ['locale/de'],
			'missing file' => ['cmaps/Adobe-Korea1-UCS2.bcmap'],
			'empty path' => [''],
		];
	}

	#[DataProvider('dataNotFound')]
	public function testServeNotFound(string $path): void {
		$response = $this->controller->serve($path);

		$this->assertInstanceOf(DataDisplayResponse::class, $response);
		$this->assertSame(Http::STATUS_NOT_FOUND, $response->getStatus());
	}

	private function removeDirectory(string $directory): void {
		foreach (scandir($directory) as $entry) {
			if ($entry === '.' || $entry === '..') {
				continue;
			}
			$path = $directory . '/' . $entry;
			if (is_dir($path)) {
				$this->removeDirectory($path);
			} else {
				unlink($path);
			}
		}
		rmdir($directory);
	}
}
