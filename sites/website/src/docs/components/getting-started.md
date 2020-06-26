---
title: Getting Started with FAST Components
sidebar_label: Getting Started
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/fast-foundation/getting-started.md
---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components)

The `fast-components` and `fast-components-msft` libraries contain Web Components built on top of our standard component and design system foundation. `fast-components` express the FAST design language while `fast-components-msft` expresses Microsoft's Fluent design language.

## Installation

### From NPM

To install the components, first, choose between `fast-components` and `fast-components-msft`. Assuming a selection of `fast-components`, you would use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-components
```

```shell
yarn add @microsoft/fast-components
```

To use a Web Component as a custom element in HTML, the custom element name must be registered with a backing JavaScript class. Importing the necessary class from `@microsoft/fast-components` into your JavaScript bundle will perform that registration, as long as the imported class **does not get tree shaken** by your bundler or build system:

```js
import { FASTDesignSystemProvider, FASTButton } from "@microsoft/fast-components";

/*
 * Ensure that tree-shaking doesn't remove these components from the bundle.
 * There are multiple ways to prevent tree shaking, of which this is one.
 */
FASTDesignSystemProvider;
FASTButton;
```

:::tip
Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](../integrations/introduction).
:::

### From CDN

A pre-bundled script that contains all APIs needed to use the components is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="https://unpkg.com/@microsoft/fast-components">
    </head>
    <!-- ... -->
</html>
```

:::important
The above CDN location points to the latest release of `fast-components`. It is advised that when you deploy your site or app, you import the specific version you have developed and tested with.
:::

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::

## Add the design system provider

The [Design System Provider](./design-system-provider) provides design information to child components. So, we must always wrap the portion of our site or app that uses the components with a provider element:

```html
<!-- ... -->
<body>
    <fast-design-system-provider use-defaults>
    </fast-design-system-provider>
</body>
<!-- ... -->
```

## Add components

With the provider in place, add any components as a child of the `fast-design-system-provider`. That's it! For a comprehensive list of all elements, see the Components section.

```html
<!-- ... -->
<fast-design-system-provider use-defaults>
    <fast-button>Hello world<fast-button>
</fast-design-system-provider>
<!-- ... -->
```