# FAST Components Test Harness

## Core Concepts

The general workflow for running functional tests with Playwright:

1. Build `*.pw.spec.ts` files with `tsc`, output to `dist/`. These are the files that Mocha will run directly.
2. Build fixtures and distribution files with `rollup`, ouptut to `public/`. so Playwright can navigate to them in the browser.
3. Run Mocha:
    * Before running any tests, start a local server to host the fixtures. This can be skipped for CI environments (see the "Environment Variables" section below).
    * Before starting the test suite, open the browser with Playwright.
    * Before each test, open a new page in the browser and navigate to a hosted fixture. After each test, close the page.
    * After all tests complete, close the browser and stop the local server.

The test harness for FAST Components is composed of these parts:

* `server.js` - Uses [Mocha Global setup fixtures](https://mochajs.org/#global-setup-fixtures) for starting a local web server before running any tests. This is needed so Playwright has pages it can navigate to, where tests can inject their scenarios. The web server is closed after all the tests have run.
* `harness.js` - Uses [Mocha root hook plugins](https://mochajs.org/#root-hook-plugins) for ensuring the Playwright browser instance is launched and that a new page is opened before every test, and closed after each test completes.

Both `server.js` and `harness.js` are included as `require` entries in `.mocharc.json`.

## CLI

### Standard commands

|command|description|
|-|-|
| `yarn clean:test` | Remove `dist/` and `public/` from previous builds. |
| `yarn build:pw-tests` | Build `*.pw.spec.ts` files with `tsc` (outputs to `dist/`). |
| `yarn build:pw-fixtures` | Build fixtures and distribution files with `rollup`  (ouptuts to `public/`). |
| `yarn build:pw` | Run `build:pw-tests` and `build:pw-fixtures`. |
| `yarn test-pw` | Run all built tests with Mocha. The default browser is `chromium`. |
| `yarn test-pw:full` | Run `clean:test`, `build:pw`, and `test-pw`. |
| `yarn test-chromium:pw` | Run `test-pw:full` in Chromium. |
| `yarn test-firefox:pw` | Run `test-pw:full` in Firefox. |
| `yarn test-webkit:pw` | Run `test-pw:full` in Webkit. |

### Environment Variables

| variable | description |
|-|-|
| `PW_BROWSER` | Target a specific Playwright browser. Values are `chromium`, `firefox`, and `webkit`. |
| `FIXTURE` | Override the fixture file that Playwright will use for all tests. Values depend on available fixtures in `fixtures/`, currently `index.html` or `iife.html`. Defaults to `index.html`. |
| `FIXTUREURL` | Override the entire fixture URL that Playwright will use for all tests. Defaults to `http://localhost:7001/index.html`. |
| `USELOCAL` | When set to `false`, the local Express server initialization will be skipped. |
| `PORT` | Override the listening port for Express. Defaults to `7001`. |

### Examples

* Run all tests against a specific website:

  ```bash
  USELOCAL=false \
  FIXTUREURL=http://explore.fast.design/preview \
  yarn test-pw:full
  ```

* Re-run the tests in a different browser, without rebuilding everything:

  ```bash
  PW_BROWSER=firefox yarn test-pw
  ```
