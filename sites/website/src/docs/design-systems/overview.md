---
id: overview
title: What is the Design System?
sidebar_label: Overview
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/overview.md
---
A Design System can generally be thought of as a collection of resources for interactive media that promotes brand alignment. While that definition is intentionally broad, in UI development, Design Systems generally manifest as component libraries surrounded by usage guidance and design principles.

## How does FAST facilitate development of Design Systems?
### Highly Configurable Web Components
[FAST Frame](/docs/design-systems/fast-frame) is a library of highly configurable Web Components. The visual design can be impacted in myriad ways using the exported [Design Tokens](docs/design-systems/design-tokens), element templates and styles can be augmented or overridden, and shadow roots can be opened or closed as necessary for your application. If you’re looking to get up and running with using FAST Web Components, [start here.](/docs/design-systems/fast-frame)

### Foundation Components
By exporting raw JavaScript Custom Element classes, `@microsoft/fast-foundation` handles the business-logic driving a large catalog of UI components. These Custom Element classes can taken as-is and composed with your templates and styles to match your application or library requirements, reducing development time and overhead of maintaining the core business logic of the component.

### Design Tokens
Design Tokens are powerful tools to that are used to express design abstractions like color, typography, spacing units, and other design-led values.  FAST exposes powerful tools for creating and using Design Tokens for your Design System. Learn more [here](/docs/design-systems/design-tokens).