<?php
/**
 * @copyright 2014 Lukas Reschke lukas@owncloud.com
 *
 *
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Files_PDFViewer\Tests\Unit\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Files_PDFViewer\Controller\DisplayController;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\StandaloneTemplateResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IInitialStateService;
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
		$this->initialStateService = $this->createMock(IInitialStateService::class);
		$this->controller = new DisplayController(
			$this->request,
			$this->urlGenerator,
			$this->initialStateService
		);

		parent::setUp();
	}

	public function testShowPdfViewer(): void {
		$expectedResponse = new StandaloneTemplateResponse(Application::APP_ID, 'viewer', [], TemplateResponse::RENDER_AS_BASE);
		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		$policy->allowEvalScript(true);
		$expectedResponse->setContentSecurityPolicy($policy);

		$this->assertEquals($expectedResponse, $this->controller->showPdfViewer());
	}
}
