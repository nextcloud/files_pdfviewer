<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Files_PDFViewer\Listeners;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

class LoadViewerListener implements IEventListener {
	public function handle(Event $event): void {
		if (!$event instanceof LoadViewer) {
			return;
		}

		// The PDF viewer needs to register the "share-attributes" DAV property
		// before the viewer is loaded in public share pages. Therefore an init
		// script is needed rather than a regular script, and it needs to be
		// done for "LoadViewer" rather than the "BeforeTemplateRenderedEvent",
		// as when that event is handled the viewer is already initialized.
		Util::addInitScript(Application::APP_ID, 'files_pdfviewer-init');

		Util::addScript(Application::APP_ID, 'files_pdfviewer-main', 'viewer');
	}
}
