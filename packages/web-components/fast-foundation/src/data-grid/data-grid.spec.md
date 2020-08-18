# Data Grid

## Overview

The `data grid` component enables authors to display an array of data in a grid layout.  The layout includes a "header" region where a title can be displayed for each column.  


### Background

*Relevant historical or background information, related existing issues, etc.*

### Use Cases

*Primary use cases for this component.*

### Non-goals
- The initial version of the component will not support virtualization to display large data sets but should be architected to support it in a future release.
  
### Features

*A list of the key features unique to this component.*

### Risks and Challenges

*Notable risks or challenges associated with implementing the component. Would we need to make any breaking changes in order to achieve this component's goals?*

### Prior Art/Examples

Previous React version of FAST data grid.

[Infragistics](https://www.infragistics.com/products/ignite-ui-web-components/web-components/components/data-grid.html#:~:text=%20Data%20Grid%20Overview%20%201%20Demo.%20,Components%20data%20grid%20to%20the%20above...%20More%20)

[Smart](https://www.htmlelements.com/docs/grid/)

[Vaadin](https://vaadin.com/components/vaadin-grid)


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
The menu should align to the interaction model provided by the [W3C](https://w3c.github.io/aria-practices/#grid)

### Globalization
The order of grid columns is inverted in RTL layouts.

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

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---

## Resources

*Any related resource links such as web standards, discussion threads, diagrams, etc.*

## Next Steps

*What next steps, if any, are there? Is there some functionality that would be a nice-to-have or a common feature in other implementations that could be added but is not considered part of the MVP?*
