---
id: observables-and-state
title: Observables and State
sidebar_label: Observables and State
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/guide/observables-and-state.md
description: To enable binding tracking and change notification, properties must be decorated with either @attr or @observable.
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
import { Observable, observable } from '@microsoft/fast-element';

export class MyClass {
  @observable someBoolean = false;
  @observable valueA = 0;
  @observable valueB = 42;

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

Decorated properties can be subscribed to, to receive notification of changes in the property value. The templating engine uses this, but you can also directly subscribe. Here's how you would subscribe to changes in the `name` property of a `Person` class:

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

## Observing Arrays

So far, we've only seen how to observe properties on objects, but it's also possible to observe arrays for changes. Given an instance of an array, it can be observed like this:

**Example: Observing an Array**

```ts
const arr = [];
const notifier = Observable.getNotifier(arr);
const handler = {
  handleChange(source: any, splices: Splice[]) {
    // respond to the change here
    // source will be the array instance
    // splices will be an array of change records
    // describing the mutations in the array in
    // terms of splice operations
  }
};

notifier.subscribe(handler);
```

There are a couple of important details to note with array observation:

* The `fast-element` library's ability to observe arrays is opt-in, in order that the functionality remain tree-shakeable. If you use a `repeat` directive anywhere in your code, you will be automatically opted in. However, if you wish to use the above APIs and are not using `repeat`, you will need to enable array observation by importing and calling the `enableArrayObservation()` function.
* The observation system cannot track changes made directly through an index update. e.g. `arr[3] = 'new value';`. This is due to a limitation in JavaScript. To work around this, update arrays with the equivalent `splice` code e.g. `arr.splice(3, 1, 'new value');`
* If the array is a property of an object, you will often want to observe both the property and the array. Observing the property will allow you to detect when the array instance is completely replaced on the object, while observing the array will allow you to detect changes in the array instance itself. When the property changes, be sure to unsubscribe to the old array and set up a subscription to the new array instance.
* Observing an array only notifies on changes to the array itself. It does not notify on changes to properties on objects held within the array. Separate observers would need to be set up for those individual properties. These could be set up and torn down in response to changes in the array though.

## Observing Volatile Properties

In addition to watching properties and arrays, you can also watch volatile properties.

**Example: Subscribing to a Volatile Property**

```ts
import { Observable, defaultExecutionContext } from '@microsoft/fast-element';

const myObject = new MyClass();
const handler = {
  handleChange(source: any) {
    // respond to the change here
    // the source is the volatile binding itself
  }
};
const bindingObserver = Observable.binding(myObject.computedValue, handler);
bindingObserver.observe(myObject, defaultExecutionContext);

// Call this to dismantle the observer
bindingObserver.disconnect();
```

### Records 

To inspect which observable objects and properties were accessed from a `BindingObserver`, you can get the observation records from `BindingObserver.records()` after observing the binding.

**Example: Getting observation records**
```ts
const binding = (x: MyClass) => x.someBoolean ? x.valueA : x.valueB;
const bindingObserver = Observable.binding(binding);
const value = bindingObserver.observe({}, defaultExecutionContext);

for (const record of bindingObserver.records()) {
  // Do something with the binding's observable dependencies
  console.log(record.propertySource, record.propertyName)
}
```
