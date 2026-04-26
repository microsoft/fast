# FAST Element Declarative HTML

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-element.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-element)

The declarative entrypoint in `@microsoft/fast-element` interprets FAST
declarative HTML syntax as a template for a FAST web component.

This document focuses on declarative-runtime implementation details:
template structure, prerendered markup requirements, lifecycle callbacks,
binding configuration, syntax, and integration testing.

For package installation, using `declarativeTemplate()`, extension setup, and
the package-level hydration overview, see the
[FAST Element README](./README.md#declarative-html) and
[Prerendered Content Optimization](./README.md#prerendered-content-optimization).
For user-facing guides covering f-template syntax, element definition, and
server-side rendering, see the
[Declarative HTML docs](https://fast.design/docs/3.x/declarative-templates/overview/).

## Template Structure

After importing the declarative APIs as shown in the README, templates are
associated with an element through
`<f-template name="[custom-element-name]"><template>...</template></f-template>`.
The host custom element should be defined with
`template: declarativeTemplate()`. This automatically defines `<f-template>` in
the relevant registry and waits for the matching declarative template when it is
already present or inserted later.

The `@microsoft/fast-element/declarative.js` entrypoint itself remains
side-effect free at import time. Declarative APIs lazily install declarative
debug messages when they create templates. Hydratable `ViewTemplate` support is
installed only when `enableHydration()` is called from
`@microsoft/fast-element/hydration.js`.

`observerMap()` and `attributeMap()` remain available from the declarative
entrypoint for existing declarative imports. New code should prefer the
extension subpaths, `@microsoft/fast-element/extensions/observer-map.js` and
`@microsoft/fast-element/extensions/attribute-map.js`, especially when using
the maps without declarative templates.

Example:
```html
<my-custom-element greeting="Hello world">
    <template shadowrootmode="open">
        Hello world
    </template>
</my-custom-element>
<f-template name="my-custom-element">
    <template>{{greeting}}</template>
</f-template>
```

The legacy `defer-hydration` and `needs-hydration` attributes are no longer
required.

## Non-browser HTML Rendering

One of the benefits of FAST declarative HTML templates is that the server can
be stack agnostic because JavaScript does not need to be interpreted to emit
the initial HTML. The declarative runtime expects hydratable comment markers
and datasets when prerendered content is generated. For the required marker
format and initial-state application details, see
[DECLARATIVE_RENDERING.md](./DECLARATIVE_RENDERING.md).

## Lifecycle Callbacks

FAST Element's declarative APIs provide lifecycle callbacks that allow you to
hook into template processing and hydration. The callbacks are split by scope:

| Scope | API | Callbacks |
|---|---|---|
| Per element | `declarativeTemplate(callbacks)` | `elementDidRegister`, `templateWillUpdate`, `templateDidUpdate`, `elementDidDefine`, `elementWillHydrate`, `elementDidHydrate` |
| Global hydration | `enableHydration(options)` | `hydrationStarted`, `hydrationComplete` |

Hydration is opt-in. Call `enableHydration()` before FAST elements connect when
you want prerendered Declarative Shadow DOM to be reused:

```typescript
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration({
    hydrationStarted() {
        console.log("Hydration started");
    },
    hydrationComplete() {
        console.log("All elements hydrated");
    },
});
```

Pass per-element lifecycle callbacks directly to `declarativeTemplate()`:

```typescript
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

MyComponent.define({
    name: "my-component",
    template: declarativeTemplate({
        elementDidRegister(name) {
            console.log(`Element registered: ${name}`);
        },
        templateWillUpdate(name) {
            console.log(`Template updating: ${name}`);
        },
        templateDidUpdate(name) {
            console.log(`Template updated: ${name}`);
        },
        elementDidDefine(name) {
            console.log(`Element defined: ${name}`);
        },
        elementWillHydrate(source) {
            console.log(`Element will hydrate: ${source.localName}`);
        },
        elementDidHydrate(source) {
            console.log(`Element hydrated: ${source.localName}`);
        },
    }),
});
```

The lifecycle callbacks occur in this general sequence:

1. `elementDidRegister(name)`
2. `templateWillUpdate(name)` → template processing → `templateDidUpdate(name)`
3. `elementDidDefine(name)`
4. If `enableHydration()` was called and the element has prerendered content:
   `hydrationStarted()` → `elementWillHydrate(source)` → hydration →
   `elementDidHydrate(source)` → `hydrationComplete()`

Template processing is asynchronous and happens independently for each element,
so callbacks for different elements may interleave.

## `observerMap`

When the `observerMap()` extension is applied to an element definition,
it automatically sets up deep reactive observation for root properties
discovered in the template. Declarative templates assign `definition.schema`
during template resolution, so `observerMap()` has schema data automatically.
For non-declarative/manual schemas, import from the extension subpath and pass
`observerMap({ schema })`.

```typescript
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";
```

For finer control, pass a configuration object with a `properties` key that maps root property names to a recursive path tree:

```typescript
UserProfile.define(
    {
        name: "user-profile",
        template: declarativeTemplate(),
    },
    [
        observerMap({
            properties: {
                user: {
                    name: true,          // user.name — observed
                    details: {
                        age: true,       // user.details.age — observed
                        history: false,  // user.details.history — NOT observed
                    },
                },
                // root properties not listed here are skipped
            },
        }),
    ],
);
```

Each path entry can be:
- **`true`** — observe this path and all descendants.
- **`false`** — skip this path and all descendants.
- **An object** with an optional `$observe` boolean and child property overrides.

Use `$observe: false` on a node to skip it by default, then re-include specific children:

```typescript
observerMap({
    properties: {
        analytics: {
            charts: {
                $observe: false,       // charts NOT observed by default
                activeChart: true,     // ...except activeChart IS observed
            },
        },
    },
});
```

When `properties` is omitted, all root properties are observed. When
`properties` is present but empty (`{ properties: {} }`), no root properties
are observed.

Manual schema example:

```typescript
import { FASTElement, Schema } from "@microsoft/fast-element";
import { observerMap } from "@microsoft/fast-element/extensions/observer-map.js";

class MyElement extends FASTElement {}

const schema = new Schema("my-element");
schema.addPath({
    rootPropertyName: "user",
    pathConfig: {
        type: "default",
        parentContext: null,
        currentContext: null,
        path: "user.name",
    },
    childrenMap: null,
});

MyElement.define({ name: "my-element" }, [observerMap({ schema })]);
```

## `attributeMap`

When the `attributeMap()` extension is applied to an element definition,
it automatically creates reactive `@attr` properties for every **leaf binding**
in the template — simple expressions like `{{foo}}` or `id="{{fooBar}}"` that
have no nested properties. Declarative templates provide the schema
automatically. For non-declarative/manual schemas, place the optional `schema`
on the FAST element definition and import `attributeMap()` from its extension
subpath.

```typescript
import { attributeMap } from "@microsoft/fast-element/extensions/attribute-map.js";
```

By default, the binding key is treated as a camelCase property name and the HTML
attribute name is derived by converting it to kebab-case. Properties already
decorated with `@attr` or `@observable` on the class are left untouched.

```typescript
MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap()],
);
```

With the template:

```html
<f-template name="my-element">
    <template>
        <p>{{greeting}}</p>
        <p>{{firstName}}</p>
    </template>
</f-template>
```

This registers `greeting` (attribute `greeting`, property `greeting`) and
`firstName` (attribute `first-name`, property `firstName`) as `@attr`
properties on the element prototype, enabling `setAttribute("first-name",
"Jane")` to trigger a template re-render automatically.

### `attribute-name-strategy`

The `attribute-name-strategy` configuration option controls how template binding
keys map to HTML attribute names. This matches the build-time
`--attribute-name-strategy` option in `@microsoft/fast-build`.

| Strategy | Behaviour | Example |
|---|---|---|
| `"camelCase"` (default) | Binding key is the camelCase property; attribute name is derived as kebab-case | `{{fooBar}}` → property `fooBar`, attribute `foo-bar` |
| `"none"` | Binding key used as-is for both property and attribute | `{{foo-bar}}` → property `foo-bar`, attribute `foo-bar` |

```typescript
MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [
        attributeMap({
            "attribute-name-strategy": "none",
        }),
    ],
);
```

When using the `"none"` strategy, property names may contain dashes and must be
accessed via bracket notation (e.g. `element["foo-bar"]`).

## Syntax

All bindings use a handlebars-like syntax.

Some bindings are only relevant to the browser, such as for click handlers or other pieces of dynamic interaction. As such, their bindings use single curly braces `{}`, this is to prevent an intial SSR (Server Side Rendering) or other build time rendering technologies from needing to interpret them.

If a binding is relevant to both client and the back end rendering engine, it will use `{{}}` or `{{{}}}` depending on what type of data injection is being done.

Browser-only bindings:
- Event bindings
- Attribute directives

### Content binding

```html
{{text}}
```

### Event binding

Event bindings must include the `()` as well as being preceeded by `@` in keeping with `@microsoft/fast-element` tagged template `html` syntax.

```html
<button @click="{handleClick()}"></button>
```

You can pass the DOM event object, the execution context, or both as arguments. Any other argument is treated as a binding expression and resolved against the current data source.

**`$e` — DOM event object (preferred):**
```html
<button @click="{handleClick($e)}"></button>
```

**`$c` — execution context:**
```html
<button @click="{handleClick($c)}"></button>
```

**`$c.somePath` — a property of the execution context (e.g. `$c.parent`, `$c.event`):**
```html
<button @click="{handleClick($c.parent)}"></button>
```

**Multiple arguments:**
```html
<button @click="{handleClick($e, $c)}"></button>
```

**Arbitrary binding expressions** — any token that is not `$e` or `$c` is resolved as a binding path on the data source:
```html
<button @click="{handleClick(user.id)}"></button>
```

Use `$e` for the DOM event object.

### Directives

Directives are assumed to be either an attribute directive or a directive that also serves a template. Both are prepended by `f-`. The logic of these directives and what their use cases are is explained in the [FAST html documentation](https://fast.design/docs/getting-started/html-directives).

Attribute directives are part of [client side binding](#syntax) and therefore use the `{}` syntax.

Attribute directives include:
- **slotted**

    Example:
    ```html
    <slot f-slotted="{slottedNodes}"></slot>
    <slot f-slotted="{slottedNodes filter elements()}"></slot>
    <slot f-slotted="{slottedNodes filter elements(div, p)}"></slot>
    ```

- **children**

    Example:
    ```html
    <ul f-children="{listItems}"><f-repeat value="{{item in list}}"><li>{{item}}</li></f-repeat></ul>
    ```

- **ref**

    Example:
    ```html
    <video f-ref="{video}"></video>
    ```

Template directives include:
- **when**

    Example:
    ```html
    <f-when value="{{show}}">Hello world</f-when>
    <f-when value="{{!show}}">Goodbye world</f-when>
    ```

The following operators can also be used:
- `==`
- `!=`
- `>=`
- `>`
- `<=`
- `<`
- `||`
- `&&`

Where the right operand can be either a reference to a value (string e.g. `{{foo == 'bar'}}`, boolean e.g. `{{foo == true}}`, number e.g. `{{foo == 3}}`) or another binding value.

- **repeat**

    Example:
    ```html
    <ul><f-repeat value="{{item in list}}"><li>{{item}}</li></f-repeat></ul>
    ```

    Bindings inside `<f-repeat>` without a context prefix resolve to the custom element. For example, `{{title}}` below resolves to the host element's `title` property:

    ```html
    <ul><f-repeat value="{{item in list}}"><li>{{item}} - {{title}}</li></f-repeat></ul>
    ```

### Execution Context Access

In imperative fast-element templates, every binding expression receives both the data source and the execution context: `${(x, c) => c.parent.handleClick(c.event)}`. Declarative `<f-template>` expressions can access the same execution context using the `$c` prefix.

This is particularly useful inside `<f-repeat>`, where `$c.parent` refers to the parent view-model (typically the host element) and `$c.event` provides the DOM event.

Event handler with context access:

```html
<f-repeat value="{{item in items}}">
    <button @click="{$c.parent.handleItemClick($c.event)}">{{item.name}}</button>
</f-repeat>
```

Conditional rendering using a host property inside a repeat:

```html
<f-repeat value="{{item in items}}">
    <f-when value="{{$c.parent.showNames}}">
        <span>{{item.name}}</span>
    </f-when>
</f-repeat>
```

### Unescaped HTML

You can add unescaped HTML using triple braces, this will create an additional `div` element as the HTML needs an element to bind to. Where possible it is advisable to not use unescaped HTML and instead use other binding techniques.

Example:
```html
{{{html}}}
```

## Writing Components

When writing components with the intention of using the declarative HTML syntax, it is imperative that components are written with styling and rendering of the component to be less reliant on any JavaScript state management. An example of this is relying on `elementInterals` state to style a component.

## WebUI Integration Testing

The fixture tests in `test/declarative/fixtures/` are also validated against
[`@microsoft/webui`](https://github.com/microsoft/webui) to ensure
cross-renderer compatibility. The build step renders each fixture's templates
with `webui build --plugin=fast`, then the existing Playwright specs run
against the webui-rendered output.

```shell
# Build fixtures with webui and run Playwright tests
npm run test:webui-integration -w @microsoft/fast-element

# Or run the steps separately
npm run build:fixtures:webui -w @microsoft/fast-element
npm exec -w @microsoft/fast-element -- playwright test --config=playwright.declarative.webui.config.ts
```

This is also run automatically in CI via the `ci-webui-integration.yml` GitHub Action on pull requests and pushes to `main`.

Some tests are conditionally skipped during webui integration runs due to known
rendering differences between `fast-build` and `webui`. The
`playwright.declarative.webui.config.ts` file sets
`FAST_WEBUI_INTEGRATION=true`, and affected tests use `test.skip()` with a
descriptive reason. See the WebUI Integration Tests section in
[DECLARATIVE_DESIGN.md](./DECLARATIVE_DESIGN.md) for the full list.
