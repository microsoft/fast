# Checkbox

## Overview
An implementation of a checkbox as a form-connected web-component.

### Use Cases
Used anywhere an author might otherwise use an `input[type="checkbox"]`
  
### Features
- form association
- focus delegation

### Risks and Challenges
We want general feature-parity between this component and an `input[type="checkbox"]`. Most of these concerns are addressed by https://github.com/microsoft/fast/pull/2723, but some stateful nuance will need to be handled by this component.

### Prior Art/Examples
- [FAST Checkbox (React)](https://www.npmjs.com/package/@microsoft/fast-components-react-msft)
- [Material UI](https://material-ui.com/components/checkboxes/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/checkbox/)
- [Carbon Design](https://www.carbondesignsystem.com/components/checkbox/code)
- [Ant Design](https://ant.design/components/checkbox/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/checkbox)
- [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/checkbox)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/checkbox)
---

### API
Extends [form associated custom element](../form-associated/form-associated-custom-element.md).

*Component Name*
`fast-checkbox`

*IDL attributes*
- `defaultChecked: boolean`
  - If the checkbox is checked by default. Synchronized with the `checked` content attribute
- `checked: boolean`
  - The current checked state of the checkbox
- `indeterminate: boolean`
  - The indeterminate state. Independent of checked

*Content attributes*
- `readonly`
  - The checkbox should be submitted with the form but should not be editable.
- `value`
  - Defaults to "on" to match `input[type="checkbox"]`
- `checked`
  - The initial checked value. 
  
*Events*
- `change: CustomEvent`
  - no custom data
  - bubbles

### Anatomy and Appearance

```HTML
<!-- shadow root -->
<label part="label"><slot></slot></label>
<div part="checkbox">
  <div part="checked-indicator"></div>
  <div part="indeterminate-indicator"></div>
</div>
<!-- end shadow root -->
```

*Slot Names*
- default: label for the checkbox

*Host Classes*
- checked
- disabled
- required
- readonly

*Slotted Content/Slotted Classes*
*CSS Parts*
- checkbox
- label
- checked-indicator
- indeterminate-indicator

### States
**checked**: `true` or `false`
The checked state can be toggled by:
- Clicking the checkbox (or any of it's labels)
- Pressing the space-bar while focus is placed on the checkbox
- Adding / removing the "checked" content attribute
  - This will only trigger a change if the "checked" property has not been changed, either through user action or programmatically

**disabled**: `true` or `false`
When disabled, the value will not be changeable through user interaction. It should also not expose it's value to a form submission.

**readonly**: `true` or `false`
When readonly, the value will not be changeable through user interaction. The value will still be exposed to forms on submission.

### Accessibility
The root element inside the shadow-dom of the checkbox will be a focusable element with the following accessability content attributes:
- role: checkbox
- aria-checked: the checked state of the component
- aria-required: the required state of the component
- aria-disabled: the disabled state of the component
- tabindex: 0

Because we're delegating focus to this element, the relevant information will be presented to AT users when they focus this element.

### Globalization
N/A

### Security
N/A

### Performance
N/A

### Dependencies
N/A

### Test Plan
N/A

### Tooling
N/A

### Documentation
N/A

## Resources
N/A

## Next steps
Adding mechanisms, slots, and data for surfacing validation error messages.