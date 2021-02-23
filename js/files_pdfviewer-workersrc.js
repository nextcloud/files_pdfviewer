!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/js/",n(n.s=141)}({141:function(e,t,n){"use strict";n.r(t);var o=n(22);
/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */window.location===window.parent.location&&(window.location.href="/"),document.addEventListener("DOMContentLoaded",(function(){if(PDFViewerApplicationOptions.set("disablePreferences",!0),PDFViewerApplicationOptions.set("externalLinkTarget",pdfjsLib.LinkTarget.BLANK),PDFViewerApplicationOptions.set("isEvalSupported",!1),PDFViewerApplicationOptions.set("workerSrc",document.getElementsByTagName("head")[0].getAttribute("data-workersrc")),PDFViewerApplicationOptions.set("cMapUrl",document.getElementsByTagName("head")[0].getAttribute("data-cmapurl")),console.debug("Initialized files_pdfviewer",PDFViewerApplicationOptions.getAll()),PDFViewerApplication.download=function(){function e(e){let t=0;const n=e.length;for(;t<n&&""===e[t].trim();)t++;return"data:"===e.substr(t,5).toLowerCase()}const t=decodeURIComponent(window.location.search.substr(6));this.downloadManager.downloadUrl(t,function(t){const n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"document.pdf";if(e(t))return console.warn('getPDFFileNameFromURL: ignoring "data:" URL for performance reasons.'),n;const o=/^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/,i=/[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i,r=o.exec(t);let a=i.exec(r[1])||i.exec(r[2])||i.exec(r[3]);if(a&&(a=a[0],-1!==a.indexOf("%")))try{a=i.exec(decodeURIComponent(a))[0]}catch(e){console.debug(e)}return a||n}(t))},!Object(o.a)()){PDFViewerApplication.download=function(){};const e=document.getElementById("toolbarViewerRight").querySelector("button.download");e&&(e.style.display="none"),delete PDFViewerApplication.supportsPrinting,PDFViewerApplication.supportsPrinting=!1,PDFViewerApplication.beforePrint=function(){},document.getElementById("viewer").classList.add("disabledTextSelection"),console.debug("Files_PDFViewer, download and print disabled")}}),!0)},22:function(e,t,n){"use strict";
/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */const o=document.getElementById("hideDownload");t.a=()=>!o||o&&"true"!==o.value}});
//# sourceMappingURL=files_pdfviewer-workersrc.js.map?v=757f0196e3f49afcab21