# Spec Title

## Process

- [ ] **Checkpoint 1** - Schedule a spec review meeting to cover the Overview section before proceeding to work on the Design section. Be sure to include relevant stakeholders such as members of the tools team.

- [ ] **Checkpoint 2** - Schedule a spec review meeting before beginning the implementation work. Be sure to invite relevant stakeholders such as design system owners.

- [ ] **Checkpoint 3** - Submit the component PR and schedule a component code review meeting or present the component in one of our Engineering Open Mic sessions. Address feedback from the review, obtain final approvals through GitHub, and merge.

## Overview

*The name of the component, along with a high-level description.*

### Background

*Relevant historical or background information, related existing issues, etc.*

### Use Cases

*Primary use cases for this component. These should be based on typical patterns seen in the industry and requests from customers.*

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component.*
  
### Features

*A list of the key features unique to this component.*

### Risks and Challenges

*Notable risks or challenges associated with implementing the component. Would we need to make any breaking changes in order to achieve this component's goals?*

### Prior Art/Examples

*Screenshots and/or links to existing, canonical, or exemplary implementations of the component.*

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

### Anatomy 

Outline the component structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

- *Slot Names*
- *Host Classes*
- *Slotted Content/Slotted Classes*
- *CSS Parts*

*Work closely with the visual design partner to co-develop the API and anatomy along side the visual design.

### Visual Appearance

*Provide Figma files and other design assets. Be sure to account for the various component states, including hover, active, etc. as well as validity, and appearance variants. Focus primarily on the officially supported design system as well as known community scenarios as appropriate. Consider other popular design systems during this process and, where possible, ensure that common design features that may not be part of the officially supported design system can be accommodated. Work closely with engineering to co-develop the visual design along side the API and anatomy.*

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
  - e.g. The implications shadow dom might have on how roles and attributes are presented to the AT. Components which delegate focus require all global aria-* attributes to be enumerated.

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

*What is the plan for testing the component, if different from the normal path? Note that the normal plan includes unit tests for basic state/behavior as well as end-to-end tests to validate the specific user stories described above.*

### Tooling

*Are there any special considerations for tooling? Will tooling changes need to be made? Is there a special way to light up this component in our tooling that would be compelling for developers/designers?*

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---
## Appendix

### Resources

*Any related resource links such as web standards, discussion threads, diagrams, etc.*

### Next Steps

*What next steps, if any, are there? Is there some functionality that would be a nice-to-have or a common feature in other implementations that could be added but is not considered part of the MVP?*
