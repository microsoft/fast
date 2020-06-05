---
id: introduction
title: Introduction
sidebar_label: Introduction
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/sites/website/src/docs/introduction.md
---

Welcome to the FAST-DNA documentation! We're glad you're here. We can't wait to show you around.

## What is FAST-DNA?

FAST-DNA is a collection of JavaScript packages centered around web standards, designed to help you efficiently tackle some of the most common challenges in website and application development. Have you ever needed a reusable set of UI components that you could drop into your app and have an amazing experience? That's FAST-DNA. Have you ever needed to create your own components, and share them across your company, including across groups that use different, incompatible front-end frameworks? That's FAST-DNA. Have you ever needed to implement a branded experience or a design language like Microsoft's Fluent UI or Google's Materials Design? That's FAST-DNA. Have you ever wanted to improve your apps's startup time, speed up its rendering, or lower its memory consumption? That's FAST-DNA. Have you ever wanted to adopt more web standards and build your site or app on a native web foundation that's immune to the shifting sands of the modern JavaScript front-end landscape? That's FAST-DNA.

Let's take a look at what each of FAST-DNA's packages give you today:

### fast-element

The `@microsoft/fast-element` library is a lightweight means to easily building performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. To get up and running with `@microsoft/fast-element` see [the Getting Started guide](fast-element/getting-started.md).

### fast-foundation

The `@microsoft/fast-foundation` package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems (e.g. Fluent Design, Material Design, etc.). The exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.

This package does not export Web Components registered as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) - it exports parts and pieces intended to be *composed* into Web Components, allowing you to implement your own design language by simply applying CSS styles and behaviors without having to write all the JavaScript that's involved in building production-quality component implementations.

### fast-components

`@microsoft/fast-components` is a library of Web Components that *composes* the exports of `@microsoft/fast-foundation` with stylesheets aligning to the FAST design language. This composition step registers a custom element.

Both the [quick start](./fast-foundation/getting-started) and the [advanced guide](./fast-foundation/getting-started#advanced-guide) leverage custom elements from this package.

### fast-components-msft

`@microsoft/fast-components-msft` is another library of Web Components that *composes* `@microsoft/fast-foundation`. `@microsoft/fast-components-msft` uses the same custom element names as `@microsoft/fast-components`, but makes use of different stylesheets that align to the Microsoft design language.

## Getting Started

If you're looking to get started using our components right away, take a look at [the components quick start](./fast-foundation/getting-started). You'll also want to check out [our integrations](./fast-foundation/webpack) if you're looking to add the components into a Webpack build or incorporate them with another front-end framework. For those interested in implementing their own design system or customizing the styles of the components, after you [have a look at the components](./fast-foundation/getting-started), you'll want to read through [our styling docs](./fast-components/intro). Finally, if your goal is to build your own components or apps with `fast-element`, you can learn all about that in our [guide to building web components with FASTElement](./fast-element/getting-started).

## Joining the Community

Looking to get answers to questions or engage with us in realtime? Our community is most active [on Discord](https://discord.gg/FcSNfg4). We look forward to building an amazing open source community with you!