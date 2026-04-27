# Migrating from previous versions

## Hydration Marker Format (v1-alpha → v1)

The SSR output format for hydration markers has been simplified. If you have any tooling that inspects or generates hydration markers, update it to use the new format.

| Old marker | New marker |
|---|---|
| `<!-- fe-b$$start$$...$$fe-b -->` | `<!--fe:b-->` |
| `<!-- fe-b$$end$$...$$fe-b -->` | `<!--fe:/b-->` |
| `<!-- fe-repeat$$start$$...$$fe-repeat -->` | `<!--fe:r-->` |
| `<!-- fe-repeat$$end$$...$$fe-repeat -->` | `<!--fe:/r-->` |
| `data-fe-b="0 1 2"` / `data-fe-b-0` / `data-fe-c-0-3` | `data-fe="N"` |

The `@microsoft/fast-build` WASM binary emits the new markers automatically. Rebuild all fixtures and SSR output after upgrading.

See the [`@microsoft/fast-element` MIGRATION.md](../fast-element/MIGRATION.md#hydration-marker-format-v3) for full details on API changes.

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

1. Replace `RenderableFASTElement(MyComponent).defineAsync({...})` with
   `await MyComponent.define({...})` and use `declarativeTemplate()` for
   declarative templates. `declarativeTemplate()` is the waiting behavior: it
   resolves the matching `<f-template>` before `define()` completes.

   ```typescript
   // Before
   import { RenderableFASTElement } from "@microsoft/fast-html";
   RenderableFASTElement(MyComponent).defineAsync({
       name: "my-component",
       templateOptions: "defer-and-hydrate",
   });

   // After
   await MyComponent.define({
       name: "my-component",
       template: declarativeTemplate(),
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

Public declarative imports now come from
`@microsoft/fast-element/declarative.js` rather than
`@microsoft/fast-html`. Existing declarative imports for `attributeMap()` and
`observerMap()` remain valid. New code that only needs the map extensions should
prefer `@microsoft/fast-element/attribute-map.js` and
`@microsoft/fast-element/observer-map.js`.

### Schema changes

`Schema.jsonSchemaMap` (static property) has been replaced by:
- An instance-level `schemaMap` on each `Schema` instance (private)
- A module-level `schemaRegistry` export for cross-element lookups

| Before | After |
|---|---|
| `Schema.jsonSchemaMap.get('my-element')` | `import { schemaRegistry } from "@microsoft/fast-element/declarative.js"; schemaRegistry.get('my-element')` |

### Public exports

The public entrypoint exports the functional declarative API:

| Export | Purpose |
|---|---|
| `declarativeTemplate()` | Resolves `<f-template>` markup for a FAST element definition |
| `attributeMap()` | Definition extension for automatic `@attr` property registration |
| `observerMap()` | Definition extension for automatic deep observation |
| `Schema` | JSON schema builder class |
| `schemaRegistry` | Module-level registry for cross-element schema lookups |
| `JSONSchema` | JSON Schema type interface |
| `CachedPathMap` | Schema registry map type |

## Simplified ObserverMap and AttributeMap defaults

The explicit `ObserverMapOption.all` and `AttributeMapOption.all` constants have
been removed. Calling `observerMap()` with no arguments observes every
discovered root property, and calling `attributeMap()` with no arguments maps
every discovered leaf binding.

| Before | After |
|---|---|
| `observerMap(ObserverMapOption.all)` | `observerMap()` |
| `attributeMap(AttributeMapOption.all)` | `attributeMap()` |


## Declarative TemplateElement API removal

The public declarative API is now the functional API. The `<f-template>`
implementation is internal and is defined automatically by `declarativeTemplate()`.

| Removed | Replacement |
|---|---|
| `TemplateElement` public export | `declarativeTemplate()` on each FAST element definition |
| `TemplateElement.define({ name: "f-template" })` | No manual definition; `declarativeTemplate()` defines the internal publisher in the target registry |
| `TemplateElement.config(callbacks)` / `HydrationLifecycleCallbacks` | Per-element callbacks via `declarativeTemplate(callbacks)` and global hydration callbacks via `enableHydration(options)` |
| `TemplateElement.options({ "my-el": { attributeMap, observerMap } })` | Define extensions: `MyElement.define(definition, [attributeMap(...), observerMap(...)])` |
| `ElementOptions` / `ElementOptionsDictionary` | No replacement |
| `AttributeMap` / `ObserverMap` class exports from the old declarative public surface | `attributeMap()` / `observerMap()` extension helpers and their config types |

Hydration is also no longer installed by `@microsoft/fast-element/declarative.js`.
Call `enableHydration()` from `@microsoft/fast-element/hydration.js` before FAST
elements connect when prerendered Declarative Shadow DOM should be reused.

## Extension subpaths and optional definition schema

`attributeMap()` and `observerMap()` are now schema-driven extensions that are
factored away from declarative templating. Prefer importing them from their
dedicated subpaths for tree-shaken or non-declarative use:

```ts
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";
```

`FASTElementDefinition.schema` is optional. `declarativeTemplate()` assigns it
automatically when it parses `<f-template>` markup. Manual schema users can pass
a schema in the element definition, and `observerMap()` can also take a schema
directly in configuration:

```ts
import { FASTElement } from "@microsoft/fast-element";
import { Schema } from "@microsoft/fast-element/schema.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

class MyElement extends FASTElement {}

const schema = new Schema("my-element");
schema.addPath({
    rootPropertyName: "user",
    pathConfig: {
        type: "default",
        parentContext: null,
        currentContext: null,
        path: "user.name",
    },
    childrenMap: null,
});

MyElement.define({ name: "my-element" }, [observerMap({ schema })]);
```
