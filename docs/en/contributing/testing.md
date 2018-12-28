---
id: testing
title: Testing
sidebar_label: Testing
---

## Checklist

This testing checklist is a good starting point for manual testing web applications.

1. Test each page for design and content issues
    1. Test screen sizes from viewport 1 to 6
    2. Test screen orientations
        1. Portrait
        2. Landscape
    3. Test word length and case
        1. Test the smallest amount of text
        2. Test the largest amount of text
        3. Case sensitivity
2. Test for localization (RTL, LTR)
3. Test for progressive enhancement
    1. Test complete browser matrix
    2. Test for zooming browser from 200% and 25%
4. Test each component and pages for accessibility issues
    1. Test for keyboard accessibility
    2. Test for Mouse only interaction
    3. Test for Touch interaction
    4. Test with High Contrast of OS
    5. Test without images
    6. Test for text only
    7. Test with a screen reader

## Manual testing

FAST UI development tools offer a solution for manually testing components during development. Easily test with features such as viewport, localized direction (RTL or LTR), background transparency, color themes, and interactive properties.

Additionally, we offer testing services under `./build/testing` that can be used to assist in comprehensive testing. We have included these configurations and tests as a starting point. Run the tests manually, and the cloud services dashboard can be used to evaluate your code changes before submitting for code review.

### Testing on physical devices

When testing local code on physical devices, Localtunnel allows you to easily share a web service on your local machine without managing DNS and firewall settings.

Localtunnel assigns a unique publicly accessible URL that proxies all requests to your local web server.

#### Quickstart

Install Localtunnel globally (requires NodeJS):

```bash
npm install -g localtunnel
```

* Start a web server on a local port (eg, [http://localhost:8000](http://localhost:8000)) and use the command line interface to request a tunnel to the local server:

```bash
lt --port 8000
```

* You receive a URL to share as long as your local instance remains active. Requests route to your local service at the specified port.

### Testing with Sauce Labs

[Sauce Labs](https://saucelabs.com/beta/dashboard/builds) lets collaborators and contributors execute automated tests against Selenium WebDriver on pre-configured browser matrix's.

The cross-browser testing strategy focuses on the differences between browser rendering engines. There are three different [configuration files](https://github.com/Microsoft/fast-dna/tree/master/build/testing) based on feature maturity of ongoing work.

[Alpha](https://github.com/Microsoft/fast-dna/blob/master/build/testing/config-browsers.alpha.js) - immature feature development:

```bash
node build/testing/sauce-labs/test-browsers.js alpha
```

[Beta](https://github.com/Microsoft/fast-dna/blob/master/build/testing/config-browsers.beta.js) - stable feature development:

```bash
node build/testing/sauce-labs/test-browsers.js beta
```

[Release](https://github.com/Microsoft/fast-dna/blob/master/build/testing/config-browsers.release.js) - mature feature development:

```bash
node build/testing/sauce-labs/test-browsers.js release
```

### Testing with Applitools

[Applitools](https://eyes.applitools.com/) can be used to run visual regression tests on UI changes for your branches and allows you to execute automated tests against Selenium WebDriver with ChromeDriver and FirefoxDriver.

Before making any UI changes on a new branch, run Applitools to create a baseline set of images.

1. When executing a test for the first time on a new branch, Applitools generates screenshots with an 'undefined' status.
2. Once the tests finish, users should select all checkboxes and click **save** to generate the baseline image.
3. Make changes to your UI code.
4. Rerun the first set of tests and for all snapshots that match the baseline - the images turn green and show as 'passed' status. Any images with 'undefined' status would be caused by additional UI changes. Getting into this state requires new test cases in the `./run-msft-docs.js` file. Anomalies marked red have a 'failed' status.
5. Manually verify all the UI changes and save the new baseline.

Once undesired changes are fixed, retest:

```bash
node build/testing/applitools/test-javascript.js
```

#### Visual Regression testing with Cypress SDK

Contributors can perform functional user interface and experience testing using [Cypress](https://www.cypress.io/).

To validate Cypress is configured correctly:

```bash
npm run ui-tests:verify
```

Execute through Electron for real-time user interaction and debugging:

```bash
npm run ui-tests:open
```

Execute using the CLI:

```bash
npm run ui-tests:run
```

When running as CLI, the results can be viewed printing to the command screen or in the cloud dashboard.

## Cross browser testing

You can read more from [Mozilla](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Introduction) on cross-browser testing and processes.

Report browser bugs by following these links:

* [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/)
* [Firefox](https://bugzilla.mozilla.org/)
* [Safari](https://bugs.webkit.org/)
* [Chrome](https://bugs.chromium.org/p/chromium/issues/list)
* [Opera](https://bugs.opera.com/wizard/desktop)
