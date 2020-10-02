# FAST Physics

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-physics.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-physics)

The `fast-physics` library enables creating interruptible physics-based animations.

## Installation

### From NPM

To install the `fast-physics` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-physics
```

```shell
yarn add @microsoft/fast-physics
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { Foo } from '@microsoft/fast-physics';
```

:::tip
Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](https://fast.design/docs/integrations/introduction).
:::

### From CDN

A pre-bundled script that contains all APIs needed to build with FAST Physics is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
          import { Foo } from "https://unpkg.com/@microsoft/fast-physics";

          // your code here
        </script>
    </head>
    <!-- ... -->
</html>
```

:::important
The above CDN location points to the latest release of `fast-physics`. It is advised that when you deploy your site or app, you import the specific version you have developed and tested with.
:::

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::