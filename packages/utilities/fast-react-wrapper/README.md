# FAST React Wrapper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-react-wrapper.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-react-wrapper)

The `fast-react-wrapper` package contains a utility that enables automatically wrapping Web Components in a React component for ease of integration into React projects.

## Installation

### From NPM

To install the `fast-react-wrapper` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @microsoft/fast-react-wrapper
```

```shell
yarn add @microsoft/fast-react-wrapper
```

Within your JavaScript or TypeScript code, you can then and use the wrapper like this:

```ts
import React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';

const { wrap } = provideReactWrapper(React);

const MyComponent = wrap(MyComponent);
```

For additional wrapper settings and more information on integrating with Design Systems, see [our integration docs](https://fast.design/docs/integrations/react).