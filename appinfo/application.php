<?php
/**
 * @author Lukas Reschke
 * @copyright 2014 Lukas Reschke lukas@owncloud.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

namespace OCA\Files_PdfViewer\AppInfo;

use OCA\Files_PdfViewer\Controller\DisplayController;
use OCP\AppFramework\App;
use OCP\IContainer;

class Application extends App {

	/**
	 * @param array $urlParams
	 */
	public function __construct (array $urlParams=[]) {
		parent::__construct('files_pdfviewer', $urlParams);

		$container = $this->getContainer();

		/**
		 * Controllers
		 */
		$container->registerService('DisplayController', function(IContainer $c) {
			return new DisplayController(
				$c->query('AppName'),
				$c->query('Request'),
				$c->query('URLGenerator')
			);
		});

		/**
		 * Core Services
		 */
		$container->registerService('URLGenerator', function(IContainer $c) {
			return $c->query('ServerContainer')->getURLGenerator();
		});

	}


}
