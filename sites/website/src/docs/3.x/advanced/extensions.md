---
id: extensions
title: Extensions
layout: 3x
eleventyNavigation:
  key: extensions3x
  parent: advanced3x
  title: Extensions
navigationOptions:
  activeKey: extensions3x
description: How to use FASTElement extensions like observerMap and attributeMap to enhance element definitions.
keywords:
  - extensions
  - observerMap
  - attributeMap
  - observer map
  - attribute map
  - schema
  - hydration
---

# Extensions

Extensions allow you to hook into the `FASTElement.define()` lifecycle and augment element definitions. They run synchronously during element composition, before the element is registered with the browser.

## Overview

An extension is a function that receives a `FASTElementDefinition` and can modify it:

```ts
import { FASTElement } from "@microsoft/fast-element";
import type { FASTElementExtension } from "@microsoft/fast-element";

const myExtension: FASTElementExtension = (definition) => {
    // Augment the definition here
};

class MyElement extends FASTElement {}
MyElement.define({ name: "my-element" }, [myExtension]);
```

Extensions are passed as the second argument to `define()` as an array. They execute in order, synchronously, after the `FASTElementDefinition` is constructed but before the element is registered with the Custom Elements registry.

## Built-in Extensions

FAST provides two built-in extension factories for use with `@microsoft/fast-html` declarative templates:

- **`observerMap()`** — Registers observable property tracking for complex data binding
- **`attributeMap()`** — Registers HTML attribute definitions for simple leaf properties

### observerMap

The `observerMap` extension enables automatic observable proxy creation for properties discovered in a declarative template's schema. When a property value is assigned an object or array, the extension wraps it in a `Proxy` that triggers FAST's change notification system on mutation — keeping the UI in sync without manual `Observable.notify()` calls.

#### Basic Usage

```ts
import { FASTElement, observerMap } from "@microsoft/fast-element";

class MyElement extends FASTElement {}
MyElement.define(
    { name: "my-element", templateOptions: "defer-and-hydrate" },
    [observerMap()]
);
```

With no arguments, `observerMap()` observes **all** root properties discovered in the template schema. This is equivalent to decorating every root property with `@observable`.

#### Selective Properties

To limit observation to specific root properties, pass a config object with a `properties` map:

```ts
MyElement.define(
    { name: "my-element", templateOptions: "defer-and-hydrate" },
    [
        observerMap({
            properties: {
                user: true,       // Observe user and all descendants
                settings: false,  // Do not observe settings
            }
        })
    ]
);
```

#### Fine-Grained Path Control

For nested objects, you can control observation at each level using `ObserverMapPathNode` objects. The `$observe` flag controls whether a node itself triggers notifications:

```ts
observerMap({
    properties: {
        user: {
            $observe: true,
            profile: {
                $observe: true,
                avatar: false,    // Skip observation for user.profile.avatar
            },
            preferences: false,  // Skip entire preferences subtree
        }
    }
})
```

When `$observe` is omitted, it inherits from the nearest ancestor. At the root level, the default is `true`.

### attributeMap

The `attributeMap` extension automatically discovers simple (leaf) properties in the template schema and defines them as `@attr` properties. A property is a candidate for `@attr` when its schema entry has no nested `properties`, no `type`, and no `anyOf`.

#### Basic Usage

```ts
import { FASTElement, attributeMap } from "@microsoft/fast-element";

class MyElement extends FASTElement {}
MyElement.define(
    { name: "my-element", templateOptions: "defer-and-hydrate" },
    [attributeMap()]
);
```

This allows your declarative template bindings like `{{foo}}` in an attribute position to automatically be reflected as HTML attributes on the element.

#### Naming Strategy

By default (`"none"`), the binding key is used as-is for both the property name and the HTML attribute name. If your build tool generates camelCase property names, use the `"camelCase"` strategy to convert them to kebab-case attributes:

```ts
attributeMap({ attributeNameStrategy: "camelCase" })
// Property: fooBar → Attribute: foo-bar
```

This matches the build-time `attribute-name-strategy` option in `@microsoft/fast-build`.

## Combining Extensions

Extensions compose naturally. A typical declarative component definition uses both:

```ts
import {
    FASTElement,
    observerMap,
    attributeMap,
} from "@microsoft/fast-element";

class UserCard extends FASTElement {}
UserCard.define(
    { name: "user-card", templateOptions: "defer-and-hydrate" },
    [
        observerMap({
            properties: {
                user: true,
            }
        }),
        attributeMap(),
    ]
);
```

With the corresponding HTML:

```html
<user-card name="Jane">
    <template shadowrootmode="open">
        <!--fe-b$$start$$0$$abc123$$fe-b-->Jane<!--fe-b$$end$$0$$abc123$$fe-b-->
    </template>
</user-card>

<f-template name="user-card">
    <template>
        <h2>{{user.name}}</h2>
        <p>Role: {{user.role}}</p>
        <p>ID: {{name}}</p>
    </template>
</f-template>
```

In this example:
- `observerMap` makes `user` an observable property with a deep proxy, so mutations to `user.name` or `user.role` automatically update the template.
- `attributeMap` makes `name` an `@attr` property, so setting the `name` HTML attribute reflects to the property and updates the template.

## Writing Custom Extensions

You can write your own extensions for any cross-cutting concern. An extension factory is a function that returns a `FASTElementExtension`:

```ts
import type { FASTElementExtension } from "@microsoft/fast-element";

function logDefine(label: string): FASTElementExtension {
    return (definition) => {
        console.log(`[${label}] Defined: ${definition.name}`);
    };
}

MyElement.define(
    { name: "my-element" },
    [logDefine("app")]
);
```

### Timing Guarantees

Extensions run synchronously inside `FASTElementDefinition.compose()`. This means:

- Extensions execute **after** the `FASTElementDefinition` is constructed (so `definition.name`, `definition.type`, etc. are available).
- Extensions execute **before** the element is registered with `customElements.define()`.
- For `templateOptions: "defer-and-hydrate"`, extensions run before any microtask-based template resolution, ensuring configuration is available when `TemplateElement` processes the element.

## API Reference

| Export | Description |
|---|---|
| `observerMap(config?)` | Extension factory for observable property tracking |
| `attributeMap(config?)` | Extension factory for HTML attribute definitions |
| `ObserverMapConfig` | Configuration type for `observerMap` |
| `AttributeMapConfig` | Configuration type for `attributeMap` |
| `ObserverMap` | Class that defines observable properties on a prototype |
| `AttributeMap` | Class that defines `@attr` properties on a prototype |
| `Schema` | Class representing a constructed JSON schema from a template |

See the [API documentation](/docs/3.x/api) for full type details.
