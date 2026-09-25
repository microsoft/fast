---
id: fast-element
title: FASTElement
sidebar_label: FASTElement
keywords:
  - FASTElement
  - web components
---

# FASTElement

The `FASTElement` class can be extended from for your custom component logic.

## Attribute Bindings

Attributes are defined using the `@attr` decorator.

**Example:**
```ts
import { FASTElement, attr } from '@microsoft/fast-element';

export class MyElement extends FASTElement {
  @attr
  foo: string;
}
```

HTML file:
```html
<my-element foo="Hello"></my-element>
```

An `@attr` can take a configuration with the following options:

| Property | Description | Values | Default |
|-|-|-|-|
| attribute | The attribute name that is reflected in the DOM, this can be specified in cases where a different string is preferred. | `string` | The class property converted to lowercase |
| mode | If the attribute is a boolean and the mode is set to "boolean" this allows `FASTElement` to add/remove the attribute from the element in the same way that [native boolean attributes on elements work](https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML). The "fromView" behavior only updates the property value based on changes in the DOM, but does not reflect property changes back. | `"reflect" \| "boolean" \| "fromView"` | "reflect" |
| converter | This allows the value of the attribute to be converted when moving to and from the HTML template. | [See ValueConverter Interface](#converters) | |

Example with a custom attribute name and boolean mode:
```ts
import { FASTElement, attr } from '@microsoft/fast-element';

export class MyElement extends FASTElement {
  @attr({
    attribute: "foo-bar",
    mode: "boolean"
  })
  foo: boolean;
}
```

HTML file:
```html
<my-element foo-bar></my-element>
```

:::tip
As a handy feature, attribute names are automatically converted to a lower-case version in HTML, so declaring `fooBar` as an `@attr` in `FASTElement` will in HTML convert to `foobar`. We include the configuration option of `attribute` to allow re-naming, and one of the most common use cases is adding dashes, so you can have `foo-bar` as in the example above.
:::

:::important
When the `mode` is set to `boolean`, a built-in `booleanConverter` is automatically used to ensure type correctness so that the manual configuration of the converter is not needed in this common scenario.
:::

### Converters

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

**Example: An Attribute in Reflect Mode with Custom Conversion**

```ts
import { FASTElement, attr, ValueConverter } from '@microsoft/fast-element';

const numberConverter: ValueConverter = {
  toView(value: any): string {
    // convert numbers to strings
  },

  fromView(value: string): any {
    // convert strings to numbers
  }
};

export class MyCounter extends FASTElement {
  @attr({ converter: numberConverter }) count: number = 0;
}

MyCounter.define({
  name: 'my-counter'
});
```

A few commonly used converters are available as well:

- [booleanConverter](/docs/api/fast-element.booleanconverter)
- [nullableBooleanConverter](/docs/api/fast-element.nullablebooleanconverter)
- [nullableNumberConverter](/docs/api/fast-element.nullablenumberconverter)

## Observables

While `@attr` is used for primitive properties (string, boolean, and number), the `@observable` decorator is for all other properties. In addition to observing properties, the templating system can also observe arrays.

These decorators are a means of meta-programming the properties on your class, such that they include all the implementation needed to support state tracking, observation, and reactivity. You can access any property within your template, but if it hasn't been decorated with one of these two decorators, its value will not update after the initial render.

:::important
Properties with only a getter, that function as a computed property over other observables, should not be decorated with `@attr` or `@observable`. However, they may need to be decorated with `@volatile`, depending on the internal logic.
:::

```ts
import { FASTElement, observable } from '@microsoft/fast-element';

export class MyComponent extends FASTElement {
  @observable
  someBoolean = false;

  @observable
  valueA = 0;

  @observable
  valueB = 42;
}
```

A common use case for `@observable` is with slotted elements.

**Example: Track changes to elements being added/removed to a slot**

```ts
import { FASTElement, observable } from '@microsoft/fast-element';

class MyComponent extends FASTElement {
  @observable
  public slottedItems: HTMLElement[];

  protected itemCount: number;

  public slottedItemsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]): void {
    if (this.$fastController.isConnected) {
      this.itemCount = newValue.length;
    }
  }
}
```

### Manually tracking observables

When `@attr` and `@observable` decorated properties are accessed during template rendering, they are tracked, allowing the engine to deeply understand the relationship between your model and view. These decorators serves to meta-program the property for you, injecting code to enable the observation system. However, if you do not like this approach, for `@observable`, you can always implement notification manually. This is especially useful if you need to do some additional logic inside a `getter` and `setter`. Here's what that would look like:

**Example: Manual Observer Implementation**

```ts
import { Observable } from '@microsoft/fast-element';

export class Person {
  private _name: string;

  get name() {
    Observable.track(this, 'name');
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    Observable.notify(this, 'name');
  }
}
```

## Emitting Events

In various scenarios, it may be appropriate for a custom element to publish its own element-specific events. To do this, you can use the `$emit` helper on `FASTElement`. It's a convenience method that creates an instance of `CustomEvent` and uses the `dispatchEvent` API on `FASTElement` with the `bubbles: true` and `composed: true` options. It also ensures that the event is only emitted if the custom element is fully connected to the DOM.

**Example: Custom Event Dispatch**

```ts
const template = html`
  <input @change="${x => x.valueChanged()}" />
`;

export class MyInput extends FASTElement {
  @attr
  value: string = '';

  valueChanged() {
    this.$emit('change', this.value);
  }
}
```

:::tip
When emitting custom events, ensure that your event name is always lower-case, so that your Web Components stay compatible with various front-end frameworks that attach events through DOM binding patterns (the DOM is case insensitive).
:::

## Defining

`FASTElement` has a `define` method, this is the means by which a custom web component is registered with the browser.

**Example:**
```ts
import { FASTElement } from '@microsoft/fast-element';

export class MyElement extends FASTElement {}

MyElement.define({
  name: 'my-element'
});
```

:::important
Defining a web component creates [side effects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only). This is important to note as [tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) may cause web components to be removed during transpile even if they are imported. Ensure that your build system accounts for this and does not tree shake out your web components.
:::

This configuration can take various options:

| Property | Description | Values | Default | Required |
|-|-|-|-|-|
| name | The [name of the custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements#name). | | | Yes |
| template | The template to render for the custom element. Use the `html` tag template literal to create this template. | | | |
| styles | The styles to associate with the custom element. Use the `css` tag template literal to create this template. | | | |
| shadowOptions | Options controlling the creation of the custom element's shadow DOM. Provide null to render to the associated template to the light DOM instead. Example: `{ delegatesFocus: true }`, see the [ShadowRoot API](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) for details. | | Defaults to an open shadow root. | |
| elementOptions | [Options](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#options) controlling how the custom element is defined with the platform. | | | |
| registry | The registry to register this component in by default. | | If not provided, defaults to the global registry. | |

A typical configuration will at least include `name`, `template`, and `styles`.

**Example:**
```ts
import { attr, css, FASTElement, html } from "@microsoft/fast-element";

const template = html`<span>Hello ${x => x.name}!</span>`

const styles = css`
    :host {
      border: 1px solid blue;
    }
`;

class HelloWorld extends FASTElement {
  @attr
  name: string;
}

HelloWorld.define({
  name: "hello-world",
  template,
  styles,
});
```

**Example: Defining with a custom registry**
```ts
export const FooRegistry = Object.freeze({
  prefix: 'foo',
  registry: customElements,
});

HelloWorld.compose({
  name: `${FooRegistry.prefix}-tab`,
  template,
  styles,
}).define(FooRegistry);
```

## Lifecycle

All Web Components support a series of lifecycle events that you can tap into to execute custom code at specific points in time. `FASTElement` implements several of these callbacks automatically in order to enable features of its templating engine. However, you can override them to provide your own code. Here's an example of how you would execute custom code when your element is inserted into the DOM.

**Example: Tapping into the Custom Element Lifecycle**

```ts
import { FASTElement, attr } from '@microsoft/fast-element';

export class NameTag extends FASTElement {
  @attr
  greeting: string = 'Hello';

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
| constructor | Runs when the element is created or upgraded. `FASTElement` will attach the shadow DOM at this time. |
| connectedCallback | Runs when the element is inserted into the DOM. On first connect, `FASTElement` hydrates the HTML template, connects template bindings, and adds the styles. |
| disconnectedCallback | Runs when the element is removed from the DOM. `FASTElement` will remove template bindings and clean up resources at this time. |
| `<attribute>Changed(oldVal, newVal)` | Runs any time one of the element's custom attributes changes. `FASTElement` uses this to sync the attribute with its property. When the property updates, a render update is also queued, if there was a template dependency. The naming convention is to add "Changed" to the end of the attribute name, and that is the method that will get called. |
| adoptedCallback | Runs if the element was moved from its current `document` into a new `document` via a call to the `adoptNode(...)` API. |
