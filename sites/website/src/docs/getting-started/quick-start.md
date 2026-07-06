---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
keywords:
  - quick start
  - web components
---

# Quick Start

## Install the package

```bash
npm install --save @microsoft/fast-element
```

## Create a web component

A web component created using FAST is comprised of 3 parts, the HTML template, the CSS styles, and the component logic. Web components can be as simple as a button, or as complex as a full page interactive experience.

To start, let's create a simple web component that combines all the necessary parts:
```typescript
import { attr, css, FASTElement, html } from "@microsoft/fast-element";

/**
 * Create an HTML template using the html tag template literal,
 * this contains interpolated text content from a passed attribute
 */
const template = html`<span>Hello ${x => x.name}!</span>`

/**
 * Create CSS styles using the css tag template literal
 */
const styles = css`
    :host {
      border: 1px solid blue;
    }

    span {
      color: red;
    }
`;

/**
 * Define your component logic by creating a class that extends
 * the FASTElement, note the addition of the attr decorator,
 * this creates an attribute on your component which can be passed.
 */
class HelloWorld extends FASTElement {
  @attr
  name: string;
}

/**
 * Define your custom web component for the browser, as soon as the file
 * containing this logic is imported, the element "hello-world" will be
 * defined in the DOM with it's html, styles, logic, and tag name.
 */
HelloWorld.define({
  name: "hello-world",
  template,
  styles,
});
```

## Add it to your project

Now that the "hello-world" custom web component has been defined, it can be included in your HTML like so:

```html
<script type="module" src="path/to/hello-world.js"></script>
<hello-world name="Earth"></hello-world>
```

It's as simple as that!

Continue reading through the docs to understand all of the potential ways to use `@microsoft/fast-element` for your website or application.