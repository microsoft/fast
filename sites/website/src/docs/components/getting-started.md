---
title: Getting Started with FAST Components
sidebar_label: Getting Started
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/fast-foundation/getting-started.md
---
[![License: MIT](/badges/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](/badges/fast-components.svg)](https://www.npmjs.com/package/@microsoft/fast-components)

The `@microsoft/fast-components` and `@fluentui/web-components` libraries contain Web Components built on top of our standard component and design system foundation. `@microsoft/fast-components` expresses the FAST design language (FAST Frame) while `@fluentui/web-components` expresses Microsoft's Fluent design language.

## Installation

### From NPM

To install the components, first, choose between `@microsoft/fast-components` and `@fluentui/web-components`. Assuming a selection of `@microsoft/fast-components`, you would use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-components
```

```shell
yarn add @microsoft/fast-components
```

To use a Web Component as a custom element in HTML, the custom element name must be registered with a backing JavaScript class. Importing the necessary component definition from `@microsoft/fast-components` into your JavaScript bundle and registering it with a `DesignSystem` will perform the custom element definition:

```js
import { DesignSystem } from "@microsoft/fast-foundation";
import { fastButton } from "@microsoft/fast-components";

DesignSystem.getOrCreate().register(
    fastButton()
);
```

:::tip
Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](/docs/integrations/introduction).
:::

### From CDN

A pre-bundled script that contains all APIs needed to use the components is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="https://unpkg.com/@microsoft/fast-components"></script>
    </head>
    <!-- ... -->
</html>
```

:::important
The above CDN location points to the latest release of `@microsoft/fast-components`. It is advised that when you deploy your site or app, you import the specific version you have developed and tested with.
:::

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::

## Add components

With the provider in place, add any components to the HTML. That's it! For a comprehensive list of all elements, see the [Components](/docs/components) section.

```html
<!-- ... -->
<fast-button>Hello world</fast-button>
<!-- ... -->
```
