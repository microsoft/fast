# Listbox Option

## Overview

The `<fast-option>` component is an option that is intended to be used with `<fast-listbox>` and `<fast-select>`.

**Note**: To avoid namespace collisions with the [Option() constructor](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement/Option), the component class is `ListboxOption`, and our implementation is defined as `<fast-option>`. This makes the class distinct and keeps the component tag name familiar for authors.

### API

*Component Name*:

- `fast-option`

*Attributes*:

- `disabled` - disables the control and prevents user interaction.
- `selected` - Sets the selected state of the option.
- `defaultSelected` - Reflects the initial state of the `selected` attribute.
- `value` - The initial value of the option.

*Slots*:

- *(default)* - the content of the button
- start - often times a glyph, icon, or button precedes the content
- end - often times a glyph, icon, or button follows the content

### Anatomy and Appearance

**Structure**:

```html
  <template role="option">
    <span part="start">
      <slot name="start"></slot>
    </span>
    <span part="content">
      <slot></slot>
    </span>
    <span part="end">
      <slot name="end"></slot>
    </span>
  </template>
```

---

## Implementation

```html
<fast-listbox>
  <fast-option>Option</fast-option>
</fast-listbox>

<fast-select>
  <fast-option value="option">Option</fast-option>
</fast-select>
```

### States

- `disabled` - when disabled, user interaction has no effect. Disabling the parent `<fast-listbox>` or `<fast-select>` will also prevent user interaction on the `<fast-option>`.
- `selected` - The selected state is primarily controlled by user interactions on the parent `listbox` component. Changing the `selected` property directly will force the state to change.

### Accessibility

*Listbox Option* is RTL compliant and follows [aria specifications for the option role](https://w3c.github.io/aria/#option).

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.
