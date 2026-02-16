<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Files_PDFViewer\Controller;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\IRequest;

class SettingsController extends Controller {

	private IConfig $config;

	public function __construct(
		IRequest $request,
		IConfig $config
	) {
		parent::__construct(Application::APP_ID, $request);
		$this->config = $config;
	}

	/**
	 * Get current PDF scripting setting
	 */
	#[AuthorizedAdminSetting(settings: \OCA\Files_PDFViewer\Settings\AdminSettings::class)]
	public function getSettings(): JSONResponse {
		$enableScripting = $this->config->getAppValue(
			Application::APP_ID,
			'enable_scripting',
			'no'
		) === 'yes';

		return new JSONResponse([
			'enableScripting' => $enableScripting,
		]);
	}


	/**
	 * Update PDF scripting setting
	 */
	#[AuthorizedAdminSetting(settings: \OCA\Files_PDFViewer\Settings\AdminSettings::class)]
	public function setSettings(bool $enableScripting): JSONResponse {
		$this->config->setAppValue(
			Application::APP_ID,
			'enable_scripting',
			$enableScripting ? 'yes' : 'no'
		);

		return new JSONResponse([
			'enableScripting' => $enableScripting,
		]);
	}
}
