# FAST SSR

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-ssr.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-ssr)

The `@microsoft/fast-ssr` package contains a NodeJS solution for emitting templates and components built using FAST to HTML markup strings.

## Requirements
- [NodeJS ^16.0.0](https://nodejs.org) 
- [`@microsoft/fast-element@^2.0.0`](https://www.npmjs.com/package/@microsoft/fast-element)

## Important Notes
`@microsoft/fast-ssr` is built using ES modules. This documentation assumes all JavaScript is run as ES module scripts. If that is not the case in your project, you can force ES module format by converting `.js` extensions to `.mjs`. [Click here for more information.](https://nodejs.org/api/packages.html)

## How it Works
`@microsoft/fast-ssr` internally implements `ElementRenderer` interface proposed [here](https://github.com/webcomponents-cg/community-protocols/issues/7#issuecomment-825151215)
nd implemented in [`@lit-labs/ssr`](https://github.com/lit/lit/tree/main/packages/labs/ssr). The `ElementRenderer` interface allows Custom Elements created by different component authoring libraries to be rendered side-by-side, maximizing the portability and interoperability of Web Components.

- Parses string templates to HTML, depth-first traversal, constructing custom element nodes it finds and yielding out shadow dom. 
- Only custom elements are constructed, native elements are yielded directly as strings. This means directives such as `children`, `slotted`, and `ref` are no-ops.
- Elements need to exist in the template to be rendered. Idiomatic operations appending and removing elements will not result in SSR string changes

## Installation
Install `@microsoft/fast-ssr` and `@microsoft/fast-element` using your package manager of choice:

```shell
npm install --save @microsoft/fast-ssr @microsoft/fast-element
```
## Usage
### Installing the DOM Shim
`@microsoft/fast-ssr` requires a minimal DOM implementation to function. Install the shim by importing it. Doing so will ensure availability of certain DOM globals like `HTMLElement`, `Document`, etc.

```js
import "@microsoft/fast-ssr/install-dom-shim";
```

Alternatively, a full DOM implementation such as [`jsdom`](https://github.com/jsdom/jsdom) or [`happy-dom`](https://github.com/capricorn86/happy-dom) can be used.

### Construct the Renderer
Import the renderer factory and construct a `TemplateRenderer`:
```js
import fastSSR from "@microsoft/fast-ssr";

const { templateRenderer, defaultRenderInfo } = fastSSR();
```

### Define Custom Elements
Ensure that the custom elements used in the template you are rendering are defined in the `customElements` registry. This example defines a component directly, but you can also import any components being used:
```js
import { customElement, html, FASTElement } from "@microsoft/fast-element":

@customElement({name: "my-element", template: html`<h1>${x => x.message}</h1>`})
class MyElement extends FASTElement {
    @attr
    public message = "Hello World";
}
```

### Rendering
With the `TemplateRenderer` created and a custom element defined, the `TemplateRenderer` can now render a template with that element. The result will be an `iterableIterator<string>`, which allows the result to be streamed to the client before the entire template has been rendered.

```js
const result templateRenderer.render(html`
<!DOCTYPE HTML>
<html>
    <body>
        <my-element></my-element>
    </body>
</html>
`, defaultRenderInfo);
```

#### Rendering Strings
The template renderer can also render `string` types just as it would a template:

```js
const result templateRenderer.render("<!DOCTYPE HTML><html><body><my-element></my-element></body></html>", defaultRenderInfo);
```

#### Rendering Templates with Bindings
A template can be rendered with arbitrary source data. When done so, bindings are invoked with that source data:

```ts
const result = templateRenderer.render(html`
    <h1>${x => x.message}</h1>
`, defaultRenderInfo, { message: "hello world" });
```

#### Rendering Templates with Directives
The `TemplateRenderer` can render templates with `@microsoft/fast-element` directives such as `when` and `repeat`.

## Testing
This package uses Playwright and a lightweight web server for running tests. You can run the tests by running `npm run test`.

> Playwright may prompt you to install browsers to run the tests. If so, follow the instructions provided or run `npm run install-playwright-browsers`.