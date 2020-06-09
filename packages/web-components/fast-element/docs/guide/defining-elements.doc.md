---
id: defining-elements
title: Defining Elements
sidebar_label: Defining Elements
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-element/docs/guide/defining-elements.doc.md
---

## Basic Elements

To define a custom element, begin by creating a class that extends `FASTElement` and decorate it with the `@customElement` decorator, providing the element name.

**Example: A Basic `FASTElement` Definition**

```ts
import { FASTElement, customElement } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {

}
```

With this in place, you can now use your `name-tag` element anywhere in HTML with the following markup:

**Example: Using a Web Component**

```html
<name-tag></name-tag>
```

:::important
Web Component names must contain a `-` in order to prevent future conflicts with built-in elements and to namespace components from different libraries. For more information on the basics of Web Components [see this set of articles](https://developers.google.com/web/fundamentals/web-components).
:::

We've got a basic Web Component in place, but it doesn't do much. So, let's add an attribute and make it render something. 

**Example: Adding Attributes to a `FASTElement`**

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
```

To add attributes to your HTML element, create properties decorated by the `@attr` decorator. All attributes defined this way will be automatically registered with the platform so that they can be updated through the browser's native `setAttribute` API as well as the property. You can optionally add a method with the naming convention *propertyName*Changed to your class (e.g. `greeting` and `greetingChanged()`), and this method will be called whenever your property changes, whether it changes through the property or the attribute API.

:::note
All properties decorated with `@attr` are also *observable*. See [observables and state](./observables-and-state) for information about how observables enable efficient rendering.
:::

By default, anything extending from `FASTElement` will automatically have a `ShadowRoot` attached in order to enable encapsulated rendering. The example above references the `shadowRoot` to set its `innerHTML` any time the `greeting` property changes.

To see it in action, you can use the same HTML as above, or change the default `greeting` with the following:

**Example: Using a Web Component with Attributes**

```html
<name-tag greeting="Hola"></name-tag>
```

## Customizing Attributes

By default, any attribute created with `@attr` will perform no explicit type coercion other than when it reflects its value to the HTML DOM via the `setAttribute` API. However, you can convert DOM attribute string values to and from arbitrary types as well as control the `mode` that is used to reflect property values to the DOM. There are three modes available through the `mode` property of the attribute configuration:

* `reflect` - The *default* mode that is used if none is specified. This reflects property changes to the DOM. If a `converter` is supplied, it will invoke the converter before calling the `setAttribute` DOM API.
* `boolean` - This mode causes your attribute to function using the HTML boolean attribute behavior. When your attribute is present in the DOM or equal to its own name, the value will be true. When the attribute is absent from the DOM, the value of the property will be false. Setting the property will also update the DOM by adding/removing the attribute.
* `fromView` - This mode skips reflecting the value of the property back to the HTML attribute, but does receive updates when changed through `setAttribute`.

In addition to setting the `mode`, you can also supply a custom `ValueConverter` by setting the `converter` property of the attribute configuration. The converter must implement the following interface:

```ts
interface ValueConverter {
    toView(value: any): string;
    fromView(value: string): any;
}
```

Here's how it works:

* When the DOM attribute value changes, the converter's `fromView` method will be called, allowing custom code to coerce the value to the proper type expected by the property.
* When the property value changes, the converter's `fromView` method will also be called, ensuring that the type is correct. After this, the `mode` will be determined. If the mode is set to `reflect` then the converter's `toView` method will be called to allow the type to be formatted before writing to the attribute using `setAttribute`.

::important
When the `mode` is set to `boolean`, a built-in `booleanConverter` is automatically used to ensure type correctness so that manual configuration of the converter is not needed in this common scenario.
:::

**Example: An Attribute in Reflect Mode with No Special Conversion**

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

**Example: An Attribute in Boolean Mode with Boolean Conversion**

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('my-checkbox')
export class MyCheckbox extends FASTElement {
  @attr({ mode: 'boolean' }) disabled: boolean = false;
}
```

**Example: An Attribute in Reflect Mode with Custom Conversion**

```ts
import { FASTElement, customElement, attr, ValueConverter } from '@microsoft/fast-element';

const numberConverter: ValueConverter = {
  toView(value: any): string {
    // convert numbers to strings
  },

  fromView(value: string): any {
    // convert strings to numbers
  }
};

@customElement('my-counter')
export class MyCounter extends FASTElement {
  @attr({ converter: numberConverter }) count: number = 0;
}
```

## The Element Lifecycle

All Web Components support a series of lifecycle events that you can tap into to execute custom code at specific points in time. `FASTElement` implements several of these callbacks automatically in order to enable features of its templating engine (described in [declaring templates](./declaring-templates)). However, you can override them to provide your own code. Here's an example of how you would execute custom code when your element is inserted into the DOM.

**Example: Tapping into the Custom Element Lifecycle**

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
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

The full list of available lifecycle callbacks is:

| Callback | Description |
| ------------- |-------------|
| constructor | Runs when the element is created or upgraded. `FASTElement` will attach the shadow DOM at this time and hydrate it with the HTML template, if one was provided. |
| connectedCallback | Runs when the element is inserted into the DOM. `FASTElement` will connect template bindings in order to finalize the initial render at this time. |
| disconnectedCallback | Runs when the element is removed from the DOM. `FASTElement` will remove template bindings and clean up resources at this time. |
| attributeChangedCallback(attrName, oldVal, newVal) | Runs any time one of the element's custom attributes changes. `FASTElement` uses this to sync the attribute with its property. When the property updates, a render update is also queued, if there was a template dependency. |
| adoptedCallback | Runs if the element was moved from its current `document` into a new `document` via a call to the `adoptNode(...)` API. |