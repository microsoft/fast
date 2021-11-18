# Search

## Overview

An implementation of a search box for textual values as a form-connected web-component.

### Use Cases

Used anywhere an author might otherwise use:
- input[type="search"]

### Features
- form association
- focus delegation

### Risks and Challenges

One challenge with search forms is their accessibility; a common design pattern is to not provide a label for the search box (although there might be a magnifying glass icon or similar), as the purpose of a search forms is normally obvious for sighted users due to placement.

### Prior Art/Examples

- [Fluent UI - React](https://developer.microsoft.com/en-us/fluentui#/controls/web/searchbox)
- [Material UI](https://material-ui.com/components/text-fields/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/input/)
- [Ant Design](https://ant.design/components/input/)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/apps/design/controls/auto-suggest-box)

---

### API

Extends FAST Element
lerna run prepare
*Component Name*
- `fast-search`

*Attrs* - Adapted from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search)
- `autofocus` - automatically focuses the control
- `placeholder` - an exemplar value to display in the input field whenever it is empty
- `label` - `aria-label` for the input when a <label> is not present
- `required` - boolean value that sets the field as required
- `value` - string value of the text field, can be an empty string
- `disabled` - disables the control
- `list` - the id of the `<datalist>` element that contains the optional pre-defined autocomplete options
- `maxlength`	- the maximum number of characters the input should accept
- `minlength` -	the minimum number of characters long the input can be and still be considered valid
- `name` - the name of the control
- `pattern` - a regular expression the input's contents must match in order to be valid
- `size` - a number indicating how many characters wide the input field should be
- `spellcheck` - controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used
.- `appearance` - enum
  - outline (default)
  - filled

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
  <input type="search" part="control" aria-label="${x => x.label}"/>
  <slot name="clear-button" part="clear-button"></slot>
  <slot name="end" part="end"></slot>
</div>
<!-- end shadow root -->
```


*Screenshots below are of the basic appearance of the component and are not exhaustive.*

| State | Image |
| ----- | ----- |
| default | ![](./images/search-box.png) |
| search button | ![](./images/search-box-button.png)
| focus | ![](./images/search-box-focus.png)
| disabled | ![](./images/search-box-disabled.png)
| custom icon | ![](./images/search-box-custom-icon.png)

*Slot Names*
- default - the label content
- end - often times a glyph, icon, or button that follows the input
- clear-button - a button the clears the input
- start - often times a glyph, icon, or button that precedes thr input

*CSS Parts*
- label
- root
- before-content
- after-content
- clear-button
- control

---

## Implementation

### States

**disabled**: `true` or `false` - when disabled, the value will not be changeable through user interaction. It should also not expose it's value to a form submission.

### Accessibility

A `role` attribute of value `search` on the <form> element will cause screenreaders to announce that the form is a search form.

If that isn't enough, you can use an `aria-label` attribute on the <input> itself. This should be a descriptive text label that will be read out by the screenreader; it's used as a non-visual equivalent to <label>.

### Globalization

Before and after content should swap in LTR presentations.

### Test Plan

This component should have component testing in the @microsoft/fast-foundation package.

---

## Next Steps
Adding mechanisms, slots, and data for surfacing validation error messages.
