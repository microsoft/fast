
<div align="center">
    <p><b>ni | fast</b></p>
</div>

# FAST

NI fork of Microsoft FAST to support the [NI Nimble Design System](https://github.com/ni/nimble).

If you are at NI, lucky you! **Reach out to ask questions** via Microsoft Teams on the Design System [`General` channel](https://teams.microsoft.com/l/channel/19%3ACb5zEPCpdADS7kC0XTWXJGwZCq0qHVxnjkiPEWeEz7k1%40thread.tacv2/General?groupId=180bf0c7-4ff2-405e-8330-fdbe8ab6eb52&tenantId=eb06985d-06ca-4a17-81da-629ab99f6505) or via NI Stack Overflow with the [`nimble` tag](https://ni.stackenterprise.co/questions/tagged/813).

If you are outside NI, we want to hear from you too! See how to reach out in the [**Community**](#community) section below.

## Introduction

FAST is a collection of technologies built on Web Components and modern Web Standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.

In May 2024 the [Microsoft FAST project changed directions](https://github.com/microsoft/fast/issues/6955) and is no longer supporting the FAST Foundation library concept. The [Nimble Design System response](https://github.com/ni/nimble/blob/main/specs/fast-project-realignment/README.md) was to create this fork of the libraries to enable bug fixes and continued maintenance of the FAST libraries for the short to mid-term.

## Goals

- Maintain the FAST libraries used in the fork.
- Perform dependency version updates and generic bug fixes for existing features.
- Adopt minor features targeted to consistency / alignment for general purpose use.
- Avoid new major feature or component development, prefer forking templates for significant or non-generic changes.
- Potentially re-integrate [removed packages or features](https://github.com/ni/nimble/blob/main/specs/fast-project-realignment/README.md#minimal-fork-proposal) based on future needs or community feedback.
- Potentially stage / research minor changes to assist in [future work for handling FAST re-alignment](https://github.com/ni/nimble/blob/main/specs/fast-project-realignment/README.md#future-work).

## Getting Started

See the corresponding `Getting Started` section in the packages hosted in the repository.

### Component packages

[![NI FAST Element NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-element.svg?label=@ni/fast-element)](https://www.npmjs.com/package/@ni/fast-element)
[![NI FAST Foundation NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-foundation.svg?label=@ni/fast-foundation)](https://www.npmjs.com/package/@ni/fast-foundation)

- **[`@ni/fast-element`](/packages/web-components/fast-element/)** - FAST base class, templating, and modelling system.
  - See related [FAST 1.x: Defining Elements](https://fast.design/docs/1.x/fast-element/defining-elements) documentation.
  - See related [`@microsoft/fast-element` API](https://fast.design/docs/1.x/api/fast-element) documentation.
- **[`@ni/fast-foundation`](/packages/web-components/fast-foundation/)** - FAST foundation base classes for common design system components.
  - See related [FAST 1.x: Creating a Component Library](https://fast.design/docs/1.x/design-systems/creating-a-component-library) documentation.
  - See related [`@microsoft/fast-foundation` API](https://fast.design/docs/1.x/api/fast-foundation) documentation.

### Utility packages

[![NI FAST Colors NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-colors.svg?label=@ni/fast-colors)](https://www.npmjs.com/package/@ni/fast-colors)
[![NI FAST React Wrapper NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-react-wrapper.svg?label=@ni/fast-react-wrapper)](https://www.npmjs.com/package/@ni/fast-react-wrapper)
[![NI FAST Web Utilities NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-web-utilities.svg?label=@ni/fast-web-utilities)](https://www.npmjs.com/package/@ni/fast-web-utilities)

- **[`@ni/fast-colors`](/packages/utilities/fast-colors/)** - Color classes and utilities to parse and manipulate colors.
- **[`@ni/fast-react-wrapper`](/packages/utilities/fast-react-wrapper/)** - A utility that enables automatically wrapping Web Components in a React component.
  - See related [FAST 1.x: React integration](https://fast.design/docs/1.x/integrations/react) documentation.
- **[`@ni/fast-web-utilities`](/packages/utilities/fast-web-utilities/)** - A collection of utilities intended to be used for web projects.

## Community

We welcome feedback and contributions aligned with our goals for the repo!

The fastest way to ask questions is to [join the discussion on Teams](https://teams.microsoft.com/l/channel/19%3ACb5zEPCpdADS7kC0XTWXJGwZCq0qHVxnjkiPEWeEz7k1%40thread.tacv2/General?groupId=180bf0c7-4ff2-405e-8330-fdbe8ab6eb52&tenantId=eb06985d-06ca-4a17-81da-629ab99f6505) or the [NI Stack Overflow](https://ni.stackenterprise.co/questions/tagged/813) (accessible to NI employees only). You can also start a discussion on GitHub by [filing an issue](https://github.com/ni/fast/issues/new/choose).

## Contributing

See `Getting Started` in [`Contributing.md`](/CONTRIBUTING.md#getting-started) to get started with building the monorepo.

[![contributors](https://markupgo.com/github/ni/fast/contributors?width=800&count=0&circleSpacing=10&removeLogo=true)](https://github.com/ni/fast/graphs/contributors)

## Acknowledgements

Thank you to the team at [Microsoft FAST](https://github.com/microsoft/fast) for starting this project!
