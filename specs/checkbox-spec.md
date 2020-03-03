# FAST-Checkbox

## Overview

An implementation of a checkbox as a form-connected web-component.

### Use Cases

Used anywhere someone might otherwise use an `input[type="checkbox"]`
  
### Features

- form association

### Risks and Challenges

We want general feature-parity between this component and an `input[type="checkbox"]`. Most of these concerns are addressed by https://github.com/microsoft/fast-dna/pull/2723, but some stateful nuance will need to be handled by this component.

### Prior Art/Examples
- [FAST-DNA (React)](https://explore.fast.design/components/checkbox)
- [Material UI](https://material-ui.com/components/checkboxes/)
- [Lightning Design](https://www.lightningdesignsystem.com/components/checkbox/)
- [Carbon Design](https://www.carbondesignsystem.com/components/checkbox/code)
- [Ant Design](https://ant.design/components/checkbox/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/checkbox)
- [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/checkbox)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/checkbox)
---

### API
Extends API exposed by: https://github.com/microsoft/fast-dna/pull/2723/files

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

*Screenshots and/or description of the basic appearance of the component. Outline its structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

- *Slot Names*
- *Host Classes*
- *Slotted Content/Slotted Classes*
- *CSS Parts*

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*

### Accessibility

*Consider the accessibility of the component, including:*

- *Keyboard Navigation and Focus*
- *Form Input*
- *Use with Assistive Technology*
  - e.g. The implications shadow dom might have on how roles are presented to the AT.

### Globalization

*Consider whether the component has any special globalization needs such as:*

- *Special RTL handling*
- *Swapping of internal icons/visuals*
- *Localization*

### Security

*Are there any security implications surrounding the component?*

### Performance

*Are there any performance pitfalls or challenges with implementing the component?*

### Dependencies

*Will implementing the component require taking on any dependencies?*

- *3rd party libraries*
- *Upcoming standards we need to polyfill*
- *Dependencies on other fast components or utilities*

*Do any of these dependencies bring along an associated timeline?*

### Test Plan

*What is the plan for testing the component, if different from the normal path?*

### Tooling

*Are there any special considerations for tooling? Will tooling changes need to be made? Is there a special way to light up this component in our tooling that would be compelling for developers/designers?*

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---

## Resources

*Any related resource links such as web standards, discussion threads, diagrams, etc.*
