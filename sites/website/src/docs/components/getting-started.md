---
title: Components QuickStart
sidebar_label: QuickStart
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/fast-foundation/getting-started.md
description: The @microsoft/fast-components library contains Web Components built on top of our standard component and design system foundation.
keywords:
    - getting started
---

[![License: MIT](/badges/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components.svg)](https://www.npmjs.com/package/@microsoft/fast-components)

The `@microsoft/fast-components` library contains Web Components built on top of our standard component and design system foundation. `@microsoft/fast-components` expresses the FAST design language (FAST Frame). 

## Installation

### From NPM

To install the components:

```shell
npm install --save @microsoft/fast-components
```

```shell
yarn add @microsoft/fast-components
```

To use a Web Component as a custom element in HTML, the custom element must be registered. Importing the necessary component definition into your JavaScript bundle and registering it with a `DesignSystem` will register the custom element with the platform. Here's how to do that for `@microsoft/fast-components`:

```js
import { 
    fastButton, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton()
    );
```

As a shortcut, if you wish to easily register all available components, rather than registering each one, you can use the following pattern:

```js
import { 
    allComponents, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

:::note
When working with a tree-shaking supporting bundler such as Webpack or Rollup, you will want to import and register the individual components. This will ensure that any unused components are tree-shaken out of your builds.
:::

:::tip
Looking for a setup that integrates with a particular front-end framework or bundler? Check out [our integration docs](../integrations/introduction.md).
:::

### From CDN

A pre-bundled script that contains all APIs needed to use the components is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN. Here's what that would look like for the FAST Web Components:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components/dist/fast-components.min.js"></script>
    </head>
    <!-- ... -->
</html>
```

The markup above always references the latest release of the components. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components@2.16.0/dist/fast-components.min.js"></script>
```

When using FAST from CDN, there is no need to register the components. The CDN script includes code that automatically sets up the design system and registers all the components.

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::

## Add components

With the components registered, add any component to the HTML. That's it! For a comprehensive list of all elements, see the [Components](./fast-accordion.mdx) section.

```html
<!-- ... -->
<fast-button>Hello world</fast-button>
<!-- ... -->
```
