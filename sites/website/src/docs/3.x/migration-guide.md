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

FAST Element 3.x focuses the client runtime on browser `Window` environments and
removes several APIs that previously supported alternate registration,
hydration, and declarative HTML flows. Start with this page for core
component-authoring changes, then follow the child page that matches the extra
functionality your application uses:

| Migration path | Use it when |
|---|---|
| Core FAST Element migration | You author components with `FASTElement`, `html`, `css`, `define()`, `compose()`, `@attr`, `FAST`, or `ElementStyles.withBehaviors()`. |
| [Hydration and SSR migration](/docs/3.x/migration-guide/hydration/) | You server-rendered FAST components, emitted FAST hydration markers, used `fast-ssr`, or installed FAST hydration helpers. |
| [Declarative HTML migration](/docs/3.x/migration-guide/declarative-html/) | You used the removed `@microsoft/fast-html` package, `<f-template>`, `RenderableFASTElement`, `TemplateElement`, or declarative map options. |

## Recommended upgrade order

1. Update your package versions so all FAST packages are on matching 3.x
   versions. Do not mix old SSR output or declarative runtime code with the 3.x
   client.
2. Update imports and remove deleted package exports.
3. Replace `compose()`, `defineAsync()`, and `composeAsync()` registration flows
   with subclass `define()`.
4. Move dynamic stylesheet behavior out of `css` and into the element or
   controller lifecycle.
5. If you server-render or hydrate FAST components, complete the
   [Hydration and SSR migration](/docs/3.x/migration-guide/hydration/).
6. If you use declarative HTML, complete the
   [Declarative HTML migration](/docs/3.x/migration-guide/declarative-html/).
7. Rebuild and manually verify the upgraded components in the browser.

## Runtime requirements

FAST Element 3.x targets client-side browser `Window` runtimes. Do not import or
run the FAST Element client runtime in workers, server-side JavaScript runtimes,
or other non-window hosts. Server rendering tools may emit HTML, but hydration
and client rendering run in the browser window where DOM, Custom Elements,
Shadow DOM, and `requestAnimationFrame` are available.

FAST Element v3 also no longer installs a `globalThis` polyfill and no longer
installs or depends on a `requestIdleCallback` / `cancelIdleCallback` fallback.
Load a `globalThis` polyfill before importing FAST only if you still support an
older browser that lacks it. You do not need to polyfill `requestIdleCallback`
or `cancelIdleCallback` for FAST Element itself.

See the
[package migration guide](https://github.com/microsoft/fast/blob/main/packages/fast-element/docs/migration/fast-element-3.md#native-globals-and-scheduler-requirements-v2--v3)
for the complete native globals and scheduler migration steps.

## Package and path exports

Root imports for core FAST Element authoring APIs remain supported. Focused path
exports are available for optional helpers, while deleted internals must be
removed.

| API | Import path |
|---|---|
| `FASTElement`, `FAST`, `ElementController`, definition/controller types | `@microsoft/fast-element` |
| `attr`, `AttributeDefinition`, converters, `ValueConverter` | `@microsoft/fast-element` |
| `observable`, `Observable`, `volatile`, `Updates` | `@microsoft/fast-element` |
| `html`, `css`, `ViewTemplate`, `HTMLView`, `ElementStyles` | `@microsoft/fast-element` |
| `Binding`, `oneWay`, `oneTime`, `listener` | `@microsoft/fast-element` |
| `DOM`, `DOMAspect`, `DOMPolicy` | `@microsoft/fast-element` |
| `Compiler`, `HTMLDirective`, `htmlDirective`, templating/view types | `@microsoft/fast-element` |
| `render`, `RenderBehavior`, `RenderDirective` | `@microsoft/fast-element` |
| `ArrayObserver` | `@microsoft/fast-element` |
| `children`, `elements`, `ref`, `repeat`, `slotted`, `when` | `@microsoft/fast-element` |
| `fastElementRegistry` | `@microsoft/fast-element/registry.js` |
| `twoWay` | `@microsoft/fast-element/two-way.js` |
| `signal` | `@microsoft/fast-element/signal.js` |

Remove imports from deleted package exports such as
`@microsoft/fast-element/metadata.js`, `@microsoft/fast-element/testing.js`,
and `@microsoft/fast-element/pending-task.js`. Replace hydration side-effect
imports with `enableHydration()` as described in the
[Hydration and SSR migration](/docs/3.x/migration-guide/hydration/).

See the [Path Exports](/docs/3.x/advanced/path-exports/) reference and the
[package migration guide](https://github.com/microsoft/fast/blob/main/packages/fast-element/docs/migration/fast-element-3.md#optional-helper-and-removed-path-exports-v2--v3)
for the full import migration table.

## Element registration

### `FASTElement.compose()` removed

`FASTElement.compose()` and subclass `compose()` calls have been removed from the
public authoring API. If your code immediately registered the element after
composing it, call `define()` on the subclass instead.

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
removed. Use subclass `define()` instead. It now returns a `Promise` that
resolves immediately for concrete templates and resolves after
`declarativeTemplate()` receives matching `<f-template>` markup.

```ts
// Before
MyElement.defineAsync({
    name: "my-element",
    template,
    styles,
});

// After
await MyElement.define({
    name: "my-element",
    template,
    styles,
});
```

Replace `FASTElementDefinition.compose()` calls that chain `.define()` the same
way:

```ts
// Before
FASTElementDefinition.compose(MyElement, options).define();

// After
await MyElement.define(options);
```

If old code used `registerAsync()` only to wait for a custom element tag name to
become available, replace that wait with `fastElementRegistry.whenRegistered()`.
Use subclass `define()` when the code owns the element definition.

See the
[package migration guide](https://github.com/microsoft/fast/blob/main/packages/fast-element/docs/migration/fast-element-3.md#async-definecomposeregister-api-v3)
for complete `define()`, `compose()`, and `register()` API mappings.

## Registry lookups

The static `FASTElementDefinition.isRegistered` map is no longer public. Import
`fastElementRegistry` from `@microsoft/fast-element/registry.js` instead.

```ts
import { fastElementRegistry } from "@microsoft/fast-element/registry.js";

const definition = await fastElementRegistry.whenRegistered("my-element");
```

Use `fastElementRegistry.getByType(type)` or
`fastElementRegistry.getForInstance(instance)` when you already have a
constructor or element instance.

## FAST global changes

### `globalThis.FAST` removed

The `FAST` object is no longer attached to `globalThis`. It is now a
module-scoped export from `@microsoft/fast-element`.

```ts
// Before
globalThis.FAST.addMessages({ ... });

// After
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

### `FAST.getById()` and kernel service IDs removed

The `FAST.getById(id, initializer)` slot registry has been removed. Kernel
services such as the update queue and observable system are resolved through
standard ES module imports. Remove `FASTGlobal` and `KernelServiceId` type usage
and import the service APIs directly.

## Debug entrypoint

`@microsoft/fast-element/debug.js` no longer configures FAST just by being
imported. Call `enableDebug()` explicitly instead.

```ts
// Before
import "@microsoft/fast-element/debug.js";

// After
import { enableDebug } from "@microsoft/fast-element/debug.js";

enableDebug();
```

If you want debug behavior enabled automatically, keep using the root package
`development` export or the debug rollup bundle.

## CSS and styles

### `css` moved to `@microsoft/fast-element`

`css`, `CSSTemplateTag`, and `CSSValue` are imported from
`@microsoft/fast-element`. Other style APIs such as `ElementStyles`,
`CSSDirective`, `cssDirective`, `ComposableStyles`, `HostBehavior`,
`HostController`, `StyleStrategy`, and `StyleTarget` are also available from the
root package export.

```ts
import { css, ElementStyles } from "@microsoft/fast-element";
```

### Dynamic stylesheet behaviors removed

`ElementStyles.withBehaviors()`, `ElementStyles.behaviors`, CSS bindings inside
`css`, and behavior-producing CSS directives have been removed. `ElementStyles`
is now a static style container. Move runtime conditions into the element or
controller lifecycle, then add and remove styles as conditions change.

```ts
import { css, FASTElement } from "@microsoft/fast-element";

const compactStyles = css`
    :host {
        gap: 4px;
    }
`;

class MyElement extends FASTElement {
    #media = globalThis.matchMedia("(max-width: 600px)");

    connectedCallback() {
        super.connectedCallback();
        this.#media.addEventListener("change", this.#syncCompactStyles);
        this.#syncCompactStyles();
    }

    disconnectedCallback() {
        this.#media.removeEventListener("change", this.#syncCompactStyles);
        this.$fastController.removeStyles(compactStyles);
        super.disconnectedCallback();
    }

    #syncCompactStyles = () => {
        if (this.#media.matches) {
            this.$fastController.addStyles(compactStyles);
        } else {
            this.$fastController.removeStyles(compactStyles);
        }
    };
}
```

If you previously interpolated bindings or behavior-producing directives into
`css`, replace them with element state and standard DOM, class, attribute,
inline-style, or controller updates.

See the
[package migration guide](https://github.com/microsoft/fast/blob/main/packages/fast-element/docs/migration/fast-element-3.md#dynamic-stylesheet-behaviors-v3)
for detailed dynamic stylesheet migration steps.

## Attribute and converter behavior

### `booleanConverter` now matches native HTML boolean attributes

`@attr({ mode: "boolean" })` and `booleanConverter` now match how the platform
treats native boolean attributes such as `disabled` and `required`:

- Attribute to property is presence-based: `setAttribute(name, anyString)`
  sets the property to `true`; only `removeAttribute(name)` makes it `false`.
- Property to attribute uses `Boolean()` coercion: any JavaScript truthy value
  adds the attribute with value `""`; any falsy value removes it.

The main v2 to v3 difference is that `setAttribute(name, "false")` now resolves
to property `true`.

```html
<my-element my-bool="false"></my-element>
```

```ts
// 2.x
element.myBool === false;

// 3.x
element.myBool === true;
```

`booleanConverter` 2.x to 3.x result differences:

| Call | 2.x | 3.x |
|---|---|---|
| `fromView("false")` | `false` | `true` |
| `fromView("")` | `true` | `false` |
| `fromView(NaN)` | `true` | `false` |
| `toView(true)` or any truthy value | `"true"` | `""` |
| `toView(false)` or any falsy value | `"false"` | `null` |

For `mode: "boolean"`, FAST writes attributes through presence-based boolean
attribute logic and reads them as `value !== null`. The converter methods still
apply to property assignment, explicit converter calls, and `booleanConverter`
paired with `mode: "reflect"`.

Migration steps:

1. Audit boolean-mode attributes for the literal string `"false"` in templates
   or SSR HTML. Omit the attribute to express the falsy state.
2. Audit code that calls `booleanConverter.toView()` directly or pairs
   `booleanConverter` with `mode: "reflect"`.
3. If you need a tri-state attribute that preserves an explicit `"false"` string
   value, use `nullableBooleanConverter` with `mode: "reflect"` instead of
   `mode: "boolean"`.

## Core exports added in 3.x

| Export | Package | Description |
|---|---|---|
| `ElementController.isPrerendered` | `@microsoft/fast-element` | `Promise<boolean>` that resolves `true` when an element had Declarative Shadow DOM at connect time. |
| `ElementController.isHydrated` | `@microsoft/fast-element` | `Promise<boolean>` that resolves `true` only when hydration ran successfully. |
| `ViewController.isPrerendered` | `@microsoft/fast-element` | `Promise<boolean>` for custom directives that need prerender detection. |
| `ViewController.isHydrated` | `@microsoft/fast-element` | `Promise<boolean>` for custom directives that need hydration status. |
| `fastElementRegistry` | `@microsoft/fast-element/registry.js` | Public registry lookup helper for registered FAST element definitions. |

Hydration-specific exports are covered in the
[Hydration and SSR migration](/docs/3.x/migration-guide/hydration/), and
declarative HTML exports are covered in the
[Declarative HTML migration](/docs/3.x/migration-guide/declarative-html/).
