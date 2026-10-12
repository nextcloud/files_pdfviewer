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
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Share\IManager as IShareManager;
use OCP\Util;

/**
 * Registers the pdf handler with the viewer on every page a file can be
 * opened from. The viewer reads its handlers when it first opens a file,
 * so the registration has to run as an init script.
 *
 * @template-implements IEventListener<BeforeTemplateRenderedEvent>
 */
class LoadViewerListener implements IEventListener {

	public function __construct(
		private IShareManager $shareManager,
		private IInitialState $initialState,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!$event instanceof BeforeTemplateRenderedEvent) {
			return;
		}
		// Neither the error page nor the pdf.js page the viewer frames opens a file
		$response = $event->getResponse();
		if ($response->getRenderAs() === TemplateResponse::RENDER_AS_ERROR || $response->getApp() === Application::APP_ID) {
			return;
		}
		Util::addInitScript(Application::APP_ID, 'files_pdfviewer-main');
		Util::addStyle(Application::APP_ID, 'files_pdfviewer-main');

		$this->initialState->provideInitialState('allowViewWithoutDownload', $this->shareManager->allowViewWithoutDownload());
	}
}
