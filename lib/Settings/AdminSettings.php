<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Files_PDFViewer\Settings;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\Settings\ISettings;

class AdminSettings implements ISettings {

	private IConfig $config;

	public function __construct(IConfig $config) {
		$this->config = $config;
	}

	#[\Override]
	public function getForm(): TemplateResponse {
		return new TemplateResponse(Application::APP_ID, 'admin');
	}

	#[\Override]
	public function getSection(): string {
		return 'server';
	}

	#[\Override]
	public function getPriority(): int {
		return 50;
	}
}
