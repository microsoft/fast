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

FAST Element 3.x targets client-side browser `Window` runtimes. Do not import or
run the FAST Element client runtime in workers, server-side JavaScript runtimes,
or other non-window hosts. Server rendering tools may emit HTML, but hydration
and client rendering run in the browser window where DOM, Custom Elements,
Shadow DOM, and `requestAnimationFrame` are available.

## Breaking Changes

### Browser `Window` runtime and native globals required

FAST Element v3 no longer installs a `globalThis` polyfill and no longer
installs or depends on a `requestIdleCallback` / `cancelIdleCallback` fallback.
Load a `globalThis` polyfill before importing FAST only if you still support an
older browser that lacks it. Do not run the FAST Element client runtime in
workers or server-side JavaScript hosts.

See the [package migration guide](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md)
for the complete native globals and scheduler migration steps.

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
`install-hydratable-view-templates.js` side-effect helper should also be
removed; `enableHydration()` installs hydratable template support.
`@microsoft/fast-element` no longer installs hydration automatically.

### `needs-hydration` and `defer-hydration` markup no longer required

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

### `HydrationControllerCallbacks` replaced by hydration promises

2.x Example:
```ts
import { HydratableElementController } from "@microsoft/fast-element";

HydratableElementController.config({
    /* hydration callbacks */
});
```

3.x Example:
```ts
import { enableHydration } from "@microsoft/fast-element/hydration.js";

const hydration = enableHydration();
await hydration.whenHydrated();
```

Use `enableHydration().whenHydrated("my-element")` when application code needs to
wait for hydration work associated with a specific tag name. Use
`enableHydration().whenHydrated()` for the active global hydration batch. When
`stopHydration: StopHydration.never` is configured, the global promise
intentionally remains pending because hydration never reaches a global
completion point.

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
APIs from FAST Element path exports instead:

```ts
// Before
import { TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

// After
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { deepMerge } from "@microsoft/fast-element/declarative-utilities.js";
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
| `enableHydration`, `deferHydrationAttribute`, `HydrationTracker`, hydration types | `@microsoft/fast-element/hydration.js` |
| `fastElementRegistry` | `@microsoft/fast-element/registry.js` |
| `ArrayObserver` | `@microsoft/fast-element` |
| `volatile` | `@microsoft/fast-element` |
| `children` | `@microsoft/fast-element` |
| `elements`, `NodeObservationDirective` | `@microsoft/fast-element` |
| `ref` | `@microsoft/fast-element` |
| `slotted` | `@microsoft/fast-element` |
| `when` | `@microsoft/fast-element` |
| `repeat` | `@microsoft/fast-element` |

### `FASTElementDefinition.isRegistered` removed

The static `FASTElementDefinition.isRegistered` map is no longer public. Import
`fastElementRegistry` from `@microsoft/fast-element/registry.js` instead:

```ts
import { fastElementRegistry } from "@microsoft/fast-element/registry.js";

const definition = await fastElementRegistry.whenRegistered("my-element");
```

Use `fastElementRegistry.getByType(type)` or
`fastElementRegistry.getForInstance(instance)` when you already have a
constructor or element instance.

Hydration is opt-in via `enableHydration()` from `@microsoft/fast-element/hydration.js`.

### Optional helper imports moved to flat path exports

FAST Element v3 adds focused flat path exports for optional helpers and removes
older nested helper paths.

| Before | After |
|---|---|
| `@microsoft/fast-element/binding/two-way.js` | `@microsoft/fast-element/two-way.js` |
| `@microsoft/fast-element/binding/signal.js` | `@microsoft/fast-element/signal.js` |
| Deep directive imports | `@microsoft/fast-element/children.js`, `@microsoft/fast-element/repeat.js`, `@microsoft/fast-element/when.js`, `@microsoft/fast-element/ref.js`, `@microsoft/fast-element/slotted.js`, or `@microsoft/fast-element/node-observation.js` |
| Declarative map helpers | `@microsoft/fast-element/attribute-map.js` and `@microsoft/fast-element/observer-map.js` |

Remove imports from deleted package exports such as
`@microsoft/fast-element/metadata.js`, `@microsoft/fast-element/testing.js`, and
`@microsoft/fast-element/pending-task.js`. Replace hydration side-effect imports
with `enableHydration()` from `@microsoft/fast-element/hydration.js`.

See the [Path Exports](./advanced/path-exports.md) reference and the
[package migration guide](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md)
for the full import migration table.

### `attribute-name-strategy` now defaults to `camelCase`

Declarative attribute mapping now defaults to `"camelCase"` instead of
`"none"`. With the default strategy, `{{firstName}}` maps to the `firstName`
property and the `first-name` HTML attribute. If you relied on v2 literal
attribute names, configure both the client and server to use `"none"`:

```ts
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";

MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap({ "attribute-name-strategy": "none" })],
);
```

```bash
fast build --attribute-name-strategy=none
```

### Declarative `TemplateElement` API removed

The `<f-template>` implementation is now internal and is defined automatically
when an element uses `template: declarativeTemplate()`.

| Removed | Replacement |
|---|---|
| `TemplateElement` public export | `declarativeTemplate()` |
| `TemplateElement.define({ name: "f-template" })` | No manual definition needed |
| `TemplateElement.config(callbacks)` | `enableHydration().whenHydrated(tagName)` for tag-specific hydration waits and `enableHydration().whenHydrated()` for the active hydration batch |
| `TemplateElement.options(...)` | `attributeMap()` and `observerMap()` define extensions |
| `AttributeMap` / `ObserverMap` class exports from the old declarative public surface | `attributeMap()` / `observerMap()` helpers and config types |

Import `declarativeTemplate()` and schema-driven map extensions from their
focused path exports:

```ts
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

const hydration = enableHydration();

await MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap(), observerMap()],
);

await hydration.whenHydrated("my-element");
await hydration.whenHydrated();
```

`FASTElementDefinition.schema` is optional. Declarative templates assign it
automatically during template resolution. Non-declarative users can provide a
manual schema on the definition, or pass one directly to `observerMap({ schema
})`.

```ts
import { Schema } from "@microsoft/fast-element";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

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

### `FASTElement.compose()` removed

`FASTElement.compose()` and subclass `compose()` calls have been removed from
the public authoring API. If the code immediately registers the element, call
`define()` on the subclass instead:

```ts
// Before
MyElement.compose({
    name: "my-element",
    template,
    styles,
}).define();

// After
await MyElement.define({
    name: "my-element",
    template,
    styles,
});
```

### `defineAsync()` and `composeAsync()` removed

`FASTElement.defineAsync()` and `FASTElementDefinition.composeAsync()` have been
removed. Use subclass `define()` instead; it now returns a `Promise` that
resolves immediately for concrete templates and resolves after
`declarativeTemplate()` receives matching `<f-template>` markup.

See the [package migration guide](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md)
for complete `define()`, `compose()`, and `register()` API mappings.

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

### `TemplateOptions` removed

`TemplateOptions`, `PartialFASTElementDefinition.templateOptions`, and
`FASTElementDefinition.templateOptions` have been removed. Remove
`templateOptions` from element definitions and use
`template: declarativeTemplate()` when declarative markup should supply the
template.

See the [package migration guide](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md)
for details on delayed template assignment behavior.

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

### `FAST.versions` and `fast-kernel` modes removed

`FAST.versions` has been removed and multiple FAST versions on the same page are
unsupported in v3. Remove runtime checks that read `FAST.versions` and fix
duplicate FAST installs in your bundler or dependency graph instead.

The `fast-kernel="share"`, `fast-kernel="share-v2"`, and
`fast-kernel="isolate"` script attributes no longer affect FAST initialization.
Remove them during migration.

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
import { css, ElementStyles } from "@microsoft/fast-element";
```

### Dynamic stylesheet behaviors removed

`ElementStyles.withBehaviors()`, `ElementStyles.behaviors`, CSS bindings inside
`css`, and behavior-producing CSS directives have been removed. Keep
`ElementStyles` static, move runtime conditions into the element or controller
lifecycle, and call `this.$fastController.addStyles()` /
`this.$fastController.removeStyles()` as conditions change.

See the [package migration guide](https://github.com/microsoft/fast/blob/releases/fast-element-v3/packages/fast-element/MIGRATION.md)
for detailed dynamic stylesheet migration steps.

### `ArrayObserver` moved to `@microsoft/fast-element`

`ArrayObserver` is imported from `@microsoft/fast-element`. Other array helpers such as `Splice`, `SpliceStrategy`, `SpliceStrategySupport`, `lengthOf`, `sortedCount`, and `Sort` remain available from `@microsoft/fast-element`.

Update imports to:
```ts
import { ArrayObserver } from "@microsoft/fast-element";
```

### `deferHydrationAttribute` moved to `@microsoft/fast-element/hydration.js`

`deferHydrationAttribute` is no longer exported by the root package. Most apps
can remove `defer-hydration` from server-rendered markup; if you still need the
legacy attribute string, import it from the hydration path export.

In 2.x, `deferHydrationAttribute` was exported by the root package.

2.x Example:
```ts
const attribute = "defer-hydration";
```

3.x Example:
```ts
import { deferHydrationAttribute } from "@microsoft/fast-element/hydration.js";
```

### `requestIdleCallback` / `cancelIdleCallback` polyfill removed

FAST Element v3 no longer installs or depends on a `requestIdleCallback` /
`cancelIdleCallback` fallback. You do not need to polyfill those APIs for FAST
Element itself. The async `Updates` queue schedules DOM work with
`requestAnimationFrame`, so provide a `requestAnimationFrame` polyfill before
importing FAST Element when running in a non-browser environment that lacks it.

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

### `booleanConverter` aligned with native HTML boolean attribute semantics

`@attr({ mode: "boolean" })` and `booleanConverter` now match how the platform treats native boolean attributes (e.g., `disabled`, `required`):

- **Attribute → property** is presence-based: `setAttribute(name, anyString)` (including the empty string) sets the property to `true`; only `removeAttribute(name)` makes it `false`.
- **Property → attribute** uses `Boolean()` coercion: any JavaScript truthy value adds the attribute (with value `""`); any falsy value removes it.

The headline difference is that `setAttribute(name, "false")` now resolves to property `true`, matching `<input disabled="false">` still being disabled.

2.x Behavior:
```html
<my-element my-bool="false"></my-element>
```
```ts
element.myBool === false;
```

3.x Behavior:
```html
<my-element my-bool="false"></my-element>
```
```ts
element.myBool === true;
```

`booleanConverter` shape:

```ts
toView(value: any) {
    return value ? "" : null;
}

fromView(value: any) {
    return !!value;
}
```

`booleanConverter` 2.x → 3.x result differences:

| Call | 2.x | 3.x |
|---|---|---|
| `fromView("false")` | `false` | `true` |
| `fromView("")` | `true` | `false` |
| `fromView(NaN)` | `true` | `false` |
| `toView(true)` (or any truthy) | `"true"` | `""` |
| `toView(false)` (or any falsy) | `"false"` | `null` |

For `mode: "boolean"`, FAST writes attributes via `DOM.setBooleanAttribute` (presence-based) and reads them as `value !== null`, so the `mode: "boolean"` reflection path does **not** route through `booleanConverter.toView()` or `booleanConverter.fromView()`. The converter methods still apply to property assignment (`el.bool = X` runs `fromView(X)`), explicit calls (`booleanConverter.fromView(x)`), and `booleanConverter` paired with `mode: "reflect"` (which calls `toView`).

**Migration:**

- Audit `boolean`-mode attributes for the literal string `"false"` in templates or SSR HTML — the resulting property will be `true`, not `false`. To express the falsy state, omit the attribute entirely (or call `element.removeAttribute("my-bool")`). Assigning `element.myBool = false` continues to remove the reflected attribute as before.
- Audit code that calls `booleanConverter.toView()` directly or pairs `booleanConverter` with `mode: "reflect"`. The output strings are no longer `"true"` / `"false"`.
- If you need a tri-state attribute that preserves an explicit `"false"` string value, use `nullableBooleanConverter` with `mode: "reflect"` instead of `mode: "boolean"`.

## New Exports

| Export | Package | Description |
|---|---|---|
| `ElementController.isPrerendered` | `fast-element` | `Promise<boolean>` — resolves `true` when element had DSD at connect time |
| `ElementController.isHydrated` | `fast-element` | `Promise<boolean>` — resolves `true` only when hydration ran successfully |
| `enableHydration()` | `fast-element/hydration.js` | Enables hydration support for FAST elements |
| `deferHydrationAttribute` | `fast-element/hydration.js` | Legacy `defer-hydration` attribute string for compatibility code |
| `HydrationTracker` | `fast-element/hydration.js` | Standalone hydration lifecycle tracker class |
| `HydrationOptions` | `fast-element/hydration.js` | Type for hydration configuration options |
| `ViewController.isPrerendered` | `fast-element/templating.js` | `Promise<boolean>` — DSD detection for custom directives |
| `ViewController.isHydrated` | `fast-element/templating.js` | `Promise<boolean>` — hydration status for custom directives |
