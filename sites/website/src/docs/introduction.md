---
id: introduction
title: Introduction
sidebar_label: Introduction
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/introduction.md
---

Welcome to the FAST documentation! We're glad you're here. We can't wait to show you around.

## What is FAST?

FAST is a collection of JavaScript packages centered around web standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.

Have you ever needed a reusable set of UI components that you could drop into your app and have an amazing experience? _**That's FAST.**_

Have you ever needed to create your own components, and share them across your company, including across groups that use different, incompatible front-end frameworks? _**That's FAST.**_

Have you ever needed to implement a branded experience or a design language like Microsoft's Fluent UI or Google's Material Design? _**That's FAST.**_

Have you ever wanted to improve your app's startup time, render speed, or memory consumption? _**That's FAST.**_

Have you ever wanted to adopt more web standards and build your site or app on a native web foundation that's immune to the shifting sands of the modern JavaScript front-end landscape? _**That's FAST.**_

Let's take a look at what each of FAST's core packages gives us today.

### fast-element

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-element.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-element)

The `fast-element` library is a lightweight means to easily building performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. To get up and running with `fast-element` see [the Getting Started guide](/docs/fast-element/getting-started).

### fast-foundation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-foundation.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-foundation)

The `fast-foundation` package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems (e.g. Fluent Design, Material Design, etc.). The exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.

This package does not export Web Components registered as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) - it exports parts and pieces intended to be *composed* into Web Components, allowing you to implement your own design language by simply applying CSS styles and behaviors without having to write all the JavaScript that's involved in building production-quality component implementations.

### fast-components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components)

`fast-components` is a library of Web Components that *composes* the exports of `fast-foundation` with stylesheets aligning to the FAST design language. This composition step registers a custom element. See the [quick start](/docs/components/getting-started) to get started using the components.

### fast-components-msft

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components-msft.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components-msft)

`fast-components-msft` is a library of Web Components that *composes* `fast-foundation`. `fast-components-msft` uses the same custom element names as `fast-components`, but makes use of different stylesheets that support Microsoft's Fluent design language.

### Component Explorer

Launch our [Component Explorer](https://explore.fast.design) to experience our [FAST Components](https://www.npmjs.com/package/@microsoft/fast-components) and development tools.

## Getting started

If you're looking to get started using our components right away, take a look at [the components quick start](/docs/components/getting-started). You'll also want to check out [our integrations](/docs/integrations/introduction) if you're looking to add the components into a Webpack build or incorporate them with another front-end framework. For those interested in implementing their own design system or customizing the styles of the components, after you [have a look at the components](/docs/components/getting-started), you'll want to read through [our styling docs](/docs/design/introduction). Finally, if your goal is to build your own components or apps with `fast-element`, you can learn all about that in our [guide to building web components with FASTElement](/docs/fast-element/getting-started).

## Joining the community

Looking to get answers to questions or engage with us in realtime? Our community is most active [on Discord](https://discord.gg/FcSNfg4). Submit requests and issues on [Github](https://github.com/Microsoft/fast/issues/new/choose), or join us by contributing on [some good first issues via Github](https://github.com/Microsoft/fast/labels/good%20first%20issue).

We look forward to building an amazing open source community with you!