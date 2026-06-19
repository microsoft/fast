---
id: html-templates
title: HTML Templates
layout: 3x
eleventyNavigation:
  key: html-templates3x
  parent: getting-started3x
  title: HTML Templates
  order: 3
navigationOptions:
  activeKey: html-templates3x
keywords:
  - html
  - template
  - web components
---

# HTML Templates

Custom elements typically build their shadow DOM either imperatively, by calling DOM APIs such as `appendChild()`, or by cloning a `<template>` element. FAST provides a tagged template function called `html`, which lets you describe the structure of a component's view declaratively in JavaScript and bind it to the component's state.

Templates created with `html` are reactive. When an expression interpolated into the template reads from an observable property, FAST's observation system subscribes to that property and updates the corresponding part of the DOM whenever the value changes. Properties become observable through `@attr`, `@observable`, or the lower-level [`Observable`](../../getting-started/fast-element/#manually-tracking-observables) APIs. A template is associated with a component through the `template` option passed to [`define()` or `compose()`](../../getting-started/fast-element/#defining-the-element).

This document describes how to author templates with the `html` function, including bindings for content, attributes, properties, and events, and how to type templates for use with TypeScript.

:::tip
For server-side rendering, see the [declarative templates](../../declarative-templates/overview/) documentation, which describes an alternate authoring format and the [`observerMap()`](../../declarative-templates/defining-elements/#observermap) extension for making schema-derived properties observable.
:::

## Template Basics

The `html` function is a tagged template literal that takes a template string and returns a `ViewTemplate` object that can be used as the `template` option when defining a component. The template string can contain any valid HTML.

```ts
import { FASTElement, html } from "@microsoft/fast-element";

class HelloWorld extends FASTElement {}

const template = html<HelloWorld>`
  <span>Hello World!</span>
`;

HelloWorld.define({
  name: "hello-world",
  template,
});
```

The example above creates a basic template that renders a `<span>` with the text "Hello World!" into the component's shadow DOM. When a `<hello-world>` element is used in HTML, the browser produces the following structure:

```html
<hello-world>
  #shadow-root
    <span>Hello World!</span>
</hello-world>
```

## Template Bindings

The `html` function supports several types of bindings for interpolating dynamic content from the component class into the template. These include content bindings, attribute bindings, property bindings, and event bindings. Each type of binding has a specific syntax for indicating how the value should be applied to the DOM.

### Binding Expressions

Binding expressions are arrow functions of the form `(source, context) => value`. The `source` argument is the data source the template was bound to, which for component templates is the component instance. The `context` argument is an `ExecutionContext` object whose contents vary depending on where the binding appears in the template. By convention these arguments are named `x` and `c` respectively, but any names may be used, and the `context` argument can be omitted when it is not needed.

```ts
const template = html<MyElement>`
  <span>${(x, c) => x.format(c.index)}</span>
`;
```

:::note
A non-function value passed to `${...}` is treated as a one-time static value and is not re-evaluated.

Dynamic content is set via the `textContent` HTML property for security reasons. You *cannot* set HTML content this way. See the [Property bindings](#property-bindings) section for the explicit, opt-in mechanism for setting HTML via `:innerHTML`, which is blocked by the default DOMPolicy unless you configure an `innerHTML` guard. Follow the [DOMPolicy and Trusted Types guide](../advanced/dom-policy-and-trusted-types/) before rendering sanitized HTML.
:::

### Content Bindings

Content bindings are used to insert dynamic text or HTML content into the template. They are denoted by `${...}` interpolation, with an arrow function as the expression. FAST invokes the function with the current source (typically the component instance) and uses its return value as the bound content. Because the binding is a function, FAST can re-invoke it whenever an observable property it reads from changes.

```ts
import { FASTElement, html, observable } from "@microsoft/fast-element";

class HelloWorld extends FASTElement {
  @observable
  name = "World";
}

const template = html<HelloWorld>`
  <span>Hello ${x => x.name}!</span>
`;

HelloWorld.define({
  name: "hello-world",
  template,
});
```

In the example above, the content binding `${x => x.name}` reads from the `name` property of the component instance. When the observed `name` property changes, FAST re-evaluates the expression and updates the rendered text.

### Attribute Bindings

Attribute bindings are used to set the value of an HTML attribute on an element. While the appearance of attribute bindings are the same as content bindings, FAST treats them differently based on their position in the template. When an interpolation appears where an attribute value is expected, FAST creates an attribute binding instead of a content binding. The value returned by the binding function is set as the value of the attribute on the element.

```ts
const template = html<MyElement>`
  <a href="${x => x.url}">Link</a>
`;
```

Whenever `url` changes, FAST updates the `href` attribute on the rendered `<a>` element. If the same expression appeared between tags, it would create a content binding instead. The position in the template determines the type of binding FAST creates.

### Boolean Attribute Bindings

To toggle boolean attributes, prefix the attribute name with a question mark (`?`). The value returned by the binding function is converted to a boolean, and the attribute is added or removed based on that value.

```ts
const template = html<MyElement>`
  <div ?hidden="${x => x.collapsed}">...</div>
`;
```

The `?hidden` binding adds the `hidden` attribute when `collapsed` is truthy and removes it when `collapsed` is falsy. Boolean attribute bindings are useful for attributes whose meaning is their presence or absence, such as `hidden`, `disabled`, and `required`, where setting `attribute="false"` would not have the intended effect.

### Property Bindings

Property bindings are used to set the value of a DOM property on an element within the template. They are denoted by prefixing an attribute binding with a colon (`:`). The value returned by the binding function is assigned to the corresponding property on the DOM element rather than being serialized to an HTML attribute.

```ts
const template = html<MyElement>`
  <input type="checkbox" :indeterminate="${x => x.isIndeterminate}">
`;
```

In the example above, the property binding `:indeterminate="${x => x.isIndeterminate}"` sets the `indeterminate` property of the `<input>` element to the boolean value returned by `x.isIndeterminate`. The `indeterminate` property has no corresponding HTML attribute and can only be set through JavaScript, so a property binding is the only way to control it from a template.

Property bindings are case-sensitive. Camel-cased property names such as `:tabIndex`, `:ariaLabel`, and `:scrollTop` are preserved as written and resolved against the corresponding DOM properties.

:::note
FAST does not allow binding to `innerHTML` without first attaching a [`DOMPolicy`](../../advanced/dom-policy-and-trusted-types/) to the template, to prevent accidental injection of untrusted markup.
:::

#### Binding to `classList`

`:classList` is a special property binding that targets the element's `classList`. The binding accepts a space-separated string of class names and adds them to the element. Unlike a plain `class="${...}"` attribute binding, which overwrites the entire `class` attribute on every update, `:classList` only manages the classes it added on the previous evaluation. Classes added by other code, or by other `:classList` bindings on the same element, are left untouched.

```ts
const template = html<MyElement>`
  <div :classList="${x => x.modifierClasses}">...</div>
`;
```

When `modifierClasses` changes from `"foo bar"` to `"baz"`, FAST removes `foo` and `bar` and adds `baz`. Any classes set on the element through other means remain in place.

### Event Bindings

Event bindings attach an event listener to an element within the template. They are denoted by prefixing the event name with an at symbol (`@`). When the event fires, FAST evaluates the binding expression. Unlike some frameworks, the expression is not expected to return a handler function; instead it does the work directly, typically by calling a method on the component.

```ts
import { FASTElement, html } from "@microsoft/fast-element";

class MyElement extends FASTElement {
  handleClick() {
    console.log("Button clicked!");
  }
}

const template = html<MyElement>`
  <button @click="${x => x.handleClick()}">Click Me</button>
`;
```

The `@click` binding adds a `click` listener to the `<button>`. When the button is clicked, FAST evaluates `x => x.handleClick()`, calling `handleClick` with the component instance as `x`.

#### Accessing the Event

The current event is available on the context argument as `c.event`. Use it when the handler needs to inspect the event itself, for example to check a modifier key:

```ts
class MyElement extends FASTElement {
  handleClick(event: MouseEvent) {
    if (event.shiftKey) {
      // ...
    }
  }
}

const template = html<MyElement>`
  <button @click="${(x, c) => x.handleClick(c.event as MouseEvent)}">Click Me</button>
`;
```

`c.event` is typed as `Event`, so a cast or narrowing is needed when the handler signature requires a more specific event type.

#### Preventing Default Behavior

FAST automatically calls `event.preventDefault()` after the handler runs. To opt out and allow the default behavior, return `true` from the handler:

```ts
handleClick(event: MouseEvent) {
  console.log("Button clicked!", event);

  return true; // Allow default behavior
}
```

## Host Element Bindings

By default, the content of a template is rendered into the shadow DOM of the component. To apply attributes, properties, or event listeners to the host element itself, use a `<template>` element as the root of the template. The `<template>` represents the host, and any binding placed on it is applied to the host element rather than to the shadow DOM. Content placed inside the `<template>` is still rendered into the shadow DOM as usual.

The simplest case is a static attribute on the host:

```ts
const template = html`
  <template role="progressbar">
    <span>Hello World!</span>
  </template>
`;
```

When rendered, the host element receives the `role` attribute:

```html
<my-element role="progressbar">
  #shadow-root
    <span>Hello World!</span>
</my-element>
```

If the consumer of the component sets the same attribute on the host directly, the consumer's value takes precedence over the value defined in the template.

All of the bindings described in [Template Bindings](#template-bindings) (content, attribute, boolean attribute, property, and event) work on the `<template>` root. For example, a progress bar can mirror its state to ARIA attributes on the host:

```ts
const template = html<ProgressBar>`
  <template
    role="progressbar"
    aria-valuenow="${x => x.value}"
    aria-valuemin="${x => x.min}"
    aria-valuemax="${x => x.max}"
  >
    ...
  </template>
`;
```

### Event Bindings on the Host

Event bindings on the `<template>` root attach listeners to the host element. This is a convenient place to handle events that should apply across the whole component, particularly keyboard or focus events that should be handled at the component boundary.

For example, a disclosure component might listen for the Escape key on the host to collapse, regardless of which descendant currently has focus:

```ts
const template = html<MyDisclosure>`
  <template @keydown="${(x, c) => x.handleKeydown(c.event as KeyboardEvent)}">
    <button @click="${x => x.toggle()}">${x => x.label}</button>
    <section ?hidden="${x => x.collapsed}">
      <slot></slot>
    </section>
  </template>
`;
```

The `@keydown` binding on the `<template>` root listens for keyboard events on the host. The handler then inspects the event and updates component state when appropriate.

## Typed Templates

The `html` tagged template function accepts a TypeScript type parameter that constrains the type of the `source` argument in every binding expression. For component templates, this is typically the component class:

```ts
const template = html<MyElement>`
  <span>${x => x.name}</span>
`;
```

With the type parameter in place, `x` is typed as `MyElement` and the compiler reports an error for any reference to a property that does not exist on the component. Without it, `x` falls back to `any` and binding expressions are not type-checked. Typing the template is optional but recommended for any non-trivial component, because the binding system has no way to verify property references at runtime.
