/*
 * Copyright (c) 2013-2014 Lukas Reschke <lukas@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

var isSecureViewerAvailable = function () {
	return $('#hideDownload').val() === 'true' && typeof OCA.RichDocuments !== 'undefined';
};

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

			if (typeof FileList !== 'undefined') {
				FileList.setViewerMode(false);
			}

			// replace the controls with our own
			$('#app-content #controls').removeClass('hidden');
		},

		/**
		 * @param downloadUrl
		 * @param param
		 * @param isFileList
		 */
		show: function(downloadUrl, param, isFileList) {
			var self = this;
			var shown = true;
			var $iframe;
			var viewer = OC.generateUrl('/apps/files_pdfviewer/?file={file}', {file: downloadUrl});
			$iframe = $('<iframe id="pdframe" style="width:100%;height:100%;display:block;position:absolute;top:0;z-index:1041;left:0;" src="'+viewer+param+'" sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-top-navigation" allowfullscreen="true"/>');

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
				$('#app-content').after($iframe);
			}

			$("#pageWidthOption").attr("selected","selected");
			// replace the controls with our own
			$('#app-content #controls').addClass('hidden');

			// if a filelist is present, the PDF viewer can be closed to go back there
			$('#pdframe').load(function(){
				var iframe = $('#pdframe').contents();
				if ($('#hideDownload').val() === 'true') {
					iframe.find('.toolbarButton.download').hide()
					iframe.find('.toolbarButton.print').hide()
				}
				if ($('#fileList').length)
				{
					iframe.find('#secondaryToolbarClose').click(function() {
						self.hide();
					});

					// Go back on ESC
					$(document).keyup(function(e) {
						if (shown && e.keyCode == 27) {
							shown = false;
							self.hide();
						}
					});
				} else {
					iframe.find("#secondaryToolbarClose").addClass('hidden');
				}

				var hideDownload = $('#hideDownload').val();
				if (hideDownload === 'true') {
					iframe.find('.download').addClass('hidden');
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
			if (isSecureViewerAvailable()) {
				return;
			}
			fileActions.registerAction({
				name: 'view',
				displayName: 'Favorite',
				mime: 'application/pdf',
				permissions: OC.PERMISSION_READ,
				actionHandler: function(fileName, context) {
					var downloadUrl = context.fileList.getDownloadUrl(fileName, context.dir);
					if (downloadUrl && downloadUrl !== '#') {
						self.show(downloadUrl, '', true);
					}
				}
			});
			fileActions.setDefault('application/pdf', 'view');
		}
	};

})(OCA);

OC.Plugins.register('OCA.Files.FileList', OCA.FilesPdfViewer.PreviewPlugin);

// FIXME: Hack for single public file view since it is not attached to the fileslist
$(document).ready(function(){
	if ($('#isPublic').val() && $('#mimetype').val() === 'application/pdf' && !isSecureViewerAvailable()) {
		$.urlParam = function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (results == null) {
				return 0;
			}
			return results[1] || 0;
		};
		var sharingToken = $('#sharingToken').val();
		var page = '#page='+$.urlParam('page');
		var downloadUrl = OC.generateUrl('/s/{token}/download', {token: sharingToken});
		var viewer = OCA.FilesPdfViewer.PreviewPlugin;
		viewer.show(downloadUrl, page, false);
	}
});

(function () {

	var SidebarPreview = function () {	};

	SidebarPreview.prototype = {
		attach: function (manager) {
			manager.addPreviewHandler('application/pdf', this.handlePreview.bind(this));
		},

		handlePreview: function (model, $thumbnailDiv, $thumbnailContainer, fallback) {
			var previewWidth = Math.floor($thumbnailContainer.parent().width() + 50);  // 50px for negative margins
			var previewHeight = Math.floor(previewWidth / (16 / 9));

			var downloadUrl = Files.getDownloadUrl(model.get('name'), model.get('path'));

			var viewer = OC.generateUrl('/apps/files_pdfviewer/?minmode=true&file={file}', {file: downloadUrl});
			var $iframe = $('<iframe id="pdframe-sidebar" style="width:100%;height:' + previewHeight + 'px;display:block;" src="' + viewer + '" sandbox="allow-scripts allow-same-origin allow-popups allow-modals" />');
			$thumbnailDiv.append($iframe);

			$iframe.on('load', function() {
				$thumbnailDiv.removeClass('icon-loading icon-32');
				$thumbnailContainer.addClass('large');
				$thumbnailDiv.children('.stretcher').remove();
				$thumbnailContainer.css("max-height", previewHeight);
			});
		},

		getFileContent: function (path) {
			return $.get(OC.linkToRemoteBase('files' + path));
		}
	};

	OC.Plugins.register('OCA.Files.SidebarPreviewManager', new SidebarPreview());
})();
