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

3.x: No replacement needed — prerendered content detection is automatic.

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

### `HydrationControllerCallbacks` replaced by `ElementHydrationCallbacks`

2.x Example:
```ts
import { HydratableElementController } from "@microsoft/fast-element";

HydratableElementController.config({
    hydrationComplete() { /* ... */ }
});
```

3.x Example:
```ts
import { ElementController } from "@microsoft/fast-element";

ElementController.configHydration({
    hydrationStarted() { /* ... */ },
    elementWillHydrate(source: HTMLElement) { /* ... */ },
    elementDidHydrate(source: HTMLElement) { /* ... */ },
    hydrationComplete() { /* ... */ }
});
```

Note: `elementWillHydrate` and `elementDidHydrate` now receive the `HTMLElement` instance instead of a string name.

### `isPrerendered` is a `Promise<boolean>`

The `isPrerendered` property on `ElementController` and `ViewController` is a `Promise<boolean>` that resolves after hydration completes (or immediately with `false` for client-side rendered components).

```ts
connectedCallback() {
    super.connectedCallback();
    this.$fastController.isPrerendered.then(prerendered => {
        if (!prerendered) {
            this.fetchData();
        }
    });
}
```

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
    templateOptions: "defer-and-hydrate",
});
```

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
| `<!-- fe-b$$start$$0$$scopeId$$fe-b -->` | `<!--fe:b-->` |
| `<!-- fe-b$$end$$0$$scopeId$$fe-b -->` | `<!--fe:/b-->` |
| `<!-- fe-repeat$$start$$0$$fe-repeat -->` | `<!--fe:r-->` |
| `data-fe-b="0 1 2"` / `data-fe-b-0` / `data-fe-c-0-3` | `data-fe="N"` |

The `HydrationMarkup` API methods have been renamed (e.g., `parseAttributeBinding` → `parseAttributeBindingCount`) and no longer accept index/scope parameters. See the [package MIGRATION.md](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md#hydration-marker-format-v3) for the complete API mapping.

## New Exports

| Export | Package | Description |
|---|---|---|
| `ElementController.isPrerendered` | `fast-element` | `Promise<boolean>` — resolves after hydration |
| `ElementController.configHydration()` | `fast-element` | Registers hydration lifecycle callbacks |
| `HydrationTracker` | `fast-element` | Standalone hydration lifecycle tracker class |
| `ElementHydrationCallbacks` | `fast-element` | Type for hydration lifecycle callbacks |
| `ViewController.isPrerendered` | `fast-element` | `Promise<boolean>` — available to custom directives |