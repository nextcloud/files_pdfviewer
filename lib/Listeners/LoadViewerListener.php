<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
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
