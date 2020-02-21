# Building Components

The `fast-element` library is a lightweight solution for easily building performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework.

## Defining an Element

To define a custom element, begin by creating a class that extends `FastElement` and decorate it with the `@customElement` decorator, providing the element name.

```TypeScript
import { FastElement, customElement } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FastElement {

}
```

With this in place, you can now use your `name-tag` element anywhere in HTML with the following markup:

```HTML
<name-tag></name-tag>
```

> **IMPORTANT:** Web Component names must contain a `-`, in order to prevent future conflicts with built-in elements and to namespace components from different libraries. For more information on the basics of web components [see this set of articles](https://developers.google.com/web/fundamentals/web-components).

We've got a basic web component in place, but it doesn't do much. So, let's add an attribute and make it render something. 

```TypeScript
import { FastElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
```

To add attributes to your HTML element, create properties decorated by the `@attr` decorator. All attributes defined this way will be automatically registered with the platform so that they can be updated through the browser's native `setAttribute` API as well as the property. You can optionally add a `$propertyName$Changed` method to your class, and it will be called whenever your property changes, whether it changes through the property or the attribute API.

> **Note:** All properties decorated with `@attr` are also *observable*. See the templating section below for information about how observables enable efficient rendering.

By default, anything extending from `FastElement` will automatically have a *shadow root* attached in order to enable encapsulated rendering. The example above references the `shadowRoot` to set its `innerHTML` any time the `greeting` property changes.

To see it in action, you can use the same HTML as above, or change the default `greeting` with the following:

```HTML
<name-tag greeting="Hola"></name-tag>
```

### The Element Lifecycle

All Web Components support a series of lifecycle events that you can tap into to execute custom code at specific points in time. FAST Element implements several of these callbacks automatically, in order to enable features of its templating engine (described below). However, you can override them to provide your own code. Here's an example of how you would execute custom code at the time when your element is connected to the DOM.

```TypeScript
@customElement('name-tag')
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('name-tag is now connected to the DOM');
  }
}
```

The full list of available lifecyle callbacks is:

| Callback | Description |
| ------------- |-------------|
| constructor | Runs when the element is created or upgraded. FAST Element will attach the shadow DOM at this time and hydrate it with the HTML template, if one was provided. |
| connectedCallback | Runs when the element is inserted into the DOM. FAST Element will connect template bindings in order to finalize the initial render at this time. |
| disconnectedCallback | Runs when the element is removed from the DOM. FAST Element will remove template bindings and clean up resources at this time. |
| attributeChangedCallback(attrName, oldVal, newVal) | Runs any time one of the element's custom attributes changes. FAST Element uses this to sync the attribute with its property. When the property updates, a render update is also queued, if there was a template dependency. |
| adoptedCallback | Runs if the element was moved from its current `document` into a new `document` via a call to the `adoptNode(...)` API. |

## Declaring a Template

While you can create and update nodes in the Shadow DOM manually, FAST Element provides a streamlined templating system for the most common rendering scenarios. To create an HTML template for an element, import and use the `html` tagged template helper and pass the template to the `@customElement` decorator.

Here's how we would add a template for our `name-tag` component that renders some basics structure as well as our `greeting`:

```TypeScript
import { FastElement, customElement, attr, html } from '../fast-dna';

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body"></div>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FastElement {
  @attr greeting: string = 'Hello';
}
```

TODO

- Declare a template
    - Use arrow functions for dynamic template parts
    - Binding to properties, attributes, content, events
    - Ref bindings
    - When directive
    - Repeat directive
    - Composing templates
    - Declare observable properties
- Working with Shadow DOM
    - slots (default, named, fallback content)
- Defining CSS
    - composing CSS
    - shadow dom styling
        - :host
        - ::slotted()
        - CSS contain
    - CSS properties