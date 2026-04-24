# Rendering Lifecycle

This document describes the declarative rendering lifecycle inside
`@microsoft/fast-element`.

## Overview

The FAST Element rendering lifecycle involves a coordinated process between the
core runtime and its declarative entrypoint:

- **`@microsoft/fast-element`**: Provides the core `FASTElement` base class and
  element definition system.
- **`@microsoft/fast-element/declarative.js`**: Provides the `f-template`
  custom element that processes HTML templates and attaches them to FAST
  elements as a `ViewTemplate` in lieu of an `html` template created during
  `FASTElement.define()`. When using `f-template`, the host element can be
  defined without an initial template and the declarative runtime attaches the
  template later.

## Lifecycle Phases

Given a DOM which includes an `f-template` and a component:

```html
<my-component text="Hello World">
    <template shadowrootmode="open">
        <h1><!--fe:b-->Hello World<!--fe:/b--></h1>
    </template>
</my-component>

<f-template name="my-component">
    <template>
        <h1>{{text}}</h1>
    </template>
</f-template>
```

The following phases will then be kicked off once the JavaScript is parsed.

### Phase 1: Partial Element Registration

Custom elements begin their lifecycle by registering with FAST via the
`define()` method before their declarative template is available.

```typescript
// Custom element class definition
class MyComponent extends FASTElement {
    @attr text: string = "";
}

// Register the host element before the declarative template is attached
MyComponent.define({
    name: "my-component",
});
```

Key characteristics of this phase:
- Element is registered before template attachment
- The definition is completed later when `<f-template>` assigns `definition.template`

### Phase 2: Template Element Definition

The `f-template` custom element from
`@microsoft/fast-element/declarative.js` is defined and becomes available in
the DOM:

```typescript
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

TemplateElement.define({
    name: "f-template",
});
```

### Phase 3: Template Processing and Attachment

When an `f-template` element is connected to the DOM, it initiates the template attachment process.

The lifecycle flow during this phase:

1. **Template Element Connection**: The `f-template` element's `connectedCallback()` is invoked
2. **Async Registration Lookup**: Uses `FASTElementDefinition.register(this.name)` to find the partial element definition
3. **Template Processing**: Processes the HTML template, resolving data bindings, directives, and other template features into the `ViewTemplate` model which is also used by the `@microsoft/fast-element` `html` tag template
4. **Template Attachment**: Attaches the processed template to the partial element definition via `registeredFastElement.template = resolvedTemplate`

### Phase 4: Template Activation

Once the template is attached to the registered definition, FAST activates it
for both future and already-connected elements:

1. **Definition Update**: `TemplateElement` assigns the parsed `ViewTemplate` to `registeredFastElement.template`
2. **Observable Notification**: Connected elements observing the definition recreate their controller when the `template` property changes
3. **Future Connections**: New element instances use the attached template immediately

### Phase 5: Element Instantiation and Hydration

When custom elements are instantiated in the DOM, the following occurs:

1. **Element Creation**: The platform creates instances of the custom element
2. **Prerendered Content Detection**: `ElementController` detects the existing shadow root from SSR and sets `isPrerendered = true`
3. **Late Template Attachment**: If an element connected before its template was attached, the observable `template` change recreates its controller.
4. **Hydration**: Once the template is available, `ElementController` uses `template.hydrate()` to create a `HydrationView` that maps existing DOM nodes to binding targets using `fe:b` / `fe:/b` markers

The DOM after hydration should look like this:

```html
<my-component text="Hello World">
    <template shadowrootmode="open">
        <h1><!---->Hello World<!----></h1>
    </template>
</my-component>
```

## Key Integration Points

### Fast Element Registry

The `fastElementRegistry` serves as the central coordination point between the two packages:

- Stores partial element definitions created by `define()`
- Provides lookup mechanism via `register()` for template attachment
- Maintains the registry of all FAST element definitions

### Observable Pattern

Both packages use the Observable pattern for coordination:

- `FASTElementDefinition.register()` uses `Observable.getNotifier()` to notify when elements are registered
- Template attachment triggers observable `template` notifications so connected elements can complete rendering or hydration

## Error Handling

The lifecycle includes error handling for missing components:

- Template elements throw errors if no corresponding element definition is found
- Element definitions can exist without templates (partial state)

## Performance Considerations

The asynchronous nature of the lifecycle provides several performance benefits:

- **Progressive Enhancement**: Elements can be registered before templates are loaded
- **Code Splitting**: Templates can be loaded separately from element definitions  
- **Reduced Blocking**: Template processing doesn't block element registration
- **Hydration Optimization**: Server-side rendered content can be hydrated efficiently

This coordinated lifecycle enables powerful scenarios like server-side rendering, progressive enhancement, and dynamic template loading while maintaining the reactive capabilities of FAST Element.

## Lifecycle Callbacks

FAST HTML provides a set of lifecycle callbacks that allow you to hook into various stages of the rendering and hydration process. These callbacks are particularly useful for performance monitoring, debugging, analytics, and coordinating initialization sequences.

### Available Callbacks

The lifecycle callbacks are organized into three categories:

**Template Registration Callbacks:**
- `elementDidRegister(name: string)` - Called after the JavaScript class definition has been registered as a partial definition
- `templateWillUpdate(name: string)` - Called before the template has been evaluated and assigned to the definition

**Template Processing Callbacks:**
- `templateDidUpdate(name: string)` - Called after the template has been assigned to the definition
- `elementDidDefine(name: string)` - Called after the custom element has been fully defined with the platform

**Hydration Callbacks:**
- `hydrationStarted()` - Called once when the first prerendered element begins hydrating
- `elementWillHydrate(source: HTMLElement)` - Called before an element begins hydration
- `elementDidHydrate(source: HTMLElement)` - Called after an element completes hydration
- `hydrationComplete()` - Called once after all prerendered elements have completed hydration

Hydration callbacks are tracked at the element level by `ElementController`. The `hydrationComplete` callback fires only after every prerendered element has finished binding.

### Callback Execution Order

The callbacks execute in the following sequence for each element:

```
Registration Phase:
  1. elementDidRegister(name)
  
Template Processing Phase (asynchronous):
  2. templateWillUpdate(name)
  3. [Template processing occurs]
  4. templateDidUpdate(name)
  5. elementDidDefine(name)
  
Hydration Phase (per element):
  6. hydrationStarted()           [once, on first element]
  7. elementWillHydrate(source)
  8. [Hydration occurs]
  9. elementDidHydrate(source)
  
Completion (called once for all elements):
  10. hydrationComplete()
```

**Important:** Template processing is asynchronous and happens independently for each element. When multiple elements are being processed, the template and hydration callbacks can be interleaved across different elements.

### Configuring Callbacks

Configure callbacks using `TemplateElement.config()` before defining the template element:

```typescript
import { TemplateElement, type HydrationLifecycleCallbacks } from "@microsoft/fast-element/declarative.js";

TemplateElement.config({
    elementDidRegister(name) {
        console.log(`${name} registered`);
    },
    templateWillUpdate(name) {
        console.log(`${name} template updating`);
    },
    templateDidUpdate(name) {
        console.log(`${name} template updated`);
    },
    elementDidDefine(name) {
        console.log(`${name} fully defined`);
    },
    elementWillHydrate(source) {
        console.log(`${source.localName} starting hydration`);
    },
    elementDidHydrate(source) {
        console.log(`${source.localName} hydrated`);
    },
    hydrationComplete() {
        console.log('All elements hydrated');
    }
});

TemplateElement.define({
    name: "f-template",
});
```

### Use Cases

**Performance Monitoring:**
```typescript
TemplateElement.config({
    elementWillHydrate(source) {
        performance.mark(`${source.localName}-hydration-start`);
    },
    elementDidHydrate(source) {
        performance.mark(`${source.localName}-hydration-end`);
        performance.measure(`${source.localName}-hydration`, `${source.localName}-hydration-start`, `${source.localName}-hydration-end`);
    },
    hydrationComplete() {
        const measures = performance.getEntriesByType('measure');
        // Send metrics to analytics
    }
});
```

**Loading State Management:**
```typescript
TemplateElement.config({
    hydrationStarted() {
        document.body.classList.add('hydrating');
    },
    hydrationComplete() {
        document.body.classList.remove('hydrating');
        document.body.classList.add('interactive');
    }
});
```
