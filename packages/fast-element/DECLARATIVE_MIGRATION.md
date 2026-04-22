# Migrating from previous versions

## Prerendered Content Optimization (v1-alpha → v1)

### Removed exports

| Export | Replacement |
|---|---|
| `RenderableFASTElement` | Extend `FASTElement` |

### Removed concepts

| Concept | Replacement |
|---|---|
| `prepare()` lifecycle hook | Set state in `connectedCallback`; the reactive system updates the DOM |
| `defer-hydration` attribute in rendered markup | Template-pending guard in `ElementController.connect()` |
| `needs-hydration` attribute in rendered markup | `hasExistingShadowRoot` detection in `ElementController` |
| `waitForAncestorHydration()` | Not needed — prerendered content is correct regardless of connection order |

### Migration steps

1. Replace `RenderableFASTElement(MyComponent).defineAsync({...})` with `MyComponent.define({...})`.

   ```typescript
   // Before
   import { RenderableFASTElement } from "@microsoft/fast-html";
   RenderableFASTElement(MyComponent).defineAsync({
       name: "my-component",
       templateOptions: "defer-and-hydrate",
   });

   // After
   MyComponent.define({
       name: "my-component",
       templateOptions: "defer-and-hydrate",
   });
   ```

2. Remove `prepare()` methods. Move any initialization logic to `connectedCallback`:

   ```typescript
   // Before
   class MyComponent extends FASTElement {
       async prepare() {
           this.data = await fetchData();
       }
   }

   // After
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

3. Remove `defer-hydration` and `needs-hydration` attributes from server-rendered markup:

   ```html
   <!-- Before -->
   <my-component defer-hydration needs-hydration text="Hello">
       <template shadowrootmode="open">...</template>
   </my-component>

   <!-- After -->
   <my-component text="Hello">
       <template shadowrootmode="open">...</template>
   </my-component>
   ```

4. Await `$fastController.isPrerendered` to detect prerendered components:

   ```typescript
   connectedCallback() {
       super.connectedCallback();
       this.$fastController.isPrerendered.then(prerendered => {
           if (!prerendered) {
               this.fetchData();
           }
       });
   }
   ```

## Modularize Schema, ObserverMap, and AttributeMap

### Import changes

Configuration types have moved from `template.ts` to their owning modules. If you import types directly from internal paths, update your imports:

| Before | After |
|---|---|
| `import type { ObserverMapConfig } from "./template.js"` | `import type { ObserverMapConfig } from "./observer-map.js"` |
| `import type { AttributeMapConfig } from "./template.js"` | `import type { AttributeMapConfig } from "./attribute-map.js"` |

Public imports now come from
`@microsoft/fast-element/declarative.js` rather than
`@microsoft/fast-html`.

### Schema changes

`Schema.jsonSchemaMap` (static property) has been replaced by:
- An instance-level `schemaMap` on each `Schema` instance (private)
- A module-level `schemaRegistry` export for cross-element lookups

| Before | After |
|---|---|
| `Schema.jsonSchemaMap.get('my-element')` | `import { schemaRegistry } from "@microsoft/fast-element/declarative.js"; schemaRegistry.get('my-element')` |

### New public exports

The following are now part of the public API:

| Export | Purpose |
|---|---|
| `Schema` | JSON schema builder class |
| `schemaRegistry` | Module-level registry for cross-element schema lookups |
| `AttributeMap` | Automatic `@attr` property registration |
| `AttributeMapOption` | Constant for the `"all"` option value |
| `JSONSchema` | JSON Schema type interface |
| `CachedPathMap` | Schema registry map type |
