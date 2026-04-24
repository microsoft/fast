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
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration();
```

Remove any `import "@microsoft/fast-element/install-hydration.js"` side-effect
imports as part of the migration. The older
`install-hydratable-view-templates.js` helper remains available for advanced
use cases, but `@microsoft/fast-element/declarative.js` now installs hydration
support lazily when declarative APIs create a template.

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
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

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
APIs from the dedicated FAST Element entrypoints instead:

```ts
// Before
import { TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

// After
import { TemplateElement } from "@microsoft/fast-element/declarative.js";
import { deepMerge } from "@microsoft/fast-element/declarative/utilities.js";
```

Keep importing core FAST Element APIs from `@microsoft/fast-element`. The
dedicated declarative entrypoint owns the declarative runtime and installs
hydration support lazily when declarative templates are created.

### `debug.js` requires explicit enablement

`@microsoft/fast-element/debug.js` no longer configures FAST just by being
imported. Call `enableDebug()` explicitly instead:

```ts
// Before
import "@microsoft/fast-element/debug.js";

// After
import { enableDebug } from "@microsoft/fast-element/debug.js";

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

The `isPrerendered` parameter that was briefly added to `ViewTemplate.render()` has been removed. The prerendered path is handled entirely by `ElementController.renderPrerendered()`.

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
| `ElementController.configHydration()` | `fast-element` | Registers hydration lifecycle callbacks |
| `HydrationTracker` | `fast-element` | Standalone hydration lifecycle tracker class |
| `ElementHydrationCallbacks` | `fast-element` | Type for hydration lifecycle callbacks |
| `ViewController.isPrerendered` | `fast-element` | `Promise<boolean>` — DSD detection for custom directives |
| `ViewController.isHydrated` | `fast-element` | `Promise<boolean>` — hydration status for custom directives |
