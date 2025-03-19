<div align="center">
    <p><b>ni | fast | foundation</b></p>
</div>

# FAST Foundation

[![NI FAST Foundation NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-foundation.svg?label=@ni/fast-foundation)](https://www.npmjs.com/package/@ni/fast-foundation)

The `fast-foundation` package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems (e.g. [NI Nimble Design System](https://nimble.ni.dev/), etc.). The exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.

This package does not export Web Components registered as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) - it exports parts and pieces intended to be *composed* into Web Components, allowing you to implement your own design language by simply applying CSS styles and behaviors without having to write all the JavaScript that's involved in building production-quality component implementations.

## Getting Started

### Installing from NPM

To install the `fast-foundation` library, use `npm` as follows:

```shell
npm install @ni/fast-foundation
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { Anchor } from '@ni/fast-foundation';
```

Looking for a setup that integrates with a particular front-end framework or bundler? Check out the [FAST 1.x: integration docs](https://fast.design/docs/1.x/integrations/introduction).

### Documentation

See the [FAST 1.x: Creating a Component Library](https://fast.design/docs/1.x/design-systems/creating-a-component-library) documentation and related topics.
