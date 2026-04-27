---
id: migration-guide
title: Migration Guide
layout: 3x
eleventyNavigation:
  key: migration-guide3x
  title: Migration Guide
navigationOptions:
  activeKey: migration-guide3x
keywords:
  - migrate
  - migration
  - web components
---

# Migrating from 2.x to 3.x

## Breaking Changes

### `HydratableElementController` removed

The `HydratableElementController` class has been removed. Its functionality is now built into `ElementController` via automatic prerendered content detection. When a component connects with an existing shadow root (from SSR or declarative shadow DOM), the system automatically hydrates the existing DOM.

2.x Example:
```ts
import { HydratableElementController } from "@microsoft/fast-element";

HydratableElementController.install();
```

3.x: Hydration is now opt-in via `enableHydration()`:

```ts
import { enableHydration } from "@microsoft/fast-element";

enableHydration();
```

Remove any `import "@microsoft/fast-element/install-hydration.js"` side-effect
imports as part of the migration. The older
`install-hydratable-view-templates.js` helper remains available for advanced
use cases, but the preferred API is `enableHydration()`.
`@microsoft/fast-element` no longer installs hydration
automatically.

### `needsHydrationAttribute` and `deferHydrationAttribute` removed

These attributes are no longer needed in server-rendered markup.

2.x Markup:
```html
<my-component defer-hydration needs-hydration text="Hello">
    <template shadowrootmode="open">...</template>
</my-component>
```

3.x Markup:
```html
<my-component text="Hello">
    <template shadowrootmode="open">...</template>
</my-component>
```

### `HydrationControllerCallbacks` replaced by `enableHydration` + `declarativeTemplate` callbacks

2.x Example:
```ts
import { HydratableElementController } from "@microsoft/fast-element";

HydratableElementController.config({
    hydrationComplete() { /* ... */ }
});
```

3.x Example:
```ts
import { enableHydration } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element";

// Global hydration callbacks
enableHydration({
    hydrationStarted() { /* ... */ },
    hydrationComplete() { /* ... */ },
});

// Per-element hydration callbacks
MyComponent.define({
    name: "my-component",
    template: declarativeTemplate({
        elementWillHydrate(source: HTMLElement) { /* ... */ },
        elementDidHydrate(source: HTMLElement) { /* ... */ },
    }),
});
```

Note: `elementWillHydrate` and `elementDidHydrate` now receive the `HTMLElement` instance instead of a string name.

### `isPrerendered` and `isHydrated` split

The `isPrerendered` property on `ElementController` and `ViewController` now resolves `true` when the element had a declarative shadow root (DSD) at connect time, regardless of whether hydration ran. A new `isHydrated: Promise<boolean>` property resolves `true` only when hydration actually ran successfully.

```ts
connectedCallback() {
    super.connectedCallback();
    const ctrl = this.$fastController;
    const prerendered = await ctrl.isPrerendered;
    const hydrated = await ctrl.isHydrated;

    if (prerendered && !hydrated) {
        // Had DSD but hydration wasn't enabled
    }
}
```

### Declarative HTML imports moved

The `@microsoft/fast-html` package has been removed. Import declarative HTML
APIs from the FAST Element root package instead:

```ts
// Before
import { TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

// After
import { declarativeTemplate } from "@microsoft/fast-element";
import { deepMerge } from "@microsoft/fast-element";
```

Import FAST Element APIs such as `FASTElement`, `FAST`, `ElementController`,
definition/controller types, and helper APIs from `@microsoft/fast-element`:

| API | Import path |
|---|---|
| `Updates` | `@microsoft/fast-element` |
| `Observable`, `observable` | `@microsoft/fast-element` |
| `attr`, `AttributeDefinition`, converters, `ValueConverter` | `@microsoft/fast-element` |
| `Binding`, `oneWay`, `oneTime`, `listener` | `@microsoft/fast-element` |
| `DOM`, `DOMAspect`, `DOMPolicy` | `@microsoft/fast-element` |
| `Schema`, `schemaRegistry`, schema types | `@microsoft/fast-element` |
| `css` | `@microsoft/fast-element` |
| `html`, `ViewTemplate`, `HTMLView` | `@microsoft/fast-element` |
| `Compiler`, `HTMLDirective`, `htmlDirective`, templating/view types | `@microsoft/fast-element` |
| `render`, `RenderBehavior`, `RenderDirective` | `@microsoft/fast-element` |
| `enableHydration`, `HydrationTracker`, hydration types | `@microsoft/fast-element` |
| `ArrayObserver` | `@microsoft/fast-element` |
| `volatile` | `@microsoft/fast-element` |
| `children` | `@microsoft/fast-element` |
| `elements`, `NodeObservationDirective` | `@microsoft/fast-element` |
| `ref` | `@microsoft/fast-element` |
| `slotted` | `@microsoft/fast-element` |
| `when` | `@microsoft/fast-element` |
| `repeat` | `@microsoft/fast-element` |

Hydration is opt-in via `enableHydration()` from `@microsoft/fast-element`.

### Declarative `TemplateElement` API removed

The `<f-template>` implementation is now internal and is defined automatically
when an element uses `template: declarativeTemplate()`.

| Removed | Replacement |
|---|---|
| `TemplateElement` public export | `declarativeTemplate()` |
| `TemplateElement.define({ name: "f-template" })` | No manual definition needed |
| `TemplateElement.config(callbacks)` | `declarativeTemplate(callbacks)` for per-element callbacks and `enableHydration(options)` for global hydration callbacks |
| `TemplateElement.options(...)` | `attributeMap()` and `observerMap()` define extensions |
| `AttributeMap` / `ObserverMap` class exports from the old declarative public surface | `attributeMap()` / `observerMap()` helpers and config types |

Import `declarativeTemplate()` and schema-driven map extensions from
`@microsoft/fast-element`:

```ts
import { attributeMap } from "@microsoft/fast-element";
import { observerMap } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element";
import { enableHydration } from "@microsoft/fast-element";

enableHydration();

MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap(), observerMap()],
);
```

`FASTElementDefinition.schema` is optional. Declarative templates assign it
automatically during template resolution. Non-declarative users can provide a
manual schema on the definition, or pass one directly to `observerMap({ schema
})`.

```ts
import { Schema } from "@microsoft/fast-element";
import { observerMap } from "@microsoft/fast-element";

const schema = new Schema("my-element");
MyElement.define({ name: "my-element" }, [observerMap({ schema })]);
```

### `debug.js` requires explicit enablement

`@microsoft/fast-element` no longer configures FAST just by being
imported. Call `enableDebug()` explicitly instead:

```ts
// Before
import "@microsoft/fast-element";

// After
import { enableDebug } from "@microsoft/fast-element";

enableDebug();
```

If you want debug behavior enabled automatically, keep using the root package
`development` export or the debug rollup bundle.

### `RenderableFASTElement` removed (`@microsoft/fast-html`)

The `RenderableFASTElement` mixin has been removed. Components extend `FASTElement` and call `define()` directly.

2.x Example:
```ts
import { RenderableFASTElement } from "@microsoft/fast-html";

RenderableFASTElement(MyComponent).defineAsync({
    name: "my-component",
    templateOptions: "defer-and-hydrate",
});
```

3.x Example:
```ts
MyComponent.define({
    name: "my-component",
});
```

### Bare `e` removed from declarative event handlers

Declarative event handlers now reserve only `$e` for the DOM event and `$c`
for the execution context. Bare `e` is no longer treated as the event object.

Before:
```html
<button @click="{handleClick(e)}"></button>
```

After:
```html
<button @click="{handleClick($e)}"></button>
```

If you used `TemplateParser.hasDeprecatedEventSyntax` in custom tooling, remove
that check as part of the migration.

### `prepare()` lifecycle hook removed (`@microsoft/fast-html`)

The `prepare()` hook is no longer available. Move initialization logic to `connectedCallback`:

2.x Example:
```ts
class MyComponent extends FASTElement {
    async prepare() {
        this.data = await fetchData();
    }
}
```

3.x Example:
```ts
class MyComponent extends FASTElement {
    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }
    async loadData() {
        this.data = await fetchData();
    }
}
```

### `ViewTemplate.render()` signature unchanged

The `isPrerendered` parameter that was briefly added to `ViewTemplate.render()` has been removed. The prerendered path is handled entirely by the pluggable hydration hook installed via `ElementController.installHydrationHook()`.

### `globalThis.FAST` removed

The `FAST` object is no longer attached to `globalThis`. It is now a module-scoped export from `@microsoft/fast-element`.

2.x Example:
```ts
globalThis.FAST.addMessages({ ... });
```

3.x Example:
```ts
import { FAST } from "@microsoft/fast-element";

FAST.addMessages({ ... });
```

### `FAST.getById()` removed

The `FAST.getById(id, initializer)` slot registry has been removed. Kernel services (update queue, observable system, etc.) are resolved through standard ES module imports.

### `FASTGlobal` type removed

The `FASTGlobal` interface type has been removed. Code that referenced this type should be updated to use the `FAST` export directly.

### `KernelServiceId` enum removed

The `KernelServiceId` enum (used with `FAST.getById()`) has been removed. Import kernel services directly from their respective modules.

### `css` moved to `@microsoft/fast-element`

`css`, `CSSTemplateTag`, and `CSSValue` are imported from `@microsoft/fast-element`. Other style APIs (`ElementStyles`, `CSSDirective`, `cssDirective`, `ComposableStyles`, `HostBehavior`, `HostController`, `StyleStrategy`, and `StyleTarget`) are imported from `@microsoft/fast-element`.

Update imports to:
```ts
import { css } from "@microsoft/fast-element";
import { ElementStyles } from "@microsoft/fast-element";
```

### `ArrayObserver` moved to `@microsoft/fast-element`

`ArrayObserver` is imported from `@microsoft/fast-element`. Other array helpers such as `Splice`, `SpliceStrategy`, `SpliceStrategySupport`, `lengthOf`, `sortedCount`, and `Sort` remain available from `@microsoft/fast-element`.

Update imports to:
```ts
import { ArrayObserver } from "@microsoft/fast-element";
```

### `deferHydrationAttribute` moved to `@microsoft/fast-element`

`deferHydrationAttribute` is available from the root package export.

2.x imported `deferHydrationAttribute` from the root package.

2.x Example:
```ts
const attribute = "defer-hydration";
```

3.x Example:
```ts
import { deferHydrationAttribute } from "@microsoft/fast-element";
```

### `requestIdleCallback` polyfill removed

The built-in `requestIdleCallback` / `cancelIdleCallback` polyfill has been removed. If your application targets environments without these APIs, provide your own polyfill.

### Hydration marker format changed

The SSR hydration markers have been simplified from verbose, index-embedded comments to compact sequential markers. This is a breaking change to the SSR output format — SSR and client versions must match.

| Old format | New format |
|---|---|
| `fe-b$$start$$<index>$$<scopeId>$$fe-b` | `fe:b` |
| `fe-b$$end$$<index>$$<scopeId>$$fe-b` | `fe:/b` |
| `fe-repeat$$start$$<itemIndex>$$fe-repeat` | `fe:r` |
| `fe-repeat$$end$$<itemIndex>$$fe-repeat` | `fe:/r` |
| `fe-eb$$start$$<elementId>$$fe-eb` | `fe:e` |
| `fe-eb$$end$$<elementId>$$fe-eb` | `fe:/e` |
| `data-fe-b="0 1 2"` / `data-fe-b-0` / `data-fe-c-0-3` | `data-fe="N"` |

The `HydrationMarkup` API methods have been renamed (e.g., `parseAttributeBinding` → `parseAttributeBindingCount`) and no longer accept index/scope parameters. See the [package MIGRATION.md](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md#hydration-marker-format-v3) for the complete API mapping.

## New Exports

| Export | Package | Description |
|---|---|---|
| `ElementController.isPrerendered` | `fast-element` | `Promise<boolean>` — resolves `true` when element had DSD at connect time |
| `ElementController.isHydrated` | `fast-element` | `Promise<boolean>` — resolves `true` only when hydration ran successfully |
| `enableHydration()` | `fast-element/hydration.js` | Enables hydration support for FAST elements |
| `HydrationTracker` | `fast-element/hydration.js` | Standalone hydration lifecycle tracker class |
| `HydrationOptions` | `fast-element/hydration.js` | Type for hydration configuration options |
| `ViewController.isPrerendered` | `fast-element/templating.js` | `Promise<boolean>` — DSD detection for custom directives |
| `ViewController.isHydrated` | `fast-element/templating.js` | `Promise<boolean>` — hydration status for custom directives |
