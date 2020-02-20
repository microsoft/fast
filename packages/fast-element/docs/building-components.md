# Building Components

The `fast-element` library is a lightweight solution for easily building performant, memory-efficient, standards-compliant web components. Fast elements work in every major browser and can be used in combination with any front-end framework or even without a framework.

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

## The Custom Element Lifecycle



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