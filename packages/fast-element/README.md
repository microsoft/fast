# FAST Element

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-element.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-element)

The `fast-element` library is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework.

## Installation

### From NPM

To install the latest `fast-element` library using `npm`:

```shell
npm install --save @microsoft/fast-element
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { FASTElement } from '@microsoft/fast-element';
```

### From CDN

A pre-bundled script that contains all APIs needed to build web components with FAST Element is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
          import { FASTElement } from "https://cdn.jsdelivr.net/npm/@microsoft/fast-element/dist/fast-element.min.js";

          // your code here
        </script>
    </head>
    <!-- ... -->
</html>
```

The markup above always references the latest release. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@microsoft/fast-element@1.6.2/dist/fast-element.min.js"></script>
```

:::note
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::

:::tip
Looking for a quick guide on building components?  Check out [our Cheat Sheet](../resources/cheat-sheet.md#building-components).
:::

## Prerendered Content Optimization

When a FAST element connects and already has an existing shadow root (from server-side rendering or declarative shadow DOM), `ElementController` automatically detects this and sets `isPrerendered` to `true`. This enables several optimizations:

- **Hydration instead of re-render**: The template uses `hydrate()` to map existing DOM nodes to binding targets rather than cloning new DOM.
- **Template-pending guard**: When `templateOptions` is `"defer-and-hydrate"` and no template is available yet, `connect()` returns early and retriggers when the template arrives.
- **Attribute skip**: `onAttributeChangedCallback()` skips processing during initial upgrade when the element is prerendered, since server-rendered attribute values are already correct.
- **Binding skip**: `HTMLBindingDirective.bind()` skips `updateTarget` for `attribute` and `booleanAttribute` aspect types when the controller is prerendered.

Directives can check `controller.isPrerendered` (via the `ViewController` interface) during `bind()` to skip redundant work on already-correct server-rendered content.