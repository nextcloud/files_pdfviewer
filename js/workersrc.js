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

PDFJS.openExternalLinksInNewWindow = true;
PDFJS.isEvalSupported = false;
PDFJS.workerSrc = document.getElementsByTagName('head')[0].getAttribute('data-workersrc');
