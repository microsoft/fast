# Spec Title

## Overview

*The name of the component, along with a high-level description.*

### Background

*Relevant historical or background information, related existing issues, etc.*

### Use Cases

*Primary use cases for this component.*

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component*
  
### Features
- Can represent either a hyperlink or a button 

### Risks and Challenges

Prior implementations of button provide the oppertunity to create a `button` element or an `a` element. The `button` element is a form-associated element but the `a` element is not. If we expose a single component polymophic button that can represent both a `button` and an `a` - we need to figure out how to only form-associate the `button`.

### Prior Art/Examples
- [FAST DNA React](https://explore.fast.design/components/button)
- [Material UI](https://material-ui.com/components/buttons/)
- [Lightning Design System](https://www.lightningdesignsystem.com/components/buttons/)
- [Carbon Design](https://www.carbondesignsystem.com/components/button/code)

- [Ant Design](https://ant.design/components/checkbox/)
- [Atlassian](https://atlaskit.atlassian.com/packages/core/checkbox)
- [Office Fabric](https://developer.microsoft.com/en-us/fabric#/controls/web/checkbox)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/checkbox)

---

## Design

*Describe the design of the component, thinking through several perspectives:*

- *A customer using the component on a web page.*
- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
- *A designer customizing the component.*

### API

*The key elements of the component's public API surface:*

- *Component Name*
- *Props/Attrs*
- *Methods*
- *Events*

*Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity.*

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

## Next Steps

*What next steps, if any, are there? Is there some functionality that would be a nice-to-have or a common feature in other implementations that could be added but is not considered part of the MVP?*
