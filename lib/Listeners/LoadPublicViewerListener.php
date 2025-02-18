<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Files_PDFViewer\Listeners;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent;
use OCP\AppFramework\QueryException;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\IServerContainer;
use OCP\Util;

/**
 * @template-implements IEventListener<BeforeTemplateRenderedEvent>
 */
class LoadPublicViewerListener implements IEventListener {

	/** @var IServerContainer */
	private $serverContainer;

	public function __construct(IServerContainer $serverContainer) {
		$this->serverContainer = $serverContainer;
	}

	public function handle(Event $event): void {
		if (!$event instanceof BeforeTemplateRenderedEvent) {
			return;
		}

		// If the event has a scope it is not the default share page but, for
		// example, the authentication page
		if ($event->getScope() !== null) {
			return;
		}

		// Do not load the viewer if there is a download limit
		if ($this->getDownloadLimit($event->getShare()->getToken()) >= 0) {
			return;
		}

		Util::addScript(Application::APP_ID, 'files_pdfviewer-public');
	}

	private function getDownloadLimit(string $shareToken): int {
		try {
			$limitMapper = $this->serverContainer->get('\OCA\Files_DownloadLimit\Db\LimitMapper');
		} catch (QueryException $e) {
			return -1;
		}

		try {
			$shareLimit = $limitMapper->get($shareToken);
		} catch (\Exception $e) {
			return -1;
		}

		return $shareLimit->getLimit();
	}
}
