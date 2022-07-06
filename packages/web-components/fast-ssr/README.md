# FAST SSR

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-ssr.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-ssr)

The `@microsoft/fast-ssr` package contains a NodeJS solution for rendering FAST templates and components. While primarily intended for supporting server-side rendering (SSR) scenarios, it also allows FAST to be used as a general purpose HTML templating solution.

## Requirements
- [NodeJS ^16.0.0](https://nodejs.org) 
- [`@microsoft/fast-element@^2.0.0`](https://www.npmjs.com/package/@microsoft/fast-element)

## Important Notes
`@microsoft/fast-ssr` is built using ES modules. This documentation assumes all JavaScript is run as ES module scripts. If that is not the case in your project, you can force ES module format by converting `.js` extensions to `.mjs`. [Details on this here.](https://nodejs.org/api/packages.html)

### Design Philosophy
Performance is a core tenant of this package. To help achieve that, it avoids needing a comprehensive DOM implementation to render components, instead relying on a minimal set of DOM globals provided by the packaged DOM shim. Doing so comes with an important idea to understand; non-custom elements (`<div>`, `<p>`, etc) are never instantiated as JavaScript objects and you cannot gain references to these elements declared in a template. The parts of a template containing these elements are emitted as-is to the SSR string result (with any bindings evaluated). It is for this reason [certain directives are no-ops](#directive-support-matrix). Additionally, components are rendered using only their template. Imperative code that adds elements or DOM content to a component will be invisible to the template renderer and will not be yielded in the final string result.

## Community Alignment
`@microsoft/fast-ssr` internally implements the `ElementRenderer` interface proposed [here](https://github.com/webcomponents-cg/community-protocols/issues/7#issuecomment-825151215) and implemented in [`@lit-labs/ssr`](https://github.com/lit/lit/tree/main/packages/labs/ssr). The `ElementRenderer` interface allows Custom Elements created by different component authoring libraries to be rendered side-by-side, maximizing the portability and interoperability of Web Components. For more on how to do that, see the section on [configuring the RenderInfo object](#configuring-the-renderinfo-object).

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
Import the renderer factory and construct a `TemplateRenderer`. You will also need a `RenderInfo` object. A default is provided, more on this [here](#configuring-the-renderinfo-object).
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
const result = templateRenderer.render(html`
    <!DOCTYPE HTML>
    <html>
        <body>
            <my-element></my-element>
        </body>
    </html>
`, defaultRenderInfo);
```

The template being rendered can also be a fragment of HTML, it does not need to be a valid document:

```js
const result = templateRenderer.render(html`<my-element></my-element>`, defaultRenderInfo);
```

#### Rendering Strings
The template renderer can also render `string` types just as it would a template:

```js
const result = templateRenderer.render("<!DOCTYPE HTML><html><body><my-element></my-element></body></html>", defaultRenderInfo);
```

#### Rendering Templates with Bindings
A template can be rendered with arbitrary source data by providing that source as the third argument to `.render()`. When doing so, bindings are invoked with that source data:

```ts
const result = templateRenderer.render(html`
    <h1>${x => x.message}</h1>
`, defaultRenderInfo, { message: "hello world" });
```

#### Rendering Templates with Directives
The `TemplateRenderer` can render templates with directives such as `when` and `repeat`. Some directives are no-ops, see the [directive support matrix](#directive-support-matrix) for details.

```ts
import { when, repeat } from "@microsoft/fast-element";

const result = templateRenderer.render(html`
    ${when(x => x.shouldRender, html`
        <h1>Colors of a pixel</h1>
        ${repeat(x => x.data, html`<li>${color => color}</li>`)}
    `)}
`, defaultRenderInfo, { shouldRender: true, data: ["red", "green", "blue"] });
```

##### Directive Support Matrix

|Directive Name|Support|
|-|-|
|[`children`](https://www.fast.design/docs/fast-element/using-directives#the-children-directive)|[![](https://img.shields.io/badge/-Unsupported-red)]()|
|[`ref`](https://www.fast.design/docs/fast-element/using-directives#the-ref-directive)|[![](https://img.shields.io/badge/-Unsupported-red)]()|
|[`repeat`](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive)|[![](https://img.shields.io/badge/-Supported-brightgreen)]()|
|[`slotted`](https://www.fast.design/docs/fast-element/using-directives#the-slotted-directive)|[![](https://img.shields.io/badge/-Unsupported-red)]()|
|[`when`](https://www.fast.design/docs/fast-element/using-directives#the-when-directive)|[![](https://img.shields.io/badge/-Supported-brightgreen)]()|

> Unsupported directives are no-ops. To understand more about why, see the [Design Philosophy.](#design-philosophy)

### Configuring the RenderInfo Object
`TemplateRenderer.render()` must be invoked with a `RenderInfo` object. Its purpose is to provide different element renderers to the process, as well as metadata about the rendering process. It can be used to render custom elements from different templating libraries in the same process. A pre-generated object is created for you by the factory function, but you can also easily construct your own: 

```js
const { templateRenderer, elementRenderer } = fastSSR();
templateRenderer.render(html`<some-fast-element></some-fast-element>`, {
    elementRenderers: [elementRenderer],
    customElementHostStack: [],
    customElementInstanceStack: [],
});
```

To render elements built with another library, that library will need to provide an `ElementRenderer` for the library. For example, to render a Lit element along-side a FAST element, provide the FAST `ElementRenderer` *and* the Lit `ElementRenderer` to the `RenderInfo` object:

```js
import fastSSR from "@microsoft/fast-ssr";
import { html } from "@microsoft/fast-element";
import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js"

const { templateRenderer, elementRenderer } = fastSSR();
// Some implementation that defines both FAST and Lit components
defineComponents();

const result = templateRenderer.render(html`
    <my-fast-element></my-fast-element>
    <my-lit-element></my-lit-element>
`, {
    elementRenderers: [elementRenderer, LitElementRenderer],
    customElementHostStack: [],
    customElementInstanceStack: []
});
```

### Scoping Requests

The SSR renderer can be used in a variety of contexts, one of the most common being a web server. In the web server context, it's important to keep data scoped to the context of an individual request. The easiest way to do this is to use the W3C Context protocol to inject data and services into web components combined with FAST's `RequestStorage` mechanism.

`RequestStorage` and `RequestStorageManager` provide a way to execute web server response handlers with per-request scoped Context. This can be set up for any web server framework, but FAST provides a simple helper for Express-compatible middleware. Here's a quick sample of how to configure middleware for per-request scoped DOM globals and Context.

```ts
import fastSSR, { RequestStorageManager } from "@microsoft/fast-ssr";
import express from "express";

const app = express();
const port = 8080;
const { templateRenderer, defaultRenderInfo } = fastSSR();

defineWebComponents();
const template = pageTemplate();

// set up per-request DOM globals and storage
app.use(RequestStorageManager.middleware());

app.get("/", (req, res) => {
    // This is running in the scoped context.
    // You can provide context instances here
    // and they will be scoped to the request
    // handler and cleaned up afterward.

    const stream = templateRenderer.render(
        template, 
        defaultRenderInfo
    );

    for (const part of stream) {
        res.write(part);
    }

    res.end();
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
```

If working with a different framework not compatible with Express middleware, you can use the `RequestStorageManager` APIs to create custom middleware or set up individual requests. First, install the per-request DOM shim when setting up your web server:

```ts
RequestStorageManager.installDOMShim();
```

Then, at the beginning of each request or in your middleware, create the backing storage for the request:

```ts
const storage = RequestStorageManager.createStorage();
```

Finally, you must run the request handler function using the `RequestStorageManager` as follows:

```ts
RequestStorageManager.run(storage, requestHandler);
```