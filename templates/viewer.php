<?php
/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2012-2016 ownCloud, Inc.
 * SPDX-FileCopyrightText: 2012 Mozilla Foundation
 * SPDX-FileCopyrightText: 1990-2015 Adobe Systems Incorporated.
 * SPDX-License-Identifier: Apache-2.0
 */
/** @var array $_ */
/** @var OCP\IURLGenerator $urlGenerator */
$urlGenerator = $_['urlGenerator'];
/** @var \OCP\IL10N $l */
$l = $_['l10n'];
$version = $_['appVersion'];
$enableScripting = $_['enableScripting'];
$cspNonce = $_['cspNonce'];
?>

<!DOCTYPE html>
<!--
Copyright 2012 Mozilla Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Adobe CMap resources are covered by their own copyright but the same license:

		Copyright 1990-2015 Adobe Systems Incorporated.

See https://github.com/adobe-type-tools/cmap-resources
-->
<html dir="ltr" mozdisallowselectionprint>
	<head data-workersrc="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/build/pdf.worker.js')) ?>?v=<?php p($version) ?>"
		data-cmapurl="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/web/cmaps/')) ?>">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="google" content="notranslate">
		<title>PDF.js viewer</title>

		<link rel="stylesheet" href="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/web/viewer.css')) ?>?v=<?php p($version) ?>"/>
		<link rel="stylesheet" href="<?php p($urlGenerator->linkTo('files_pdfviewer', 'css/viewer.css')) ?>?v=<?php p($version) ?>"/>
		<?php if ($_['minmode']):?>
			<link rel="stylesheet" href="<?php p($urlGenerator->linkTo('files_pdfviewer', 'css/minmode.css')) ?>?v=<?php p($version) ?>"/>
		<?php endif;?>


		<!-- This snippet is used in production (included from viewer.html) -->
		<link rel="resource" type="application/l10n" href="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/web/locale/locale.properties')) ?>?v=<?php p($version) ?>"/>
		<script nonce="<?php p($cspNonce) ?>" src="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/build/pdf.js')) ?>?v=<?php p($version) ?>"></script>
		<script nonce="<?php p($cspNonce) ?>" src="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/pdfjs/web/viewer.js')) ?>?v=<?php p($version) ?>"></script>
		<script nonce="<?php p($cspNonce) ?>" src="<?php p($urlGenerator->linkTo('files_pdfviewer', 'js/files_pdfviewer-workersrc.js')) ?>?v=<?php p($version) ?>"></script>
	</head>

	<body tabindex="1">
		<div id="outerContainer">
			<div id="sidebarContainer">
				<div id="toolbarSidebar">
					<div id="toolbarSidebarLeft">
						<div id="sidebarViewButtons" class="splitToolbarButton toggled" role="radiogroup">
							<button id="viewThumbnail"
								aria-checked="true"
								aria-controls="thumbnailView"
								class="toolbarButton toggled"
								data-l10n-id="thumbs"
								tabindex="2"
								title="<?php p($l->t('Show thumbnails')); ?>"
								role="radio">
								<span data-l10n-id="thumbs_label"><?php p($l->t('Thumbnails')); ?></span>
							</button>
							<button id="viewOutline"
								aria-checked="false"
								aria-controls="outlineView"
								class="toolbarButton"
								data-l10n-id="document_outline"
								role="radio"
								tabindex="3"
								title="<?php p($l->t('Show document outline (double-click to expand/collapse all items)')); ?>">
								<span data-l10n-id="document_outline_label"><?php p($l->t('Document Outline')); ?></span>
							</button>
							<button id="viewAttachments"
								aria-checked="false"
								aria-controls="attachmentsView"
								class="toolbarButton"
								data-l10n-id="attachments"
								tabindex="4"
								title="<?php p($l->t('Show attachments')); ?>"
								role="radio">
								<span data-l10n-id="attachments_label"><?php p($l->t('Attachments')); ?></span>
							</button>
							<button id="viewLayers"
								aria-checked="false"
								aria-controls="layersView"
								class="toolbarButton"
								data-l10n-id="layers"
								tabindex="5"
								title="<?php p($l->t('Show layers (double-click to reset all layers to the default state)')); ?>"
								role="radio">
								<span data-l10n-id="layers_label"><?php p($l->t('Layers')); ?></span>
							</button>
						</div>
					</div>

					<div id="toolbarSidebarRight">
						<div id="outlineOptionsContainer" class="hidden">
							<div class="verticalToolbarSeparator"></div>

							<button id="currentOutlineItem" class="toolbarButton" disabled="disabled" title="<?php p($l->t('Find current outline item')); ?>" tabindex="6" data-l10n-id="current_outline_item">
								<span data-l10n-id="current_outline_item_label"><?php p($l->t('Current outline item')); ?></span>
							</button>
						</div>
					</div>
				</div>
				<div id="sidebarContent">
					<div id="thumbnailView">
					</div>
					<div id="outlineView" class="hidden">
					</div>
					<div id="attachmentsView" class="hidden">
					</div>
					<div id="layersView" class="hidden">
					</div>
				</div>
				<div id="sidebarResizer" class="hidden"></div>
			</div><!-- sidebarContainer -->

			<div id="mainContainer">
				<div class="findbar hidden doorHanger" id="findbar">
					<div id="findbarInputContainer">
						<input id="findInput" class="toolbarField" title="<?php p($l->t('Find')); ?>" placeholder="<?php p($l->t('Find in document')); ?>…" tabindex="91" data-l10n-id="find_input" aria-invalid="false">
						<div class="splitToolbarButton">
							<button id="findPrevious" class="toolbarButton" title="<?php p($l->t('Find the previous occurrence of the phrase')); ?>" tabindex="92" data-l10n-id="find_previous">
								<span data-l10n-id="find_previous_label"><?php p($l->t('Previous')); ?></span>
							</button>
							<div class="splitToolbarButtonSeparator"></div>
							<button id="findNext" class="toolbarButton" title="<?php p($l->t('Find the next occurrence of the phrase')); ?>" tabindex="93" data-l10n-id="find_next">
								<span data-l10n-id="find_next_label"><?php p($l->t('Next')); ?></span>
							</button>
						</div>
					</div>

					<div id="findbarOptionsOneContainer">
						<input type="checkbox" id="findHighlightAll" class="toolbarField" tabindex="94">
						<label for="findHighlightAll" class="toolbarLabel" data-l10n-id="find_highlight"><?php p($l->t('Highlight all')); ?></label>
						<input type="checkbox" id="findMatchCase" class="toolbarField" tabindex="95">
						<label for="findMatchCase" class="toolbarLabel" data-l10n-id="find_match_case_label"><?php p($l->t('Match case')); ?></label>
					</div>
					<div id="findbarOptionsTwoContainer">
						<input type="checkbox" id="findMatchDiacritics" class="toolbarField" tabindex="96">
						<label for="findMatchDiacritics" class="toolbarLabel" data-l10n-id="find_match_diacritics_label"><?php p($l->t('Match diacritics')); ?></label>
						<input type="checkbox" id="findEntireWord" class="toolbarField" tabindex="97">
						<label for="findEntireWord" class="toolbarLabel" data-l10n-id="find_entire_word_label"><?php p($l->t('Whole words')); ?></label>
					</div>

					<div id="findbarMessageContainer" aria-live="polite">
						<span id="findResultsCount" class="toolbarLabel"></span>
						<span id="findMsg" class="toolbarLabel"></span>
					</div>
				</div><!-- findbar -->

				<div class="editorParamsToolbar hidden doorHangerRight" id="editorFreeTextParamsToolbar">
					<div class="editorParamsToolbarContainer">
						<div class="editorParamsSetter">
							<label for="editorFreeTextColor" class="editorParamsLabel" data-l10n-id="editor_free_text_color"><?php p($l->t('Color')); ?></label>
							<input type="color" id="editorFreeTextColor" class="editorParamsColor" tabindex="100">
						</div>
						<div class="editorParamsSetter">
							<label for="editorFreeTextFontSize" class="editorParamsLabel" data-l10n-id="editor_free_text_size"><?php p($l->t('Size')); ?></label>
							<input type="range" id="editorFreeTextFontSize" class="editorParamsSlider" value="10" min="5" max="100" step="1" tabindex="101">
						</div>
					</div>
				</div>

				<div class="editorParamsToolbar hidden doorHangerRight" id="editorInkParamsToolbar">
					<div class="editorParamsToolbarContainer">
						<div class="editorParamsSetter">
							<label for="editorInkColor" class="editorParamsLabel" data-l10n-id="editor_ink_color"><?php p($l->t('Color')); ?></label>
							<input type="color" id="editorInkColor" class="editorParamsColor" tabindex="102">
						</div>
						<div class="editorParamsSetter">
							<label for="editorInkThickness" class="editorParamsLabel" data-l10n-id="editor_ink_thickness"><?php p($l->t('Thickness')); ?></label>
							<input type="range" id="editorInkThickness" class="editorParamsSlider" value="1" min="1" max="20" step="1" tabindex="103">
						</div>
						<div class="editorParamsSetter">
							<label for="editorInkOpacity" class="editorParamsLabel" data-l10n-id="editor_ink_opacity"><?php p($l->t('Opacity')); ?></label>
							<input type="range" id="editorInkOpacity" class="editorParamsSlider" value="100" min="1" max="100" step="1" tabindex="104">
						</div>
					</div>
				</div>

				<div class="editorParamsToolbar hidden doorHangerRight" id="editorStampParamsToolbar">
					<div class="editorParamsToolbarContainer">
						<button id="editorStampAddImage"
							class="secondaryToolbarButton"
							data-l10n-id="editor_stamp_add_image"
							tabindex="105"
							title="<?php p($l->t('Add image')); ?>">
							<span data-l10n-id="editor_stamp_add_image_label"><?php p($l->t('Add image')); ?></span>
						</button>
					</div>
				</div>

				<div id="secondaryToolbar" class="secondaryToolbar hidden doorHangerRight">
					<div id="secondaryToolbarButtonContainer">
						<button id="secondaryOpenFile"
							class="secondaryToolbarButton visibleLargeView"
							data-l10n-id="open_file"
							hidden="true"
							tabindex="51"
							title="<?php p($l->t('Open file')); ?>">
							<span data-l10n-id="open_file_label"><?php p($l->t('Open')); ?></span>
						</button>

						<button id="secondaryPrint"
							class="secondaryToolbarButton visibleMediumView"
							data-l10n-id="print"
							tabindex="52"
							title="<?php p($l->t('Print')); ?>">
							<span data-l10n-id="print_label"><?php p($l->t('Print')); ?></span>
						</button>

						<button id="secondaryDownload"
							class="secondaryToolbarButton visibleMediumView"
							data-l10n-id="save"
							hidden="true"
							tabindex="53"
							title="<?php p($l->t('Save')); ?>">
							<span data-l10n-id="save_label"><?php p($l->t('Save')); ?></span>
						</button>

						<div class="horizontalToolbarSeparator visibleLargeView"></div>

						<button id="presentationMode"
							class="secondaryToolbarButton"
							data-l10n-id="presentation_mode"
							tabindex="54"
							title="<?php p($l->t('Switch to presentation mode')); ?>">
							<span data-l10n-id="presentation_mode_label"><?php p($l->t('Presentation mode')); ?></span>
						</button>

						<a id="viewBookmark"
							class="secondaryToolbarButton"
							data-l10n-id="bookmark1"
							href="#"
							tabindex="55"
							title="<?php p($l->t('Current page (view URL from current page')); ?>)">
							<span data-l10n-id="bookmark1_label"><?php p($l->t('Current page')); ?></span>
						</a>

						<div id="viewBookmarkSeparator" class="horizontalToolbarSeparator"></div>

						<button id="firstPage"
							class="secondaryToolbarButton"
							data-l10n-id="first_page"
							tabindex="56"
							title="<?php p($l->t('Go to first page')); ?>">
							<span data-l10n-id="first_page_label"><?php p($l->t('Go to first page')); ?></span>
						</button>
						<button id="lastPage"
							class="secondaryToolbarButton"
							data-l10n-id="last_page"
							tabindex="57"
							title="<?php p($l->t('Go to last page')); ?>">
							<span data-l10n-id="last_page_label"><?php p($l->t('Go to last page')); ?></span>
						</button>

						<div class="horizontalToolbarSeparator"></div>

						<button id="pageRotateCw" class="secondaryToolbarButton" title="<?php p($l->t('Rotate clockwise')); ?>" tabindex="58" data-l10n-id="page_rotate_cw">
							<span data-l10n-id="page_rotate_cw_label"><?php p($l->t('Rotate clockwise')); ?></span>
						</button>
						<button id="pageRotateCcw" class="secondaryToolbarButton" title="<?php p($l->t('Rotate counterclockwise')); ?>" tabindex="59" data-l10n-id="page_rotate_ccw">
							<span data-l10n-id="page_rotate_ccw_label"><?php p($l->t('Rotate counterclockwise')); ?></span>
						</button>

						<div class="horizontalToolbarSeparator"></div>

						<div id="cursorToolButtons" role="radiogroup">
							<button id="cursorSelectTool" class="secondaryToolbarButton toggled" title="<?php p($l->t('Enable text selection tool')); ?>" tabindex="60" data-l10n-id="cursor_text_select_tool" role="radio" aria-checked="true">
								<span data-l10n-id="cursor_text_select_tool_label"><?php p($l->t('Text selection tool')); ?></span>
							</button>
							<button id="cursorHandTool" class="secondaryToolbarButton" title="<?php p($l->t('Enable hand tool')); ?>" tabindex="61" data-l10n-id="cursor_hand_tool" role="radio" aria-checked="false">
								<span data-l10n-id="cursor_hand_tool_label"><?php p($l->t('Hand tool')); ?></span>
							</button>
						</div>

						<div class="horizontalToolbarSeparator"></div>

						<div id="scrollModeButtons" role="radiogroup">
							<button id="scrollPage" class="secondaryToolbarButton" title="<?php p($l->t('Use page scrolling')); ?>" tabindex="62" data-l10n-id="scroll_page" role="radio" aria-checked="false">
								<span data-l10n-id="scroll_page_label"><?php p($l->t('Page scrolling')); ?></span>
							</button>
							<button id="scrollVertical" class="secondaryToolbarButton toggled" title="<?php p($l->t(' ')); ?>" tabindex="63" data-l10n-id="scroll_vertical" role="radio" aria-checked="true">
								<span data-l10n-id="scroll_vertical_label" ><?php p($l->t('Vertical scrolling')); ?></span>
							</button>
							<button id="scrollHorizontal" class="secondaryToolbarButton" title="<?php p($l->t('Use horizontal scrolling')); ?>" tabindex="64" data-l10n-id="scroll_horizontal" role="radio" aria-checked="false">
								<span data-l10n-id="scroll_horizontal_label"><?php p($l->t('Horizontal scrolling')); ?></span>
							</button>
							<button id="scrollWrapped" class="secondaryToolbarButton" title="<?php p($l->t('Use wrapped scrolling')); ?>" tabindex="65" data-l10n-id="scroll_wrapped" role="radio" aria-checked="false">
								<span data-l10n-id="scroll_wrapped_label"><?php p($l->t('Wrapped scrolling')); ?></span>
							</button>
						</div>

						<div class="horizontalToolbarSeparator"></div>

						<div id="spreadModeButtons" role="radiogroup">
							<button id="spreadNone" class="secondaryToolbarButton toggled" title="<?php p($l->t('Do not join page spreads')); ?>" tabindex="66" data-l10n-id="spread_none" role="radio" aria-checked="true">
								<span data-l10n-id="spread_none_label"><?php p($l->t('No spreads')); ?></span>
							</button>
							<button id="spreadOdd" class="secondaryToolbarButton" title="<?php p($l->t('Join page spreads starting with odd-numbered pages')); ?>" tabindex="67" data-l10n-id="spread_odd" role="radio" aria-checked="false">
								<span data-l10n-id="spread_odd_label"><?php p($l->t('Odd spreads')); ?></span>
							</button>
							<button id="spreadEven" class="secondaryToolbarButton" title="<?php p($l->t('Join page spreads starting with even-numbered pages')); ?>" tabindex="68" data-l10n-id="spread_even" role="radio" aria-checked="false">
								<span data-l10n-id="spread_even_label"><?php p($l->t('Even spreads')); ?></span>
							</button>
						</div>

						<div class="horizontalToolbarSeparator"></div>

						<button id="documentProperties" class="secondaryToolbarButton" title="<?php p($l->t('Document properties…')); ?>" tabindex="69" data-l10n-id="document_properties" aria-controls="documentPropertiesDialog">
							<span data-l10n-id="document_properties_label"><?php p($l->t('Document properties…')); ?></span>
						</button>
					</div>
				</div><!-- secondaryToolbar -->

				<div class="toolbar">
					<div id="toolbarContainer">
						<div id="toolbarViewer">
							<div id="toolbarViewerLeft">
								<button id="sidebarToggle" class="toolbarButton" title="<?php p($l->t('Toggle sidebar')); ?>" tabindex="11" data-l10n-id="toggle_sidebar" aria-expanded="false" aria-controls="sidebarContainer">
									<span data-l10n-id="toggle_sidebar_label"><?php p($l->t('Toggle sidebar')); ?></span>
								</button>
								<div class="toolbarButtonSpacer"></div>
								<button id="viewFind" class="toolbarButton" title="<?php p($l->t('Find in document')); ?>" tabindex="12" data-l10n-id="findbar" aria-expanded="false" aria-controls="findbar">
									<span data-l10n-id="findbar_label"><?php p($l->t('Find')); ?></span>
								</button>
								<div class="splitToolbarButton hiddenSmallView">
									<button class="toolbarButton" title="<?php p($l->t('Previous page')); ?>" id="previous" tabindex="13" data-l10n-id="previous">
										<span data-l10n-id="previous_label"><?php p($l->t('Previous')); ?></span>
									</button>
									<div class="splitToolbarButtonSeparator"></div>
									<button class="toolbarButton" title="<?php p($l->t('Next page')); ?>" id="next" tabindex="14" data-l10n-id="next">
										<span data-l10n-id="next_label"><?php p($l->t('Next')); ?></span>
									</button>
								</div>
								<input type="number" id="pageNumber" class="toolbarField" title="<?php p($l->t('Page')); ?>" value="1" min="1" tabindex="15" data-l10n-id="page" autocomplete="off">
								<span id="numPages" class="toolbarLabel"></span>
							</div>
							<div id="toolbarViewerRight">
								<button id="openFile" class="toolbarButton hiddenLargeView" title="<?php p($l->t('Open file')); ?>" tabindex="31" data-l10n-id="open_file" hidden="true">
									<span data-l10n-id="open_file_label"><?php p($l->t('Open')); ?></span>
								</button>

								<button id="print" class="toolbarButton hiddenMediumView" title=<?php p($l->t('Print')); ?> tabindex="32" data-l10n-id="print">
									<span data-l10n-id="print_label"><?php p($l->t('Print')); ?></span>
								</button>

								<button id="download" class="toolbarButton hiddenMediumView" title="<?php p($l->t('Save')); ?>" tabindex="33" data-l10n-id="save" hidden="true">
									<span data-l10n-id="save_label"><?php p($l->t('Save')); ?></span>
								</button>

								<div class="verticalToolbarSeparator hiddenMediumView"></div>

								<div id="editorModeButtons" class="splitToolbarButton toggled" role="radiogroup" hidden="true">
									<button id="editorFreeText" class="toolbarButton" disabled="disabled" title="<?php p($l->t('Text')); ?>" role="radio" aria-checked="false" tabindex="34" data-l10n-id="editor_free_text2">
										<span data-l10n-id="editor_free_text2_label"><?php p($l->t('Text')); ?></span>
									</button>
									<button id="editorInk" class="toolbarButton" disabled="disabled" title="<?php p($l->t('Draw')); ?>" role="radio" aria-checked="false" tabindex="35" data-l10n-id="editor_ink2">
										<span data-l10n-id="editor_ink2_label"><?php p($l->t('Draw')); ?></span>
									</button>
									<button id="editorStamp"
										aria-checked="false"
										aria-controls="editorStampParamsToolbar"
										class="toolbarButton hidden"
										data-l10n-id="editor_stamp1"
										disabled="disabled"
										tabindex="36"
										title="<?php p($l->t('Add or edit images')); ?>"
										role="radio">
										<span data-l10n-id="editor_stamp1_label"><?php p($l->t('Add or edit images')); ?></span>
									</button>
								</div>

								<div id="editorModeSeparator" class="verticalToolbarSeparator" hidden="true"></div>

								<button id="secondaryToolbarToggle" class="toolbarButton" title="<?php p($l->t('Tools')); ?>" tabindex="48" data-l10n-id="tools" aria-expanded="false" aria-controls="secondaryToolbar">
									<span data-l10n-id="tools_label"><?php p($l->t('Tools')); ?></span>
								</button>
							</div>
							<div id="toolbarViewerMiddle">
								<div class="splitToolbarButton">
									<button id="zoomOut" class="toolbarButton" title="<?php p($l->t('Zoom out')); ?>" tabindex="21" data-l10n-id="zoom_out">
										<span data-l10n-id="zoom_out_label"><?php p($l->t('Zoom out')); ?></span>
									</button>
									<div class="splitToolbarButtonSeparator"></div>
									<button id="zoomIn" class="toolbarButton" title="<?php p($l->t('Zoom in')); ?>" tabindex="22" data-l10n-id="zoom_in">
										<span data-l10n-id="zoom_in_label"><?php p($l->t('Zoom in')); ?></span>
									</button>
								</div>
								<span id="scaleSelectContainer" class="dropdownToolbarButton">
									<select id="scaleSelect" title="<?php p($l->t('Zoom')); ?>" tabindex="23" data-l10n-id="zoom">
										<option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="page_scale_auto"><?php p($l->t('Automatic zoom')); ?></option>
										<option id="pageActualOption" title="" value="page-actual" data-l10n-id="page_scale_actual"><?php p($l->t('Actual size')); ?></option>
										<option id="pageFitOption" title="" value="page-fit" data-l10n-id="page_scale_fit"><?php p($l->t('Page fit')); ?></option>
										<option id="pageWidthOption" title="" value="page-width" data-l10n-id="page_scale_width"><?php p($l->t('Page width')); ?></option>
										<option id="customScaleOption" title="" value="custom" disabled="disabled" hidden="true"></option>
										<option title="" value="0.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 50 }'>50%</option>
										<option title="" value="0.75" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 75 }'>75%</option>
										<option title="" value="1" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 100 }'>100%</option>
										<option title="" value="1.25" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 125 }'>125%</option>
										<option title="" value="1.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 150 }'>150%</option>
										<option title="" value="2" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 200 }'>200%</option>
										<option title="" value="3" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 300 }'>300%</option>
										<option title="" value="4" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 400 }'>400%</option>
									</select>
								</span>
							</div>
						</div>
						<div id="loadingBar">
							<div class="progress">
								<div class="glimmer">
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="viewerContainer" tabindex="0">
					<div id="viewer" class="pdfViewer"></div>
				</div>
			</div>
			<!-- mainContainer -->

			<div id="dialogContainer">
				<dialog id="passwordDialog">
					<div class="row">
						<label for="password" id="passwordText" data-l10n-id="password_label"><?php p($l->t('Enter the password to open this PDF file')); ?>:</label>
					</div>
					<div class="row">
						<input type="password" id="password" class="toolbarField">
					</div>
					<div class="buttonRow">
						<button id="passwordCancel" class="dialogButton"><span data-l10n-id="password_cancel"><?php p($l->t('Cancel')); ?></span></button>
						<button id="passwordSubmit" class="dialogButton"><span data-l10n-id="password_ok"><?php p($l->t('Ok')); ?></span></button>
					</div>
				</dialog>
				<dialog id="documentPropertiesDialog">
					<div class="row">
						<span id="fileNameLabel" data-l10n-id="document_properties_file_name"><?php p($l->t('Filename')); ?>:</span>
						<p id="fileNameField" aria-labelledby="fileNameLabel">-</p>
					</div>
					<div class="row">
						<span id="fileSizeLabel" data-l10n-id="document_properties_file_size"><?php p($l->t('File size')); ?>:</span>
						<p id="fileSizeField" aria-labelledby="fileSizeLabel">-</p>
					</div>
					<div class="separator"></div>
					<div class="row">
						<span id="titleLabel" data-l10n-id="document_properties_title"><?php p($l->t('Title')); ?>:</span>
						<p id="titleField" aria-labelledby="titleLabel">-</p>
					</div>
					<div class="row">
						<span id="authorLabel" data-l10n-id="document_properties_author"><?php p($l->t('Author')); ?>:</span>
						<p id="authorField" aria-labelledby="authorLabel">-</p>
					</div>
					<div class="row">
						<span id="subjectLabel" data-l10n-id="document_properties_subject"><?php p($l->t('Subject')); ?>:</span>
						<p id="subjectField" aria-labelledby="subjectLabel">-</p>
					</div>
					<div class="row">
						<span id="keywordsLabel" data-l10n-id="document_properties_keywords"><?php p($l->t('Keywords')); ?>:</span>
						<p id="keywordsField" aria-labelledby="keywordsLabel">-</p>
					</div>
					<div class="row">
						<span id="creationDateLabel" data-l10n-id="document_properties_creation_date"><?php p($l->t('Creation date')); ?>:</span>
						<p id="creationDateField" aria-labelledby="creationDateLabel">-</p>
					</div>
					<div class="row">
						<span id="modificationDateLabel" data-l10n-id="document_properties_modification_date"><?php p($l->t('Modification date')); ?>:</span>
						<p id="modificationDateField" aria-labelledby="modificationDateLabel">-</p>
					</div>
					<div class="row">
						<span id="creatorLabel" data-l10n-id="document_properties_creator"><?php p($l->t('Creator')); ?>:</span>
						<p id="creatorField" aria-labelledby="creatorLabel">-</p>
					</div>
					<div class="separator"></div>
					<div class="row">
						<span id="producerLabel" data-l10n-id="document_properties_producer"><?php p($l->t('PDF producer')); ?>:</span>
						<p id="producerField" aria-labelledby="producerLabel">-</p>
					</div>
					<div class="row">
						<span id="versionLabel" data-l10n-id="document_properties_version"><?php p($l->t('PDF version')); ?>:</span>
						<p id="versionField" aria-labelledby="versionLabel">-</p>
					</div>
					<div class="row">
						<span id="pageCountLabel" data-l10n-id="document_properties_page_count"><?php p($l->t('Page count')); ?>:</span>
						<p id="pageCountField" aria-labelledby="pageCountLabel">-</p>
					</div>
					<div class="row">
						<span id="pageSizeLabel" data-l10n-id="document_properties_page_size"><?php p($l->t('Page size')); ?>:</span>
						<p id="pageSizeField" aria-labelledby="pageSizeLabel">-</p>
					</div>
					<div class="separator"></div>
					<div class="row">
						<span id="linearizedLabel" data-l10n-id="document_properties_linearized"><?php p($l->t('Fast web view')); ?>:</span>
						<p id="linearizedField" aria-labelledby="linearizedLabel">-</p>
					</div>
					<div class="buttonRow">
						<button id="documentPropertiesClose" class="dialogButton">
							<span data-l10n-id="document_properties_close"><?php p($l->t('Close')); ?></span>
						</button>
					</div>
				</dialog>
				<dialog id="altTextDialog" aria-labelledby="dialogLabel" aria-describedby="dialogDescription">
					<div id="altTextContainer">
						<div id="overallDescription">
							<span id="dialogLabel" data-l10n-id="editor_alt_text_dialog_label" class="title"><?php p($l->t('Choose an option')); ?></span>
							<span id="dialogDescription" data-l10n-id="editor_alt_text_dialog_description">
								<?php p($l->t('Alternative text helps when people cannot see the image or when it does not load.')); ?>
							</span>
					</div>
					<div id="addDescription">
						<div class="radio">
							<div class="radioButton">
							<input type="radio" id="descriptionButton" name="altTextOption" tabindex="0" aria-describedby="descriptionAreaLabel" checked>
							<label for="descriptionButton" data-l10n-id="editor_alt_text_add_description_label"><?php p($l->t('Add a description')); ?></label>
						</div>
						<div class="radioLabel">
							<span id="descriptionAreaLabel" data-l10n-id="editor_alt_text_add_description_description">
								<?php p($l->t('Aim for 1-2 sentences that describe the subject, setting, or actions.')); ?>
							</span>
							</div>
						</div>
						<div class="descriptionArea">
							<textarea id="descriptionTextarea"
								placeholder="<?php p($l->t('“A young man sits down at a table to eat a meal”')); ?>"
								aria-labelledby="descriptionAreaLabel"
								data-l10n-id="editor_alt_text_textarea"
								tabindex="0">
							</textarea>
						</div>
					</div>
					<div id="markAsDecorative">
					<div class="radio">
						<div class="radioButton">
							<input type="radio" id="decorativeButton" name="altTextOption" aria-describedby="decorativeLabel">
							<label for="decorativeButton" data-l10n-id="editor_alt_text_mark_decorative_label">
								<?php p($l->t('Mark as decorative')); ?>
							</label>
						</div>
						<div class="radioLabel">
							<span id="decorativeLabel" data-l10n-id="editor_alt_text_mark_decorative_description">
								<?php p($l->t('This is used for ornamental images, like borders or watermarks.')); ?>
							</span>
						</div>
					</div>
				</div>
				<div id="buttons">
					<button id="altTextCancel" tabindex="0">
						<span data-l10n-id="editor_alt_text_cancel_button"><?php p($l->t('Cancel')); ?></span>
					</button>
					<button id="altTextSave" tabindex="0">
						<span data-l10n-id="editor_alt_text_save_button"><?php p($l->t('Save')); ?></span>
					</button>
				</div>
			</div>
				</dialog>
				<dialog id="printServiceDialog" style="min-width: 200px;">
					<div class="row">
						<span data-l10n-id="print_progress_message"><?php p($l->t('Preparing document for printing…')); ?></span>
					</div>
					<div class="row">
						<progress value="0" max="100"></progress>
						<span data-l10n-id="print_progress_percent" data-l10n-args='{ "progress": 0 }' class="relative-progress">0%</span>
					</div>
					<div class="buttonRow">
						<button id="printCancel" class="dialogButton">
							<span data-l10n-id="print_progress_close"><?php p($l->t('Cancel')); ?></span>
						</button>
					</div>
				</dialog>
			</div><!-- dialogContainer -->
		</div><!-- outerContainer -->
		<div id="printContainer"></div>

		<input type="file" id="fileInput" class="hidden">
	</body>
</html>

