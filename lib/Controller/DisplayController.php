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
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IRequest;
use OCP\IURLGenerator;

class DisplayController extends Controller {

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var IAppManager */
	private $appManager;

	/** @var IConfig */
	private $config;

	/**
	 * @param IRequest $request
	 * @param IURLGenerator $urlGenerator
	 * @param IAppManager $appManager
	 * @param IConfig $config
	 */
	public function __construct(IRequest $request,
		IURLGenerator $urlGenerator,
		IAppManager $appManager,
		IConfig $config) {
		parent::__construct(Application::APP_ID, $request);
		$this->urlGenerator = $urlGenerator;
		$this->appManager = $appManager;
		$this->config = $config;
	}

	/**
	 * @param bool $minmode
	 * @return TemplateResponse
	 */
	#[PublicPage]
	#[NoCSRFRequired]
	public function showPdfViewer(bool $minmode = false): TemplateResponse {
		$params = [
			'urlGenerator' => $this->urlGenerator,
			'minmode' => $minmode,
			'version' => $this->appManager->getAppVersion(Application::APP_ID),
			'enableScripting' => $this->config->getAppValue(Application::APP_ID, 'enable_scripting', 'no') === 'yes',
		];

		$response = new TemplateResponse(Application::APP_ID, 'viewer', $params, TemplateResponse::RENDER_AS_BLANK);

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		// Needed for the ES5 compatible build of PDF.js
		$policy->allowEvalScript(true);
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
