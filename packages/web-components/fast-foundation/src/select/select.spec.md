# Select + Select-Option

## Overview

The `select` is a component that provides a list of options for the user to select from.

### Background

There is a standard select html control, `<fast-select>` and `<fast-option>`, but it doesn't support the full level of detail, styling, etc that most design systems need or require. For context please see [MDN Docs](https://developer.mozilla.org/en-US/docs/web/html/element/select).

### Use Cases

- *A customer using the component on a web page.*
On a web page the customer is shopping for a new shirt in size medium. The customer opens the size `select` and selects size medium.

### Features
- form association
- focus delegation

### Features
- Select one or multiple `<fast-option/>` using the `multiple` attribute
- When Dropdown does not have enough screen real estate to open below `<fast-select>` it will open above.

### Prior Art/Examples
- [FAST Select (React)](https://www.npmjs.com/package/@microsoft/fast-components-react-msft)
- [Ant Design](https://ant.design/components/select/)
- [Carbon Design](https://www.carbondesignsystem.com/components/select/code/)
- [Atlassian UI](https://atlaskit.atlassian.com/packages/core/select)
- [Lightning Design System](https://www.lightningdesignsystem.com/components/select/)
- [W3 Example](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)

---

### API

*Component Name*:
- `fast-select`

*Attributes:*
- `autocomplete` - Allows the developer to provide a hint on how to search the content within the `<fast-option>`(s)
- `autofocus` - automatically focuses the control
- `disabled` - disables the control
- `form` - ???
- `labels` - ???
- `length` - The number of `<fast-option>` elements in the `<fast-select>` element
- `multiple` - Allows user to select more than one `<fast-option>`
- `name` - the name of the control
- `options` - Returns a `HTMLOptionsCollection` of the `<fast-option>` elements contained by the `<fast-select>` element
- `required` - boolean value that sets the field as required
- `selectedIndex` - The index of the first or last selected `<fast-option>` element, depending on the value of `multiple`
- `selectedOptions` - An `HTMLCollection` of the selected `<fast-option>` elements
- `size` - If the `<fast-select>` is shown with a scrollbar, this represents how many `<fast-option>`s are visible.
- `value` - string value of the number field, can be an empty string

*Events*
- `change` - raise the change event for external parties to be informed of the `selectedIndex`'s value change.

*Slots*
- default - the list of option(s)
- content - the content of the button
- start - often times a glyph, icon, or button precedes the content
- end - often times a glyph, icon, or button follows the content
- expand-glyph - glyph that indicates the select is expandable often a chevron.

### Anatomy and Appearance
**Structure:**

```html
  <template>
    <button
          part="button"
          class="button"
    >
        <slot name="start" part="start"></slot>
        <slot name="content" part="content"></slot>
        <slot name="end" part="end"></slot>
        <slot name="expand-glyph" part="expand-glyph"></slot>
    </button>
    <ul
        part="listbox"
        class="listbox"
    >
        <slot></slot>
    </ul>
  </template>
```

## Implementation

```html
<fast-select>
    <fast-option>Option 1</fast-option>
    <fast-option>Option 2</fast-option>
    <fast-option>Option 3</fast-option>
    <fast-option>Option 4</fast-option>
    <fast-option>Option 5</fast-option>
</fast-select>
```

### States

**open**: This state is applied to the `<fast-select>` when the listbox is visible to the user.

**required**: An `<fast-option>` from the `<fast-select>` must be selected when the `required` attribute is set to `true`

**valid**: The `<fast-select>` meets all its validation constraints, and is therefore considered to be valid.

**invalid**: The `<fast-select>` does not meet its validation constraints, and is therefore considered to be invalid.

### Accessibility

*Select* are RTL compliant and support the following aria best practices for listbox [W3C aria-practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.

# Select Option

## Overview

The `option` component is an option to select from that renders inside the `<fast-select>` listbox dropdown.

### API
*Component Name*:
- `fast-option`

*Attributes:*
- `defaultSelected` - Sets the default of the `<fast-option>` to selected.
- `disabled` - disables the control
- `selected` - If the `<fast-option>` is selected or not.
- `value` - string value of the number field, can be an empty string

*Slots*
- content - the content of the button
- start - often times a glyph, icon, or button precedes the content
- end - often times a glyph, icon, or button follows the content

### Anatomy and Appearance
**Structure:**

```html
  <template>
    <slot name="start" part="start"></slot>
    <slot name="content" part="content"></slot>
    <slot name="end" part="end"></slot>
  </template>
```

---

## Implementation

```html
<fast-option>
  Option
</fast-option>
```