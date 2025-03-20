<div align="center">
    <p><b>ni | fast | react wrapper</b></p>
</div>

# FAST React Wrapper

[![NI FAST React Wrapper NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-react-wrapper.svg?label=@ni/fast-react-wrapper)](https://www.npmjs.com/package/@ni/fast-react-wrapper)

The `fast-react-wrapper` package contains a utility that enables automatically wrapping Web Components in a React component for ease of integration into React projects. This `@ni/fast-react-wrapper` library is a fork of [`@microsoft/fast-react-wrapper`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/utilities/fast-react-wrapper).


## Getting Started

### Installing from NPM

To install the `fast-react-wrapper` library, use `npm` as follows:

```shell
npm install @ni/fast-react-wrapper
```

Within your JavaScript or TypeScript code, you can then and use the wrapper like this:

```ts
import React from 'react';
import { provideReactWrapper } from '@ni/fast-react-wrapper';

const { wrap } = provideReactWrapper(React);

const MyComponent = wrap(MyComponent);
```

For additional wrapper settings and more information on integrating with Design Systems, see the [FAST 1.x: React integration docs](https://fast.design/docs/1.x/integrations/react).
