# Web Components

Our web component packages.

## `@microsoft/fast-element`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-element.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-element)

The `@microsoft/fast-element` library is a lightweight means to easily build performant, memory-efficient, standards-compliant Web Components. FAST Elements work in every major browser and can be used in combination with any front-end framework or even without a framework. To get up and running with `@microsoft/fast-element` see [the Getting Started guide](https://fast.design/docs/getting-started/quick-start).

## `@microsoft/fast-ssr`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-ssr.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-ssr)

The `@microsoft/fast-ssr` package contains a NodeJS solution for rendering FAST templates and components. While primarily intended for supporting server-side rendering (SSR) scenarios, it also allows FAST to be used as a general purpose HTML templating solution.

## `@microsoft/fast-router`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-foundation.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-router)

The `@microsoft/fast-router` package contains a history-based navigation and routing solution designed around Web Components. By using `fast-router`, you can create multi-page and full application experiences. The router works with any Web Components, but has special support for Web Components built on FAST.

## `@fluentui/web-components`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40fluentui%2Fweb-components.svg)](https://badge.fury.io/js/%40fluentui%2Fweb-components)

`@fluentui/web-components` is a library of Web Components that *composes* `@microsoft/fast-foundation`. `@fluentui/web-components` makes use of different stylesheets and may include components that specifically support Microsoft's Fluent design language.

The Fluent UI Web Components are built on `@microsoft/fast-element` and `@microsoft/fast-foundation`. The source for `@fluentui/web-components` is hosted in [the Fluent UI monorepo](https://github.com/microsoft/fluentui/tree/master/packages/web-components).