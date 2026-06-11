---
id: browser-support
title: Browser Support
layout: 3x
eleventyNavigation:
  key: browser-support3x
  parent: resources3x
  title: Browser Support
navigationOptions:
  activeKey: browser-support3x
description: View browser and application support guidance for FAST Element v3 features, fallbacks, and optional SSR/hydration capabilities.
keywords:
  - browser support
---

FAST Element v3 builds on native web platform features. The baseline
client-rendered runtime expects autonomous custom elements, Shadow DOM, and
native `globalThis` support. Optional capabilities, such as Declarative Shadow
DOM hydration and constructable stylesheets, use newer browser features when
they are available.

## Baseline runtime support

The following browser versions have native support for the baseline features used
by client-rendered `@microsoft/fast-element` components:

* Microsoft Edge 79+
* Mozilla Firefox 65+
* Google Chrome 71+
* Apple Safari 12.1+
* Opera 58+
* iOS Safari 12.2+
* Android Browser 81+
* Opera Mobile 54+
* Chrome for Android 81+
* Firefox for Android 68+
* Samsung Internet 10.0+

FAST Element v3 does not include platform polyfills. If an application must run
below these minimums, load standards-compatible polyfills before importing FAST.
The optional features in the matrix below do not change this baseline list unless
an application opts into those features.

## Feature support matrix

| Feature | Browser support guidance | Fallback and application requirements |
|---|---|---|
| Web Components / custom elements | Supported by the baseline browsers above for autonomous custom elements. FAST Element does not use customized built-in elements. | No FAST fallback. Browsers must provide native custom elements, or the application must load compatible platform polyfills before defining FAST elements. |
| Shadow DOM | Supported by the baseline browsers above. FAST creates an open shadow root by default for templates and style encapsulation. | No FAST Shadow DOM polyfill. Components that intentionally set `shadowOptions: null` can render to light DOM, but default FAST Element authoring expects browser Shadow DOM support. |
| Declarative Shadow DOM | Optional for client-only rendering. Hydration requires browser support for `<template shadowrootmode>`, such as Chrome/Edge 111+, Firefox 123+, Safari/iOS Safari 16.4+, Opera 97+, Samsung Internet 22+, and current Chromium-based mobile browsers. | FAST hydrates an existing shadow root; it does not make unsupported browsers parse Declarative Shadow DOM. Older browsers need an application-level DSD transform/polyfill before components connect, or they should use client rendering. |
| `adoptedStyleSheets` / constructable stylesheets | Supported in Chrome 73+, Edge 79+, Firefox 101+, Safari/iOS Safari 16.4+, Opera 60+, Samsung Internet 11.1+, and current Chromium-based mobile browsers. | FAST falls back to injected `<style>` elements for string-based `css` styles when adopted stylesheets are unavailable. Passing `CSSStyleSheet` instances directly requires browser constructable stylesheet support. |
| Trusted Types | Not part of the FAST Element baseline. Available in Chrome/Edge 83+, Firefox 148+, Safari/iOS Safari 26+, Opera 69+, Samsung Internet 13+, and matching current Chromium-based mobile browsers. | FAST creates a Trusted Types policy when `globalThis.trustedTypes` exists and otherwise uses its string-based DOM policy. Apps that enforce `require-trusted-types-for` must configure an appropriate DOM policy before templates compile. |
| `globalThis` | Required by FAST Element v3. The baseline versions above include native `globalThis` support. | FAST Element v3 no longer polyfills `globalThis`. Load a `globalThis` polyfill before importing FAST in older browsers or non-browser runtimes. |

## SSR and hydration notes

Client-rendered FAST Element components only need the baseline runtime features.
Server-side rendering and hydration add browser and application requirements:

* The server must emit FAST-compatible hydration markers and Declarative Shadow
  DOM templates.
* The browser must parse Declarative Shadow DOM before FAST elements connect.
* The application must call `enableHydration()` from
  `@microsoft/fast-element/hydration.js` before hydrated elements connect.
* If hydration is not enabled, or if a template is not hydratable, FAST uses
  client-side rendering for the element.

Use client rendering, or provide an application-owned DSD transform/polyfill, for
browsers that meet the baseline runtime requirements but do not support
Declarative Shadow DOM.
