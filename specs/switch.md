# fast-switch

## Overview

*Switch* mimics a physical switch that allows users to turn things **on** or **off**.

### Use Cases

*Switch* is used to represent a binary state such and **on** or **off**. If any extra step is required for changes to be effective or an indeterminate state is needed, you should use *checkbox* and corresponding "Apply" button instead. Users shouldn’t need to do something else or go somewhere else in order to experience the *Switch's* effect.

Typical use cases include, but are not limited to turning a feature on and off or showing or hiding a piece of UI
  
### Features

A switch should allow the following properties. Checked, whether the switch is cheched or not. CheckedMessage, the message that displays when the switch is checked. Unchecked message, the message that displays when switch is not checked. Disabled, whether the switch is disabled or not.

### Risks and Challenges

Typically it's best to include a checked and unchecked message but it is not required. It's common to see *Switch* without a message but there are accessibility concerns since it's not necessarily obvious what is **on** and what is **off**. The visual representation of **on** tends to show the state indicator to the right with the background filled and **off** tends to show the state indicator to the left and the background unfilled. However, this pattern is not always consistent.

## Design

*Describe the design of the component, thinking through several perspectives:*

- *A customer using the component on a web page.*
- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
- *A designer customizing the component.*

### API

- fast-switch
- checked, uncheckedMessage, checkedMessage, disabled, labelId, statusMessageId
- onChange

### Anatomy and Appearance

*Parts:*
- label
- button
- status-indicator
- status-message

*Template:*
```
<div>
    <label part="label" id="switch-label">Switch label</label>
    <button part="button" role="switch" aria-checked="true" aria-labelledby="switch-label" aria-describedby="status-message">
        <!-- Status Indicator -->
        <span part="status-indicator"/>
    </button>
    <span part="status-message" id="status-message">On</span>
</div>
```

## Implementation

```
<fast-switch
    checked={true}
    unCheckedMessage="On"
    checkedMessage="Off"
    labelId="label-id"
    statusMessageId="status-id"
>
    Notify by Email
</fast-switch>
```

### States

*Switch* can either be **on** or **off** clicking or keyboard interactions will flip it to its opposite state.

### Accessibility
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
https://www.w3.org/TR/wai-aria-1.1/#switch
https://github.com/nvaccess/nvda/issues/9187

*Switch* is a type of checkbox that represents on/off values, as opposed to checked/unchecked values. The *button* should have its role set to *aria-role="switch"* and *aria-checked* should be set to represent the current state of the *Switch*. *aria-labelledby* should be set to the id of the *Switch* label and *aria-describedby* should be set to the status message only if values other than "On" and "Off" are passed.

### Globalization

*Switch* should mirror in RTL languages. 

### Dependencies

*Will implementing the component require taking on any dependencies?*

- *3rd party libraries*
- *Upcoming standards we need to polyfill*
- *Dependencies on other fast components or utilities*

*Do any of these dependencies bring along an associated timeline?*

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---

## Resources
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role
https://www.w3.org/TR/wai-aria-1.1/#switch
https://github.com/nvaccess/nvda/issues/9187
