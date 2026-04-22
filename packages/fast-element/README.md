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

## Browser Requirements

FAST Element v3 assumes a modern runtime with native `globalThis`. The package
still installs its `requestIdleCallback` / `cancelIdleCallback` fallback
internally, but it no longer patches `globalThis` for older engines. If you
need to support an environment without `globalThis`, load that polyfill before
importing `@microsoft/fast-element`.

## Export Sizes

Bundle sizes for each tree-shakeable export are tracked in [`SIZES.md`](./SIZES.md) and regenerated on every build. See the [Export Sizes](https://www.fast.design/docs/3.x/resources/export-sizes/) documentation page for the latest numbers.

## Prerendered Content Optimization

When a FAST element connects and already has an existing shadow root (from server-side rendering or declarative shadow DOM), `ElementController` automatically detects this. The `isPrerendered` property on the controller is a `Promise<boolean>` that resolves to `true` after prerendered content has been hydrated, or `false` when the component is client-side rendered. This enables several optimizations:

- **Hydration instead of re-render**: The template uses `hydrate()` to map existing DOM nodes to binding targets rather than cloning new DOM.
- **Template-pending guard**: When `templateOptions` is `"defer-and-hydrate"` and no template is available yet, `connect()` returns early and retriggers when the template arrives.
- **Attribute skip**: `onAttributeChangedCallback()` skips processing during initial upgrade when the element is prerendered, since server-rendered attribute values are already correct.
- **Binding skip**: `HTMLBindingDirective.bind()` skips `updateTarget` for `attribute` and `booleanAttribute` aspect types when the view is prerendered.

Component authors can await the promise to know when hydration is complete:

```typescript
this.$fastController.isPrerendered.then(prerendered => {
    if (!prerendered) {
        this.fetchData();
    }
});
```

Custom directives can also await `controller.isPrerendered` (a `Promise<boolean>` on the `ViewController` interface) to determine whether the view's content was prerendered.

## Define Extensions

`FASTElement.define()` accepts an optional second argument — an array of extension callbacks that are invoked with the resolved element definition before the element is registered with the platform. This enables a plugin pattern where reusable behaviors can hook into element registration.

```typescript
import { FASTElement } from "@microsoft/fast-element";
import type { FASTElementExtension } from "@microsoft/fast-element";

function logger(): FASTElementExtension {
    return definition => {
        console.log(`Defining element: ${definition.name}`);
    };
}

class MyComponent extends FASTElement {
    // component code
}

// Method style
MyComponent.define({ name: "my-component", template, styles }, [logger()]);

// Static style
FASTElement.define(MyComponent, { name: "my-component" }, [logger()]);
```

Each extension receives the full `FASTElementDefinition`, which includes the resolved element name, type, template, styles, and attribute metadata. Extensions run before `customElements.define()`, so any setup they perform is available when existing DOM elements are upgraded.
