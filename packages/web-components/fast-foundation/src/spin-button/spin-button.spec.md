# Spin button

## Overview

A spin button component is the combination of two buttons and a text field that allows user to increment or decrement numeric value set by specific range or `Infinity` by default. It also allows the user to perform the same through the use of an up and down buttons on the keyboard. As defined by the W3C:

> A spinbutton is an input widget that restricts its value to a set or range of discrete values.

### Use Cases

-   Alarm, Date, Clock, Persons' age and many different applications.

### Features

-   `min` and `max` attributes allow to set the range
-   `step` attribute to define the difference on increment or decrement of the value
-   `ArrowUp`/`Home` and `ArrowDown`/`End` keys to increment or decrement the value respectively
-   In the mobiles/tablets, on focus it pops up native numeric keyboard
-   Focus Delegation

### Prior Art/Examples

-   [BootstrapVue](https://bootstrap-vue.org/docs/components/form-spinbutton)
-   [Office Fabric](https://developer.microsoft.com/en-us/fluentui#/controls/web/spinbutton)
-   [Ant Design](https://ant.design/components/input-number/)
-   [Shopify Polaris](https://polaris.shopify.com/components/forms/stepper)
-   [React Suite](https://rsuitejs.com/components/input-number)

---

### API

-   _Component Name:_ `fast-spin-button`
-   _Props/Attrs:_
    -   `min: number` - range starts from
    -   `max: number` - range ends to
    -   `step: number` - difference on each increment or decrement
    -   `value: number` - default value
    -   `autofocus: boolean` - automatically focuses the control
    -   `placeholder: string` - an exemplar value to display in the input field whenever it is empty
    -   `required: boolean` - boolean value that sets the field as required
    -   `disabled: boolean` - disables the control
    -   `readonly` - the text field should be submitted with the form but should not be editable.
-   _Events_
    -   `change: CustomEvent` - No custom data.

### Anatomy and Appearance

```html
<host>
    <label><slot></slot></label>
    <div>
        <button tabindex="-1" type="button">-</button>
        <input inputmode="decimal" type="text" min="0" max="5" step="1" />
        <button tabindex="-1" type="button">+</button>
    </div>
</host>
```

-   _Slot Names_
    -   default - the label content
-   _Host Classes_
    -   disabled
    -   readonly
    -   required

---

## Implementation

```html
<fast-spin-button placeholder="Age" min="1" max="67""></fast-spin-button>
```

### States

**disabled**: `true` or `false` - when disabled, the value will not be changeable through user interaction. It should also not expose it's value to a form submission.

**readonly**: `true` or `false` - when readonly, the value will not be changeable through user interaction. The value will still be exposed to forms on submission.

**step**: numeric value, the value will not be changeable through user interaction. Default value will be 1.

**min**: numeric value, the value will not be changeable through user interaction. The implicit value of min is that there is no minimum value.

**max**: numeric value, the value will not be changeable through user interaction. The implicit value of max is that there is no maximum value.

**value**: numeric value, the value will be changeable through user interaction. Default value will be 0.

### Accessibility

-   It has three components, including a text field that displays the current value, an increment button, and a decrement button.
-   The text field is usually the only focusable component because the increment and decrement functions are keyboard accessible via arrow keys or page up and page down or home and end.
-   Set the `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes when the all the values are provided. If not, it should set implicit values.
-   If there is a label provided, reference it by `aria-labelledby` or provide the label to the component by `aria-label`.

---

## Resources

-   https://www.w3.org/TR/wai-aria-practices-1.2/#spinbutton
-   https://www.digitala11y.com/spinbutton-role/
