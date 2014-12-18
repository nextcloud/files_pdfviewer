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

use OCP\Util;

$application = new Application();

Util::addScript($application->getContainer()->getAppName(), 'previewplugin');
