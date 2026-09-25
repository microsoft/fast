# Combobox

## Overview

As defined by the [W3C](https://w3c.github.io/aria-practices/#combobox):
> A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value. The popup may be a listbox, grid, tree, or dialog. Many implementations also include a third optional element -- a graphical Open button adjacent to the combobox, which indicates availability of the popup. Activating the Open button displays the popup if suggestions are available.

### Use Cases

- *A customer using the component on a web page.*
On a web page a customer is providing their US mailing address for an order form. The customer clicks a `<fast-combobox>` to fill in their state (California, Ohio, etc.) and sees a list of options. The customer begins typing the state name and the field is automatically populated with the closest matching state. Then, the customer uses the arrow keys to highlight their state and presses `enter` to commit the value to the combobox.

### Features

- **Form association**: The `combobox` is [form-associated](../form-associated/form-associated-custom-element.spec.md), allowing its selected or user-provided value to be submitted with a form.
- **Autocomplete and Autoselection**: Supports `inline`, `list`, and `both` values for `autocomplete`:
  - `inline`: Automatically fills the value of the first matching option while typing, and highlights the auto-inserted text. While a value is present, navigating through the list will automatically jump to partially-matching options.
  - `list`: Auto-filters the available options to only display those which start with the current value.
  - `both`: Automatically filters the list and fills the remaining text for the currently selected option.
- **Opened and closed states**: The `combobox` provides an expandable listbox can be displayed by clicking on the element, or using keyboard navigation.
- **Positioning**: When the `combobox` does not have enough screen real estate to open below the control, it will open above.
- **Keyboard navigation and type-ahead**: When the `combobox` is focused, keyboard navigation with the arrow keys will cycle through the available options. Type-ahead is also supported. See [Combobox Keyboard Interaction](https://w3c.github.io/aria-practices/#combobox-keyboard-interaction) for more details.

### Prior Art/Examples

- [Ant Design](https://ant.design/components/auto-complete/)
- [Carbon Design](https://www.carbondesignsystem.com/components/select/code/)
- [Atlassian UI](https://atlaskit.atlassian.com/packages/core/select)
- [Lightning Design System](https://www.lightningdesignsystem.com/components/combobox/)
- [W3 Example](https://w3c.github.io/aria-practices/examples/combobox/combobox-autocomplete-both.html)

---

## API

Extends [`listbox`](../listbox/listbox.spec.md) and [form associated custom element](../form-associated/form-associated-custom-element.md).

*Component Name*:

- `fast-combobox`

*Attributes*:

- `autocomplete` - Handles autocomplete features for the control on pageload. Accepted values are `none`, `inline`, `list`, and `both`.
- `disabled` - Disables the control.
- `name` - Name of the control.
- `required` - Boolean value that sets the field as required.
- `value` - The initial value of the combobox.

*Properties*:

- `options` - An array of all options.
- `placeholder` - Sets the placeholder of the element, generally used to provide a hint to the user.
- `value` - Reflects the value of the first selected option. Setting the `value` property will update the `selected` state of the first option that matches the value, if any.

*Events*:

- `change` (`CustomEvent`) - Emits when the `value` is changed via user interaction.
- `input` (`InputEvent`) - Emits when text is entered via user interaction.

*Slots*:

- *default* - The list of options, either `<fast-option>` or elements with `role="option"`.
- `control` - Contains the selected value and indicator slots inside the control element.
  - `indicator` - Holds the glyph indicating that the combobox can be expanded. This slot is only available if the `control` slot is not filled.
- `start` - Used to display content like glyphs or icons inside the button, before the control.
- `end` - Used to display content like glyphs or icons inside the button, after the control.

*Parts*:

- `control` - The container that holds the `start`, `end`, `control`, and `indicator` slots.
- `indicator` - The container that holds the `select-indicator` slot.
- `select-indicator` - The default SVG icon present the `indicator` slot.
- `listbox` - The container that represents the listbox popup.
- `selected-value` - The container that holds the displayed text for the button.
- `start` - The container that holds the `start` slot.
- `end` - The container that holds the `end` slot.

### Anatomy and Appearance

*Structure*:

```html
<template>
    <div part="control">
        <span part="start">
            <slot name="start"></slot>
        </span>
        <slot name="control">
            <input part="selected-value">
            <div part="indicator">
                <slot name="indicator">
                    <svg part="select-indicator"></svg>
                </slot>
            </div>
        </slot>
        <span part="end">
            <slot name="end"></slot>
        </span>
    </div>
    <div part="listbox" role="listbox">
        <slot></slot>
    </div>
</template>
```

## Implementation

*With `fast-option` elements*:

```html
<fast-combobox>
    <fast-option>Option 1</fast-option>
    <fast-option>Option 2</fast-option>
    <fast-option>Option 3</fast-option>
</fast-combobox>
```

*With compatible `option`-like elements*:

```html
<fast-combobox>
    <option>Option 1</option>
    <div role="option">Option 2</div>
</fast-combobox>
```

**Note**: While `<fast-option>`, `<option>`, and elements with a `role="option"` will all function, `<fast-option>` has built-in accessibility and form association support when used with a `<fast-combobox>`. See [Listbox Option](../listbox-option/listbox-option.spec.md) for more information.

**Note**: While `combobox` is implemented in very similar ways as [`select`](../select/select.spec.md), the `value` attribute on `fast-option` and other `option`-like elements is ignored in favor of the `textContent`. This is done to avoid confusion between user-provided values and predefined options.

### States

- `open` -  This state is applied to the `<fast-combobox>` when the listbox is visible to the user.
- `required` - The `<fast-combobox>` must have a user-provided value when the `required` attribute is set to `true`.
- `valid` - The `<fast-combobox>` meets all its validation constraints, and is therefore considered to be valid.
- `invalid` - The `<fast-combobox>` does not meet its validation constraints, and is therefore considered to be invalid.
- `disabled` - When disabled, the value will not be changeable through user interaction.

### Accessibility

*Combobox* is RTL compliant and supports the following aria best practices for combobox [W3C aria-practices](https://w3c.github.io/aria-practices/#combobox).

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.
