# Migrating from previous versions

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

The `install-hydratable-view-templates.js` side-effect import is still available and still required by `@microsoft/fast-html` for hydration marker support.

### Changed behavior

- **`attributeChangedCallback` during upgrade**: When `isPrerendered` is true and the element has not yet connected, attribute change callbacks are suppressed. After connection, all attribute changes are processed normally.
- **`connect()` with deferred template**: When `templateOptions` is `"defer-and-hydrate"` and no template is available, `connect()` returns early automatically. The `Observable` subscription on `"template"` retriggers connection when the template arrives. No `defer-hydration` attribute is needed.
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

- **`FASTElement.define()`** now returns `Promise<TType>`. When a template is provided at definition time, the Promise resolves immediately. When `templateOptions` is `"defer-and-hydrate"` and no template is provided, the Promise resolves after a template is supplied (e.g. via `<f-template>`).
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
   MyElement.define({
       name: "my-element",
       templateOptions: "defer-and-hydrate",
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
