# Migrating from previous versions

## FASTGlobal version tracking (v2 → v3)

### Removed API

| Removed | Replacement |
|---|---|
| `FAST.versions` | No replacement. Multiple FAST versions on the same page are unsupported in v3. |

### Removed configuration

| Removed | Replacement |
|---|---|
| `fast-kernel="share"` / `fast-kernel="share-v2"` / `fast-kernel="isolate"` | No replacement. FAST now uses a single shared kernel contract, and multiple FAST versions on the same page are unsupported. |

### Migration steps

1. Remove any runtime checks that read `FAST.versions`.
2. Fix duplicate FAST installs in your bundler or dependency graph instead of relying on version tracking at runtime.
3. Remove any `fast-kernel` script attributes. They no longer affect FAST initialization.

## Native globals and scheduler requirements (v2 → v3)

### Changed behavior

- **Browser `Window` runtime required**: `@microsoft/fast-element` is a
  client-side browser runtime. It expects browser DOM, Custom Elements, Shadow
  DOM, and scheduling APIs such as `requestAnimationFrame`.
- **Native `globalThis` required**: `@microsoft/fast-element` no longer installs
  a `globalThis` polyfill as a side effect.
- **No idle-callback polyfill**: FAST Element v3 no longer installs or depends
  on a `requestIdleCallback` / `cancelIdleCallback` fallback. The async
  `Updates` queue schedules work with `globalThis.requestAnimationFrame`.

### Migration steps

1. Verify that the browsers you support provide native `globalThis` and
   `requestAnimationFrame`.
2. If you still target an older browser without `globalThis`, load that polyfill
   before importing `@microsoft/fast-element`.
3. Do not import or run the FAST Element client runtime in workers,
   server-side JavaScript runtimes, or other non-window hosts. SSR tools may
   emit HTML, but hydration and client rendering run in the browser `Window`.
4. You do not need to polyfill `requestIdleCallback` or `cancelIdleCallback`
   for FAST Element itself. Only provide them if your application or another
   dependency calls those APIs directly.

## Declarative HTML moved into fast-element (v3)

Declarative HTML APIs now ship from focused `@microsoft/fast-element` package
path exports instead of the removed `@microsoft/fast-html` package.

### Import changes

| Before | After |
|---|---|
| `@microsoft/fast-html` | `@microsoft/fast-element/declarative.js` |
| `@microsoft/fast-html/utilities.js` | `@microsoft/fast-element/declarative-utilities.js` |

Core FAST Element helpers are available from the root package export:

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
| `ArrayObserver` | `@microsoft/fast-element` |
| `volatile` | `@microsoft/fast-element` |
| `children` | `@microsoft/fast-element` |
| `elements`, `NodeObservationDirective` | `@microsoft/fast-element` |
| `ref` | `@microsoft/fast-element` |
| `slotted` | `@microsoft/fast-element` |
| `when` | `@microsoft/fast-element` |
| `repeat` | `@microsoft/fast-element` |

### Migration steps

1. Update declarative runtime imports to
   `@microsoft/fast-element/declarative.js`.
2. Update declarative utility imports such as `deepMerge` to
   `@microsoft/fast-element/declarative-utilities.js`.
3. Keep importing FAST Element APIs such as `FASTElement`, `FAST`,
   `ElementController`, definition/controller types, `attr`, `Schema`, and
   `observable` from `@microsoft/fast-element`.
4. Call `enableHydration()` from `@microsoft/fast-element/hydration.js` when
   prerendered content should be hydrated.

## `TemplateOptions` removal (v3)

### Removed APIs

| Removed | Replacement |
|---|---|
| `TemplateOptions` | No replacement |
| `PartialFASTElementDefinition.templateOptions` | No replacement |
| `FASTElementDefinition.templateOptions` | No replacement |

### Changed behavior

- Subclass `define()` calls no longer use `templateOptions` to delay platform
  definition or connection.
- Elements can still be defined before a template is attached; a later
  `FASTElementDefinition.template` update notifies connected elements so they
  can render or hydrate with the new template.

### Migration steps

1. Remove `templateOptions` from element definitions.
2. Continue calling `define({ name })` when a definition needs to exist before
   its template is attached.
3. If a template is supplied later, assign `FASTElementDefinition.template` (or
   use the declarative runtime that does so for you).


## Declarative TemplateElement API removal (v3)

### Removed APIs

| Removed | Replacement |
|---|---|
| `TemplateElement` public export | `declarativeTemplate()` on each FAST element definition |
| `TemplateElement.define({ name: "f-template" })` | No manual definition; `declarativeTemplate()` defines FAST's internal `<f-template>` publisher in the target registry |
| `TemplateElement.config(callbacks)` / `HydrationLifecycleCallbacks` | `MyElement.whenRegistered` for registration waits, `MyElement.whenHydrated` for component hydration waits, and `enableHydration().whenHydrated` for the active hydration batch |
| `TemplateElement.options(...)`, `ElementOptions`, `ElementOptionsDictionary` | Define extensions: `attributeMap(...)` and `observerMap(...)` passed as the second argument to `define()` |
| `AttributeMap` / `ObserverMap` exports from the old declarative public surface | `attributeMap()` / `observerMap()` extension helpers and their config types |

### Migration steps

1. Replace manual `<f-template>` registration with `template: declarativeTemplate()`:

   ```typescript
   // Before
   import { TemplateElement } from "@microsoft/fast-element";
   TemplateElement.define({ name: "f-template" });

   MyElement.define({ name: "my-element" });

   // After
   import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

   MyElement.define({
       name: "my-element",
       template: declarativeTemplate(),
   });
   ```

2. Replace `TemplateElement.options()` with definition extensions:

   ```typescript
   import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
   import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
   import { observerMap } from "@microsoft/fast-element/observer-map.js";

   MyElement.define(
       {
           name: "my-element",
           template: declarativeTemplate(),
       },
       [attributeMap(), observerMap()],
   );
   ```

   `attributeMap()` is imported from
   `@microsoft/fast-element/attribute-map.js` and `observerMap()` from
   `@microsoft/fast-element/observer-map.js` for declarative templates,
   manually supplied schemas, or both. `FASTElementDefinition.schema` is optional;
   `declarativeTemplate()` assigns it automatically, and `observerMap()` can
   take a manual schema with `observerMap({ schema })`.

3. Replace `TemplateElement.config()` with `MyElement.whenRegistered` for
   registration waits, `MyElement.whenHydrated` for component hydration waits,
   and `enableHydration().whenHydrated` for the active hydration batch.
   Hydration is not installed by `declarative.js`; call `enableHydration()`
   before elements connect when SSR content should hydrate.

## Debug entrypoint explicit enablement (v3)

### Import changes

| Before | After |
|---|---|
| `import "@microsoft/fast-element";` | `import { enableDebug } from "@microsoft/fast-element/debug.js"; enableDebug();` |

### Migration steps

1. Replace setup-only `debug.js` imports with an explicit `enableDebug()` call.
2. Keep using the root package `development` export or debug rollup bundle when
   you want debug behavior enabled automatically.

## Declarative event handler `e` removal (v3)

### Removed behavior

| Removed | Replacement |
|---|---|
| Bare `e` event arguments in declarative event handlers | `$e` |
| `TemplateParser.hasDeprecatedEventSyntax` | No replacement |

Only `$e` and `$c` are reserved event handler arguments in declarative
templates. Bare `e` now resolves like any other binding path on the current
data source.

### Migration steps

1. Replace declarative event bindings such as
   `@click="{handleClick(e)}"` with `@click="{handleClick($e)}"`.
2. Remove any `TemplateParser.hasDeprecatedEventSyntax` checks or warnings from
   custom tooling.

## Prerendered Content Optimization (v2 → v3)

### Removed and moved APIs

| 2.x API | 3.x guidance |
|---|---|
| `HydratableElementController` | `ElementController` (prerendered path built in) |
| `HydrationControllerCallbacks` | Call `enableHydration()` and await the returned controller's `whenHydrated` promise |
| `needsHydrationAttribute` | No replacement. Existing shadow root detection sets `ElementController.isPrerendered`. |
| Root `deferHydrationAttribute` export | Import `deferHydrationAttribute` from `@microsoft/fast-element/hydration.js` only if you still need the legacy attribute string. New server-rendered markup should omit `defer-hydration`. |

### Removed side-effect imports

| Import | Replacement |
|---|---|
| `@microsoft/fast-element/install-hydration.js` | No replacement needed — prerendered path is built into `ElementController` |
| `@microsoft/fast-element/install-hydratable-view-templates.js` | No replacement needed — `enableHydration()` installs hydratable template support |

Use `enableHydration()` from `@microsoft/fast-element/hydration.js` when SSR
content should hydrate. The declarative entrypoint no longer installs hydration
automatically.

### Changed behavior

- **`attributeChangedCallback` during upgrade**: When `isPrerendered` is true and the element has not yet connected, attribute change callbacks are suppressed. After connection, all attribute changes are processed normally.
- **Declarative template resolution**: `declarativeTemplate()` waits for the
  matching `<f-template>` before `define()` completes, so connected elements
  hydrate with a concrete template. No `defer-hydration` attribute is needed.
- **Binding evaluation with existing shadow root**: When an existing shadow root is detected, `attribute` and `booleanAttribute` bindings skip their initial DOM update. All other binding types (event, content, property, tokenList) run normally.

### New APIs

- **`ElementController.isPrerendered`** (`Promise<boolean>`): Resolves to `true` when the element had a declarative shadow root at connect time, or `false` when the component was client-side rendered.
- **`ElementController.isHydrated`** (`Promise<boolean>`): Resolves to `true` only when hydration ran successfully.
- **`ViewController.isPrerendered`** (`Promise<boolean> | undefined`): Available to custom directives. Resolves to `true` when the view's content was prerendered, `false` otherwise.
- **`ViewController.isHydrated`** (`Promise<boolean> | undefined`): Available to custom directives. Resolves to `true` only when hydration ran successfully.

### Migration steps

1. Remove `HydratableElementController.install()` calls.
2. Remove `import "@microsoft/fast-element/install-hydration.js"` side-effect imports.
3. Replace `element.$fastController instanceof HydratableElementController` checks with `await element.$fastController.isPrerendered`.
4. Remove `defer-hydration` and `needs-hydration` attributes from server-rendered markup.

## Hydration Marker Format (v3)

### Changed format

The hydration markers embedded in SSR output have been simplified from verbose, index-embedded comment markers to compact, data-free sequential markers.

#### Comment markers

| Marker type | Old format | New format |
|---|---|---|
| Content binding start | `<!-- fe-b$$start$$<index>$$<scopeId>$$fe-b -->` | `<!--fe:b-->` |
| Content binding end | `<!-- fe-b$$end$$<index>$$<scopeId>$$fe-b -->` | `<!--fe:/b-->` |
| Repeat item start | `<!-- fe-repeat$$start$$<itemIndex>$$fe-repeat -->` | `<!--fe:r-->` |
| Repeat item end | `<!-- fe-repeat$$end$$<itemIndex>$$fe-repeat -->` | `<!--fe:/r-->` |
| Element boundary start | `<!-- fe-eb$$start$$<elementId>$$fe-eb -->` | `<!--fe:e-->` |
| Element boundary end | `<!-- fe-eb$$end$$<elementId>$$fe-eb -->` | `<!--fe:/e-->` |

#### Attribute binding markers

| Old format | New format |
|---|---|
| `data-fe-b="0 1 2"` (space-separated indices) | `data-fe="N"` (binding count) |
| `data-fe-b-0` (enumerated, one per factory) | `data-fe="N"` |
| `data-fe-c-0-3` (compact, start index + count) | `data-fe="N"` |

### Removed APIs

| Export | Replacement |
|---|---|
| `HydrationMarkup.contentBindingStartMarker(index, scopeId)` | `HydrationMarkup.contentBindingStartMarker()` |
| `HydrationMarkup.contentBindingEndMarker(index, scopeId)` | `HydrationMarkup.contentBindingEndMarker()` |
| `HydrationMarkup.isContentBindingStartMarker(data)` | `HydrationMarkup.isContentBindingStartMarker(data)` (unchanged signature, new implementation) |
| `HydrationMarkup.isContentBindingEndMarker(data)` | `HydrationMarkup.isContentBindingEndMarker(data)` (unchanged signature, new implementation) |
| `HydrationMarkup.parseAttributeBinding(element)` | `HydrationMarkup.parseAttributeBindingCount(element)` |
| `HydrationMarkup.parseRepeatStartMarker(data)` | `HydrationMarkup.isRepeatViewStartMarker(data)` |
| `HydrationMarkup.parseRepeatEndMarker(data)` | `HydrationMarkup.isRepeatViewEndMarker(data)` |
| `HydrationMarkup.parseElementBoundaryStartMarker(content)` | `HydrationMarkup.isElementBoundaryStartMarker(node)` |
| `HydrationMarkup.parseElementBoundaryEndMarker(content)` | `HydrationMarkup.isElementBoundaryEndMarker(node)` |

### Impact

This is a **breaking change** for SSR output format. Any system that produces or parses hydration markers must be updated to use the new format. The `@microsoft/fast-build` Rust crate and WASM binary have been updated accordingly.

- Marker parsing uses string equality checks (`data === "fe:b"`) instead of regex
- Start/end pairing uses balanced depth counting instead of embedded IDs
- The hydration walker uses a sequential factory pointer instead of index-based lookup
- SSR and client versions must match — mixing old SSR output with new client code (or vice versa) will fail

## Async define/compose/register API (v3)

### Removed APIs

| Removed | Replacement |
|---|---|
| `FASTElement.defineAsync()` | Subclass `define()` calls (now return `Promise<TType>`) |
| `FASTElement.compose()` and subclass `compose()` calls | Subclass `define()` calls |
| `FASTElementDefinition.composeAsync()` | Subclass `define()` calls |
| `FASTElementDefinition.registerAsync()` | `FASTElementDefinition.register()` (same `Promise<Function>` return type) |

### Changed behavior

- Subclass **`define()`** calls now return `Promise<TType>`. When a concrete
  template is provided at definition time, the Promise resolves immediately.
  When `template: declarativeTemplate()` is used, the Promise resolves after
  the matching `<f-template>` supplies the concrete template.
- Subclass compose helpers are no longer part of the public authoring surface; use subclass `define()` for registration.
- **`@customElement` decorator** calls `define()` internally but does not return the Promise (fire-and-forget). For complete definitions with a template, the element is registered via a microtask.

### Migration steps

1. Replace `defineAsync()` calls with `define()`:

   ```typescript
    // Before
    MyElement.defineAsync({
        name: "my-element",
        templateOptions: "defer-and-hydrate",
    });

    // After
    await MyElement.define({
        name: "my-element",
        template: declarativeTemplate(),
    });
   ```

2. Replace subclass `compose()` calls that immediately register an element with
   `define()`:

   ```typescript
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

3. Replace `FASTElementDefinition.composeAsync()` calls that register an element
   with subclass `define()`:

   ```typescript
   // Before
   (await FASTElementDefinition.composeAsync(MyElement, {
       name: "my-element",
       template,
       styles,
   })).define();

   // After
   await MyElement.define({
       name: "my-element",
       template,
       styles,
   });
   ```

4. Replace `registerAsync()` calls with `register()`:

   ```typescript
   // Before
   const el = await FASTElementDefinition.registerAsync(name);

   // After
   const el = await FASTElementDefinition.register(name);
   ```

5. Replace `FASTElementDefinition.compose()` calls that chain `.define()` with
   subclass `define()`:

   ```typescript
    // Before
    FASTElementDefinition.compose(MyElement, options).define();

    // After
    await MyElement.define(options);
   ```

## Dynamic stylesheet behaviors (v3)

### Removed API

| Removed | Replacement |
|---|---|
| `ElementStyles.withBehaviors()` | Move the runtime condition into the element and call `this.$fastController.addStyles()` / `this.$fastController.removeStyles()` directly. |
| `ElementStyles.behaviors` | Move any runtime behavior out of the stylesheet and into the element or controller lifecycle. |
| CSS bindings in `css` (for example ``css`color: ${x => x.color}```) | Move the dynamic value into the element and update classes, attributes, or inline styles from element code. |
| `CSSDirective.createCSS(add)` | Update directives to implement `createCSS()` and return only static CSS content. |

### Changed behavior

- `css` and `css.partial()` no longer compose `HostBehavior`s.
- `css` no longer accepts function or `Binding` interpolations.
- `ElementStyles` is now a fully static style container.

### Migration steps

1. Keep the conditional `ElementStyles` in a separate `css` value.
2. Move the external listener or condition (for example `matchMedia()` or an app event subscription) into the element lifecycle.
3. Call `this.$fastController.addStyles(styles)` when the condition is active and `this.$fastController.removeStyles(styles)` when it is inactive or during cleanup.
4. If you previously interpolated bindings or behavior-producing directives into `css`, replace them with element state and standard DOM or controller updates.

## `booleanConverter` aligned with native HTML boolean attribute semantics (v2 → v3)

### Changed behavior

`@attr({ mode: "boolean" })` and `booleanConverter` now match how the platform treats native boolean attributes (e.g., `disabled`, `required`):

- **Attribute → property** is presence-based: `setAttribute(name, anyString)` (including the empty string) sets the property to `true`; only `removeAttribute(name)` makes it `false`.
- **Property → attribute** uses `Boolean()` coercion: any JavaScript truthy value adds the attribute (with value `""`); any falsy value removes it.

The headline v2 → v3 difference is that `setAttribute(name, "false")` now resolves to property `true`, matching `<input disabled="false">` still being disabled.

`booleanConverter` shape:

```ts
toView(value: any) {
    return value ? "" : null;
}

fromView(value: any) {
    return !!value;
}
```

`booleanConverter` v2 → v3 result differences:

| Call | v2 result | v3 result |
|---|---|---|
| `fromView("false")` | `false` | `true` |
| `fromView("")` | `true` | `false` |
| `fromView(NaN)` | `true` | `false` |
| `toView(true)` (or any truthy) | `"true"` | `""` |
| `toView(false)` (or any falsy) | `"false"` | `null` |

> **Note**: For `mode: "boolean"`, FAST writes attributes via `DOM.setBooleanAttribute` (presence-based) and reads them as `value !== null`, so the `mode: "boolean"` reflection path does **not** route through `booleanConverter.toView()` or `booleanConverter.fromView()`. The converter methods still apply to property assignment (`el.bool = X` runs `fromView(X)`), explicit calls (`booleanConverter.fromView(x)`), and `booleanConverter` paired with `mode: "reflect"` (which calls `toView`).

### Migration steps

1. Audit `boolean`-mode attributes for the literal string `"false"` in templates or SSR HTML — the resulting property will be `true`, not `false`. To express the falsy state, omit the attribute entirely (or call `element.removeAttribute(name)`). Setting `element.bool = false` continues to remove the reflected attribute.
2. Audit code that calls `booleanConverter.toView()` directly or pairs `booleanConverter` with `mode: "reflect"`. The output strings are no longer `"true"` / `"false"`.
3. If you need a tri-state attribute (`true` / `false` / unset) that preserves an explicit `"false"` string value, use `nullableBooleanConverter` with `mode: "reflect"` instead of `mode: "boolean"`.
