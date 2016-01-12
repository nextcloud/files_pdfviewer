/*
 * Copyright (c) 2013-2014 Lukas Reschke <lukas@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OCA) {

	OCA.FilesPdfViewer = OCA.FilesPdfViewer || {};

	/**
	 * @namespace OCA.FilesPdfViewer.PreviewPlugin
	 */
	OCA.FilesPdfViewer.PreviewPlugin = {

		/**
		 * @param fileList
		 */
		attach: function(fileList) {
			this._extendFileActions(fileList.fileActions);
		},

		hide: function() {
			$('#pdframe').remove();
			if ($('#isPublic').val() && $('#filesApp').val()){
				$('#controls').removeClass('hidden');
				$('#content').removeClass('full-height');
				$('footer').removeClass('hidden');
			}

			FileList.setViewerMode(false);

			// replace the controls with our own
			$('#app-content #controls').removeClass('hidden');
		},

		/**
		 * @param downloadUrl
		 * @param isFileList
		 */
		show: function(downloadUrl, isFileList) {
			var self = this;
			var $iframe;
			var viewer = OC.generateUrl('/apps/files_pdfviewer/?file={file}', {file: downloadUrl});
			$iframe = $('<iframe id="pdframe" style="width:100%;height:100%;display:block;position:absolute;top:0;" src="'+viewer+'" sandbox="allow-scripts allow-same-origin allow-popups allow-modals" />');

			if(isFileList === true) {
				FileList.setViewerMode(true);
			}

			if ($('#isPublic').val()) {
				// force the preview to adjust its height
				$('#preview').append($iframe).css({height: '100%'});
				$('body').css({height: '100%'});
				$('#content').addClass('full-height');
				$('footer').addClass('hidden');
				$('#imgframe').addClass('hidden');
				$('.directLink').addClass('hidden');
				$('.directDownload').addClass('hidden');
				$('#controls').addClass('hidden');
			} else {
				$('#app-content').append($iframe);
			}

			$("#pageWidthOption").attr("selected","selected");
			// replace the controls with our own
			$('#app-content #controls').addClass('hidden');

			// if a filelist is present, the PDF viewer can be closed to go back there
			$('#pdframe').load(function(){
				var iframe = $('#pdframe').contents();
				if ($('#fileList').length) {
					iframe.find('#secondaryToolbarClose').click(function() {
						if(!$('html').hasClass('ie8')) {
							history.back();
						} else {
							self.hide();
						}
					});
				} else {
					iframe.find("#secondaryToolbarClose").addClass('hidden');
				}
			});

			if(!$('html').hasClass('ie8')) {
				history.pushState({}, '', '#pdfviewer');
			}

			if(!$('html').hasClass('ie8')) {
				$(window).one('popstate', function (e) {
					self.hide();
				});
			}
		},

		/**
		 * @param fileActions
		 * @private
		 */
		_extendFileActions: function(fileActions) {
			var self = this;
			fileActions.registerAction({
				name: 'view',
				displayName: 'Favorite',
				mime: 'application/pdf',
				permissions: OC.PERMISSION_READ,
				actionHandler: function(fileName, context) {
					var downloadUrl = '';
					if($('#isPublic').val()) {
						var sharingToken = $('#sharingToken').val();
						downloadUrl = OC.generateUrl('/s/{token}/download?files={files}&path={path}', {
							token: sharingToken,
							files: fileName,
							path: context.dir
						});
					} else {
						downloadUrl = Files.getDownloadUrl(fileName, context.dir);
					}
					self.show(downloadUrl, true);
				}
			});
			fileActions.setDefault('application/pdf', 'view');
		}
	};

})(OCA);

// Doesn't work with IE below 9
if(!$.browser.msie || ($.browser.msie && $.browser.version >= 9)){
	OC.Plugins.register('OCA.Files.FileList', OCA.FilesPdfViewer.PreviewPlugin);
}

// FIXME: Hack for single public file view since it is not attached to the fileslist
$(document).ready(function(){
	// Doesn't work with IE below 9
	if(!$.browser.msie || ($.browser.msie && $.browser.version >= 9)){
		if ($('#isPublic').val() && $('#mimetype').val() === 'application/pdf') {
			var sharingToken = $('#sharingToken').val();
			var downloadUrl = OC.generateUrl('/s/{token}/download', {token: sharingToken});
			var viewer = OCA.FilesPdfViewer.PreviewPlugin;
			viewer.show(downloadUrl, false);
		}
	}
});
