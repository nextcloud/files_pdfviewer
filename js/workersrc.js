/**
 * Checks if the page is displayed in an iframe. If not redirect to /.
 **/
function redirectIfNotDisplayedInFrame () {
	try {
		if (window.frameElement) {
			return;
		}
	} catch (e) {}

	window.location.href = '/';
}
redirectIfNotDisplayedInFrame();

// When "PDFViewerApplication.initialize" is executed it overwrites the value of
// "PDFJS.workerSrc", so the custom initialization has to be executed after
// that. As "PDFViewerApplication" does not provide any hookable point for
// custom initialization in its initialization routine a dirty hack has to be
// used.
//
// When "vendor/pdfjs/web/viewer.js" is parsed at the end it calls
// "PDFViewerApplication.initialize" (either directly or as a "DOMContentLoaded"
// event handler), and "PDFViewerApplication.initialize" sends an asynchronous
// XHR request to initialize the locales, which causes the execution flow to
// continue with the next script or the next "DOMContentLoaded" handler. Thanks
// to this "initializeCustomPDFViewerApplication" can be executed at that point
// by parsing "js/workersrc.js" after "vendor/pdfjs/web/viewer.js" and either
// calling it directly or adding it as a "DOMContentLoaded" event handler (using
// the same conditions as in "vendor/pdfjs/web/viewer.js").
function initializeCustomPDFViewerApplication() {
	PDFJS.openExternalLinksInNewWindow = true;
	PDFJS.isEvalSupported = false;
	PDFJS.workerSrc = document.getElementsByTagName('head')[0].getAttribute('data-workersrc');

	PDFViewerApplication.download = function() {
		window.open(decodeURIComponent(window.location.search.substr(6)), '_blank');
	};
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
	initializeCustomPDFViewerApplication();
} else {
	document.addEventListener('DOMContentLoaded', initializeCustomPDFViewerApplication, true);
}
