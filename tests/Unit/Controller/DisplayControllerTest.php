<?php

/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2014-2016 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Files_PDFViewer\Tests\Unit\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Files_PDFViewer\Controller\DisplayController;
use OCP\App\IAppManager;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\ServerVersion;
use Test\TestCase;

class DisplayControllerTest extends TestCase {
	/** @var IRequest */
	private $request;

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var IAppManager */
	private $appManager;

	/** @var IConfig */
	private $config;

	/** @var ServerVersion */
	private $serverVersion;

	/** @var DisplayController */
	private $controller;

	protected function setUp(): void {
		$this->request = $this->createMock(IRequest::class);
		$this->urlGenerator = $this->createMock(IURLGenerator::class);
		$this->appManager = $this->createMock(IAppManager::class);
		$this->config = $this->createMock(IConfig::class);
		$this->serverVersion = $this->createMock(ServerVersion::class);
		$this->controller = new DisplayController(
			$this->request,
			$this->urlGenerator,
			$this->appManager,
			$this->config,
			$this->serverVersion,
		);

		parent::setUp();
	}

	public function testShowPdfViewer(): void {
		$this->appManager->method('getAppVersion')
			->with(Application::APP_ID)
			->willReturn('1.0.0');
		$this->config->method('getAppValue')
			->with(Application::APP_ID, 'enable_scripting', 'no')
			->willReturn('no');
		$this->serverVersion->method('getVersion')
			->willReturn([34, 0, 3, 2]);

		$params = [
			'urlGenerator' => $this->urlGenerator,
			'minmode' => false,
			// substr(md5('1.0.0-34.0.3.2'), 0, 8)
			'version' => 'd77714da',
			'enableScripting' => false,
		];
		$expectedResponse = new TemplateResponse(Application::APP_ID, 'viewer', $params, TemplateResponse::RENDER_AS_BLANK);
		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		$policy->addAllowedScriptDomain('\'wasm-unsafe-eval\'');
		$expectedResponse->setContentSecurityPolicy($policy);

		$this->assertEquals($expectedResponse, $this->controller->showPdfViewer());
	}

	public function testShowPdfViewerCacheBusterChangesWhenTheServerIsUpdated(): void {
		// The app version is the same in every patch release of a Nextcloud
		// version, so it can not be used on its own to bust the cache of the
		// static assets.
		$this->appManager->method('getAppVersion')
			->with(Application::APP_ID)
			->willReturn('1.0.0');
		$this->config->method('getAppValue')
			->with(Application::APP_ID, 'enable_scripting', 'no')
			->willReturn('no');
		$this->serverVersion->method('getVersion')
			->willReturnOnConsecutiveCalls([34, 0, 2, 2], [34, 0, 3, 2]);

		$paramsBeforeUpdate = $this->controller->showPdfViewer()->getParams();
		$paramsAfterUpdate = $this->controller->showPdfViewer()->getParams();

		$this->assertNotEquals($paramsBeforeUpdate['version'], $paramsAfterUpdate['version']);
	}

	public function testShowPdfViewerCacheBusterChangesWhenTheAppIsUpdated(): void {
		$this->appManager->method('getAppVersion')
			->with(Application::APP_ID)
			->willReturnOnConsecutiveCalls('1.0.0', '1.1.0');
		$this->config->method('getAppValue')
			->with(Application::APP_ID, 'enable_scripting', 'no')
			->willReturn('no');
		$this->serverVersion->method('getVersion')
			->willReturn([34, 0, 3, 2]);

		$paramsBeforeUpdate = $this->controller->showPdfViewer()->getParams();
		$paramsAfterUpdate = $this->controller->showPdfViewer()->getParams();

		$this->assertNotEquals($paramsBeforeUpdate['version'], $paramsAfterUpdate['version']);
	}
}
