
![fast_banner_github_914.png](https://static.fast.design/assets/fast_banner_github_914.png)

# FAST

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)

[![Maintainability](https://api.codeclimate.com/v1/badges/8a74621e634a6e9b9561/maintainability)](https://codeclimate.com/github/Microsoft/fast/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8a74621e634a6e9b9561/test_coverage)](https://codeclimate.com/github/Microsoft/fast/test_coverage)
[![Validate PRs](https://github.com/microsoft/fast/actions/workflows/ci-validate-pr.yml/badge.svg)](https://github.com/microsoft/fast/actions/workflows/ci-validate-pr.yml)
[![Validate Platforms/Browsers](https://github.com/microsoft/fast/actions/workflows/ci-validate-platforms.yml/badge.svg)](https://github.com/microsoft/fast/actions/workflows/ci-validate-platforms.yml)

[![Deploy Documentation](https://github.com/microsoft/fast/actions/workflows/cd-deploy-www-production.yml/badge.svg)](https://github.com/microsoft/fast/actions/workflows/cd-deploy-www-production.yml)
[![Deploy CDN](https://github.com/microsoft/fast/actions/workflows/cd-deploy-cdn.yml/badge.svg)](https://github.com/microsoft/fast/actions/workflows/cd-deploy-cdn.yml)

[![Discord](https://img.shields.io/badge/chat%20on-discord-7289da.svg)](https://discord.gg/FcSNfg4)
[![Twitter](https://img.shields.io/twitter/follow/fast_ui.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=fast_ui)

This is the FAST monorepo, containing web component packages, tools, examples, and documentation. FAST tech can be used à la carte or as a suite to build enterprise-grade websites, applications, components, design systems, and more.

:star: We appreciate your star, it helps!

## Introduction

FAST is a collection of technologies built on Web Components and modern Web Standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.

**TL;DR**

* Create reusable UI components with `@microsoft/fast-element`, all based on W3C Web Component standards.
* Use our `@microsoft/fast-foundation` library to rapidly build [W3C OpenUI-based](https://open-ui.org/) design systems without re-implementing component logic.
* Leverage modern, W3C standards-based SSR for Web Components by plugging in `@microsoft/fast-ssr`.
* Bring all the pieces together to build SPAs and rich experiences with our Web Components router by installing `@microsoft/fast-router`.
* React users can drop in `@microsoft/fast-react-wrapper` to turn any Web Component into a native React component.
* Integrate FAST Web Components with any library, framework, or build system. You can adopt incrementally without re-writing your existing systems.

For an in-depth explanation of FAST [see our docs introduction](https://www.fast.design/docs/introduction/).

## Packages

### `@microsoft/fast-element`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-element.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-element)

The `@microsoft/fast-element` library is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. To get up and running with `@microsoft/fast-element` see [the Getting Started guide](https://fast.design/docs/fast-element/getting-started).

### `@microsoft/fast-foundation`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-foundation.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-foundation)

The `@microsoft/fast-foundation` package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems (e.g. Fluent Design, Material Design, etc.). The exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.

This package does not export Web Components registered as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) - it exports parts and pieces intended to be *composed* into Web Components, allowing you to implement your own design language by simply applying CSS styles and behaviors without having to write all the JavaScript that's involved in building production-quality component implementations.

### `@microsoft/fast-ssr`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-ssr.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-ssr)

The `@microsoft/fast-ssr` package contains a NodeJS solution for rendering FAST templates and components. While primarily intended for supporting server-side rendering (SSR) scenarios, it also allows FAST to be used as a general purpose HTML templating solution.

### `@microsoft/fast-router`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-router.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-router)

The `@microsoft/fast-router` package contains a history-based navigation and routing solution designed around Web Components. By using `fast-router`, you can create multi-page and full application experiences. The router works with any Web Components, but has special support for Web Components built on FAST.

### `@fluentui/web-components`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40fluentui%2Fweb-components.svg)](https://badge.fury.io/js/%40fluentui%2Fweb-components)

`@fluentui/web-components` is a library of Web Components that *composes* `@microsoft/fast-foundation`. `@fluentui/web-components` makes use of different stylesheets and may include components that specifically support Microsoft's Fluent design language.

The Fluent UI Web Components are built on `@microsoft/fast-element` and `@microsoft/fast-foundation`. The source for `@fluentui/web-components` is hosted in [the Fluent UI monorepo](https://github.com/microsoft/fluentui/tree/master/packages/web-components).

## Getting Started

We hope you're excited by the possibilities that FAST presents. But, you may be wondering where to start. Here are a few statements that describe various members of our community. We recommend that you pick the statement you most identify with and follow the links where they lead. You can always come back and explore another topic at any time.

* "I just want ready-made components!"
  * [Check out the FluentUI Web Components.](https://docs.microsoft.com/en-us/fluent-ui/web-components/)
* "I want to build my own design system."
  * [Jump to the design system docs.](https://fast.design/docs/design-systems/overview)
* "I want to build my own components."
  * [Jump to the fast-element docs.](https://fast.design/docs/fast-element/getting-started)
* "I need to integrate FAST with another framework or build system."
  * [Jump to the integration docs.](https://fast.design/docs/integrations/introduction)
* "I want to look at a quick reference."
  * [Jump to the Cheat Sheet](https://fast.design/docs/resources/cheat-sheet)

## Joining the Community

Looking to get answers to questions or engage with us in realtime? Our community is most active [on Discord](https://discord.gg/FcSNfg4). Submit requests and issues on [GitHub](https://github.com/Microsoft/fast/issues/new/choose), or join us by contributing on [some good first issues via GitHub](https://github.com/Microsoft/fast/labels/community:good-first-issue).

Get started here with the [Contributor Guide](https://www.fast.design/docs/community/contributor-guide).

We look forward to building an amazing open source community with you!

## Features & benefits

### Unopinionated

There are a million and one great ways to build your next website or application. To support the technologies you choose, creating unopinionated code is at the center of every decision we make in FAST.

This principle of being unopinionated manifests in several important ways including:

* A flat component architecture that lets you compose what you need without struggling with rigid patterns and complex objects.
* Separating base components from styles and design systems to support multiple implementations without re-writing or duplicating styles. Use the design system to customize existing styled components, or build your own styles, with your design system, without having to rebuild or duplicate the base components.
* Framework agnostic tooling that lets you use our development tools with any view framework.
* The ability to replace almost any FAST package with your package of choice. Just use one package or leverage our entire suite of packages to build your next project from the ground up; it's your call.

### Tooling

Leverage our (upcoming!) FAST CLI to accelerate your design or development workflow. You can create new projects from scratch, create design systems, and add or customize from dozens of components in our foundation library.

### Bring your design system

Widely available design systems from companies like Microsoft (Fluent), Google (Material), or Salesforce (Lightning) are useful when it is essential to align with a platform or take advantage of a polished system at low cost, but many companies have a design system of their own, and some may have multiple design systems or variations.

Because FAST has abstracted base components from their style, you get a head start on your design system by building on top of tried and true base components and style libraries like our offerings for color, animation, and elevation.

## Contact

* Join the community and chat with us in real-time on [Discord](https://discord.gg/FcSNfg4).
* Submit requests and issues on [GitHub](https://github.com/Microsoft/fast/issues/new/choose).
* Contribute by helping out on some of our recommended first issues on [GitHub](https://github.com/Microsoft/fast/labels/community:good-first-issue).
