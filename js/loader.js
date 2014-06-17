/* globals FileList, FileActions */
function hidePDFviewer() {
	$('#pdframe, #pdfbar').remove();
	if ($('#isPublic').val()){
		$('#preview').css({height: null});
	}
	FileList.setViewerMode(false);
	// replace the controls with our own
	$('#app-content #controls').removeClass('hidden');
}

function showPDFviewer(dir, filename) {
	if(!showPDFviewer.shown) {
		var $iframe;
		var viewer = OC.linkTo('files_pdfviewer', 'viewer.php')+'?dir='+encodeURIComponent(dir).replace(/%2F/g, '/')+'&file='+encodeURIComponent(filename);
		$iframe = $('<iframe id="pdframe" style="width:100%;height:100%;display:block;position:absolute;top:0;" src="'+viewer+'" /><div id="pdfbar"><a id="close" title="Close">X</a></div>');
		if ($('#isPublic').val()) {
			// force the preview to adjust its height
			$('#preview').append($iframe).css({height: '100%'});
			$('body').css({height: '100%'});
			$('footer').css({display:'none'});
			$('#imgframe').css({display:'none'});
			$('#directLink').css({display:'none'});
			$('#directDownload').css({display:'none'});
		} else {
			FileList.setViewerMode(true);
			$('#app-content').append($iframe);
		}
		$("#pageWidthOption").attr("selected","selected");
		// replace the controls with our own
		$('#app-content #controls').addClass('hidden');
		$('#pdfbar').css({position:'absolute',top:'6px',right:'5px'});
		// if a filelist is present, the PDF viewer can be closed to go back there
		if ($('#fileList').length) {
				$('#close').css({display:'block',padding:'0 5px',color:'#BBBBBB','font-weight':'900','font-size':'16px',height:'18px',background:'transparent'}).click(function(){
				hidePDFviewer();
			});
		} else {
			$('#close').css({display:'none'});
		}
	}

}
showPDFviewer.oldCode='';
showPDFviewer.lastTitle='';

$(document).ready(function(){
	// Doesn't work in IE
	if(!$.browser.msie){

		// Logged-in view
		if ($('#filesApp').val() && typeof FileActions !=='undefined'){
 			FileActions.register('application/pdf','Edit', OC.PERMISSION_READ, '',function(filename){
				showPDFviewer(FileList.getCurrentDirectory(), filename);
			});
			FileActions.setDefault('application/pdf','Edit');
		}
		
		// Public view
		if ($('#isPublic').val() && $('#mimetype').val() === 'application/pdf') {
			var sharingToken = $('#sharingToken').val();

			showPDFviewer('', sharingToken);
		}
	}
});
