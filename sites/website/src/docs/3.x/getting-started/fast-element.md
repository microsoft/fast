---
id: fast-element
title: FASTElement
layout: 3x
eleventyNavigation:
  key: fast-element3x
  parent: getting-started3x
  title: FASTElement
  order: 2
navigationOptions:
  activeKey: fast-element3x
keywords:
  - FASTElement
  - web components
---

# The `FASTElement` Base Class

Custom elements in the browser start by extending the `HTMLElement` class. FAST provides a base class called `FASTElement`, which itself extends `HTMLElement`, and adds reactive property observation, automatic change callbacks, and lifecycle management for building web components. By extending `FASTElement`, you can take advantage of these features while still having access to all the standard Web Component APIs.

To create a custom FAST element, define a class that extends `FASTElement`. This class will contain the properties, methods, and lifecycle callbacks that define the behavior of your custom element:

```ts
import { FASTElement } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  // component logic goes here
}
```

## Declaring Attributes with the `@attr` Decorator

Native custom elements can define attributes by implementing the `observedAttributes` static getter and handling changes in the `attributeChangedCallback`. FAST simplifies this process with the `@attr` decorator, which allows you to declare attributes directly on class properties.

```ts
import { attr, FASTElement } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  @attr
  appearance?: string;
}
```

In this example, the `@attr` decorator tells `FASTElement` to treat `appearance` as an observed attribute. This means that when you use `<my-element appearance="value">`, the `appearance` property on the class will be automatically updated to reflect the value of the attribute. You can also set the property in JavaScript, and it will update the corresponding attribute in the DOM.

### Attribute Options

The `@attr` decorator accepts an optional configuration object that allows you to customize how the attribute is bound to the property. For example, you can specify a different attribute name, a converter for type coercion, or whether the attribute should reflect back to the DOM.

By default, decorated attribute properties use `mode: "reflect"`, which keeps the attribute and property in sync in both directions.

#### Different Attribute Name

Attributes in HTML are always case-insensitive, so FAST maps camelCase property names to lowercase attribute names by default. For example, a property named `myAttribute` would correspond to an attribute named `myattribute` in HTML.

A common convention is to use kebab-case for attribute names, so you can specify a different attribute name using the `attribute` option:

```ts
@attr({ attribute: "my-attribute" })
myAttribute?: string;
```

#### Boolean Attributes

The `mode` property allows for specifying boolean attributes, which are considered `true` if the attribute is present on the element, regardless of its value, and `false` if the attribute is absent:

```ts
@attr({ mode: "boolean" })
enabled?: boolean;
```

#### One-way Binding

By default, attributes and properties are kept in sync in both directions. However, if you want to create a one-way binding where changes to the property do not reflect back to the DOM, you can set the `mode` to `"fromView"`:

```ts
@attr({ attribute: "initial-value", mode: "fromView" })
initialValue?: string;
```

#### Value Converters

If your property expects a type other than `string`, you can provide a converter object to specify how to convert between the attribute value and the property value. The most common use case for a custom converter is to handle attributes that represent numbers, so FAST provides a built-in `nullableNumberConverter` for this purpose:

```ts
import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  @attr({ converter: nullableNumberConverter })
  count?: number | null;
}
```

This converter will convert the attribute value to a number when reading from the DOM, and convert the value back to a string when writing to the DOM. If the attribute is not present or cannot be converted to a number, the property will be set to `null`. Likewise, if the property is set to `undefined`, `null`, or `NaN`, the attribute will be removed from the DOM.

:::tip
Properties decorated with `@attr({ mode: "boolean" })` automatically utilize the `booleanConverter` converter, which treats the presence of the attribute as `true` and its absence as `false`.
:::

## Property and Attribute Observation

When declaring attributes via the platform's native `observedAttributes` API, you must also implement the `attributeChangedCallback` to respond to changes in those attributes. Similarly, if you want to observe changes to properties, you would need to implement getters and setters for those properties. FAST's `@attr` and `@observable` decorators enable observability callbacks without requiring you to implement these patterns directly.

For example, with `@attr`, you can define a callback method that will be called whenever an attribute-bound property changes:

```ts
import { attr, FASTElement } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  @attr
  name?: string;

  nameChanged(oldValue?: string, newValue?: string) {
    console.log(`Name changed from ${oldValue} to ${newValue}`);
  }
}
```

Whenever the `name` property changes, whether through an attribute update in the DOM or by setting the property on an element instance in JavaScript, the `nameChanged` method will be called with the previous and new values. This allows you to react to changes in a declarative way without needing to manually implement attribute observation or property getters/setters.

### Property Observation with the `@observable` Decorator

The `@observable` decorator provides similar functionality for properties that are not necessarily tied to attributes. This is useful for internal state management within your component that doesn't need to be reflected in the DOM:

```ts
import { observable, FASTElement } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  @observable
  count: number = 0;

  countChanged(oldValue: number, newValue: number) {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  }
}
```

In this example, the `count` property is decorated with `@observable`, which means that any changes to `count` will trigger the `countChanged` callback, allowing you to respond to changes in the internal state of your component.

:::tip
FAST's `Observable` API can be used independently of custom elements, so you can create observable objects and properties in any JavaScript class, not just those that extend `FASTElement`. Read the [Reactivity](../../advanced/reactivity/) section for more details on using observables in FAST.
:::

### Manually Tracking Observables

The `@attr` and `@observable` decorators rewrite the decorated property into a getter/setter pair that calls into FAST's observation system. When a decorated property is accessed during template rendering, the engine tracks the access and establishes the relationship between the model and the view. The same notification behavior can be implemented manually, which is useful when a property requires additional logic in its getter or setter. The following example shows what that looks like:

```ts
import { Observable } from "@microsoft/fast-element";

export class Person {
  private _name: string;

  get name() {
    // Manually track the property access for reactivity
    Observable.track(this, 'name');
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    // Manually notify that the property has changed
    Observable.notify(this, 'name');
  }
}
```

## Lifecycle Callbacks

Extending `HTMLElement` gives you access to the standard custom element lifecycle callbacks. `FASTElement` supports these callbacks and also provides additional lifecycle management features through its internal controller. When you override lifecycle methods like `connectedCallback` or `disconnectedCallback`, make sure to call `super` to ensure that the base class can perform necessary setup and teardown work.

```ts
import { FASTElement } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  connectedCallback() {
    super.connectedCallback();
    console.log("Element connected to the DOM");
  }

  disconnectedCallback() {
    console.log("Element disconnected from the DOM");
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    super.attributeChangedCallback(name, oldValue, newValue);
  }
}
```

:::note
Call `super.connectedCallback()` before ordinary post-bind work. Always call `super.disconnectedCallback()` to tear down FAST's connection, and delegate attribute changes to `super.attributeChangedCallback()`. Lifecycle callbacks are synchronous; FAST does not await an asynchronous override.
:::

### Preparing State Before Binding

During connection, FAST restores public observable properties captured as own properties before upgrade, connects registered host behaviors, binds the view, and then marks the controller connected. Reconnection runs host behaviors before rebinding the view.

This means deriving state before `super.connectedCallback()` can read constructor defaults rather than the captured values supplied before upgrade. Deriving it after `super` is too late for the first bind. If initial bindings need derived state, register a `HostBehavior` in the constructor after `super()`:

```ts
import { FASTElement, html, observable } from "@microsoft/fast-element";
import type { HostBehavior } from "@microsoft/fast-element";

export class LabelElement extends FASTElement {
  @observable label?: string;
  @observable displayLabel = "";

  constructor() {
    super();
    const preparation: HostBehavior<LabelElement> = {
      connectedCallback(controller) {
        controller.source.displayLabel = controller.source.label ?? "Untitled";
      },
    };
    this.$fastController.addBehavior(preparation);
  }
}

LabelElement.define({
  name: "label-element",
  template: html<LabelElement>`<span>${x => x.displayLabel}</span>`,
});
```

The behavior sees the restored `label` and derives a fallback without overwriting the supplied property (including an explicit empty string). It also runs on reconnect. Keep preparation repeatable, and distinguish it from one-time effects: do not blindly repeat storage writes or telemetry on every connection.

DOM lookups belong after `super.connectedCallback()` on the ordinary already-resolved synchronous-template path. If template resolution is pending, the callback returning does not establish view readiness: wait for template availability and confirm `$fastController.isConnected`, observing its transition as needed before view-dependent work. Pre-bind preparation is synchronous model work, not an awaited readiness hook; it does not defer rendering or hydration.

### Guarding Asynchronous Completions

Checking `$fastController.isConnected` when a request completes is not enough: the element may have disconnected and reconnected while the request was pending. Use the opt-in `ConnectionGuard` to capture the connection episode that started the work:

```ts
import { FASTElement, observable } from "@microsoft/fast-element";
import { ConnectionGuard } from "@microsoft/fast-element/connection-guard.js";

export class StatusElement extends FASTElement {
  @observable message = "";
  private readonly connection: ConnectionGuard;

  constructor() {
    super();
    this.connection = new ConnectionGuard(this.$fastController);
  }

  connectedCallback() {
    super.connectedCallback();
    void this.loadStatus(this.connection.capture());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  private async loadStatus(isCurrent: () => boolean) {
    try {
      const response = await fetch("/status");
      if (!response.ok) {
        throw new Error("Unable to load status");
      }
      const message = await response.text();
      if (isCurrent()) {
        this.message = message;
      }
    } catch {
      if (isCurrent()) {
        this.message = "Unable to load status";
      }
    }
  }
}
```

`ConnectionGuard` is also exported from `@microsoft/fast-element`. Its constructor accepts a `HostController` and registers an internal host behavior. `capture()` returns a `() => boolean` predicate that is true only while the captured connection episode remains fully controller-connected:

- Capturing while disconnected produces a predicate that never becomes valid.
- Capturing in a pre-bind host behavior can become valid after binding completes only if the guard's own connected behavior has already run; it is false during preparation. Construct the guard before registering preparation behaviors that capture it.
- Capturing before the guard's connected behavior runs produces a predicate that never becomes valid.
- Disconnecting invalidates that episode's predicates permanently, even if the element later reconnects.

For ordinary asynchronous work, capture after `super.connectedCallback()` and before starting the work, as shown above. Check immediately before each state or DOM mutation, including error handling. The predicate is only a guard: it does not cancel a request, unsubscribe event listeners, or order multiple requests within the same episode. Manage cancellation and subscription cleanup separately. No asynchronous lifecycle or hydration delay is introduced.

Neither `ConnectionGuard` nor connection or hydration status establishes application-specific content or transport readiness. Bound shadow DOM does not prove that streamed or projected light DOM has finished arriving. Track that readiness separately in your application.

## Defining the Element

### `define()`

Autonomous custom elements must be registered with the browser using `customElements.define()`. FAST provides a static `define()` method on `FASTElement`-derived classes that wraps this registration process and also allows you to specify additional configuration such as observed attributes, styles, and templates.

```ts
import { FASTElement, html, css } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  // component logic
}

MyElement.define({
  name: "my-element",
  template: html`<div>Hello, World!</div>`,
  styles: css`
    div {
      color: blue;
    }
  `,
});
```

In this example, `MyElement.define()` registers the custom element with the name `my-element`, and provides a template and styles for the element. The template defines the structure of the element's Shadow DOM, while the styles are scoped to that Shadow DOM, ensuring that they do not affect other elements on the page.

#### Definition Extensions

`define()` accepts an array of extension callbacks as an optional second argument. Each extension is a function that receives the resolved `FASTElementDefinition` and is called **before** the element is registered with `customElements.define()`. This enables a plugin pattern for hooking into element registration.

```ts
import type { FASTElementExtension } from "@microsoft/fast-element";

function myPlugin(): FASTElementExtension {
  return definition => {
    console.log(`Defining: ${definition.name}`);
  };
}

MyComponent.define({
  name: "my-component",
  template,
  styles,
}, [myPlugin()]);
```

Extensions can also be used with the static call style:

```ts
FASTElement.define(MyComponent, { name: "my-component" }, [myPlugin()]);
```

For the full set of configuration options accepted by `define()`, see the [`PartialFASTElementDefinition`](/docs/3.x/api/fast-element.partialfastelementdefinition/) API reference.

## Utilities, Helpers, and Additional Features

In addition to the features described above, `FASTElement` provides a number of utilities and helpers for working with custom elements, such as methods for adding and removing styles, accessing the element's internal controller, working with the processing queue, and more.

### Using the Element Controller via `$fastController`

Every `FASTElement` instance exposes a `$fastController` property that references the internal `ElementController` driving the element's lifecycle and reactivity. Most components do not need to access it directly, but one member is commonly used inside `*Changed` callbacks: `isConnected`.

The `isConnected` property on the controller reports `true` after FAST has connected the element, which happens during `super.connectedCallback()` on the ordinary already-resolved synchronous-template path. It is distinct from the platform's `Node.isConnected`, which reports only whether the element is attached to a document. During the parse-time window when attributes are being assigned to a freshly upgraded element, the platform property is already `true`, but FAST has not yet bound the template or wired up the reactivity system. Reading from `this.elementInternals` or dispatching events during that window can produce inconsistent results.

For this reason, `*Changed` callbacks that touch the DOM typically guard against running before the controller has connected:

```ts
protected disabledChanged() {
  if (!this.$fastController.isConnected) {
    return;
  }
  this.elementInternals.ariaDisabled = `${this.disabled}`;
}
```

For other uses of the controller, such as dynamically swapping stylesheets at runtime, see [Working with Custom Elements](../../advanced/working-with-custom-elements/).

### Custom events with `$emit()`

`FASTElement` provides a helper method called `$emit()` for dispatching custom events from your component. This method simplifies the process of creating and dispatching events by providing a convenient API for specifying event details such as the event name, detail data, and options.

```ts
import { FASTElement } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
  handleClick() {
    this.$emit("my-event", { some: "data" }, { bubbles: true, composed: true });
  }
}
```

In this example, the `handleClick` method dispatches a custom event named `my-event` with a detail object containing some data. The event is configured to bubble up through the DOM and to cross the shadow DOM boundary (if applicable) by setting `bubbles: true` and `composed: true` in the options.

:::note
`$emit()` only dispatches when the element is connected. Like the pre-connect lifecycle guidance above, this means a `$emit()` call during the parse-time window before the controller has connected is a no-op. If you need to emit an event in response to an early property change, guard on `this.$fastController.isConnected` and defer the dispatch until after the element has connected.
:::
