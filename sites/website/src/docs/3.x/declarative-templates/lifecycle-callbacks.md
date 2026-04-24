---
id: lifecycle-callbacks
title: Lifecycle Callbacks
sidebar_label: Lifecycle Callbacks
---

# Lifecycle Callbacks

FAST declarative templates provide lifecycle callbacks that hook into the rendering and hydration pipeline. These are useful for performance monitoring, debugging, analytics, and managing loading states.

## Two APIs, Two Scopes

Lifecycle callbacks are split between two APIs based on their scope:

| Scope | API | Callbacks |
|---|---|---|
| Per-element | `declarativeTemplate(callbacks)` | `elementDidRegister`, `templateWillUpdate`, `templateDidUpdate`, `elementDidDefine`, `elementWillHydrate`, `elementDidHydrate` |
| Global | `enableHydration(options)` | `hydrationStarted`, `hydrationComplete` |

## Enabling Hydration

Hydration is **opt-in**. Import and call `enableHydration()` before any FAST elements connect:

```typescript
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration({
    hydrationStarted() {
        console.log("First element is hydrating");
    },
    hydrationComplete() {
        console.log("All elements hydrated");
    },
});
```

Without calling `enableHydration()`, prerendered content is discarded and elements render client-side.

## Per-Element Callbacks

Pass lifecycle callbacks directly to `declarativeTemplate()`:

```typescript
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

MyComponent.define({
    name: "my-component",
    template: declarativeTemplate({
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
    }),
});
```

Each component type gets its own set of callbacks. Different elements can have different callbacks.

## Execution Order

Callbacks fire in the following order for each element:

```
1. elementDidRegister(name)       — JS class registered
2. templateWillUpdate(name)       — before template is parsed
3. templateDidUpdate(name)        — after template is assigned
4. elementDidDefine(name)         — after customElements.define()
5. hydrationStarted()             — once, on first hydrating element
6. elementWillHydrate(source)     — before element hydrates
7. [Hydration occurs]
8. elementDidHydrate(source)      — after element hydrates
9. hydrationComplete()            — once, after all elements finish
```

Steps 5–9 only fire when `enableHydration()` has been called and the element has prerendered content.

> **Note:** Template processing is asynchronous. Callbacks for different elements may interleave.

## Examples

### Performance Monitoring

```typescript
import { enableHydration } from "@microsoft/fast-element/hydration.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

enableHydration({
    hydrationStarted() {
        performance.mark("hydration:started");
    },
    hydrationComplete() {
        performance.measure("hydration:total", "hydration:started");
    },
});

MyComponent.define({
    name: "my-component",
    template: declarativeTemplate({
        elementWillHydrate(source) {
            performance.mark(`${source.localName}:hydrate:start`);
        },
        elementDidHydrate(source) {
            performance.measure(
                `${source.localName}:hydrate`,
                `${source.localName}:hydrate:start`,
            );
        },
    }),
});
```

### Loading State Management

```typescript
enableHydration({
    hydrationStarted() {
        document.body.classList.add("hydrating");
    },
    hydrationComplete() {
        document.body.classList.remove("hydrating");
        document.body.classList.add("interactive");
    },
});
```

### Declarative Template Without Hydration

Lifecycle callbacks work even without hydration — the template-related callbacks still fire:

```typescript
// No enableHydration() call needed for template callbacks
MyComponent.define({
    name: "my-component",
    template: declarativeTemplate({
        elementDidDefine(name) {
            console.log(`${name} is ready`);
        },
    }),
});
```

In this case, `elementWillHydrate` and `elementDidHydrate` will never fire, and the element renders client-side.
