---
id: overview
title: Overview
sidebar_label: Overview
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/overview.md
---
- What is the Design System?
    - Answers the question "What is a Design System in FAST and what is it for?"
    - Captures information about UX design
        - [Colors](https://www.fast.design/docs/design/color)
        - Fonts and [font sizes](https://www.fast.design/docs/design/type-ramp)
        - Motion
        - Contrast preferences
        - UI density
        - etc...
    - Stores Design Tokens
- How is the Design System used?
    - Values represented as CSS custom properties
    - Values represented as a JavaScript object
        - Can be used for programmatic calculation. See "Using design system resolvers"
    - Provided to components by a DesignSystemProvider
- What is the DesignSystemProvider?
    - HTML element
    - Creates CSS custom properties for Design System values
    - Propagates Design System JavaScript object to descendent elements
    - Resolves functions of the Design System to CSS custom properties
        - [See color recipes](https://www.fast.design/docs/design/color#algorithmic-colors-recipes) 
    - `use-defaults` explained
    - Explain "Adaptive UI"
    - Describe property inheritance through document structure
    - Using the DesignSystemProvider to configure and change the Design System