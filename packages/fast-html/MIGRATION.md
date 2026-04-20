# Migrating from previous versions

## Prerendered Content Optimization (v1-alpha → v2)

### Removed exports

| Export | Replacement |
|---|---|
| `RenderableFASTElement` | Extend `FASTElement` directly |

### Removed concepts

| Concept | Replacement |
|---|---|
| `prepare()` lifecycle hook | Set state in `connectedCallback`; the reactive system updates the DOM |
| `defer-hydration` attribute in rendered markup | Template-pending guard in `ElementController.connect()` |
| `needs-hydration` attribute in rendered markup | `hasExistingShadowRoot` detection in `ElementController` |
| `waitForAncestorHydration()` | Not needed — prerendered content is correct regardless of connection order |

### Migration steps

1. Replace `RenderableFASTElement(MyComponent).defineAsync({...})` with `MyComponent.defineAsync({...})`.

   ```typescript
   // Before
   import { RenderableFASTElement } from "@microsoft/fast-html";
   RenderableFASTElement(MyComponent).defineAsync({
       name: "my-component",
       templateOptions: "defer-and-hydrate",
   });

   // After
   MyComponent.defineAsync({
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
