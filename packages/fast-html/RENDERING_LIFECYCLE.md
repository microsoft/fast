# Rendering Lifecycle

This document describes the interaction between `@microsoft/fast-element` and `@microsoft/fast-html` packages and their collaborative rendering lifecycle.

## Overview

The FAST Element rendering lifecycle involves a coordinated process between two main packages:

- **`@microsoft/fast-element`**: Provides the core `FASTElement` base class and element definition system
- **`@microsoft/fast-html`**: Provides the `f-template` custom element that processes HTML templates and attaches them to FAST elements as a `ViewTemplate` in lieu of an `html` template created during `FASTElement.define()`. When using `f-template` the `FASTElement.defineAsync()` method must be used instead.

## Lifecycle Phases

Given a DOM which includes an `f-template` and a component:

```html
<my-component defer-hydration needs-hydration text="Hello World">
    <template shadowrootmode="open">
        <h1><!--fe-b$$start$$0$$abc123$$fe-b-->Hello World<!--fe-b$$end$$0$$abc123$$fe-b--></h1>
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

Custom elements begin their lifecycle by registering as partial definitions with the FAST Element Registry using the `defineAsync()` method. This allows the element to be registered before its template is available.

```typescript
// Custom element class definition
class MyComponent extends FASTElement {
    @attr text: string = "";
}

// Register as partial definition - element is registered but incomplete
MyComponent.defineAsync({
    name: "my-component",
});
```

Key characteristics of this phase:
- Element is in a "partial" state waiting for template attachment
- `templateOptions` allows for hydration options to be provided. TBD see [this issue](https://github.com/orgs/microsoft/projects/240/views/17?pane=issue&itemId=127653173&issue=microsoft%7Cfast%7C7173).

### Phase 2: Template Element Definition

The `f-template` custom element from `@microsoft/fast-html` is defined and becomes available in the DOM:

```typescript
import { TemplateElement } from "@microsoft/fast-html";

TemplateElement.define({
    name: "f-template",
});
```

### Phase 3: Template Processing and Attachment

When an `f-template` element is connected to the DOM, it initiates the template attachment process.

The lifecycle flow during this phase:

1. **Template Element Connection**: The `f-template` element's `connectedCallback()` is invoked
2. **Async Registration Lookup**: Uses `FASTElementDefinition.registerAsync(this.name)` to find the partial element definition
3. **Template Processing**: Processes the HTML template, resolving data bindings, directives, and other template features into the `ViewTemplate` model which is also used by the `@microsoft/fast-element` `html` tag template
4. **Template Attachment**: Attaches the processed template to the partial element definition via `registeredFastElement.template = resolvedTemplate`

### Phase 4: Composition Completion

Once the template is attached to the partial definition, the element completes its composition:

1. **`composeAsync()` Execution**: The element definition internally completes its composition process
2. **Platform Registration**: The completed element definition is fully registered with the platform's custom element registry

### Phase 5: Element Instantiation and Hydration

When custom elements are instantiated in the DOM: the following occurs:

1. **Element Creation**: The platform creates instances of the custom element
2. **Hydration**: Elements with `needs-hydration` attribute will now be hydrated, or this process may be delayed with the `defer-hydration` attribute which the developer can remove once they determine that the initial state has been provided to the custom element

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

- Stores partial element definitions created by `defineAsync()`
- Provides lookup mechanism via `registerAsync()` for template attachment
- Maintains the registry of all FAST element definitions

### Observable Pattern

Both packages use the Observable pattern for coordination:

- `FASTElementDefinition.registerAsync()` uses `Observable.getNotifier()` to notify when elements are registered
- Template attachment triggers observable notifications to complete the lifecycle

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
- `elementWillHydrate(name: string)` - Called before an element begins hydration
- `elementDidHydrate(name: string)` - Called after an element completes hydration
- `hydrationComplete()` - Called once after all elements have completed hydration

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
  
Hydration Phase:
  6. elementWillHydrate(name)
  7. [Hydration occurs]
  8. elementDidHydrate(name)
  
Completion (called once for all elements):
  9. hydrationComplete()
```

**Important:** Template processing is asynchronous and happens independently for each element. When multiple elements are being processed, the template and hydration callbacks can be interleaved across different elements.

### Configuring Callbacks

Configure callbacks using `TemplateElement.config()` before defining the template element:

```typescript
import { TemplateElement, type HydrationLifecycleCallbacks } from "@microsoft/fast-html";

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
    elementWillHydrate(name) {
        console.log(`${name} starting hydration`);
    },
    elementDidHydrate(name) {
        console.log(`${name} hydrated`);
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
    elementWillHydrate(name) {
        performance.mark(`${name}-hydration-start`);
    },
    elementDidHydrate(name) {
        performance.mark(`${name}-hydration-end`);
        performance.measure(`${name}-hydration`, `${name}-hydration-start`, `${name}-hydration-end`);
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
    elementWillHydrate() {
        document.body.classList.add('hydrating');
    },
    hydrationComplete() {
        document.body.classList.remove('hydrating');
        document.body.classList.add('interactive');
    }
});
```
