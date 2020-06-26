---
id: observables-and-state
title: Observables and State
sidebar_label: Observables and State
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/guide/observables-and-state.md
---

## Reactivity

The arrow function bindings and directives used in templates allow the `fast-element` templating engine to intelligently react by only updating the parts of the DOM that actually change, with no need for a virtual DOM, VDOM diffing, or DOM reconciliation algorithms. This approach enables top-tier initial render time, industry-leading incremental DOM updates, and ultra-low memory allocation.

When a binding is used within a template, the underlying engine uses a technique to capture which properties are accessed in that expression. With the list of properties captured, it then subscribes to changes in their values. Any time a value changes, a task is scheduled on the DOM update queue. When the queue is processed, all updates run as a batch, updating precisely the aspects of the DOM that have changed.

## Observables

To enable binding tracking and change notification, properties must be decorated with either `@attr` or `@observable`. Use `@attr` for primitive properties (string, bool, number) that are intended to be surfaced on your element as HTML attributes. Use `@observable` for all other properties. In addition to observing properties, the templating system can also observe arrays. The `repeat` directive is able to efficiently respond to array change records, updating the DOM based on changes in the collection.

These decorators are a means of meta-programming the properties on your class, such that they include all the implementation needed to support state tracking, observation, and reactivity. You can access any property within your template, but if it hasn't been decorated with one of these two decorators, its value will not update after the initial render.

:::important
The `@attr` decorator can only be used in a `FASTElement` but the `@observable` decorator can be used in any class.
:::

:::important
Properties with only a getter, that function as a computed property over other observables, should not be decorated with `@attr` or `@observable`. However, they may need to be decorated with `@volatile`, depending on the internal logic.
:::

## Observable Features

### Access tracking

When `@attr` and `@observable` decorated properties are accessed during template rendering, they are tracked, allowing the engine to deeply understand the relationship between your model and view. These decorators serves to meta-program the property for you, injecting code to enable the observation system. However, if you do not like this approach, for `@observable`, you can always implement notification manually. Here's what that would look like:

**Example: Manual Observer Implementation**

```ts
import { Observable } from '@microsoft/fast-element';

export class Person {
  private _firstName: string;
  private _lastName: string;

  get firstName() {
    Observable.track(this, 'firstName');
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
    Observable.notify(this, 'firstName');
  }

  get lastName() {
    Observable.track(this, 'lastName');
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
    Observable.notify(this, 'lastName');
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

Notice that the `fullName` property does not need any special code, since it's computing based on properties that are already observable. There is one special exception to this: if you have a computed property with branching code paths, such as ternary operators, if/else conditions, etc, then you must tell the observation system that your computed property has *volatile* dependencies. In other words, which properties need to be observed may change from invocation to invocation based on which code path executes. 

Here's how you would do that with a decorator:

```ts
import { observable, volatile } from '@microsoft/fast-element';

export class MyClass {
  @observable someBoolean = false;
  @observable valueA = 0;
  @observable valueB = 42;

  @volatile
  get computedValue() {
    return this.someBoolean ? this.valueA : this.valueB;
  }
}
```

Here's how you would do it without a decorator:

```ts
import { Observable } from '@microsoft/fast-element';

export class MyClass {
  // elided

  get computedValue() {
    Observable.trackVolatile();
    return this.someBoolean ? this.valueA : this.valueB;
  }
}
```

### Internal observation

On the class where the `@attr` or `@observable` is defined, you can optionally implement a *propertyName*Changed method to easily respond to changes in your own state.

**Example: Property Change Callbacks**

```ts
import { observable } from '@microsoft/fast-element';

export class Person {
  @observable name: string;

  nameChanged(oldValue: string, newValue: string) {

  }
}
```

### External observation

Decorated properties can be subscribed to, to receive notification of changes in the property value. The templating engine uses this, but you can also directly subscribe as well. Here's how you would subscribe to changes in the `name` property pf a `Person` class:

**Example: Subscribing to an Observable**

```ts
import { Observable } from '@microsoft/fast-element';

const person = new Person();
const notifier = Observable.getNotifier(person);
const handler = {
  handleChange(source: any, propertyName: string) {
    // respond to the change here
    // source will be the person instance
    // propertyName will be "name"
  }
};

notifier.subscribe(handler, 'firstName')
notifier.unsubscribe(handler, 'lastName');
```

## Bindings

In addition to watching basic properties, you can also watch arbitrary bindings.

**Example: Subscribing to a Binding**

```ts
import { Observable } from '@microsoft/fast-element';

const binding = (x: MyClass) => x.someBoolean ? x.valueA : x.valueB;
const bindingObserver = Observable.binding(binding);
const handler = {
  handleChange(source: any) {
    // respond to the change here
    // the source is the bindingObserver itself
  }
};

bindingObserver.subscribe(handler);
```