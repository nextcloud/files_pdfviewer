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
	PDFJS.cMapUrl = document.getElementsByTagName('head')[0].getAttribute('data-cmapurl');

	// The download has to be forced to use the URL of the file; by default
	// "PDFViewerApplication.download" uses a blob, but this causes a CSP error
	// (at least, in Firefox) when trying to download it.
	PDFViewerApplication.download = function() {
		// "isDataSchema()" and "getPDFFileNameFromURL()" are copied from
		// "vendor/pdfjs/web/viewer.js", as the functions defined in that file
		// can not be accessed from the outside.
		function isDataSchema(url) {
			var i = 0,
				ii = url.length;
			while (i < ii && url[i].trim() === '') {
				i++;
			}
			return url.substr(i, 5).toLowerCase() === 'data:';
		}

		function getPDFFileNameFromURL(url) {
			var defaultFilename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'document.pdf';

			if (isDataSchema(url)) {
				console.warn('getPDFFileNameFromURL: ' + 'ignoring "data:" URL for performance reasons.');
				return defaultFilename;
			}
			var reURI = /^(?:(?:[^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
			var reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
			var splitURI = reURI.exec(url);
			var suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);
			if (suggestedFilename) {
				suggestedFilename = suggestedFilename[0];
				if (suggestedFilename.indexOf('%') !== -1) {
					try {
						suggestedFilename = reFilename.exec(decodeURIComponent(suggestedFilename))[0];
					} catch (ex) {}
				}
			}
			return suggestedFilename || defaultFilename;
		}

		var url = decodeURIComponent(window.location.search.substr(6));

		this.downloadManager.downloadUrl(url, getPDFFileNameFromURL(url));
	};
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
	initializeCustomPDFViewerApplication();
} else {
	document.addEventListener('DOMContentLoaded', initializeCustomPDFViewerApplication, true);
}
