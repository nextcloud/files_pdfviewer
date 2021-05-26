<?php

declare(strict_types=1);

/**
 * @copyright 2014 Lukas Reschke lukas@owncloud.com
 *
 * @author Lukas Reschke <lukas@owncloud.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
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

namespace OCA\Files_PDFViewer\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\StandaloneTemplateResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IInitialStateService;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\Util;

class DisplayController extends Controller {

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var IInitialStateService */
	private $initialStateService;

	/**
	 * @param IRequest $request
	 * @param IURLGenerator $urlGenerator
	 */
	public function __construct(IRequest $request,
								IURLGenerator $urlGenerator,
								IInitialStateService $initialStateService) {
		parent::__construct(Application::APP_ID, $request);

		$this->urlGenerator = $urlGenerator;
		$this->initialStateService = $initialStateService;
	}

	/**
	 * @PublicPage
	 * @NoCSRFRequired
	 *
	 * @param bool $minmode
	 * @return StandaloneTemplateResponse
	 */
	public function showPdfViewer(bool $minmode = false): StandaloneTemplateResponse {
		if ($minmode) {
			Util::addStyle(Application::APP_ID, 'minmode');
		}

		Util::addScript(Application::APP_ID, 'files_pdfviewer-workersrc');
		Util::addScript(Application::APP_ID, 'pdfjs/build/pdf');
		Util::addScript(Application::APP_ID, 'pdfjs/web/viewer');

		Util::addStyle(Application::APP_ID, 'style');
		Util::addStyle(Application::APP_ID, '../js/pdfjs/web/viewer');

		$workerSrc = $this->urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/build/pdf.worker.js');
		$cmapUrl = $this->urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/web/cmaps/');
		$localeUrl = $this->urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/web/locale/locale.properties');

		$this->initialStateService->provideInitialState(Application::APP_ID, 'workerSrc', $workerSrc);
		$this->initialStateService->provideInitialState(Application::APP_ID, 'cmapUrl', $cmapUrl);
		Util::addHeader('link', ['rel' => 'resource', 'type' => 'application/l10n', 'href' => $localeUrl]);

		$response = new StandaloneTemplateResponse(Application::APP_ID, 'viewer', [], TemplateResponse::RENDER_AS_BASE);

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		// Needed for the ES5 compatible build of PDF.js
		$policy->allowEvalScript(true);
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
