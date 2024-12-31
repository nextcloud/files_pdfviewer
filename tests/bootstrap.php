<?php

/**
 * SPDX-FileCopyrightText: 2018-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2014-2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
if (!defined('PHPUNIT_RUN')) {
	define('PHPUNIT_RUN', 1);
}

require_once __DIR__.'/../../../lib/base.php';

\OC::$loader->addValidRoot(\OC::$SERVERROOT . '/tests');
\OC_App::loadApp('files_pdfviewer');

if (!class_exists('\PHPUnit\Framework\TestCase')) {
	require_once('PHPUnit/Autoload.php');
}

\OC_App::loadApp('files_pdfviewer');
OC_Hook::clear();
