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
