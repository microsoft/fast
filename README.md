
![fast_banner_github_914.png](https://static.fast.design/assets/fast_banner_github_914.png)

# FAST

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)

[![Maintainability](https://api.codeclimate.com/v1/badges/8a74621e634a6e9b9561/maintainability)](https://codeclimate.com/github/Microsoft/fast/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8a74621e634a6e9b9561/test_coverage)](https://codeclimate.com/github/Microsoft/fast/test_coverage)
![workflows](https://github.com/microsoft/fast/workflows/CI%20-%20FAST/badge.svg?branch=master&event=push)

[![Discord](https://img.shields.io/badge/chat%20on-discord-7289da.svg)](https://discord.gg/FcSNfg4)
[![Twitter](https://img.shields.io/twitter/follow/fast_ui.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=fast_ui)

This is the FAST monorepo, containing web component packages, tools, examples, and documentation. FAST tech can be used à la carte or as a suite to build enterprise-grade websites, applications, components, design systems, and more.

**TL;DR**

* Create reusable UI components based on web component standards.
* Use our standard library of pre-built web components in your apps.
* Choose between two *adaptive* design systems: Fluent Design and FAST Frame.
* Build your own design system without re-implementing component logic.
* Integrate with any front-end framework or build system.

:star: We appreciate your star, it helps!

## Introduction

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

The `fast-element` library is a lightweight means to easily building performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. To get up and running with `fast-element` see [the Getting Started guide](http://fast.design/docs/fast-element/getting-started).

### fast-foundation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-foundation.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-foundation)

The `fast-foundation` package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems (e.g. Fluent Design, Material Design, etc.). The exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.

This package does not export Web Components registered as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) - it exports parts and pieces intended to be *composed* into Web Components, allowing you to implement your own design language by simply applying CSS styles and behaviors without having to write all the JavaScript that's involved in building production-quality component implementations.

### fast-components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components)

`fast-components` is a library of Web Components that *composes* the exports of `fast-foundation` with stylesheets aligning to the FAST design language. This composition step registers a custom element. See the [quick start](http://fast.design/components/getting-started) to get started using the components.

### fast-components-msft

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-components-msft.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-components-msft)

`fast-components-msft` is a library of Web Components that *composes* `fast-foundation`. `fast-components-msft` uses the same custom element names as `fast-components`, but makes use of different stylesheets that support Microsoft's Fluent design language.

### Component Explorer

Launch our [Component Explorer](https://explore.fast.design) to experience our [FAST Components](https://www.npmjs.com/package/@microsoft/fast-components) and development tools.

## Getting Started

If you're looking to get started using our components right away, take a look at [the components quick start](http://fast.design/docs/components/getting-started). You'll also want to check out [our integrations](http://fast.design/docs/integrations/introduction) if you're looking to add the components into a Webpack build or incorporate them with another front-end framework. For those interested in implementing their own design system or customizing the styles of the components, after you [have a look at the components](http://fast.design/docs/components/getting-started), you'll want to read through [our styling docs](http://fast.design/docs/design/introduction). Finally, if your goal is to build your own components or apps with `fast-element`, you can learn all about that in our [guide to building web components with FASTElement](http://fast.design/docs/fast-element/getting-started).

## Joining the Community

Looking to get answers to questions or engage with us in realtime? Our community is most active [on Discord](https://discord.gg/FcSNfg4). Submit requests and issues on [GitHub](https://github.com/Microsoft/fast/issues/new/choose), or join us by contributing on [some good first issues via GitHub](https://github.com/Microsoft/fast/labels/good%20first%20issue).

We look forward to building an amazing open source community with you!

## Features & benefits

### Unopinionated

There are a million and one great ways to build your next website or application. To support the technologies you choose, creating unopinionated code is at the center of every decision we make in FAST.

This principle of being unopinionated manifests in several important ways including:

* A flat component architecture that lets you compose what you need without struggling with rigid patterns and complex objects.
* Separating base components from styles and design systems to support multiple implementations without re-writing or duplicating styles. Use the design system to customize existing styled components, or build your own styles, with your design system, without having to rebuild or duplicate the base components.
* Framework agnostic tooling that lets you use our development tools with any view framework.
* The ability to replace almost any FAST package with your package of choice. Get started with our animation package and add more as you need them. Alternatively, use our suite of packages to build your next project from the ground up; it's your call.

### UI development and style guide tools

When developing components and views, excellent development tooling can make all the difference. FAST offers development and style guide tools that work with FAST components, components from other frameworks, or your components.

Try out component properties with an auto-generated property UI, get a live preview of the code based on any property’s configuration, preview localization (RTL/LTR) and themes, and preview component compositing with a transparency grid.

Also, we built FAST development tools from re-usable packages, so if you have special needs, you can build your tools from the same shared libraries.

### Bring your design system

Widely available design systems from companies like Microsoft (Fluent), Google (Material), or Salesforce (Lightning) are useful when it is essential to align with a platform or take advantage of a polished system at low cost, but many companies have a design system of their own, and some may have multiple design systems or variations.

Because FAST has abstracted base components from their style, you get a head start on your design system by building on top of tried and true base components and style libraries like our offerings for color, animation, and elevation.

## Contact

* Join the community and chat with us in real-time on [Discord](https://discord.gg/FcSNfg4).
* Submit requests and issues on [GitHub](https://github.com/Microsoft/fast/issues/new/choose).
* Contribute by helping out on some of our recommended first issues on [GitHub](https://github.com/Microsoft/fast/labels/good%20first%20issue).
