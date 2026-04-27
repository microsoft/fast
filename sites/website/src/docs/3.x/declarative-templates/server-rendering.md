---
id: declarative-server-rendering
title: Server-Side Rendering
layout: 3x
eleventyNavigation:
  key: declarative-server-rendering3x
  parent: declarative-templates3x
  title: Server-Side Rendering
navigationOptions:
  activeKey: declarative-server-rendering3x
description: Learn how to render declarative FAST templates on the server and hydrate them on the client.
keywords:
  - server-side rendering
  - SSR
  - hydration
  - fast-build
  - declarative shadow DOM
  - prerendering
---

{% raw %}

# Server-Side Rendering

One of the core benefits of FAST's declarative HTML templates is stack-agnostic server-side rendering. Because `<f-template>` markup is standard HTML with binding expressions — not JavaScript — any server technology can render the initial page without a JS runtime.

## The Rendering Contract

A server-side renderer must produce HTML that follows these conventions so the client-side FAST runtime can hydrate it:

1. **Declarative Shadow DOM** — Custom element content is rendered inside a `<template shadowrootmode="open">` element, which the browser expands into a shadow root.
2. **Hydration markers** — Attribute bindings are annotated with `data-fe="N"` attributes on elements (where `N` is the count of attribute bindings on that element). Content bindings are wrapped in `<!--fe:b-->VALUE<!--fe:/b-->` comment markers.
3. **State resolution** — Binding expressions like `{{title}}` are resolved to their initial values from a state object.

**Example:** Given this template and state:

```html
<f-template name="greeting-card">
    <template>
        <h2>{{title}}</h2>
        <button ?disabled="{{!isActive}}" @click="{handleClick($e)}">
            {{buttonLabel}}
        </button>
    </template>
</f-template>
```

```json
{ "title": "Hello", "isActive": true, "buttonLabel": "Click me" }
```

A server renderer produces:

```html
<greeting-card title="Hello" is-active button-label="Click me">
    <template shadowrootmode="open">
        <h2><!--fe:b-->Hello<!--fe:/b--></h2>
        <button data-fe="2">
            <!--fe:b-->Click me<!--fe:/b-->
        </button>
    </template>
</greeting-card>
```

Note that `data-fe="2"` appears on the `<button>` because it has two attribute bindings: the boolean `?disabled` binding and the `@click` event binding. Content bindings (`{{title}}` and `{{buttonLabel}}`) use comment markers instead. Event bindings and attribute directives are client-only — the server strips them but allocates binding slots for hydration.

When the page loads, the FAST declarative runtime finds these markers and attaches reactive bindings to the existing DOM nodes instead of re-rendering.

## Hydration Flow

The end-to-end flow from server to interactive page follows these steps:

1. **Server renders** — The renderer resolves `{{bindings}}` against the state, injects Declarative Shadow DOM `<template>` elements, and adds hydration markers.
2. **Browser loads HTML** — The browser parses the page. Declarative Shadow DOM `<template>` elements are automatically expanded into shadow roots.
3. **JavaScript loads** — Component classes are defined with `template: declarativeTemplate()`, which waits for matching `<f-template>` elements and resolves the template.
4. **Template resolution** — `declarativeTemplate()` coordinates with the `<f-template>` elements to parse the declarative markup and supply the compiled template to each element definition.
5. **Hydration** — If `enableHydration()` was called before FAST elements connect, FAST detects the pre-rendered shadow DOM, maps existing DOM nodes to binding slots using hydration markers, and re-establishes reactive observations. Without `enableHydration()`, the element renders client-side instead.
6. **Interactive** — The page is fully interactive. Property changes trigger targeted DOM updates.

:::tip
The controller exposes two properties: `isPrerendered` resolves `true` when the element had a declarative shadow root at connect time, while `isHydrated` resolves `true` only when hydration actually ran successfully. Use these to detect how the element was rendered and when it is fully interactive.
:::

## State Propagation

When the server renders custom elements, attribute values on the host element become the initial state for template bindings inside the shadow DOM.

```html
<greeting-card title="Hello" message="Welcome"></greeting-card>
```

The `title` and `message` attributes become state properties that resolve `{{title}}` and `{{message}}` in the element's template.

### Nested Custom Elements

State flows from parent to child elements. Unbound state keys — values from the parent state that the parent template does not consume — propagate automatically to child custom elements.

```html
<!-- Parent state: { "theme": "dark", "username": "Jane" } -->
<app-header username="{{username}}">
    <!-- theme propagates to user-avatar even though
         app-header's template doesn't use it -->
    <template shadowrootmode="open">
        <user-avatar username="{{username}}"></user-avatar>
    </template>
</app-header>
```

### Special Attribute Handling

The renderer applies special rules for certain HTML attributes:

| Attribute pattern | State property | Example |
|---|---|---|
| `data-*` | `dataset.*` (camelCase) | `data-user-id` → `dataset.userId` |
| `aria-*` | camelCase ARIA property | `aria-label` → `ariaLabel` |
| Boolean (`?attr`) | Truthy/falsy evaluation | `?disabled="{{isOff}}"` → present or absent |

## Using `@microsoft/fast-build`

The `@microsoft/fast-build` package is a build-time renderer for declarative templates, powered by a WebAssembly core. It implements the rendering contract described above and is primarily used in testing and development workflows.

:::note
For production server-side rendering, consider the [`@microsoft/webui`](https://github.com/microsoft/webui) project, which provides a full rendering pipeline.
:::

### Installation

```shell
npm install --save @microsoft/fast-build
```

### CLI Usage

The `fast build` command renders an entry HTML file with a JSON state file:

```shell
fast build --entry=index.html --state=state.json --output=output.html --templates="./components/**/*.html"
```

| Option | Default | Description |
|---|---|---|
| `--entry` | `index.html` | Entry HTML template to render |
| `--state` | `state.json` | JSON file containing the initial state |
| `--output` | `output.html` | Where to write the rendered HTML |
| `--templates` | _(none)_ | Glob pattern(s) for `<f-template>` HTML files |
| `--attribute-name-strategy` | `camelCase` | How to map attribute names to properties |
| `--config` | `fast-build.config.json` | Path to a configuration file |

### Example

**`entry.html`:**

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>My App</title></head>
<body>
    <greeting-card title="{{title}}" message="{{message}}"></greeting-card>
    <script type="module" src="./main.ts"></script>
</body>
</html>
```

**`state.json`:**

```json
{
    "title": "Hello FAST",
    "message": "Server-rendered with WebAssembly"
}
```

**`templates.html`:**

```html
<f-template name="greeting-card">
    <template>
        <h2>{{title}}</h2>
        <p>{{message}}</p>
    </template>
</f-template>
```

Run the build:

```shell
fast build \
    --entry=entry.html \
    --state=state.json \
    --output=index.html \
    --templates=templates.html
```

The output (`index.html`) contains the fully resolved HTML with Declarative Shadow DOM and hydration markers.

### Configuration File

Instead of passing every option on the command line, create a `fast-build.config.json`:

```json
{
    "entry": "entry.html",
    "state": "state.json",
    "output": "index.html",
    "templates": "./components/**/*.html"
}
```

The CLI automatically loads `fast-build.config.json` from the current directory when it exists. CLI arguments always take precedence over config file values. File paths in the config are resolved relative to the config file's directory.

### Attribute Name Strategy

The `--attribute-name-strategy` option controls how HTML attribute names on custom elements map to state property names:

| Strategy | Behavior | Example |
|---|---|---|
| `camelCase` (default) | Dashes converted to camelCase | `foo-bar` → `{{fooBar}}` |
| `none` | Dashes preserved | `foo-bar` → `{{foo-bar}}` |

```shell
fast build --attribute-name-strategy=none --templates="./components/**/*.html"
```

:::important
The attribute name strategy must match between the server-side build and the client-side `attributeMap` configuration. If the build uses `--attribute-name-strategy=none`, import `attributeMap` from `@microsoft/fast-element` and configure the client with `attributeMap({ "attribute-name-strategy": "none" })`. Existing declarative imports remain supported.
:::

## Writing Components for SSR

When designing components for server-side rendering, keep these guidelines in mind:

- **Minimize JavaScript-dependent styling.** Prefer CSS-based state (`:host` attributes, CSS custom properties) over `elementInternals` state for initial styles, since the server cannot run JavaScript.
- **Use `@attr` for initial state.** Attributes are visible to the server and can be rendered into the initial HTML. Observable properties set in `connectedCallback` are not available during server rendering.
- **Keep templates self-contained.** Templates should produce meaningful content from attribute values alone without requiring imperative setup.
- **Test both paths.** Verify that components work correctly with both client-side rendering (no pre-rendered content) and server-side rendering (hydration path).

{% endraw %}
