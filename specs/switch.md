# fast-switch

## Overview

*Switch* mimics a physical switch that can be turned **on** or **off**.

### Use Cases

Typical use cases include, but are not limited to, turning a feature on and off or showing or hiding a piece of UI
  
### Features

A switch should allow the following properties:
- `checked`, whether the switch is cheched or not.
- `checked-message`, the message that displays when the switch is checked.
- `unchecked-message`, the message that displays when switch is not checked.
- `disabled`, whether the switch is disabled or not.

### Risks and Challenges

Typically it's best to include a checked and unchecked message but it is not required. It's common to see *Switch* without a message but there are accessibility concerns since it's not necessarily obvious what is **on** and what is **off**. The visual representation of **on** tends to show the state indicator to the right with the background filled and **off** tends to show the state indicator to the left and the background unfilled or as a muted or neutral color. However, this pattern is not always consistent.

### Prior Art/Examples
- [FAST-DNA (React)](https://explore.fast.design/components/toggle)
- [Material UI](https://material-ui.com/components/switches/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/checkbox-toggle/)
- [Ant Design](https://ant.design/components/switch/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/toggle)
- [Open UI](https://open-ui.org/components/switch)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/toggles)

---

### API

*Component name:*
- `fast-switch`

*Attributes:*
- `checked`: boolean
- `disabled`: boolean

*Slots:*
- `default`
- `unchecked-message`
- `checked-message`

*Events:*
- `change` - fires when component is clicked or "spacebar" is pressed. This is a standard `onChange` event from the `input`

### Anatomy and Appearance

*Parts:*
- label
- checkbox
- checked-indicator
- status-message

*Template:*
```
<div>
    <label class="label" part="label" id="switch-label">
        <slot></slot>
    </label>
    <div part="switch" class="switch>
        <span part="checked-indicator"/>
    </div>
    <span part="status-message" id="status-message">
        <span class="checked-message" part="checked-message">
           <slot name="checked-message">On</slot>
        </span>
        <span class="unchecked-message" part="unchecked-message">
           <slot name="unchecked-message">On</slot>
        </span>
    </span>
</div>
```

## Implementation

```
<fast-switch
    checked={true}
>
    Notify by Email
    <span slot="checked-message">On</span>
    <span slot="unchecked-message">Off</span>
</fast-switch>
```

### States

*Switch* can either be controlled or uncontrolled, meaning if `checked` is passed the app author is taking control of the state and will need to handle the `change` event and `checked` attribute. The `change` event fires on mouse click or "spacebar" press.

### Accessibility
*Switch* is a type of checkbox that represents on/off values, as opposed to checked/unchecked values. The *button* should have its role set to *aria-role="switch"* and *aria-checked* should be set to represent the current state of the *Switch*. *aria-labelledby* should be set to the id of the *Switch* label and *aria-describedby* should be set to the status message only if values other than "On" and "Off" are passed.

### Globalization

*Switch* should mirror in RTL languages, meaning the lable should render to the right and the checled and unchecked message should render ot the left in RTL.

### Dependencies

No dependencies outside of fast-element itself.

### Documentation

*Switch* is used to represent a binary state such and **on** or **off**. If any extra step is required for changes to be effective or an indeterminate state is needed, you should use *checkbox* and corresponding "Apply" button instead. Users shouldn’t need to do something else or go somewhere else in order to experience the *Switch's* effect.

---

## Resources
- [Mozilla documentation aria role "Switch"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role)
- [W3 documentation aria role "Switch"](https://www.w3.org/TR/wai-aria-1.1/#switch)
