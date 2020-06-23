---
id: observables-and-state
title: Observables and State
sidebar_label: Observables and State
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-element/docs/guide/observables-and-state.md
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
Properties with only a getter, that function as a computed property over other observables, should not be decorated with `@attr` or `@observable`.
:::

### Features

#### Access tracking

When decorated properties are accessed during template rendering, they are tracked, allowing the engine to deeply understand the relationship between your model and view.

#### Internal observation

On the class where the attr/observable is defined, you can optionally implement a *propertyName*Changed method to easily respond to changes in your own state.

**Example: Property Change Callbacks**

```ts
export class Person {
  @observable name: string;

  nameChanged(oldValue: string, newValue: string) {

  }
}
```

#### External observation

Decorated properties can be subscribed to, to receive notification of changes in the property. The templating engine uses this, but you can also directly subscribe as well. Here's how you would subscribe to changes in the `name` property pf a `Person` class:

**Example: Subscribing to an Observable**

```ts
const person = new Person('John');
const notifier = Observable.getNotifier(person);
const handler = {
  handleChange(source: any, propertyName: string) {
    // respond to the change here
    // source will be the person instance
    // propertyName will be "name"
  }
};

notifier.subscribe(handler, 'name')
notifier.unsubscribe(handler, 'name');
```