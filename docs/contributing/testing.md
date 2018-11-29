---
id: testing
title: Contributing
sidebar_label: Testing
---

# Testing

When building Web sites and apps on FAST-DNA it's recommended to perform exhaustive testing to instill the confidence that you've met your customers' expectations. The checklist below was compiled over the last few years and is a good starting point for manual testing Web applications.

## Checklist

1. Test each page for design and content issues
    1. Test screen sizes from viewport 1 to 6
    2. Test screen orientations
       1. Portrait
       2. Landscape
    3. Test word length and case
        1. Test smallest amount of text
        2. Test largest amount of text
        3. Case sensitivity
2. Test for localization (RTL, LTR)
    1. English
    2. Arabic
    3. Russian
    4. French
    5. Japanese
    6. Korean
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

There is a [FAST-DNA documentation site for MSFT Components](https://msft-docs.fast-dna.net) that includes built in developer and testing tools to manually test.

Additionally, there are services included in FAST-DNA under `./build/testing` that can be used to assist in comprehensive testing. The configuration and tests are included as a starting point and as functional and UI testing matures these may become part of the CI/CD pipeline.  As of now, these can be ran manually and the cloud services dashboard can be used to evaluate your code changes prior to submitting for code review.

For those interested in using these services contact the project maintainers on discord to gain access.

### Testing on physical devices

Testing local development code on physical devices in hand.

Localtunnel allows you to easily share a web service on your local development machine without messing with DNS and firewall settings.

Localtunnel will assign you a unique publicly accessible URL that will proxy all requests to your locally running web server.

Quickstart

+ Install Localtunnel globally (requires NodeJS).

```bash
npm install -g localtunnel
```

+ Start a web server on a local port (eg: http://localhost:8000) and use the command line interface to request a tunnel to the local server.

```bash
lt --port 8000
```

+ You will receive a URL, for example https://gqgh.localtunnel.me, that you can share with anyone for as long as your local instance remains active. Any requests will be routed to your local service at the specified port.

### Testing with Sauce Labs

[Sauce Labs](https://saucelabs.com/beta/dashboard/builds) allows collaborators and contributors to execute automated tests against Selenium WebDriver on pre-configured browser matrix's.

The cross browser testing strategy focuses on the differences between browser rendering engines. There are three different [configuration files](https://github.com/Microsoft/fast-dna/tree/master/build/testing) based on feature maturity of ongoing work.

[Alpha](https://github.com/Microsoft/fast-dna/blob/master/build/testing/config-browsers.alpha.js) Immature feature development

```bash
node build/testing/sauce-labs/test-browsers.js alpha
```

[Beta](https://github.com/Microsoft/fast-dna/blob/master/build/testing/config-browsers.beta.js) Stable feature development

```bash
node build/testing/sauce-labs/test-browsers.js beta
```

[Release](https://github.com/Microsoft/fast-dna/blob/master/build/testing/config-browsers.release.js) Mature feature development

```bash
node build/testing/sauce-labs/test-browsers.js release
```

### Testing with Applitools

[Applitools](https://eyes.applitools.com/) can be used to visual regression test UI changes on your own branches allow  to execute automated tests against Selenium WebDriver. Currently, ChromeDriver and FirefoxDriver are supported.

Prior to beginning to make UI changes on a new branch it's recommended to run initially to create a baseline set of images.

1. The first time the test is executed on a new branch, screenshots are created as 'undefined' status.
2. After the tests finish users should select all checkbox's and choose to save to generate the baseline image.
3. Next perform UI code changes.
4. Rerun the first set of tests and for all snapshots that match the baseline - they will turn green and show as 'passed' status. Any 'undefined' status would be additional UI changes added. Though to get into this scenario new test cases would be required in the `./run-msft-docs.js` file.  Any anomalies will be marked red as 'failed' status.
5. Manually review all UI changes and if the changes are desired, select and choose to save the new baseline. Anything else should be changed and retested.

```bash
node build/testing/applitools/test-javascript.js
```

#### Visual Regression testing with Cypress SDK

Contributors can perform functional user interface and experience testing using [Cypress](https://www.cypress.io/).

To validate Cypress is configured correctly.

```bash
npm run ui-tests:verify
```

Execute through Electron for real-time user interaction and debugging.

```bash
npm run ui-tests:open
```

Execute using the CLI.

```bash
npm run ui-tests:run
```

_When running as CLI, the results can be viewed as printed out to the command screen or in the cloud dashboard._

## Cross browser testing

You can read more from [Mozilla](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Introduction) on cross browser testing and processes.
