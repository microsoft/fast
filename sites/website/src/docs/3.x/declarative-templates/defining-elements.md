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
description: Learn how to register declarative FASTElement components and use observerMap and attributeMap extensions.
keywords:
  - FASTElement
  - declarative
  - define
  - observerMap
  - attributeMap
  - extensions
---

{% raw %}

# Defining Declarative Elements

A declarative FASTElement component requires a JavaScript class definition with `template: declarativeTemplate()` and an `<f-template>` in the HTML. The `declarativeTemplate()` function automatically defines the `<f-template>` custom element and waits for the matching template before completing registration. This page covers the JavaScript setup and extension configuration.

## Basic Setup

**1. Define the component class** with `template: declarativeTemplate()`:

```ts
import { FASTElement, attr } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

class MyCounter extends FASTElement {
    @attr count: number = 0;
}

MyCounter.define({
    name: "my-counter",
    template: declarativeTemplate(),
});
```

The `template: declarativeTemplate()` setting tells FAST to wait for a matching `<f-template>` element before completing registration. It automatically defines FAST's internal `<f-template>` publisher in the relevant registry. If pre-rendered content exists in the DOM, call `enableHydration()` before elements connect to hydrate it; otherwise the element renders client-side.

**2. Write the template** in an HTML file:

```html
<f-template name="my-counter">
    <template>
        <p>Count: {{count}}</p>
        <button @click="{increment()}">+1</button>
    </template>
</f-template>
```

:::important
The `<f-template>` elements must be present in the DOM when the component definition resolves. A common pattern is to include the `<f-template>` elements directly in the HTML page before the script module loads.
:::

## Complete File Structure

A typical declarative component setup involves these files:

```
my-app/
├── main.ts          # Component classes + declarativeTemplate() setup
├── templates.html   # <f-template> elements
├── entry.html       # Page HTML with component instances
├── state.json       # Initial state for server rendering (optional)
└── styles.css       # Component styles (optional)
```

**`main.ts`:**

```ts
import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element/styles.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

class TaskItem extends FASTElement {
    @attr text: string = "";
    @attr({ mode: "boolean" }) done: boolean = false;
}

TaskItem.define({
    name: "task-item",
    styles: css`:host { display: block; }`,
    template: declarativeTemplate(),
});
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

## Extensions

The `observerMap()` and `attributeMap()` functions are define extensions — they are passed as the second argument to `define()` and run before the element is registered with the platform. They are exported from dedicated extension subpaths so they can be used with declarative templates or with manually supplied schemas.

```ts
import { FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

class MyElement extends FASTElement {}

MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [observerMap(), attributeMap()],
);
```

Calling `observerMap()` or `attributeMap()` with no arguments applies the default behavior for all properties in the schema. `declarativeTemplate()` assigns a schema to the FAST element definition automatically during template resolution. Non-declarative users can provide a manual schema on the definition; `observerMap()` can also receive one directly with `observerMap({ schema })`.

## ObserverMap

The `observerMap` option automatically sets up deep reactive observation for properties discovered in the template. When a nested object property changes, the template re-renders the affected bindings.

### Observe All Properties

Pass `observerMap()` with no arguments to observe every root property found in the template:

```ts
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

UserProfile.define(
    {
        name: "user-profile",
        template: declarativeTemplate(),
    },
    [observerMap()],
);
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
UserProfile.define(
    {
        name: "user-profile",
        template: declarativeTemplate(),
    },
    [
        observerMap({
            properties: {
                user: {
                    name: true,       // user.name — observed
                    details: {
                        age: true,    // user.details.age — observed
                        history: false // user.details.history — NOT observed
                    },
                },
            },
        }),
    ],
);
```

Each entry in the path tree can be:

| Value | Behavior |
|---|---|
| `true` | Observe this path and all descendants |
| `false` | Skip this path and all descendants |
| `{ ... }` | An object with child path overrides and an optional `$observe` flag |

Use `$observe: false` on a node to skip it by default, then selectively include specific children:

```ts
observerMap({
    properties: {
        analytics: {
            charts: {
                $observe: false,      // charts NOT observed by default
                activeChart: true,    // ...except activeChart IS observed
            },
        },
    },
});
```

When `properties` is omitted, all root properties are observed. When `properties` is present but empty (`{ properties: {} }`), no root properties are observed.

### Non-declarative Schemas

For components that do not use `declarativeTemplate()`, create or obtain a `Schema` and pass it to `observerMap()`:

```ts
import { FASTElement, Schema } from "@microsoft/fast-element";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

class UserProfile extends FASTElement {}

const schema = new Schema("user-profile");
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

UserProfile.define({ name: "user-profile" }, [observerMap({ schema })]);
```

You can also attach the schema to the definition and call `observerMap()` without a schema argument.

## AttributeMap

The `attributeMap` option automatically creates reactive `@attr` properties for leaf bindings in the template — simple expressions like `{{greeting}}` that have no nested dot-notation paths. Declarative templates provide the schema automatically; non-declarative users should attach a manual `schema` to the FAST element definition before applying `attributeMap()`.

### Enable for All Leaf Bindings

```ts
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";

GreetingCard.define(
    {
        name: "greeting-card",
        template: declarativeTemplate(),
    },
    [attributeMap()],
);
```

With this template:

```html
<f-template name="greeting-card">
    <template>
        <p>{{greeting}}</p>
        <p>{{firstName}}</p>
    </template>
</f-template>
```

This automatically registers `greeting` and `firstName` as `@attr` properties. By default, `attributeMap()` uses the `"camelCase"` attribute name strategy, so `firstName` maps to the HTML attribute `first-name`. Setting `setAttribute("first-name", "Jane")` on the element triggers a re-render.

Properties already decorated with `@attr` or `@observable` on the class are left untouched.

### Attribute Name Strategy

The `attribute-name-strategy` option controls how template binding keys map to HTML attribute names:

| Strategy | Behavior | Example |
|---|---|---|
| `"camelCase"` (default) | Binding key is the camelCase property; attribute is kebab-case | `{{fooBar}}` → property `fooBar`, attribute `foo-bar` |
| `"none"` | Binding key used as-is for both property and attribute | `{{foo-bar}}` → property `foo-bar`, attribute `foo-bar` |

```ts
MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [
        attributeMap({
            "attribute-name-strategy": "none",
        }),
    ],
);
```

With the `"camelCase"` strategy (the default), a template binding `{{firstName}}` creates a property `firstName` with an HTML attribute `first-name`. This matches the behavior of the `--attribute-name-strategy` option in the `@microsoft/fast-build` CLI.

:::tip
Ensure the server-side build tool uses the same attribute name strategy as the client-side `attributeMap` configuration so that attribute names are consistent between the server-rendered HTML and the client-side runtime.
:::

## Combining ObserverMap and AttributeMap

Both extensions can be used together for a fully declarative component:

```ts
import { FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

class ProductCard extends FASTElement {}

ProductCard.define(
    {
        name: "product-card",
        template: declarativeTemplate(),
    },
    [observerMap(), attributeMap()],
);
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
- `attributeMap()` auto-registers `name` and `price` as `@attr` properties (leaf bindings).
- `observerMap()` enables deep observation so that changes to `details.description` trigger re-renders.
- The `details` property is not registered as an `@attr` because it has nested paths — it would typically be set programmatically.

## Custom Extensions

In addition to `observerMap()` and `attributeMap()`, the element's `define()` call accepts any extension callback in the extensions array. Extensions run before the element is registered with the platform, enabling a plugin pattern:

```ts
import type { FASTElementExtension } from "@microsoft/fast-element";

function logDefinition(): FASTElementExtension {
    return definition => {
        console.log(`Defining: ${definition.name}`);
    };
}

MyComponent.define({
    name: "my-component",
    template: declarativeTemplate(),
}, [observerMap(), attributeMap(), logDefinition()]);
```

This is the same extension mechanism available for imperative components. See [FASTElement — Define Extensions](../getting-started/fast-element#define-extensions) for details.

{% endraw %}
