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
description: View the list of browsers that have native support for the Web Components features and native globalThis required by fast-element v3.
keywords:
  - browser support
---

The following browsers have native support for the Web Components features used by `@microsoft/fast-element`, including the native `globalThis` required by v3:

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

FAST Element v3 no longer polyfills `globalThis` for older engines. If you need
to support an environment below these minimums, load a `globalThis` polyfill
before importing FAST.
