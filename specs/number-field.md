# Number Field

## Overview

An implementation of a generic input for numerical values as a form-connected web-component.

### Use Cases

Used anywhere an author might otherwise use input[type="number"].

### Features

1. Form association

2. Conversion to/from number/string between the view and the control

### Prior Art/Examples

- [FAST (React)](https://explore.fast.design/components/number-field)
- [Carbon Design](https://www.carbondesignsystem.com/components/number-input/code)
- [Ant Design](https://ant.design/components/input-number/)
- [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/spinbutton)
- [Duet](https://www.duetds.com/components/number-input/)

---

### API

Extends Form associated component

*Component Name*
- `fast-number-field`

*Attrs* - Adapted from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- `autofocus` - automatically focuses the control
- `readonly` - the number field should be submitted with the form but should not be editable.
- `placeholder` - an exemplar value to display in the input field whenever it is empty
- `required` - boolean value that sets the field as required
- `value` - string value of the number field, can be an empty string
- `disabled` - disables the control
- `list` - the id of the `<datalist>` element that contains the optional pre-defined autocomplete options
- `max`	- the maximum value to accept for this input
- `min` -	the minimum number to accept for this input
- `maxlength`	- the maximum number of characters the input should accept
- `minlength` -	the minimum number of characters long the input can be and still be considered valid
- `name` - the name of the control
- `size` - a number indicating how many characters wide the input field should be
- `step` - a stepping interval to use when using up and down arrows to adjust the value, as well as for validation

- `appearance` - enum
  - outline (default)
  - filled

*Methods*
- `stepUp(stepIncrement?: number)`
- `stepDown(stepIncrement?: number)`

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
  <input type="number" part="control" />
  <slot name="end" part="end"></slot>
</div>
<!-- end shadow root -->
```


*Screenshots below are of the basic appearance of the component and are not exhaustive.*

**The visual treatment of this control should visually match the number field component**

| State | Image |
| ----- | ----- |
| default | ![](./text-field/images/text-field.png) |
| focus | ![](./text-field/images/text-field-focus.png)
| filled | ![](./text-field/images/text-field-filled.png)

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

---

## Implementation

### States

**disabled**: `true` or `false` - when disabled, the value will not be changeable through user interaction. It should also not expose it's value to a form submission.

**readonly**: `true` or `false` - when readonly, the value will not be changeable through user interaction. The value will still be exposed to forms on submission.

### Accessibility

The host element should handle providing the role of textbox to assistive technology (AT) as well as reporting any state based aria attributes (disabled, readonly, etc) to AT.

Keyboard interactions for up and down arrow should increment or decrement the value of the input field based on the current step value.

### Globalization

Start and end content should swap in LTR presentations.

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.

---

## Next Steps
- Adding mechanisms, slots, and data for surfacing validation error messages.
- Create custom spin button controls and apply as default to the `end` slot.