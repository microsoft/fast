---
id: introduction
title: Introduction
sidebar_label: Introduction
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/introduction.md
keywords:
  - introduction
  - web components
---

# Introduction

## What is FAST?

FAST is a collection of technologies built on Web Components and modern Web Standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.

### What are Web Components?

"Web Components" is an umbrella term that refers to a collection of web standards focused on enabling the creation of custom HTML elements. Some of the standards that are under the umbrella include the ability to define new HTML tags, plug into a standard component lifecycle, encapsulate HTML rendering and CSS, parameterize CSS, skin components, and more. Each of these platform features is defined by the W3C and has shipped in every major browser today.

### How does FAST leverage Web Components?

`@microsoft/fast-element` provides a thin layer of opinion on top of Web Components, lifting the level of abstraction just enough to make it easier and faster to build components by providing:

- Attribute/property syncing
- Rich Model-View-ViewModel (MVVM) support
- Efficient template rendering/update
- Style composition
- Elements refs, template directives, and much more.

The entire `@microsoft/fast-element` library, without tree-shaking, is around 10kb minified and GZipped. It was designed for tree-shaking from the beginning, so any feature you don't use when building a component will be removed during build, allowing for highly efficient optimized payloads as small as 4.5k.

One of FAST's driving principles is "strive to adopt open, web standards-based approaches as much as possible." To that end, FAST is built directly on the W3C Web Component standards mentioned above, and does not create its own component model. This allows components built with FAST to function the same as built-in, native HTML elements. You do not need a framework to use FAST components, but you can use them in combination with any framework or library of your choice.