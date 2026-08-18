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
use OCP\IConfig;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\ServerVersion;

class DisplayController extends Controller {

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var IAppManager */
	private $appManager;

	/** @var IConfig */
	private $config;

	/** @var ServerVersion */
	private $serverVersion;

	/**
	 * @param IRequest $request
	 * @param IURLGenerator $urlGenerator
	 * @param IAppManager $appManager
	 * @param IConfig $config
	 * @param ServerVersion $serverVersion
	 */
	public function __construct(IRequest $request,
		IURLGenerator $urlGenerator,
		IAppManager $appManager,
		IConfig $config,
		ServerVersion $serverVersion) {
		parent::__construct(Application::APP_ID, $request);
		$this->urlGenerator = $urlGenerator;
		$this->appManager = $appManager;
		$this->config = $config;
		$this->serverVersion = $serverVersion;
	}

	/**
	 * @PublicPage
	 * @NoCSRFRequired
	 *
	 * @param bool $minmode
	 * @return TemplateResponse
	 */
	public function showPdfViewer(bool $minmode = false): TemplateResponse {
		$params = [
			'urlGenerator' => $this->urlGenerator,
			'minmode' => $minmode,
			'version' => $this->getVersionHash(),
			'enableScripting' => $this->config->getAppValue(Application::APP_ID, 'enable_scripting', 'no') === 'yes',
		];

		$response = new TemplateResponse(Application::APP_ID, 'viewer', $params, 'blank');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		// Needed for the ES5 compatible build of PDF.js
		$policy->allowEvalScript(true);
		$response->setContentSecurityPolicy($policy);

		return $response;
	}

	/**
	 * Returns the value used to bust the cache of the static assets.
	 *
	 * Assets requested with a "v" parameter are served as immutable, so
	 * browsers keep them for months without checking again whether they
	 * changed. The app version can not be used on its own for that, as it is
	 * the same in every patch release of a Nextcloud version. Therefore,
	 * the Nextcloud version is taken into account too, like the server does
	 * for the assets that it links itself.
	 *
	 * @return string
	 */
	private function getVersionHash(): string {
		$appVersion = $this->appManager->getAppVersion(Application::APP_ID);
		$serverVersion = implode('.', $this->serverVersion->getVersion());

		return substr(md5($appVersion . '-' . $serverVersion), 0, 8);
	}
}
