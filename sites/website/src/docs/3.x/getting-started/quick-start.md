---
id: quick-start
title: Quick Start
layout: 3x
eleventyNavigation:
  key: quick-start3x
  parent: getting-started3x
  title: Quick Start
  order: 1
navigationOptions:
  activeKey: quick-start3x
keywords:
  - quick start
  - web components
---

# Quick Start

This guide provides a quick introduction to building a web component using FAST Element. It covers the basics of installation, setup, and creating a simple custom element with a template, styles, and attributes. By the end of this guide, you'll have a working web component that displays a personalized greeting.

## Installation and Setup

This guide assumes you're building a browser bundle with TypeScript, via a build tool such as esbuild, Rollup, Vite, or Webpack.

Install `@microsoft/fast-element` as a dependency:

```bash
npm install --save @microsoft/fast-element
```

If you're publishing a reusable component library, you can install `@microsoft/fast-element` as a peer dependency instead with the `--save-peer` flag.

You may need to adjust your `tsconfig.json` to accommodate the conventions used throughout this guide. The following options are recommended:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true, // required for decorators (`@attr`, `@observable`, `@volatile`, etc.)
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "useDefineForClassFields": false
  }
}
```

:::note
TypeScript enables `useDefineForClassFields` by default when `target` is `ES2022` or higher. FAST's property decorators (`@attr`, `@observable`, and others) rely on the older field-assignment semantics, so this option must be set to `false` explicitly. Because the default changes with the compilation target, it's an easy setting to overlook. See [microsoft/fast#5261](https://github.com/microsoft/fast/issues/5261) for the tracking discussion.
:::

## Create a Web Component

A FAST Web Component is composed of three parts: a _component class_, an _HTML template_, and a _CSS stylesheet_. Once defined, the custom element can be used on a page like any other HTML element.

To start, let's create a basic element that combines all the necessary parts.

### Component Class

Typically, when creating a custom element in the browser, you would extend `HTMLElement` and define your element's behavior in the class body. With FAST Element, you extend `FASTElement`, which provides additional features and optimizations on top of the standard Web Component APIs.

```ts
import { FASTElement } from "@microsoft/fast-element/fast-element.js";

class HelloWorld extends FASTElement {}
```

Properties on the component class can be decorated with `@attr` to create an attribute that can be set on the element in HTML. For example, to create a `name` attribute that can be used to personalize our greeting:

```ts
import { attr } from "@microsoft/fast-element/attr.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";

class HelloWorld extends FASTElement {
    @attr
    name?: string;
}
```

This decorator enables two-way syncing between the `name` property and the `name` attribute on the element. When the attribute is updated in HTML, the property will be updated in JavaScript, and vice versa.

### Template

Next, we can use FAST Element's `html` tagged template literal to define the structure of our component and bind dynamic content from the class:

```ts
import { html } from "@microsoft/fast-element/html.js";

const template = html<HelloWorld>`
    <template>
        <span>Hello ${x => x.name}!</span>
    </template>
`;
```

The `${x => x.name}` interpolation is a function that takes the component instance (`x`) and returns the value of the `name` property. When the component is processed, this expression will be turned into a one-way binding, and the content will update whenever the element instance's `name` property changes.

Additionally, by providing the type parameter `<HelloWorld>` to the `html` function, we can get better type safety and autocompletion for our component's properties within the template.

### Styles

Let's define some styles for our component using the `css` tagged template literal:

```ts
import { css } from "@microsoft/fast-element/css.js";

const styles = css`
    :host {
        border: 1px solid blue;
    }

    span {
        color: green;
    }
`;
```

Styles applied via the component definition are isolated to the element's Shadow DOM, so they won't leak out and affect other elements on the page. The `:host` selector targets the custom element itself, while the `span` selector styles the `<span>` inside our template.

### Define the Custom Element

Calling the `define()` method on the component class associates it with the provided tag name, template, and styles, and registers it as a custom element in the browser:

```ts
HelloWorld.define({
    name: "hello-world",
    template,
    styles,
});
```

### Use the Custom Element

Now that our custom element is defined, we can use it in our HTML like any other element. Here's the complete code for our `HelloWorld` component, along with an example of how to use it in an HTML page:

```ts
import { attr, css, FASTElement, html } from "@microsoft/fast-element";

const template = html`
    <template>
        <span>Hello ${x => x.name}!</span>
    </template>
`;

const styles = css`
    :host {
        border: 1px solid blue;
    }

    span {
        color: red;
    }
`;

class HelloWorld extends FASTElement {
    @attr
    name?: string;
}

HelloWorld.define({
    name: "hello-world",
    template,
    styles,
});
```

```html
<html>
  <head>
    <script type="module" src="./hello-world.js"></script>
  </head>
  <body>
    <hello-world name="World"></hello-world>
  </body>
</html>
```
