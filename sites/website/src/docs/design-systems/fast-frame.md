---
id: fast-frame
title: The FAST Frame Design System 
sidebar_label: FAST Frame
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/fast-frame.md
---
The FAST Frame Design System is the Design System that comes with the `@microsoft/fast-components` package.





## Design System properties
Every piece of Design System data in the FAST Frame Design System exists in the [`FASTDesignSystem`](/docs/api/fast-components.fastdesignsystem) interface. The [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider) *implements* the [`FASTDesignSystem`](/docs/api/fast-components.fastdesignsystem). These two resources are the best place to look for a catalog of what Design System data exists in FAST Frame, as well as which CSS custom properties exist and which HTML attributes / JavaScript properties are used to configure the Design System.

## Adaptive Color



- What is FAST Frame
    - A design system implementation of FAST Foundation.
- Comprehensive properties table with definitions and CSS custom property names (if applicable)
    - Included use cases of properties
    - Show examples where appropriate
- Configuring the FAST Frame Design System
    - Setting value driven by content property
    - Setting value driven by IDL property
    - Coordinating color palettes and base colors
- Extending the FAST Frame Design System
    - Create a new `DesignSystemProvider` that extends FASTDesignSystemProvider
    - Declare new Design System properties
    - Use element in HTML