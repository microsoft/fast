---
id: declarative-templates-overview
title: Declarative HTML Overview
layout: 3x
eleventyNavigation:
  key: declarative-templates-overview3x
  parent: declarative-templates3x
  title: Overview
navigationOptions:
  activeKey: declarative-templates-overview3x
description: An overview of FAST's declarative HTML authoring model for web components.
keywords:
  - declarative
  - html
  - templates
  - web components
  - f-template
---

{% raw %}

# Declarative HTML Overview

FAST Element provides two ways to author web component templates:

1. **Imperative** — JavaScript tagged template literals using the `html` function.
2. **Declarative** — Plain HTML `<f-template>` elements parsed at runtime.

The declarative model moves template authoring from JavaScript into HTML. Because templates are expressed as standard markup, they can be rendered by any server-side technology without a JavaScript runtime — enabling true stack-agnostic server-side rendering.

## When to Use Declarative Templates

Choose declarative HTML when:

- You want **server-rendered initial HTML** that hydrates on the client.
- Your rendering pipeline does not run JavaScript (e.g. Rust, Go, or .NET servers).
- You prefer authoring templates in HTML files rather than JavaScript modules.
- You need the same template to be consumable by both a build tool and the browser.

The imperative `html` tagged template remains the right choice for purely client-side applications where templates are authored alongside component logic in TypeScript.

## Hello World

A declarative FAST component requires three pieces: a JavaScript class, an `<f-template>` element, and a host element in the page.

**1. Define the component class** (`main.ts`):

```ts
import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element";

class HelloWorld extends FASTElement {
    @attr greeting: string = "Hello";
}

HelloWorld.define({
    name: "hello-world",
    template: declarativeTemplate(),
});
```

**2. Write the template** (`templates.html`):

```html
<f-template name="hello-world">
    <template>
        <p>{{greeting}}, world!</p>
    </template>
</f-template>
```

**3. Use the element in your page** (`index.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body>
    <hello-world greeting="Hi"></hello-world>
    <script type="module" src="./main.ts"></script>
</body>
</html>
```

When the page loads, `declarativeTemplate()` automatically defines FAST's internal `<f-template>` publisher in the relevant registry, finds the `<f-template name="hello-world">` element, parses its inner `<template>`, and resolves the template for the `hello-world` definition. If you call `enableHydration()` before elements connect, matching pre-rendered content is hydrated; otherwise the component renders client-side. Reactive bindings keep the DOM in sync with property changes.

## How It Works

The declarative pipeline follows these steps:

1. **Define** — The component class is registered with `template: declarativeTemplate()`, which tells FAST to wait for a matching `<f-template>` element and automatically defines the `<f-template>` custom element in the registry.
2. **Parse** — When `<f-template>` connects to the DOM, `TemplateParser` converts the declarative markup into the same internal `ViewTemplate` that the imperative `html` tag produces.
3. **Resolve** — The template is resolved through the bridge and assigned to the element definition before `define()` completes.
4. **Render or hydrate** — If `enableHydration()` was called and the page contains pre-rendered content, existing DOM nodes are reused. Otherwise the template renders client-side.

## Declarative vs. Imperative Syntax

The same component can be expressed either way. Here is a side-by-side comparison:

**Imperative:**

```ts
import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element";
import { html } from "@microsoft/fast-element";

const template = html<NameTag>`
    <h3>${x => x.greeting}</h3>
`;

class NameTag extends FASTElement {
    @attr greeting: string = "Hello";
}

NameTag.define({ name: "name-tag", template });
```

**Declarative:**

```ts
import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element";

class NameTag extends FASTElement {
    @attr greeting: string = "Hello";
}

NameTag.define({
    name: "name-tag",
    template: declarativeTemplate(),
});
```

```html
<f-template name="name-tag">
    <template>
        <h3>{{greeting}}</h3>
    </template>
</f-template>
```

Both produce the same runtime behavior. The declarative version separates the template into HTML, making it available for server-side rendering without JavaScript.

## Next Steps

- [Writing f-templates](./f-templates) — Template syntax, bindings, directives, and expressions.
- [Defining Elements](./defining-elements) — Component registration and extension configuration.
- [Server-Side Rendering](./server-rendering) — Rendering templates on the server and hydrating on the client.

{% endraw %}
