---
id: declaring-templates
title: Declaring Templates
sidebar_label: Declaring Templates
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/guide/declaring-templates.md
---

## Basic templates

While you can create and update nodes in the Shadow DOM manually, `FASTElement` provides a streamlined templating system for the most common rendering scenarios. To create an HTML template for an element, import and use the `html` tagged template helper and pass the template to the `@customElement` decorator.

Here's how we would add a template for our `name-tag` component that renders some basic structure as well as our `greeting`:

**Example: Adding a Template to a `FASTElement`**

```ts
import { FASTElement, customElement, attr, html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">TODO: Name Here</div>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

There are several important details in the above example, so let's break them down one-by-one.

First, we create a template by using a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). The tag, `html`, provides special processing for the HTML string that follows, returning an instance of `ViewTemplate`.

Within a template, we provide *bindings* that declare the *dynamic parts* of our template. These bindings are declared with [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Because the template is typed, the input to your arrow function will be an instance of the data model you declared in your `html` tag. When the `html` tag processes your template, it identifies these dynamic expressions and builds up an optimized model, capable of high-performance rendering, and efficient, incremental batched updates.

Finally, we associate the template with our custom element by using a new form of the `@customElement` decorator, which allows us to pass more options. In this configuration, we pass an options object specifying the `name` and the `template`.

With this in place, we now have a `name-tag` element that will render its template into the Shadow DOM and automatically update the `h3` content whenever the name tag's `greeting` attribute changes. Give it a try!

### Typed Templates

Your templates can be *typed* to the data model that they are rendering over. In TypeScript, we provide the type as part of the tag: `html<NameTag>`. For TypeScript 3.8 or higher, you can import `ViewTemplate` as a type:

```ts
import type { ViewTemplate } from '@microsoft/fast-element';

const template: ViewTemplate<NameTag> = html`
  <div>${x => x.greeting}</div>
`;
```

## Understanding bindings

We've seen how arrow functions can be used to declare dynamic parts of templates. Let's look at a few more examples to see the breadth of what is available to you.

### Content

To bind the content of an element, simply provide the expression within the start and end tags of the element. It can be the sole content of the element or interwoven with other elements and text.

**Example: Basic Text Content**

```html
<h3>${x => x.greeting.toUpperCase()}</h3>
```

**Example: Interpolated Text Content**

```html
<h3>${x => x.greeting}, my name is ${x => x.name}.</h3>
```

**Example: Heterogeneous Content**

```html
<h3>
  ${x => x.greeting}, my name is
  <span class="name">${x => x.name}</span>.
</h3>
```

:::note
Dynamic content is set via the `textContent` HTML property for security reasons. You *cannot* set HTML content this way. See below for the explicit, opt-in mechanism for setting HTML.
:::

### Attributes

You can also use an expression to set an attribute value on an HTML Element. Simply place the expression where the value of the HTML attribute would go. The template engine will then use your expression to set the value using `setAttribute(...)`, whenever it needs to be updated. Additionally, some attributes are known as [boolean attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Boolean_Attributes) (e.g. required, readonly, disabled). These attributes behave differently from normal attributes and need special value handling. The templating engine will handle this for you if you prepend the attribute name with a `?`.

**Example: Basic Attribute Values**

```html
<a href="${x => x.aboutLink}">About</a>
```

**Example: Interpolated Attribute Values**

```html
<a href="products/${x => x.id}">
  ${x => x.name}
</a>
```

```html
<li class="list-item ${x => x.type}">
  ...
</li>
```

:::tip
When binding to `class`, the underlying engine will not over-write classes added to the element via other mechanisms. It only adds and removes classes that result directly from the binding. This "safe by default" behavior does come at a slight performance cost. To opt-out of this feature and squeeze out every ounce of performance by always overwriting all classes, use a property binding (see below) on the `className` property. e.g. `:className="list-item ${x => x.type}"`.
:::

```html
<span style="text-decoration: ${x => x.done ? 'line-through' : ''}">
  ${x => x.description}
</span>
```

**Example: ARIA Attributes**

```html
<div role="progressbar"
     aria-valuenow="${x => x.value}"
     aria-valuemin="${x => x.min}"
     aria-valuemax="${x => x.max}">
</div>
```

**Example: Boolean Attributes**

```html
<button type="submit" ?disabled="${x => !x.enabled}">Submit</button>
```

### Properties

Properties can also be set directly on an HTML element. To do so, prepend the property name with `:` to indicate a property binding. The template engine will then use your expression to assign the element's property value.

**Example: Basic Property Values**

```html
<my-element :myCustomProperty="${x => x.mySpecialData}">
  ...
</my-element>
```

**Example: Inner HTML**

```html
<div :innerHTML="${x => x.someDangerousHTMLContent}"></div>
```

:::warning
Avoid scenarios that require you to directly set HTML, especially when the content is coming from an external source. If you must do this, you should always sanitize the HTML.

The best way to accomplish HTML sanitization is to configure [a trusted types policy](https://w3c.github.io/webappsec-trusted-types/dist/spec/) with FASTElement's template engine. FASTElement ensures that all HTML strings pass through the configured policy. Also, by leveraging the platform's trusted types capabilities, you get native enforcement of the policy through CSP headers. Here's an example of how to configure a custom policy to sanitize HTML:

```ts
import { DOM } from '@microsoft/fast-element';

const myPolicy = trustedTypes.createPolicy('my-policy', {
  createHTML(html) {
    // TODO: invoke a sanitization library on the html before returning it
    return html;
  }
});

DOM.setHTMLPolicy(myPolicy);
```

For security reasons, the HTML Policy can only be set once. For this reason, it should be set by application developers and not by component authors, and it should be done immediately during the startup sequence of the application.
:::

### Events

Besides rendering content, attributes, and properties, you'll often want to add event listeners and execute code when events fire. To do that, prepend the event name with `@` and provide the expression to be called when that event fires. Within an event binding, you also have access to a special *context* argument from which you can access the `event` object.

**Example: Basic Events**

```html
<button @click="${x => x.remove()}">Remove</button>
```

**Example: Accessing Event Details**

```html
<input type="text"
       :value="${x => x.description}"
       @input="${(x, c) => x.handleDescriptionChange(c.event)}">
```

:::important
In both examples above, after your event handler is executed, `preventDefault()` will be called on the event object by default. You can return `true` from your handler to opt-out of this behavior.
:::

The second example demonstrates an important characteristic of the templating engine: it only supports *unidirectional data flow* (model => view). It does not support *two-way data binding* (model <=> view). As shown above, pushing data from the view back to the model should be handled with explicit events that call into your model's API.

## Templating and the element lifecycle

It is during the `connectedCallback` phase of the Custom Element lifecycle that `FASTElement` creates templates and binds the resulting view. The creation of the template only occurs the first time the element is connected, while binding happens every time the element is connected (with unbinding happening during the `disconnectedCallback` for symmetry).

:::note
In the future we're planning new optimizations that will enable us to safely determine when we do not need to unbind/rebind certain views.
:::

In most cases, the template that `FASTElement` renders is determined by the `template` property of the Custom Element's configuration. However, you can also implement a method on your Custom Element class named `resolveTemplate()` that returns a template instance. If this method is present, it will be called during `connectedCallback` to obtain the template to use. This allows the element author to dynamically select completely different templates based on the state of the element at the time of connection.

In addition to dynamic template selection during the `connectedCallback`, the `$fastController` property of `FASTElement` enables dynamically changing the template at any time though setting the controller's `template` property to any valid template.