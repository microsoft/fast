# fast-popover
An implementation of a [popover](https://w3c.github.io/aria-practices/#popover) web-component.

// TODO: Should this be more like a behavior like anchored-region? Like Dialog, where it is just a container that pops up where desired.... that's what this is isn't it?

For more information view the [component specification](../../../fast-foundation/src/checkbox/popover.spec.md).

Notes:
- The implementation using Popover must have an event listener that changes the Popover's _visible_ attribute in order to show and hide the Popover.
