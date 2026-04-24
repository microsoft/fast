---
id: declarative-defining-elements
title: Defining Declarative Elements
layout: 3x
eleventyNavigation:
  key: declarative-defining-elements3x
  parent: declarative-templates3x
  title: Defining Elements
navigationOptions:
  activeKey: declarative-defining-elements3x
description: Learn how to register declarative FASTElement components, configure lifecycle callbacks, and use observerMap and attributeMap.
keywords:
  - FASTElement
  - declarative
  - define
  - TemplateElement
  - observerMap
  - attributeMap
  - lifecycle
  - hydration
---

{% raw %}

# Defining Declarative Elements

A declarative FASTElement component requires a JavaScript class definition, a `TemplateElement` registration, and an `<f-template>` in the HTML. This page covers the JavaScript setup, lifecycle callbacks, and configuration options.

## Basic Setup

**1. Define the component class** with `templateOptions: "defer-and-hydrate"`:

```ts
import { FASTElement, attr } from "@microsoft/fast-element";

class MyCounter extends FASTElement {
    @attr count: number = 0;
}

MyCounter.define({
    name: "my-counter",
    templateOptions: "defer-and-hydrate",
});
```

The `templateOptions: "defer-and-hydrate"` setting tells FAST to wait for a template from an `<f-template>` element instead of rendering immediately. If pre-rendered content exists in the DOM, it will be hydrated rather than replaced.

**2. Register the `TemplateElement`** so the browser recognizes `<f-template>`:

```ts
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

TemplateElement.define({ name: "f-template" });
```

**3. Write the template** in an HTML file:

```html
<f-template name="my-counter">
    <template>
        <p>Count: {{count}}</p>
        <button @click="{increment()}">+1</button>
    </template>
</f-template>
```

:::important
The `TemplateElement` must be defined **after** all component classes are defined, and the `<f-template>` elements must be present in the DOM when `TemplateElement` connects. A common pattern is to place `TemplateElement.define()` as the last registration call in your entry module and include the `<f-template>` elements directly in the HTML page.
:::

## Complete File Structure

A typical declarative component setup involves these files:

```
my-app/
├── main.ts          # Component classes + TemplateElement registration
├── templates.html   # <f-template> elements
├── entry.html       # Page HTML with component instances
├── state.json       # Initial state for server rendering (optional)
└── styles.css       # Component styles (optional)
```

**`main.ts`:**

```ts
import { FASTElement, attr, css, observable } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TaskItem extends FASTElement {
    @attr text: string = "";
    @attr({ mode: "boolean" }) done: boolean = false;
}

TaskItem.define({
    name: "task-item",
    styles: css`:host { display: block; }`,
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({ name: "f-template" });
```

**`templates.html`:**

```html
<f-template name="task-item">
    <template>
        <label>
            <input type="checkbox" ?checked="{{done}}">
            <span>{{text}}</span>
        </label>
    </template>
</f-template>
```

**`entry.html`:**

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Tasks</title></head>
<body>
    <task-item text="Buy groceries"></task-item>
    <task-item text="Write docs" done></task-item>
    <script type="module" src="./main.ts"></script>
</body>
</html>
```

## Lifecycle Callbacks

`TemplateElement.config()` registers callbacks that fire during template processing and hydration. This is useful for tracking progress, gathering performance metrics, or coordinating initialization.

```ts
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

TemplateElement.config({
    hydrationComplete() {
        console.log("All elements hydrated");
    },
}).define({ name: "f-template" });
```

### Available Callbacks

**Template lifecycle:**

| Callback | Description |
|---|---|
| `elementDidRegister(name)` | Called after the element class is registered |
| `templateWillUpdate(name)` | Called before the template is evaluated and assigned |
| `templateDidUpdate(name)` | Called after the template is assigned to the definition |
| `elementDidDefine(name)` | Called after the custom element is defined with the platform |

**Hydration lifecycle:**

| Callback | Description |
|---|---|
| `hydrationStarted()` | Called once when the first pre-rendered element begins hydrating |
| `elementWillHydrate(source)` | Called before an individual element starts hydration |
| `elementDidHydrate(source)` | Called after an individual element completes hydration |
| `hydrationComplete()` | Called after all pre-rendered elements have finished hydrating |

### Lifecycle Order

1. **Registration** — `elementDidRegister`
2. **Template processing** — `templateWillUpdate` → template parsing → `templateDidUpdate` → `elementDidDefine`
3. **Hydration** — `hydrationStarted` → `elementWillHydrate` → hydration → `elementDidHydrate`
4. **Completion** — `hydrationComplete`

:::note
Template processing is asynchronous and happens independently for each element. The template and hydration phases can be interleaved when multiple elements are being processed simultaneously.
:::

### Performance Monitoring Example

```ts
TemplateElement.config({
    elementWillHydrate(source) {
        performance.mark(`${source.localName}-hydration-start`);
    },
    elementDidHydrate(source) {
        performance.mark(`${source.localName}-hydration-end`);
        performance.measure(
            `${source.localName}-hydration`,
            `${source.localName}-hydration-start`,
            `${source.localName}-hydration-end`
        );
    },
    hydrationComplete() {
        const entries = performance.getEntriesByType("measure");
        console.log("Hydration metrics:", entries);
    },
});
```

### Loading State Example

```ts
TemplateElement.config({
    hydrationStarted() {
        document.body.classList.add("hydrating");
    },
    hydrationComplete() {
        document.body.classList.remove("hydrating");
        document.body.classList.add("hydrated");
    },
});
```

## Element Options

`TemplateElement.options()` configures per-element behavior for `observerMap` and `attributeMap`. These are keyed by custom element name.

```ts
TemplateElement.options({
    "my-element": {
        observerMap: "all",
        attributeMap: "all",
    },
}).define({ name: "f-template" });
```

Both `.config()` and `.options()` are chainable and can be combined:

```ts
TemplateElement
    .options({
        "my-element": { observerMap: "all" },
    })
    .config({
        hydrationComplete() {
            console.log("Ready");
        },
    })
    .define({ name: "f-template" });
```

## ObserverMap

The `observerMap` option automatically sets up deep reactive observation for properties discovered in the template. When a nested object property changes, the template re-renders the affected bindings.

### Observe All Properties

Use `"all"` to observe every root property found in the template:

```ts
TemplateElement.options({
    "user-profile": {
        observerMap: "all",
    },
});
```

With this template:

```html
<f-template name="user-profile">
    <template>
        <p>{{user.name}}</p>
        <p>{{user.address.city}}</p>
    </template>
</f-template>
```

Changes to `user.name` or `user.address.city` will automatically trigger a re-render.

### Selective Observation

For fine-grained control, pass a configuration object with a `properties` key:

```ts
TemplateElement.options({
    "user-profile": {
        observerMap: {
            properties: {
                user: {
                    name: true,       // user.name — observed
                    details: {
                        age: true,    // user.details.age — observed
                        history: false // user.details.history — NOT observed
                    },
                },
            },
        },
    },
});
```

Each entry in the path tree can be:

| Value | Behavior |
|---|---|
| `true` | Observe this path and all descendants |
| `false` | Skip this path and all descendants |
| `{ ... }` | An object with child path overrides and an optional `$observe` flag |

Use `$observe: false` on a node to skip it by default, then selectively include specific children:

```ts
observerMap: {
    properties: {
        analytics: {
            charts: {
                $observe: false,      // charts NOT observed by default
                activeChart: true,    // ...except activeChart IS observed
            },
        },
    },
}
```

When `properties` is omitted or set to `"all"`, all root properties are observed. When `properties` is present but empty (`{ properties: {} }`), no root properties are observed.

## AttributeMap

The `attributeMap` option automatically creates reactive `@attr` properties for leaf bindings in the template — simple expressions like `{{greeting}}` that have no nested dot-notation paths.

### Enable for All Leaf Bindings

```ts
TemplateElement.options({
    "greeting-card": {
        attributeMap: "all",
    },
});
```

With this template:

```html
<f-template name="greeting-card">
    <template>
        <p>{{greeting}}</p>
        <p>{{first-name}}</p>
    </template>
</f-template>
```

This automatically registers `greeting` and `first-name` as `@attr` properties. Setting `setAttribute("first-name", "Jane")` on the element triggers a re-render.

Properties already decorated with `@attr` or `@observable` on the class are left untouched.

### Attribute Name Strategy

The `attribute-name-strategy` option controls how template binding keys map to HTML attribute names:

| Strategy | Behavior | Example |
|---|---|---|
| `"none"` (default) | Binding key used as-is for both property and attribute | `{{foo-bar}}` → property `foo-bar`, attribute `foo-bar` |
| `"camelCase"` | Binding key is the camelCase property; attribute is kebab-case | `{{fooBar}}` → property `fooBar`, attribute `foo-bar` |

```ts
TemplateElement.options({
    "my-element": {
        attributeMap: {
            "attribute-name-strategy": "camelCase",
        },
    },
});
```

With the `"camelCase"` strategy, a template binding `{{firstName}}` creates a property `firstName` with an HTML attribute `first-name`. This matches the behavior of the `--attribute-name-strategy` option in the `@microsoft/fast-build` CLI.

:::tip
When using the `"camelCase"` strategy, ensure the server-side build tool uses the same strategy so that attribute names are consistent between the server-rendered HTML and the client-side runtime.
:::

## Combining ObserverMap and AttributeMap

Both options can be used together for a fully declarative component:

```ts
import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class ProductCard extends FASTElement {}

ProductCard.define({
    name: "product-card",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.options({
    "product-card": {
        observerMap: "all",
        attributeMap: "all",
    },
}).config({
    hydrationComplete() {
        console.log("Ready");
    },
}).define({ name: "f-template" });
```

```html
<f-template name="product-card">
    <template>
        <h2>{{name}}</h2>
        <p>{{price}}</p>
        <p>{{details.description}}</p>
    </template>
</f-template>
```

In this example:
- `attributeMap: "all"` auto-registers `name` and `price` as `@attr` properties (leaf bindings).
- `observerMap: "all"` enables deep observation so that changes to `details.description` trigger re-renders.
- The `details` property is not registered as an `@attr` because it has nested paths — it would typically be set programmatically.

## Define Extensions

The element's `define()` call accepts an optional second argument — an array of extension callbacks. Extensions run before the element is registered with the platform, enabling a plugin pattern:

```ts
import type { FASTElementExtension } from "@microsoft/fast-element";

function logDefinition(): FASTElementExtension {
    return definition => {
        console.log(`Defining: ${definition.name}`);
    };
}

MyComponent.define({
    name: "my-component",
    templateOptions: "defer-and-hydrate",
}, [logDefinition()]);
```

This is the same extension mechanism available for imperative components. See [FASTElement — Define Extensions](../getting-started/fast-element#define-extensions) for details.

{% endraw %}
