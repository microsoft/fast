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

## Native `globalThis` requirement (v2 → v3)

### Changed behavior

- **Native `globalThis` required**: `@microsoft/fast-element` no longer installs
  a `globalThis` polyfill as a side effect. The package only keeps the
  `requestIdleCallback` / `cancelIdleCallback` fallback for environments that
  still lack those APIs.

### Migration steps

1. Verify that the browsers and JS runtimes you support provide native
   `globalThis`.
2. If you still target an older runtime without `globalThis`, load that
   polyfill before importing `@microsoft/fast-element`.

## Declarative HTML moved into fast-element (v3)

Declarative HTML APIs now ship from `@microsoft/fast-element` instead of the
removed `@microsoft/fast-html` package.

### Import changes

| Before | After |
|---|---|
| `@microsoft/fast-html` | `@microsoft/fast-element/declarative.js` |
| `@microsoft/fast-html/utilities.js` | `@microsoft/fast-element/declarative-utilities.js` |

Core FAST Element helpers now use dedicated subpaths:

| API | Import path |
|---|---|
| `Updates` | `@microsoft/fast-element/updates.js` |
| `Observable`, `observable` | `@microsoft/fast-element/observable.js` |
| `attr`, `AttributeDefinition`, converters, `ValueConverter` | `@microsoft/fast-element/attr.js` |
| `Binding`, `oneWay`, `oneTime`, `listener` | `@microsoft/fast-element/binding.js` |
| `DOM`, `DOMAspect`, `DOMPolicy` | `@microsoft/fast-element/dom.js` |
| `Schema`, `schemaRegistry`, schema types | `@microsoft/fast-element/schema.js` |
| `css` | `@microsoft/fast-element/css.js` |
| `html`, `ViewTemplate`, `HTMLView` | `@microsoft/fast-element/html.js` |
| `Compiler`, `HTMLDirective`, `htmlDirective`, templating/view types | `@microsoft/fast-element/templating.js` |
| `render`, `RenderBehavior`, `RenderDirective` | `@microsoft/fast-element/render.js` |
| `enableHydration`, `HydrationTracker`, hydration types | `@microsoft/fast-element/hydration.js` |
| `ArrayObserver` | `@microsoft/fast-element/array-observer.js` |
| `volatile` | `@microsoft/fast-element/volatile.js` |
| `children` | `@microsoft/fast-element/children.js` |
| `elements`, `NodeObservationDirective` | `@microsoft/fast-element/node-observation.js` |
| `ref` | `@microsoft/fast-element/ref.js` |
| `slotted` | `@microsoft/fast-element/slotted.js` |
| `when` | `@microsoft/fast-element/when.js` |
| `repeat` | `@microsoft/fast-element/repeat.js` |

### Migration steps

1. Update declarative runtime imports to
   `@microsoft/fast-element/declarative.js`.
2. Update declarative utility imports such as `deepMerge` to
   `@microsoft/fast-element/declarative-utilities.js`.
3. Keep importing root FAST Element APIs such as `FASTElement`, `FAST`,
   `ElementController`, and definition/controller types from
   `@microsoft/fast-element`, and import moved helpers from their dedicated
   subpaths (for example `attr` from `@microsoft/fast-element/attr.js`,
   `Schema` from `@microsoft/fast-element/schema.js`, and `observable` from
   `@microsoft/fast-element/observable.js`).
4. Do not switch to the root `@microsoft/fast-element` barrel for declarative
    APIs; the declarative entrypoint owns the declarative runtime but does not
    install hydration. Call `enableHydration()` from
    `@microsoft/fast-element/hydration.js` when prerendered content should be
    hydrated.

## `TemplateOptions` removal (v3)

### Removed APIs

| Removed | Replacement |
|---|---|
| `TemplateOptions` | No replacement |
| `PartialFASTElementDefinition.templateOptions` | No replacement |
| `FASTElementDefinition.templateOptions` | No replacement |

### Changed behavior

- `FASTElement.define()` no longer uses `templateOptions` to delay platform
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
| `TemplateElement.config(callbacks)` / `HydrationLifecycleCallbacks` | Per-element callbacks via `declarativeTemplate(callbacks)` and global callbacks via `enableHydration(options)` |
| `TemplateElement.options(...)`, `ElementOptions`, `ElementOptionsDictionary` | Define extensions: `attributeMap(...)` and `observerMap(...)` passed as the second argument to `define()` |
| `AttributeMap` / `ObserverMap` exports from the old declarative public surface | `attributeMap()` / `observerMap()` extension helpers and their config types |

### Migration steps

1. Replace manual `<f-template>` registration with `template: declarativeTemplate()`:

   ```typescript
   // Before
   import { TemplateElement } from "@microsoft/fast-element/declarative.js";
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
   import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
   import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
   import { observerMap } from "@microsoft/fast-element/observer-map.js";

   MyElement.define(
       {
           name: "my-element",
           template: declarativeTemplate(),
       },
       [attributeMap(), observerMap()],
   );
   ```

   Existing `attributeMap()` and `observerMap()` imports from
   `@microsoft/fast-element/declarative.js` remain valid for declarative
   templates. Prefer the extension subpaths when only the schema-driven maps are
   needed or when using manually supplied schemas. `FASTElementDefinition.schema`
   is optional; `declarativeTemplate()` assigns it automatically, and
   `observerMap()` can take a manual schema with `observerMap({ schema })`.

3. Replace `TemplateElement.config()` with `declarativeTemplate(callbacks)` for
   per-element callbacks and `enableHydration(options)` for global hydration
   callbacks. Hydration is not installed by `declarative.js`; call
   `enableHydration()` before elements connect when SSR content should hydrate.

## Debug entrypoint explicit enablement (v3)

### Import changes

| Before | After |
|---|---|
| `import "@microsoft/fast-element/debug.js";` | `import { enableDebug } from "@microsoft/fast-element/debug.js"; enableDebug();` |

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

### Removed exports

| Export | Replacement |
|---|---|
| `HydratableElementController` | `ElementController` (prerendered path built in) |
| `HydrationControllerCallbacks` | `ElementHydrationCallbacks` via `ElementController.configHydration()` |
| `needsHydrationAttribute` | `ElementController.isPrerendered` |
| `deferHydrationAttribute` | Template-pending guard in `ElementController.connect()` |

### Removed side-effect imports

| Import | Replacement |
|---|---|
| `@microsoft/fast-element/install-hydration.js` | No replacement needed — prerendered path is built into `ElementController` |

The `install-hydratable-view-templates.js` side-effect import is still
available for advanced scenarios, but the preferred API is
`enableHydration()` from `@microsoft/fast-element/hydration.js`. The
declarative entrypoint no longer installs hydration automatically.

### Changed behavior

- **`attributeChangedCallback` during upgrade**: When `isPrerendered` is true and the element has not yet connected, attribute change callbacks are suppressed. After connection, all attribute changes are processed normally.
- **Declarative template resolution**: `declarativeTemplate()` waits for the
  matching `<f-template>` before `define()` completes, so connected elements
  hydrate with a concrete template. No `defer-hydration` attribute is needed.
- **Binding evaluation with existing shadow root**: When an existing shadow root is detected, `attribute` and `booleanAttribute` bindings skip their initial DOM update. All other binding types (event, content, property, tokenList) run normally.

### New APIs

- **`ElementController.isPrerendered`** (`Promise<boolean>`): Resolves to `true` after prerendered content has been hydrated, or `false` when the component is client-side rendered. Component authors can await this to know when the element is fully interactive.
- **`ViewController.isPrerendered`** (`Promise<boolean> | undefined`): Available to custom directives. Resolves to `true` when the view's content was prerendered, `false` otherwise.

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
| `FASTElement.defineAsync()` | `FASTElement.define()` (now returns `Promise<TType>`) |
| `FASTElementDefinition.composeAsync()` | `FASTElementDefinition.compose()` (now returns `Promise<FASTElementDefinition>`) |
| `FASTElementDefinition.registerAsync()` | `FASTElementDefinition.register()` (same `Promise<Function>` return type) |

### Changed behavior

- **`FASTElement.define()`** now returns `Promise<TType>`. When a concrete
  template is provided at definition time, the Promise resolves immediately.
  When `template: declarativeTemplate()` is used, the Promise resolves after
  the matching `<f-template>` supplies the concrete template.
- **`FASTElement.compose()`** now returns `Promise<FASTElementDefinition>`. The Promise always resolves immediately.
- **`FASTElementDefinition.compose()`** now returns `Promise<FASTElementDefinition>`. The Promise always resolves immediately.
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

2. Replace `composeAsync()` calls with `compose()` and add `await`:

   ```typescript
   // Before
   const def = await FASTElementDefinition.composeAsync(MyElement, name);

   // After
   const def = await FASTElementDefinition.compose(MyElement, name);
   ```

3. Replace `registerAsync()` calls with `register()`:

   ```typescript
   // Before
   const el = await FASTElementDefinition.registerAsync(name);

   // After
   const el = await FASTElementDefinition.register(name);
   ```

4. Add `await` to `compose()` calls that chain `.define()`:

   ```typescript
    // Before
    FASTElementDefinition.compose(MyElement, options).define();

    // After
    (await FASTElementDefinition.compose(MyElement, options)).define();
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
