# Number Field

## Overview

An implementation of a generic input for numerical values as a form-connected web-component.

### Use Cases

Used anywhere an author might otherwise use:
- input[type="number"]

### Features

1. Focus Delegation

---

### API

Extends FAST Element

*Component Name*
- `fast-number-field`

*Attrs* - Adapted from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- `autofocus` - automatically focuses the control
- `readonly` - the text field should be submitted with the form but should not be editable.
- `placeholder` - an exemplar value to display in the input field whenever it is empty
- `required` - boolean value that sets the field as required
- `value` - string value of the text field, can be an empty string
- `disabled` - disables the control
- `list` - the id of the `<datalist>` element that contains the optional pre-defined autocomplete options
- `maxlength`	- the maximum number of characters the input should accept
- `minlength` -	the minimum number of characters long the input can be and still be considered valid
- `name` - the name of the control
- `size` - a number indicating how many characters wide the input field should be
- `appearance` - enum
  - outline (default)
  - filled
- `max` - maximum numerical value
- `min` - minimum numerical value
- `step` - number amount to increment or decrement the value

*Events*
- `change: CustomEvent`
  - no custom data
  - bubbles

### Anatomy and Appearance

```HTML
<!-- shadow root -->
<label part="label"><slot></slot></label>
<div part="root">
  <slot name="start" part="start"></slot>
  <input part="control" />
  <div part="step-buttons"></div>
  <slot name="end" part="end"></slot>
</div>
<!-- end shadow root -->
```


*Screenshots below are of the basic appearance of the component and are not exhaustive.*

| State | Image |
| ----- | ----- |

*Slot Names*
- default - the label content
- start - often times a glyph, icon, or button precedes input
- end - often times a glyph, icon, or button follows the input

*Host Classes*
- disabled
- required
- readonly

*CSS Parts*
- label
- root
- start
- end
- control
- step-buttons

---

## Implementation

### States

**disabled**: `true` or `false` - when disabled, the value will not be changeable through user interaction. It should also not expose it's value to a form submission.

**readonly**: `true` or `false` - when readonly, the value will not be changeable through user interaction. The value will still be exposed to forms on submission.

### Accessibility

The input element inside the shadow-dom of the checkbox will be a focusable element. With this in mind, so long as the text field receives focus, assistive technology should treat it as such.

### Globalization

Before and after content should swap in LTR presentations.

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.

---

## Next Steps
Adding mechanisms, slots, and data for surfacing validation error messages.
