---
id: overview
title: What is a Design System?
sidebar_label: Overview
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/design-systems/overview.md
description: A Design System can generally be thought of as a collection of resources for interactive media that promotes brand alignment.
keywords:
  - design systems
---

A Design System can be generally thought of as a collection of interactive media resources that promotes brand alignment. While that definition is intentionally broad, in UI development, Design Systems manifest as component libraries surrounded by usage guidance and design principles.

## How does FAST facilitate development of design systems?

FAST helps by both providing a highly configurable design system that you can drop into any app and by providing a set of building blocks you can use to construct your own design system from scratch, with very little work.

## A highly configurable design system

[FAST Frame](./fast-frame.md) is the name of our highly configurable design system. It's made up of a set of web components and accompanying design tokens. The visual design can be impacted in myriad ways using the exported [Design Tokens](./design-tokens.md), element templates and styles can be augmented or overridden, and shadow roots can be opened or closed as necessary for your application. If you’re looking to get up and running with FAST Web Components and the FAST Frame design system, [start here](./fast-frame.md).

### Design Tokens

Design Tokens are powerful tools that are used to express design abstractions like color, typography, spacing units, and other design-led values. FAST exposes powerful tools for creating and using Design Tokens for your Design System. FAST Frame leverages FAST's design tokens extensively. FAST Frame's use of design tokens is so extensive that you might be able to create your own design system simply by modifying the existing tokens. Of course, you can always create your own tokens and even base your tokens on compositions of existing tokens. To learn more [see our documentation on design tokens](./design-tokens.md).

## Your own design system based on FAST components

If you need more control than you can get through modifying design token values or recipes, you can wrap your styling around the foundation components. By exporting raw JavaScript Custom Element classes, `@microsoft/fast-foundation` handles the business-logic driving a large catalog of UI components. These Custom Element classes can be taken as-is and composed with your templates and styles to match your application or library requirements, reducing the development time and overhead of creating your own design system. For example, rather than implementing a Tree View from scratch, you can use the Foundation Tree View class and simply compose it with your own CSS to create a reusable web component as part of your own system.
