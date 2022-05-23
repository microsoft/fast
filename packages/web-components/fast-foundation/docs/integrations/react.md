---
id: react
title: React
sidebar_label: React
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/docs/integrations/react.md
description: FAST can be used in React applications. Let's take a look at how you can set up a project, starting from scratch.
keywords:
  - react
---

FAST can be used in React applications. Let's take a look at how you can set up a project, starting from scratch.

## Setting up the React project

First, you'll need to make sure that you have Node.js >= 8.2 and npm >= 5.6 installed. You can learn more and download that [on the official site](https://nodejs.org/).

With Node.js installed, you can use [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) to create a new React project.

```shell
npx create-react-app fast-app
```

## Configuring packages

Next, we'll install the FAST packages, along with supporting libraries. To do that, run this command from your new project folder:

```shell
npm install --save @microsoft/fast-components @microsoft/fast-foundation @microsoft/fast-element @microsoft/fast-react-wrapper
```

## Configure create-react-app

[create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) ships with an [eslint](https://eslint.org/) rule that makes working with FAST components difficult. There are two changes that will need to be made in the `package.json`:

**Set the EXTEND_ESLINT environment variable in start, build, and test scripts**

```jsonc
{
    //...
    "scripts": {
        "start": "EXTEND_ESLINT=true react-scripts start",
        "build": "EXTEND_ESLINT=true react-scripts build",
        "test": "EXTEND_ESLINT=true react-scripts test",
    }
    // ...
}
```

:::note
The above will not work on Windows. You can adjust the scripts to use [cross-env](https://www.npmjs.com/package/cross-env) to add Windows support.
:::

**Override the `eslintConfig` field to turn off the 'no-unused-expressions' rule**

```jsonc
{
    //..
    "eslintConfig": {
        "extends": "react-app",
        "rules": {
            "no-unused-expressions": "off"
        }
    },
    //..
}
```

See [configuring eslint](https://create-react-app.dev/docs/setting-up-your-editor#experimental-extending-the-eslint-config) for more information.

## Using the components

With all the basic pieces in place, let's run our app in dev mode with `npm start`. Right now, it displays the React logo and some editing instructions, since we haven't added any code or interesting HTML. Let's change that.

First, open your `src/app.js` file and add the following code:

```js
import { 
    provideFASTDesignSystem, 
    fastCard, 
    fastButton
} from '@microsoft/fast-components';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import React from 'react';

const { wrap } = provideReactWrapper(
    React, 
    provideFASTDesignSystem()
);

export const FastCard = wrap(fastCard());
export const FastButton = wrap(fastButton())
```

This code uses the FAST Design System to register the `<fast-card>` and `<fast-button>` components while automatically wrapping them into React components. Once you save, the dev server will rebuild and refresh your browser. However, you still won't see anything. To get some UI showing up, we need to write some HTML that uses our components. Replace the App component in your `src/app.js` file with the following:

```jsx
function App() {
    return (
      <FastCard>
          <h2>FAST React</h2>
          <FastButton appearance="accent" onClick={() => console.log("clicked")}>Click Me</FastButton>
      </FastCard>
    );
}
```

To add a splash of style, add the following to the `src/App.css`:

```css
fast-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: var(--type-ramp-plus-5-font-size);
  line-height: var(--type-ramp-plus-5-line-height);
}

fast-card > fast-button {
  align-self: flex-end;
}
```

Congratulations! You're now set up to use FAST and React!

## Using the React Wrapper

Above, we leveraged the `@microsoft/fast-react-wrapper` library to enable seamless integration of FAST Components. There are a few additional ways to use this API for different web component scenarios.

### Wrapping Design System Components

Previously, you've seen that we can wrap a Design System component by passing its registration function to the `wrap` method as follows:

```ts
const { wrap } = provideReactWrapper(
    React, 
    provideFASTDesignSystem()
);

export const FastButton = wrap(fastButton())
```

This code creates a wrapper that is configured with a React-compatible API and a Design System instance. When passing a Design System as the second parameter, you can then pass component registration functions to the `wrap` helper. The helper will both register the web component with the Design System and wrap it in a type-safe React component, all with a single call.

Alternatively, you can skip providing the Design System to the wrapper, and use the generated registry to manually register all previously wrapped components.

```ts
const { wrap, registry } = provideReactWrapper(React);

export const FastButton = wrap(fastButton())

provideFASTDesignSystem()
    .register(registry)
```

The final option is to handle everything by hand:

```ts
const { wrap } = provideReactWrapper(React);

export const FastButton = wrap(fastButton())

provideFASTDesignSystem()
    .register(
        fastButton()
    );
```

### Wrapping FAST Components

The `wrap` helper can also wrap any FAST Web Component defined using the `@customElement` decorator or by manually calling `FASTElement.define`. To do so, pass the custom element class to the wrapper.

```ts
import { FASTElement, customElement, html } from '@microsoft/fast-element';

@customElement({
  name: 'my-component',
  template: html`...`,
  styles:...
})
class _MyComponent extends FASTElement {

}

export const MyComponent = provideReactWrapper(React).wrap(_MyComponent);
```
:::note
When using decorators in a create-react-app setup, you will most likely get this error `Support for the experimental syntax 'decorators-legacy' isn't currently enabled`. See the "Additional Notes" below for options to add support for decorators.
:::
### Wrapping VanillaJS Web Components

If you have a component from a 3rd party library, not written with FAST, or a VanillaJS Web Component, you can wrap that as well. In this scenario, you will have to provide some additional information, such as the element name and the list of properties that should be handled by the wrapper rather than React. Components created with libraries like `Lit` require the element name to be configured but not the properties, while some other libraries or hand-written components may also require the property list. This depends on how the component was defined. Below is an example of configuring both the name and the property list.

```ts
import { CoolComponent as _CoolComponent } from '@cool/component';

const { wrap } = provideReactWrapper(React);

export const CoolComponent = wrap(
  _CoolComponent,
  {
    name: 'cool-component',
    properties: [
      'list',
      'properties',
      'here'
    ]
  }
);
```

### Configuring Custom Events

If the wrapped component uses custom events that you intend to use from React, you will need to manually configure a mapping from React event name to the native event name. Here's an example of what that would look like if you wanted to leverage the FAST MenuItem's `expanded-change` event:

```ts
const { wrap } = provideReactWrapper(
    React, 
    provideFASTDesignSystem()
);

export const FastMenuItem = wrap(
    fastMenuItem(),
    {
      events: {
        onExpandedChange: 'expanded-change'
      }
    }
)
```

## Additional Notes

### create-react-app

FAST makes use of decorators to define components. At this time, `create-react-app` [does not support decorators](https://create-react-app.dev/docs/can-i-use-decorators/). This won't be a problem when using components *imported* from FAST because they have already been transpiled by TypeScript - but to *create* components in a `create-react-app` application you'll need to do one of the following:
- [Define components without decorators](../fast-element/defining-elements.md#working-without-decorators)
- [Eject](https://create-react-app.dev/docs/available-scripts#npm-run-eject)`create-react-app` and change Babel to support decorators 
- Use an intermediary like [react-app-rewired](https://www.npmjs.com/package/react-app-rewired)

You can read more about decorator configuration issues [here.](https://github.com/microsoft/fast/issues/4503)
### Configure ejected create-react-app

Eject create-react-app:
```shell
npm run eject
```

Install babel plugins:
```shell
npm i --save-dev @babel/plugin-proposal-decorators @babel/preset-env
```
#### Configure babel-loader options

Go to the `webpack.config.js` file under the `config` folder and find where `babel-loader` is (around line 407).

Add `@babel/preset-env` to presets. This allows you to use the latest JavaScript features.
Targeting specific browser versions prevents Babel from transpiling too much to support old JavaScript versions, increasing file size.

```js
presets: [
  ["@babel/preset-env", {
    "targets": {
      "browsers": ["last 2 versions", "safari >= 7"]
    }
  }],
  ...
```
Add `@babel/plugin-proposal-decorators` to support decorators.

```js
plugins: [
  ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ...
```

### Working without the fast-react-wrapper

The `@microsoft/fast-react-wrapper` library described above addresses all the challenges involved in using Web Components from React. We strongly recommend using this library for integration. However, if you cannot use this library or want to explore other options, below you'll find information on alternative approaches.

#### HTML Attributes

React is capable of rendering custom HTML elements and binding data to them, but it is beneficial to understand *how* React does this. React will apply all *props* to a custom HTML element as *HTML attributes* - including non-primitive types such as arrays and objects. Where some UI libraries provide binding syntaxes to distinguish setting properties, attributes, and events, React does not. This means that it can be very easy to end up with `my-prop="[object Object]"` in your HTML. React is exploring solutions [in this issue](https://github.com/facebook/react/issues/11347). See the section on [interop layers](#interop-layers-skatejsval-and-reactify-wc) for a work-around for this issue.

#### Custom events

React's synthetic eventing system comes with an unfortunate side-effect of being incapable of declaratively applying [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) listeners. [interop layers](#interop-layers-skatejsval-and-reactify-wc) can be used to address this issue. Alternatively, a `ref` can be used on the custom element to imperatively apply the event listener to the HTML element directly.

#### Interop layers: @skatejs/val and reactify-wc

[@skatejs/val](https://github.com/skatejs/val) is a small library that wraps React's `createElement` function and provides the ability direct React *props* explicitly to HTML attributes, DOM properties, or to declarative event listeners.

Another good option is [reactify-wc](https://github.com/BBKolton/reactify-wc). It provides similar capabilities as `@skatejs/val` but does so by creating component wrappers.

#### TypeScript and TSX support

If you're using TypeScript, you'll need to augment the `JSX.IntrinsicElements` interface to use custom elements in TSX. To do so, create a `custom-elements.d.ts` file in your source directory and add the following:

```ts
// custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        /**
         *  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> allows setting standard HTML attributes on the element
         */
        "my-element": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            "my-attribute-name": string;
        };
    }
}
```
