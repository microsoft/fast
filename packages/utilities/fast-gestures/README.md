# FAST Gestures

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-gestures.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-gestures)

The `fast-gestures` library enables input device independent gesture recognition.

## Installation

### From NPM

To install the `fast-gestures` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-gestures
```

```shell
yarn add @microsoft/fast-gestures
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { Foo } from '@microsoft/fast-gestures';
```

:::tip
Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](https://fast.design/docs/integrations/introduction).
:::

### From CDN

A pre-bundled script that contains all APIs needed to build with FAST Gestures is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
          import { Foo } from "https://unpkg.com/@microsoft/fast-gestures";

          // your code here
        </script>
    </head>
    <!-- ... -->
</html>
```

:::important
The above CDN location points to the latest release of `fast-gestures`. It is advised that when you deploy your site or app, you import the specific version you have developed and tested with.
:::

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::