# Pivot

## Accessibility

Follows the [tab panel](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel) pattern.

## Implementing

Set the `items` prop to an array of objects conforming to the `Item`  interface. `Item` consists of `tab`, `content` and `id`. `tab` and `content` will render a ReactNode and `id` is a string that represents its unique identifier.
