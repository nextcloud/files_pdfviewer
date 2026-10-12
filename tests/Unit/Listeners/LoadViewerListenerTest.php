<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Files_PDFViewer\Tests\Unit\Listeners;

use OCA\Files_PDFViewer\AppInfo\Application;
use OCA\Files_PDFViewer\Listeners\LoadViewerListener;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\Share\IManager as IShareManager;
use OCP\Util;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class LoadViewerListenerTest extends TestCase {
	private IShareManager&MockObject $shareManager;
	private IInitialState&MockObject $initialState;
	private LoadViewerListener $listener;

	protected function setUp(): void {
		parent::setUp();

		$this->shareManager = $this->createMock(IShareManager::class);
		$this->initialState = $this->createMock(IInitialState::class);
		$this->listener = new LoadViewerListener($this->shareManager, $this->initialState);

		Util::resetStaticProperties();
	}

	private function event(string $app, string $renderAs = TemplateResponse::RENDER_AS_USER): BeforeTemplateRenderedEvent {
		return new BeforeTemplateRenderedEvent(true, new TemplateResponse($app, 'main', [], $renderAs));
	}

	private function hasInitScript(): bool {
		return in_array(Application::APP_ID . '/js/files_pdfviewer-main', Util::getScripts(), true);
	}

	public function testRegistersTheHandlerOnAnotherAppsPage(): void {
		$this->shareManager->method('allowViewWithoutDownload')->willReturn(true);
		$this->initialState->expects($this->once())
			->method('provideInitialState')
			->with('allowViewWithoutDownload', true);

		$this->listener->handle($this->event('files'));

		$this->assertTrue($this->hasInitScript());
	}

	public function testSkipsTheFramedPdfJsPage(): void {
		$this->initialState->expects($this->never())->method('provideInitialState');

		$this->listener->handle($this->event(Application::APP_ID, TemplateResponse::RENDER_AS_BLANK));

		$this->assertFalse($this->hasInitScript());
	}

	public function testSkipsTheErrorPage(): void {
		$this->initialState->expects($this->never())->method('provideInitialState');

		$this->listener->handle($this->event('core', TemplateResponse::RENDER_AS_ERROR));

		$this->assertFalse($this->hasInitScript());
	}
}
