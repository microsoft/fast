# FAST Foundation Test Harness

This directory contains the test harness for FAST Foundation, which is a static webpage hosted by a small express server. The page provides a way to run the FAST Foundation tests in a browser, by importing each component definition and registering it with the browser's custom element registry. This is the same method used by the FAST Foundation Storybook.

## Structure

```text
test/
├── public/             # static assets for the test harness
│   ├── dist/           # gitignored build output directory
│   │   └── bundle.js   # generated test harness bundle
│   └── index.html      # test harness HTML file
├── bundle.ts           # entry point for the test harness bundle
└── server.js           # test harness express server
```

## Building the test harness bundle

The bundle is built along with the main package bundles via the `build:rollup` script in `package.json`. The Rollup config outputs the bundle to `public/dist/bundle.js`.

## Running the test harness

The Playwright config uses its `webServer` property to specify the command to start the test harness. While Playwright is running, the test harness will be available at `http://localhost:6007`.

If you'd like to run the test harness manually, you can run `node test/server.js` from the `fast-foundation` directory. This will start the test harness server separately from Playwright, which can be useful for debugging.
