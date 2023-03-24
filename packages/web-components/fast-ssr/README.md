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

#### Augmenting the DOM Shim
To augment the properties installed by the DOM shim, import the Window factory and installer directly, and provide an object to `createWindow()` with the properties that should be added or overwritten.

```ts
import {
  createWindow,
  installWindowOnGlobal,
} from '@microsoft/fast-ssr/dom-shim';

installWindowOnGlobal(createWindow({ isSSR: true }));
```

### Construct the Renderer
Import the renderer factory and construct a `TemplateRenderer`.
```js
import fastSSR from "@microsoft/fast-ssr";

const { templateRenderer } = fastSSR();
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
`);
```

The template being rendered can also be a fragment of HTML, it does not need to be a valid document:

```js
const result = templateRenderer.render(html`<my-element></my-element>`);
```

#### Rendering Strings
The template renderer can also render `string` types just as it would a template:

```js
const result = templateRenderer.render("<!DOCTYPE HTML><html><body><my-element></my-element></body></html>");
```

#### Rendering Templates with Bindings
A template can be rendered with arbitrary source data by providing that source as the third argument to `.render()`. When doing so, bindings are invoked with that source data:

```ts
const result = templateRenderer.render(html`
    <h1>${x => x.message}</h1>
`, templateRenderer.createRenderInfo(), { message: "hello world" });
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
`, templateRenderer.createRenderInfo(), { shouldRender: true, data: ["red", "green", "blue"] });
```

##### Directive Support Matrix

|Directive Name|Support|
|-|-|
|[`children`](https://www.fast.design/docs/fast-element/using-directives#the-children-directive)|[![](https://img.shields.io/badge/-Unsupported-red)]()|
|[`ref`](https://www.fast.design/docs/fast-element/using-directives#the-ref-directive)|[![](https://img.shields.io/badge/-Unsupported-red)]()|
|`render`|[![](https://img.shields.io/badge/-Supported-brightgreen)]()|
|[`repeat`](https://www.fast.design/docs/fast-element/using-directives#the-repeat-directive)|[![](https://img.shields.io/badge/-Supported-brightgreen)]()|
|[`slotted`](https://www.fast.design/docs/fast-element/using-directives#the-slotted-directive)|[![](https://img.shields.io/badge/-Unsupported-red)]()|
|[`when`](https://www.fast.design/docs/fast-element/using-directives#the-when-directive)|[![](https://img.shields.io/badge/-Supported-brightgreen)]()|

> Unsupported directives are no-ops. To understand more about why, see the [Design Philosophy.](#design-philosophy)

##### Rendering Custom Directives
`@microsoft/fast-element` supports creating custom directives, and `@microsoft/fast-ssr` supports *rendering* 
those custom directives by associating a SSR *renderer* to the custom directive.

> This section does not cover *creating* a FAST directives - that documentation is coming to fast-element.

With your directive (`MyDirective`) created, create a `ViewBehaviorFactoryRenderer` using the Directive

```ts
const MyDirectiveRenderer: ViewBehaviorFactoryRenderer<MyDirective> = {
    // Instructs the TemplateRenderer to use this renderer when instances of
    // 'MyDirective' are found in a template
    matches: MyDirective,
    *render(directive, renderInfo, source, templateRenderer, context) {
        // Yield something, or do nothing
    }
}
```

What a custom directive should *do* on the server depends highly on the scenario. As discussed above, several FAST directives are no-ops because the use-case doesn't make sense in an SSR context. The `render()` function is provided the directive instance, the SSR renderInfo object, any source data, the `TemplateRenderer`, and the `ExecutionContext` - use these to render what makes sense for the custom directive.

To use the custom renderer, you must configure `fastSSR`:
```ts
import fastSSR from "@microsoft/fast-ssr";

const { templateRenderer} = fastSSR({viewBehaviorFactoryRenderers: [MyDirectiveRenderer]});
```

Then, templates that use `MyDirective` can be rendered:

```ts
templateRenderer.render(html`<p ${new MyDirective("some-option")}></p>`);
```
#### Rendering Asynchronous Components
Sometimes it is necessary for a component to do asynchronous work prior to rending it's template, and `@microsoft/fast-ssr` can be configured to support async work by supplying the `renderMode: "async"` configuration to the SSR factory:

```ts
import fastSSR from "@microsoft/fast-ssr";

const { templateRenderer } = fastSSR({
    renderMode: "async"
});
```

Communication that an element requires asynchronous rendering is facilitated by the [PendingTask](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/pending-task.md) community protocol. The component should emit a `PendingTaskEvent` during it's `connectedCallback()`. Doing so instructs the `TemplateRenderer` to resolve all pending tasks before continuing rendering:
```ts
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task";
// ... 
class AsyncElement extends FASTElement {
    async doWork() {
        // ...
    }

    connectedCallback() {
        super.connectedCallback();

        this.dispatchEvent(new PendingTaskEvent(this.doWork()));
    }
}
```

When yielding the results of an async renderer, ensure that any `Promise` encountered is awaited:

```ts

for await (const part of templateRenderer.render(someAsyncTemplate)) {
    res.write(part);
}
```

> It's important to note that to accurately render asynchronous components, template rendering must be effectively paused until async work is complete. This is inherently inefficient because that work gets initiated iteratively, during template rendering. If possible, it is best to architect your components and application in such a way that async work happens prior to template rendering, where initiation of async work can be better coordinated.

#### Disabling Rendering for Specific Components
In cases where an author doesn't want a FAST component to render in SSR environments, but it is impractical to prevent *defining* that element in the custom element registry, the `ElementRenderer` exposes a mechanism to prevent matching elements it would otherwise match. Components can be disabled by tag-name (`"element-name"`), class constructor (`class MyElement extends FASTElement {}`), or `FASTElementDefinition` (`MyElement.compose({/* config */})`)

```ts
// The element gets defined somewhere in an application
const name = "my-element";
class MyElement extends FASTElement {}
const definition = MyElement.compose({name, template: html`<p>Hello world</p>`});
definition.define();


const { templateRenderer, ElementRenderer } = fastSSR();
ElementRenderer.disable("my-element");
// or 
// ElementRenderer.disable(MyElement);
// or
// ElementRenderer.disable(definition);

// Does not render template contents of the custom element
templateRenderer.render(html`<my-element></my-element>`);
```

### Hydration
#### `defer-hydration` Attribute
The `defer-hydration` attribute is an attribute that indicates to client-side code that the element should not hydrate it's view. When the attribute is removed, the element is free to hydrate itself.

The SSR renderer can be configured to emit the `defer-hydration` attribute to all FAST custom elements:
```ts
const { templateRenderer } = fastSSR({deferHydration: true});
```

> For more information on this community-protocol, see https://github.com/webcomponents-cg/community-protocols/pull/15
#### Configuring FAST-Element
`@microsoft/fast-element` must be configured to respect the `defer-hydration` attribute. To do this, simply import the install code into the client-side application before defining the custom elements:
```ts
import "@microsoft/fast-element/install-element-hydration";

// Define custom elements
```

Alternatively, the `HydratableElementController` can be imported and installed manually:

```ts
import { HydratableElementController } from "@microsoft/fast-element/element-hydration";

HydratableElementController.install();
```

After you do this, `@microsoft/fast-element` will wait until the `defer-hydration` attribute is removed (if present during connection) before doing connection work like rendering templates, applying stylesheets, and binding behaviors.

### Configuring the RenderInfo Object
`TemplateRenderer.render()` must be invoked with a `RenderInfo` object. Its purpose is to provide different element renderers to the process, as well as metadata about the rendering process. It can be used to render custom elements from different templating libraries in the same process. By default, `TemplateRenderer.render()` will create a `RenderInfo` object for you, but you can also easily construct your own using `TemplateRenderer.createRenderInfo()`: 

```js
const { templateRenderer, ElementRenderer } = fastSSR();
templateRenderer.render(html`<some-fast-element></some-fast-element>`, templateRenderer.createRenderInfo());
```

By default, `TemplateRenderer.createRenderInfo()` returns a `RenderInfo` object hydrated with only the `ElementRenderer` returned from `fastSSR()`. To configure this method to return a `RenderInfo` with *additional* or *different* elementRenderers, use the `TemplateRenderer.withDefaultElementRenderers()` method:

```ts
    import { AnotherElementRenderer } from "somewhere";
    const { templateRenderer, ElementRenderer } = fastSSR();

    templateRenderer.withDefaultElementRenderers(ElementRenderer, AnotherElementRenderer);

    const renderInfo = templateRenderer.createRenderInfo();
    renderInfo.elementRenderers.includes(ElementRenderer); // true
    renderInfo.elementRenderers.includes(AnotherElementRenderer); // true
```

To render elements built with another library, that library will need to provide an `ElementRenderer` for the library. For example, to render a Lit element along-side a FAST element, provide the FAST `ElementRenderer` *and* the Lit `ElementRenderer` to the `RenderInfo` object. There are two ways to accomplish this. First, the `templateRenderer` itself can be configured to always create `RenderInfo` objects using both renderers:

```ts
import fastSSR from "@microsoft/fast-ssr";
import { html } from "@microsoft/fast-element";
import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js"

const { templateRenderer, ElementRenderer } = fastSSR();

templateRenderer.withDefaultElementRenderers(ElementRenderer, LitElementRenderer);
// Some implementation that defines both FAST and Lit components
defineComponents();

const result = templateRenderer.render(html`
    <my-fast-element></my-fast-element>
    <my-lit-element></my-lit-element>
`);
```

Alternatively, a `RenderInfo` can be created with both renderers for only a single rendering process:
```ts
// ...
import fastSSR from "@microsoft/fast-ssr";
import { html } from "@microsoft/fast-element";
import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js"

const { templateRenderer, ElementRenderer } = fastSSR();

// Some implementation that defines both FAST and Lit components
defineComponents();

const result = templateRenderer.render(html`
    <my-fast-element></my-fast-element>
    <my-lit-element></my-lit-element>
`, templateRenderer.createRenderInfo([ElementRenderer, LitElementRenderer]));
```


### Scoping Requests

The SSR renderer can be used in a variety of contexts, one of the most common being a web server. In the web server context, it's important to keep data scoped to the context of an individual request. The easiest way to do this is to use the W3C Context protocol to inject data and services into web components combined with FAST's `RequestStorage` mechanism.

`RequestStorage` and `RequestStorageManager` provide a way to execute web server response handlers with per-request scoped Context. This can be set up for any web server framework, but FAST provides a simple helper for Express-compatible middleware. Here's a quick sample of how to configure middleware for per-request scoped DOM globals and Context.

```ts
import fastSSR, { RequestStorageManager } from "@microsoft/fast-ssr";
import express from "express";

const app = express();
const port = 8080;
const { templateRenderer } = fastSSR();

defineWebComponents();
const template = pageTemplate();

// set up per-request DOM globals and storage
app.use(RequestStorageManager.middleware());

app.get("/", (req, res) => {
    // This is running in the scoped context.
    // You can provide context instances here
    // and they will be scoped to the request
    // handler and cleaned up afterward.

    const stream = templateRenderer.render(template);

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