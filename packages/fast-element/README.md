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

FAST Element v3 assumes a modern runtime with native `globalThis`. The `FAST`
object is now a module-scoped export (not on `globalThis`). If you need to
support an environment without `globalThis`, load that polyfill before
importing `@microsoft/fast-element`.

## Debug entrypoint

`@microsoft/fast-element/debug.js` exports `enableDebug()` instead of
configuring FAST at import time. The development root export and debug rollup
bundle still enable debug behavior automatically.

```ts
import { enableDebug } from "@microsoft/fast-element/debug.js";

enableDebug();
```

## Export Sizes

Bundle sizes for each tree-shakeable export are tracked in [`SIZES.md`](./SIZES.md) and regenerated on every build. See the [Export Sizes](https://www.fast.design/docs/3.x/resources/export-sizes/) documentation page for the latest numbers.

## Dynamic Style Application

Style APIs (`css`, `ElementStyles`, `CSSDirective`, `cssDirective`,
`ComposableStyles`, `HostBehavior`, `HostController`, `StyleStrategy`,
`StyleTarget`) are imported from `@microsoft/fast-element/styles.js`:

```ts
import { css, ElementStyles } from "@microsoft/fast-element/styles.js";
```

When runtime state or external signals need to add or remove styles, create the
`ElementStyles` with `css` and toggle it through
`this.$fastController.addStyles()` / `this.$fastController.removeStyles()` from
the element lifecycle or change handlers.

`css` templates remain static style definitions. Runtime CSS bindings and
behavior-producing CSS directives are no longer supported; keep the condition on
the element and toggle a separate `ElementStyles` instance through the
controller when styles need to change.

## Declarative HTML

FAST Element also publishes a declarative HTML runtime from
`@microsoft/fast-element/declarative.js`. This entrypoint exports the
functional APIs for declarative templates: `declarativeTemplate()`,
`attributeMap()`, `observerMap()`, `TemplateParser`, `Schema`,
`schemaRegistry`, and related configuration types. Existing declarative imports
remain supported.

The schema-driven map extensions are also available from their own subpaths:
`@microsoft/fast-element/extensions/attribute-map.js` and
`@microsoft/fast-element/extensions/observer-map.js`. Prefer these subpaths when
you only need the maps, when you are not using declarative templates, or when
you want the smallest tree-shaken extension import. The declarative runtime is
pure at import time; declarative APIs lazily install only declarative debug
messages. Hydration is separate and remains opt-in through `enableHydration()`
from `@microsoft/fast-element/hydration.js`.

```ts
import { FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

class MyElement extends FASTElement {}

MyElement.define({
    name: "my-element",
    template: declarativeTemplate(),
});
```

`declarativeTemplate()` automatically defines FAST's internal native
`<f-template>` publisher in the relevant registry, resolves the matching
`<f-template name="my-element">`, and keeps the definition template concrete
before `define()` resolves. Consumers should not import or define the
`<f-template>` implementation directly.

Declarative schema behavior is enabled with define extensions:

```ts
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap(), observerMap()],
);
```

`attributeMap()` creates `@attr`-style accessors for leaf bindings, and
`observerMap()` creates deep observable accessors for discovered root
properties. Declarative templates assign `definition.schema` during template
resolution so these extensions always have schema data when used with
`declarativeTemplate()`. For non-declarative/manual schema use, pass a `Schema`
on the element definition; `observerMap()` can also receive
`observerMap({ schema })` directly. When both extensions are present, attribute
mapping runs before observer mapping.

Declarative utilities such as `deepMerge` are available from
`@microsoft/fast-element/declarative/utilities.js`. See
[`DECLARATIVE_HTML.md`](./DECLARATIVE_HTML.md) for declarative implementation
details and the
[Declarative HTML docs](https://fast.design/docs/3.x/declarative-templates/overview/)
for guides on writing f-templates, defining declarative elements, and
server-side rendering. Declarative event bindings use `$e` for the DOM event
object and `$c` for the execution context.

## Prerendered Content Optimization

Hydration of prerendered content is **opt-in**. Call `enableHydration()` from `@microsoft/fast-element/hydration.js` before any FAST elements connect to activate the hydration path:

```typescript
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration({
    hydrationComplete() {
        console.log("hydration complete");
    },
});
```

When hydration is enabled and a FAST element connects with an existing shadow root (from server-side rendering or declarative shadow DOM), `ElementController` detects this and hydrates instead of re-rendering. Two properties on the controller let you inspect the result:

- **`isPrerendered: Promise<boolean>`** — resolves `true` when the element had a declarative shadow root (DSD) at connect time, regardless of whether hydration ran.
- **`isHydrated: Promise<boolean>`** — resolves `true` only when hydration actually ran successfully.

This enables several optimizations:

- **Hydration instead of re-render**: The template uses `hydrate()` to map existing DOM nodes to binding targets rather than cloning new DOM.
- **Declarative template resolution**: `declarativeTemplate()` waits for the
  matching `<f-template>` before `define()` completes, so connected elements
  hydrate with a concrete template.
- **Attribute skip**: `onAttributeChangedCallback()` skips processing during initial upgrade when the element is prerendered, since server-rendered attribute values are already correct.
- **Binding skip**: `HTMLBindingDirective.bind()` skips `updateTarget` for `attribute` and `booleanAttribute` aspect types when the view is prerendered.

Per-element lifecycle callbacks can be passed directly to `declarativeTemplate()`:

```typescript
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

MyComponent.define({
    name: "my-component",
    template: declarativeTemplate({
        elementWillHydrate(source) {
            console.log(`${source.localName} will hydrate`);
        },
        elementDidHydrate(source) {
            console.log(`${source.localName} hydrated`);
        },
    }),
});
```

Component authors can await both promises to distinguish prerendered content from successful hydration:

```typescript
const controller = this.$fastController;
const prerendered = await controller.isPrerendered;
const hydrated = await controller.isHydrated;

if (prerendered && !hydrated) {
    // Had DSD but hydration wasn't enabled — client-side rendered
}
```

Custom directives can also await `controller.isPrerendered` and `controller.isHydrated` (both `Promise<boolean>` on the `ViewController` interface) to determine how the view's content was rendered.

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
