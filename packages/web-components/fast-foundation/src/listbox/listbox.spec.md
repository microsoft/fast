# Listbox

## Overview

The `listbox` component is a component that provides a navigatable list of options for the user to select from.

### Background

This component is used as a building block for other components in this library that need a way for users to choose distinct options from a list. The goal for `listbox` is to handle implementation details related to the [`listbox`](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) and [`combobox`](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) aria roles.

### Features

- **Single and multiple selection mode**: Users can choose one or multiple options when the `multiple` attribute is present. *(Note: While our implementation currently only supports single selection mode, multiple selection mode is being tracked in [issue #4190](https://github.com/microsoft/fast/issues/4190).)*
- **Keyboard navigation and type-ahead**: When the `listbox` is focused, keyboard navigation with the arrow keys will cycle through the available options. Type-ahead is also supported. See [Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.1/#listbox_kbd_interaction) for more details.
- Users can choose one or multiple options when the `multiple` attribute is present.

### Prior Art/Examples

- [W3 Example](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-scrollable.html)

---

## API

*Component Name*:

- `fast-listbox`

*Attributes and Properties*:

- `disabled` - Disables the control.
- `options` - An array of all options in the `listbox`.
- `role` - The role of the element, defaults to "listbox".
- `selectedOptions` - A collection of the selected options in the `listbox`.
- `selectedIndex` - The index of the first selected option, or `-1` if nothing is selected. Setting the `selectedIndex` property will update the `selected` state of the option at the new index. Out of range values will reset the `selectedIndex` to `-1`.

*Slots*:

- *default* - the list of options, either `<fast-option>` or elements with `role="option"`.

### Anatomy and Appearance

*Structure*:

```html
<template role="listbox">
  <slot></slot>
</template>
```

## Implementation

*With `fast-option` elements*:

```html
<fast-listbox>
    <fast-option>Option 1</fast-option>
    <fast-option>Option 2</fast-option>
    <fast-option>Option 3</fast-option>
</fast-listbox>
```

*With compatible `option`-like elements*:

```html
<fast-listbox>
    <option>Option 1</option>
    <div role="option">Option 2</div>
</fast-listbox>
```

**Note**: While `<fast-option>`, `<option>`, and elements with a `role="option"` will all function, `<fast-option>` has built-in accessibility support when used with a `<fast-listbox>`. See [Listbox Option](../listbox-option/listbox-option.spec.md) for more information.

### States

- `disabled` - when disabled, user interaction has no effect.

### Accessibility

*Listbox* is RTL compliant and supports the following aria best practices for listbox [W3C aria-practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.
