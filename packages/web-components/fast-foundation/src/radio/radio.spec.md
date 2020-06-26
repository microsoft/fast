# Radio

## Overview
An implementation of a radio button as a form-connected web-component. Facilitating single select from a group of visible choices.

### Use Cases
Used anywhere an author might otherwise use an `input[type="radio"]`. Used to facilitate choice where only one choice is acceptable.
  
### Features
- form association
- focus delegation

### Risks and Challenges
We want general feature-parity between this component and an `input[type="radio"]`.

### Prior Art/Examples
- [FAST (React)](https://explore.fast.design/components/radio)
- [Material UI](https://material-ui.com/components/radio-buttons/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/radio-group/)
- [Carbon Design](https://www.carbondesignsystem.com/components/radio-button/code)
- [Ant Design](https://ant.design/components/radio/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/radio)
- [Office Fabric](https://developer.microsoft.com/en-us/fluentui#/controls/web/choicegroup)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/radio-button)
---

### API
Extends [form associated custom element](../form-associated/form-associated-custom-element.md).

*Component Name*
`fast-radio`

*IDL attributes*
- `checked: boolean`
  - The current checked state of the radio

*Content attributes*
- `readonly`
  - The radio should be submitted with the form but should not be editable.
- `disabled`
  - The radio should be disabled from user interaction and will not be submitted with the form data.
- `value` - Not visible to the user, it's used for form data and to distinguish between other radio buttons of the same name attribute value.
- `checked`
  - The initial checked value. 
  
*Events*
- `change: CustomEvent`
  - no custom data
  - bubbles

### Anatomy and Appearance

```HTML
<!-- shadow root -->
<label part="label">
  <slot></slot>
</label>
<div part="control">
  <slot name="checked-indicator">
    <div part="checked-indicator">
    </div>
  </slot>
</div>
<!-- end shadow root -->
```

*Slot Names*
- default: label for the radio
- checked-indicator: visual indicator control is checked

*Host Classes*
- checked
- disabled
- required
- readonly

*Slotted Content/Slotted Classes*
*CSS Parts*
- control
- label
- checked-indicator

### States
**checked**: `true` or `false`
The checked state can be toggled by:
- Clicking the radio button (or any of it's labels)
- Pressing the space-bar while focus is placed on the radio button will toggle it on

**disabled**: `true` or `false`
When disabled, the value will not be changeable through user interaction. It should also not expose it's value to a form submission.

**readonly**: `true` or `false`
When readonly, the value will not be changeable through user interaction. The value will still be exposed to forms on submission.

### Accessibility
The root element inside the shadow-dom of the radio will be a focusable element with the following accessibility content attributes:
[MDN Web docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_radio_role)
- role: radio
- aria-checked: the checked state of the component
- aria-required: the required state of the component
- aria-disabled: the disabled state of the component
- tabindex: 0

## Next steps
Adding mechanisms, slots, and data for surfacing validation error messages.