# FAST Foundation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-foundation.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-foundation)

The `fast-foundation` package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems (e.g. Fluent Design, Material Design, etc.). The exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.

This package does not export Web Components registered as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) - it exports parts and pieces intended to be *composed* into Web Components, allowing you to implement your own design language by simply applying CSS styles and behaviors without having to write all the JavaScript that's involved in building production-quality component implementations.

## Installation

### From NPM

To install the `fast-foundation` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-foundation
```

```shell
yarn add @microsoft/fast-foundation
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { Anchor } from '@microsoft/fast-foundation';
```

Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](https://fast.design/docs/integrations/introduction).

### From CDN

A pre-bundled script that contains all APIs needed to use FAST Foundation is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
          import { Anchor } from "https://cdn.jsdelivr.net/npm/@microsoft/fast-foundation/dist/fast-foundation.min.js";

          // your code here
        </script>
    </head>
    <!-- ... -->
</html>
```

The markup above always references the latest release. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-foundation@2.26.2/dist/fast-foundation.min.js"></script>
```

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::