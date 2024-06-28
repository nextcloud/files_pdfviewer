<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Files_PDFViewer\Listeners;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

class LoadPublicViewerListener implements IEventListener {
	public function handle(Event $event): void {
		if (!$event instanceof BeforeTemplateRenderedEvent) {
			return;
		}

		// Make sure we are on a public page rendering
		if ($event->getResponse()->getRenderAs() !== TemplateResponse::RENDER_AS_PUBLIC) {
			return;
		}
		Util::addScript(Application::APP_ID, 'files_pdfviewer-public');
	}
}
