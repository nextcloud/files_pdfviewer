<?php

/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2014-2016 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Files_PDFViewer\Tests\Unit\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Files_PDFViewer\Controller\DisplayController;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IURLGenerator;
use Test\TestCase;

class DisplayControllerTest extends TestCase {
	/** @var IRequest */
	private $request;

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var DisplayController */
	private $controller;

	protected function setUp(): void {
		$this->request = $this->createMock(IRequest::class);
		$this->urlGenerator = $this->createMock(IURLGenerator::class);
		$this->controller = new DisplayController(
			$this->request,
			$this->urlGenerator
		);

		parent::setUp();
	}

	public function testShowPdfViewer(): void {
		$params = [
			'urlGenerator' => $this->urlGenerator,
			'minmode' => false
		];
		$expectedResponse = new TemplateResponse(Application::APP_ID, 'viewer', $params, 'blank');
		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		$policy->allowEvalScript(true);
		$expectedResponse->setContentSecurityPolicy($policy);

		$this->assertEquals($expectedResponse, $this->controller->showPdfViewer());
	}
}
