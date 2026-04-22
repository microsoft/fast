# Migrating from previous versions

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
