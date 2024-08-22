<?php

/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2014-2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Files_PDFViewer\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IAppConfig;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;
use OCP\IURLGenerator;

class DisplayController extends Controller {

	/**
	 * @param IRequest $request
	 * @param IURLGenerator $urlGenerator
	 */
	public function __construct(
		IRequest $request,
		private IURLGenerator $urlGenerator,
		private IL10N $l10n,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * @PublicPage
	 * @NoCSRFRequired
	 *
	 * @param bool $minmode
	 * @return TemplateResponse
	 */
	public function showPdfViewer(
		IAppManager $appManager,
		IAppConfig $appConfig,
		bool $minmode = false,
	): TemplateResponse {
		$params = [
			'appVersion' => $appManager->getAppVersion(Application::APP_ID),
			'enableScripting' => $appConfig->getAppValueBool('enable_scripting', false),
			'l10n' => $this->l10n,
			'urlGenerator' => $this->urlGenerator,
			'minmode' => $minmode,
		];

		$response = new TemplateResponse(Application::APP_ID, 'viewer', $params, 'blank');

		$policy = (new ContentSecurityPolicy())
			->addAllowedFrameDomain('\'self\'')
			->addAllowedWorkerSrcDomain('\'self\'')
			->addAllowedFontDomain('data:')
			->addAllowedImageDomain('*')
			// Needed for the ES5 compatible build of PDF.js
			->allowEvalScript(true);
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
