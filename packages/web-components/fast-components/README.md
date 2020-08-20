# FAST Components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components)

`fast-components` is a library of Web Components that *composes* the exports of `fast-foundation` with stylesheets aligning to the FAST design language. This composition step registers a custom element. See the [quick start](https://fast.design/docs/components/getting-started) to get started using the components.

## Installation

### From NPM

To install the `fast-components` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-components
```

```shell
yarn add @microsoft/fast-components
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { FASTAnchor } from '@microsoft/fast-components';
```

Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](https://fast.design/docs/integrations/introduction).

### From CDN

A pre-bundled script that contains all APIs needed to use FAST Foundation is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="https://unpkg.com/@microsoft/fast-components"></script>
    </head>
    <!-- ... -->
</html>
```

The above CDN location points to the latest release of `fast-components`. It is advised that when you deploy your site or app, you import the specific version you have developed and tested with.

For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.

## Development

To start the component development environment, run `yarn start`.

### Known issue with Storybook site hot-reloading

Storybook will watch modules for changes and hot-reload the module when necessary. This is usually great but poses a problem when the module being hot-reloaded defines a custom element. A custom element name can only be defined by the `CustomElementsRegistry` once, so reloading a module that defines a custom element will attempt to re-register the custom element name, throwing an error because the name has already been defined. This error will manifest with the following message:
`Failed to execute 'define' on 'CustomElementRegistry': the name "my-custom-element-name" has already been used with this registry`

This is a known issue and will indicate that you need to refresh the page. We're working on surfacing a more instructive error message for this case.
