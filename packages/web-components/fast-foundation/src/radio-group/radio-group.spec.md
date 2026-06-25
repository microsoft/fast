# Radio group

## Overview

As defined by the W3C:
> A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time. Some implementations may initialize the set with all buttons in the unchecked state in order to force the user to check one of the buttons before moving past a certain point in the workflow.

### Use Cases

Radio group allows the user to be presented with a list of all the options visible which can facilitate the comparison of choice.
  
### Features

- **Selection:** A radio group can only support single select


### Prior Art/Examples
- [Material UI](https://material-ui.com/api/radio-group/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/radio-group/)
- [Carbon design](https://www.carbondesignsystem.com/components/radio-button/code)
- [Ant Design](https://ant.design/components/radio/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/radio)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/radio-button)

---

## Design

### API

*The key elements of the component's public API surface:*

**Radio group**
*Component name:*
- `fast-radio-group`

*Attributes:*
- `value` - allows user to set the initial radio selected within the group.
- `readonly`
  - If there is a selected radio button in the group it should be submitted with the form but none of the radio buttons should be editable.
- `disabled`
  - All of the radio buttons should be disabled from user interaction and will not be submitted with the form data.

*Slots:*
- default slot for radio items
- label - provide a label for the radio group


### Anatomy and Appearance
*Parts:*
- positioning-region

*Template:*
```
<template
    role="radiogroup"
>
    <slot name="label"></slot>
    <div class="positioning-region" part="positioning-region">
        <slot ${slotted("slottedRadioButtons")}> </slot>
    </div>
</template>
```


### Accessibility

Keyboard interaction will work as described by [W3C](https://w3c.github.io/aria-practices/#radiobutton)

- Tab and Shift + Tab: Move focus into and out of the radio group. When focus moves into a radio group :
 - If a radio button is checked, focus is set on the checked button.
 - If none of the radio buttons are checked, focus is set on the first radio button in the group.
- Space: checks the focused radio button if it is not already checked.
- Right Arrow and Down Arrow: move focus to the next radio button in the group, uncheck the previously focused button, and check the newly focused button. If focus is on the last button, focus moves to the first button.
- Left Arrow and Up Arrow: move focus to the previous radio button in the group, uncheck the previously focused button, and check the newly focused button. If focus is on the first button, focus moves to the last button.

Additional support for keyboard interaction while in a toolbar as described by [W3C](https://w3c.github.io/aria-practices/#for-radio-group-contained-in-a-toolbar)

Radio group:
```html
<fast-radio-group value="3">
    <fast-radio value="1">One</fast-radio>
    <fast-radio value="2">Two</fast-radio>
    <fast-radio value="3" checked>Three</fast-radio>
    <fast-radio value="4" disabled>Four</fast-radio>
</fast-radio-group>
```

