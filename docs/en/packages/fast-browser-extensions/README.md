---
id: index
title: FAST Browser Extensions
sidebar_label: Browser Extensions
---


# FAST browser extension

A Chrome extension for testing real-world localization, theming, and other production type scenarios in web development.

## Getting started

Obtain a _chrome.pem_ key and save it in a convenient and secure location, you will need it later.

Run `npm run dev:chrome`.

Navigate to [chrome://extensions](chrome://extensions) in the Chrome browser.

Click the **Load unpacked** button and select `dist/chrome` (relative to project root.)

Click the 'Pack extension' button where:

* The **Extension root directory** is `dist/chrome` (relative to project root.)
* The **Private key file** is the _chrome.pem_ file you obtained.

## Resources

[Controlling the extension ID](https://stackoverflow.com/questions/21497781/how-to-change-chrome-packaged-app-id-or-why-do-we-need-key-field-in-the-manifest/21500707#21500707)
[Keep development ID consistent](https://developer.chrome.com/apps/app_identity#copy_key)