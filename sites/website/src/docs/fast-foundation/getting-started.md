---
title: Getting Started
sidebar_label: Getting Started
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/sites/website/src/docs/fast-foundation/getting-started.md
---
This document presumes you have [NodeJS](https://nodejs.org/) installed as well as some way to run an HTTP server locally, such as [http-server](https://www.npmjs.com/package/http-server).

## Quick-start

This section will walk through the quickest way to get up and running using FAST components.

### Add the script

First, add the `fast-components.js` script file to your HTML. This pre-bundled script contains all components and dependencies. Also be sure to add [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="...TODO..." type="module"></script>
    </head>
    <!-- ... -->
</html>
```

:::Note
If you are looking to leverage a tool like Webpack, see our [Webpack Guide](./webpack) to learn how to properly get set up.
:::

### Add the Design System Provider

The [Design System Provider](fast-foundation/fast-design-system-provider.md) will provide design information to child FAST components. 

By default, the background color and text color won't be set by the `fast-design-system-provider` ([but there will be a solution soon](https://github.com/microsoft/fast-dna/issues/3213)), so you'll want to apply the CSS *background-color* and *color* properties.

```html
<!-- ... -->
<body>
    <fast-design-system-provider use-defaults style="background-color: var(--background-color); color: #E5E5E5;">
    </fast-design-system-provider>
</body>
<!-- ... -->
```

### Add Components

Add any FAST elements (or any element) as a child of the `fast-design-system-provider`. That's it! For a comprehensive list of all elements, see the Components section.

```html
<!-- ... -->
<fast-design-system-provider use-defaults style="background-color: var(--background-color); color: #E5E5E5;">
    <fast-button>Hello world<fast-button>
</fast-design-system-provider>
<!-- ... -->
```

## Advanced guide

Production applications are usually a bit more complicated than the above and may include requirements like tree shaking, bundle minification, async dependency requests, and integration into application frameworks. While these concerns are broad and largely covered in other sections, this section details installation and importing of the package components.

### Installation

```shell
npm install @microsoft/fast-components
# or
yarn add @microsoft/fast-components
```

### Importing components

To use a Web Component as a custom element in HTML, the custom element name must be registered with a backing JavaScript class. Importing the necessary class from `@microsoft/fast-components` into your JavaScript bundle will perform that registration, so long as the imported class **does not get tree shaken**:

```js
import { FASTDesignSystemProvider, FASTButton } from "@microsoft/fast-components";

/*
 * Ensure that tree-shaking doesn't remove these components from the bundle.
 * There are multiple ways to prevent tree shaking, of which this is one.
 */
FASTDesignSystemProvider;
FASTButton;
```