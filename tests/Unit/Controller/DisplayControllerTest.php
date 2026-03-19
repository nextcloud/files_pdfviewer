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

	/** @var DisplayController */
	private $controller;

	protected function setUp(): void {
		$this->request = $this->createMock(IRequest::class);
		$this->urlGenerator = $this->createMock(IURLGenerator::class);
		$this->appManager = $this->createMock(IAppManager::class);
		$this->config = $this->createMock(IConfig::class);
		$this->controller = new DisplayController(
			$this->request,
			$this->urlGenerator,
			$this->appManager,
			$this->config,
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

		$params = [
			'urlGenerator' => $this->urlGenerator,
			'minmode' => false,
			'version' => '1.0.0',
			'enableScripting' => false,
		];
		$expectedResponse = new TemplateResponse(Application::APP_ID, 'viewer', $params, TemplateResponse::RENDER_AS_BLANK);
		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		$policy->allowEvalScript(true);
		$expectedResponse->setContentSecurityPolicy($policy);

		$this->assertEquals($expectedResponse, $this->controller->showPdfViewer());
	}
}
