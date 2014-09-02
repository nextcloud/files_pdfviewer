<?php

/** @var $this \OCP\Route\IRouter */

$this->create('files_pdfviewer_viewer', 'viewer.php')
	->actionInclude('files_pdfviewer/viewer.php');
