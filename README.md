<!--
   - SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
   - SPDX-FileCopyrightText: 2014-2016 ownCloud, Inc.
   - SPDX-License-Identifier: AGPL-3.0-only
-->
# PDF viewer for Nextcloud

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud/files_pdfviewer)](https://api.reuse.software/info/github.com/nextcloud/files_pdfviewer)

This application integrates the [PDF.js](https://mozilla.github.io/pdf.js/) library into Nextcloud's Viewer.
You can view PDF files as well as Adobe Illustrator files (.ai)

![PDF viewer](https://user-images.githubusercontent.com/59488153/189176433-2f6d97a1-b151-4099-84f4-d1446a007b8a.png)

### Enable Javascript execution in PDF files

To allow Javascript embedded in PDF-files to be executed inside the PDF-viewer inside your browser, enable it with:

`php occ config:app:set files_pdfviewer enable_scripting --value=yes`

Disable:

`php occ config:app:delete files_pdfviewer enable_scripting`

## 🏗 Development setup

1. ☁ Clone this app into the `apps` folder of your Nextcloud: `git clone https://github.com/nextcloud/files_pdfviewer.git`
1. ☁ Clone the viewer app into the `apps` folder of your Nextcloud: `git clone https://github.com/nextcloud/viewer.git`
2. 👩‍💻 In the folder of the files_pdfviewer app, run the command `npm ci && npm run dev` to install dependencies and build the Javascript.
3. ✅ Enable the app through the app management of your Nextcloud (viewer should be enabled by default)
4. 🎉 Partytime! Help fix [some issues](https://github.com/nextcloud/files_pdfviewer/issues) and [review pull requests](https://github.com/nextcloud/files_pdfviewer/pulls) 👍


### 🧙 Advanced development stuff

To build the Javascript whenever you make changes, you can also use `npm run build`. Or `npm run watch` to automatically rebuild on every file save.

You run all tests by using `make test`.

### 📦 Update pdf.js

When a new release of pdf.js is available on https://github.com/mozilla/pdf.js/releases, update the version number on https://github.com/nextcloud/files_pdfviewer/blob/master/pdfjs-get.js#L8 and compile the app again.


## ♥ How to create a pull request

This guide will help you get started:
- 💃 [Opening a pull request](https://opensource.guide/how-to-contribute/#opening-a-pull-request)


## ✌ Code of conduct

The Nextcloud community has core values that are shared between all members during conferences, hackweeks and on all interactions in online platforms including [Github](https://github.com/nextcloud) and [forums](https://help.nextcloud.com). If you contribute, participate or interact with this community, please respect [our shared values](https://nextcloud.com/code-of-conduct/). 😌
