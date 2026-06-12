# `Updates`

The `Updates` API batches FAST Element DOM work in the client-side browser
`Window` runtime. Queued work includes updates to attributes, observables, and
observed arrays. The async queue is aligned to `requestAnimationFrame`, which is
expected to be available in the supported runtime.

FAST Element is not intended to run its client runtime in workers, server-side
JavaScript runtimes, or other non-window hosts. Code that needs server rendering
should generate HTML for the browser, then let the browser window run FAST
Element, connect custom elements, and process queued updates.

## Attributes

An attribute change may be queued when the value of the attribute is updated. This change is triggered by `HTMLElement` lifecycle hook `attributeChangedCallback`. The `Updates` queue is used to try to reflect the attribute with the updated value onto the element using `DOM` APIs.

## Observables

The `Reflect` API is used to override `defineProperty` in order to observe a property on an Custom Element, this overrides the getter and setter, which allows subscribers to be notified of changes. Any changes which `set` the value are passed to the `Updates` queue.