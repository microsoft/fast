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
  a subclass `define()` call. The preferred path uses `declarativeTemplate()` so
  the subclass `define()` call waits for the matching declarative template and keeps
  the definition concrete before registration completes.

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

### Phase 1: Definition Resolution

Custom elements begin their lifecycle by composing a definition that points at
`declarativeTemplate()`. The resolver waits for a matching declarative template
and returns a concrete `ViewTemplate` before the platform registration step.

```typescript
// Custom element class definition
class MyComponent extends FASTElement {
    @attr text: string = "";
}

// Register with the declarative template bridge
await MyComponent.define({
    name: "my-component",
    template: declarativeTemplate(),
});
```

Key characteristics of this phase:
- The element definition stays unresolved until a matching declarative template is available
- The resolved template is concrete before platform registration completes

### Phase 2: Declarative Template Bridge

`declarativeTemplate()` from `@microsoft/fast-element/declarative.js`
automatically ensures that `f-template` is defined in the same registry as the
FAST element being composed.

### Phase 3: Template Processing and Attachment

When an `f-template` element is connected to the DOM, it initiates the template attachment process.

The lifecycle flow during this phase:

1. **Template Discovery**: The resolver waits for a matching
   `<f-template name="...">` in the same registry as the element definition.
2. **Template Element Connection**: The matching `f-template` element's
   `connectedCallback()` registers it with the declarative template bridge.
3. **Template Processing**: The bridge reads and transforms the markup, builds
   the schema, applies `observerMap()` / `attributeMap()` behavior, and resolves
   data bindings, directives, and other template features into the `ViewTemplate`
   model which is also used by the `@microsoft/fast-element` `html` tag template.
4. **Template Attachment**: The concrete `ViewTemplate` is returned to
   the subclass `define()` call, which assigns it to the definition before platform
   registration completes.

### Phase 4: Composition Completion

Once the template is attached to the partial definition, the element completes its composition:

1. **`compose()` Execution**: The element definition internally completes its composition process
2. **Platform Registration**: The completed element definition is fully registered with the platform's custom element registry

### Phase 5: Element Instantiation and Hydration

When custom elements are instantiated in the DOM, the following occurs:

1. **Element Creation**: The platform creates instances of the custom element
2. **Prerendered Content Detection**: `ElementController` detects the existing shadow root from SSR — `isPrerendered` resolves `true`
3. **Hydration Check**: If `enableHydration()` was called and the template is hydratable, the element hydrates — `isHydrated` resolves `true`. Otherwise it falls back to client-side rendering.
4. **Concrete Template Ready**: Because `declarativeTemplate()` resolved during
   definition, `connect()` starts with the final template already attached.
5. **Hydration**: `ElementController` uses `template.hydrate()` to create a
   `HydrationView` that maps existing DOM nodes to binding targets using `fe:b`
   / `fe:/b` markers

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

The `fastElementRegistry` serves as the central coordination point between the
two packages and is available to consumers from
`@microsoft/fast-element/registry.js`:

- Stores partial element definitions created by `define()`
- Provides lookup mechanism via `register()` for template attachment
- Maintains the registry of all FAST element definitions

### Observable Pattern

Both packages use the Observable pattern for coordination:

- `FASTElementDefinition.register()` uses `Observable.getNotifier()` to notify when elements are registered
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

## Promise readiness APIs

FAST Element exposes promises for the registration and hydration readiness points
that are useful to application code.

### `MyComponent.whenRegistered`

Use a component's static `whenRegistered` promise to wait until the element type
has been registered with FAST's element registry or defined with the platform
custom element registry.

```typescript
await MyComponent.whenRegistered;
```

### Hydration promises

Hydration must be explicitly opted into by calling `enableHydration()`. Await
the returned controller's `whenHydrated` promise when code needs to run after
the active hydration batch completes. Await `MyComponent.whenHydrated` when code
needs to wait for a specific component class.

```typescript
import { enableHydration } from "@microsoft/fast-element/hydration.js";

const hydration = enableHydration();
await MyComponent.whenHydrated;
await hydration.whenHydrated;
```

By default, hydration no-ops for later prerendered batches after the initial
batch completes. Set `stopHydration: StopHydration.never` in
`enableHydration()` when streaming Declarative Shadow DOM should continue
hydrating after the initial batch. In that mode, `hydration.whenHydrated`
intentionally remains pending because hydration has no global completion point.
