# `Updates`

The `Updates` API is part of the `FAST` global. The updates that are queued include updates to attributes, observables, and observed arrays.

## Attributes

An attribute change may be queued when the value of the attribute is updated. This change is triggered by `HTMLElement` lifecycle hook `attributeChangedCallback`. The `Updates` queue is used to try to reflect the attribute with the updated value onto the element using `DOM` APIs.

## Observables

The `Reflect` API is used to override `defineProperty` in order to observe a property on an Custom Element, this overrides the getter and setter, which allows subscribers to be notified of changes. Any changes which `set` the value are passed to the `Updates` queue.