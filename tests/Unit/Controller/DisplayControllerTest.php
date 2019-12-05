<?php
/**
 * @author Lukas Reschke
 * @copyright 2014 Lukas Reschke lukas@owncloud.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

namespace OCA\Files_PdfViewer\Tests\Unit\Controller;

use OCA\Files_PdfViewer\Controller\DisplayController;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IURLGenerator;
use Test\TestCase;

class DisplayControllerTest extends TestCase {
	/** @var string */
	private $appName;
	/** @var IRequest */
	private $request;
	/** @var IURLGenerator */
	private $urlGenerator;
	/** @var DisplayController
	 */
	private $controller;

	protected function setUp(): void {
		$this->appName = 'files_pdfviewer';

		$this->request = $this->createMock(IRequest::class);
		$this->urlGenerator = $this->createMock(IURLGenerator::class);
		$this->controller = new DisplayController(
			$this->appName,
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
		$expectedResponse = new TemplateResponse($this->appName, 'viewer', $params, 'blank');
		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		$policy->allowEvalScript(false);
		$expectedResponse->setContentSecurityPolicy($policy);

		$this->assertEquals($expectedResponse, $this->controller->showPdfViewer());
	}

}
