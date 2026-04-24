# FAST Element Declarative HTML

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-element.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-element)

The declarative entrypoint in `@microsoft/fast-element` interprets FAST
declarative HTML syntax as a template for a FAST web component.

This document focuses on declarative-runtime implementation details:
template structure, prerendered markup requirements, lifecycle callbacks,
binding configuration, syntax, and integration testing.

For package installation, importing `TemplateElement`, basic registration, and
the package-level hydration overview, see the
[FAST Element README](./README.md#declarative-html) and
[Prerendered Content Optimization](./README.md#prerendered-content-optimization).
For user-facing guides covering f-template syntax, element definition, and
server-side rendering, see the
[Declarative HTML docs](https://fast.design/docs/3.x/declarative-templates/overview/).

## Template Structure

After registering the declarative entrypoint as shown in the README, templates
are associated with an element through
`<f-template name="[custom-element-name]"><template>...</template></f-template>`.
The host custom element should be defined with
`templateOptions: "defer-and-hydrate"`.

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

FAST Element's declarative entrypoint provides lifecycle callbacks that allow
you to hook into various stages of template processing and element hydration.
These callbacks are useful for tracking the rendering lifecycle, gathering
analytics, or coordinating complex initialization sequences.

### Available Callbacks

**Template Lifecycle Callbacks:**
- `elementDidRegister(name: string)` - Called after the JavaScript class definition has been registered
- `templateWillUpdate(name: string)` - Called before the template has been evaluated and assigned
- `templateDidUpdate(name: string)` - Called after the template has been assigned to the definition
- `elementDidDefine(name: string)` - Called after the custom element has been defined

**Hydration Lifecycle Callbacks:**
- `hydrationStarted()` - Called once when the first prerendered element begins hydrating
- `elementWillHydrate(source: HTMLElement)` - Called before an element begins hydration
- `elementDidHydrate(source: HTMLElement)` - Called after an element completes hydration
- `hydrationComplete()` - Called after all prerendered elements have completed hydration

Hydration callbacks are tracked at the element level by `ElementController` — `hydrationComplete` fires only after every prerendered element has finished binding.

### Configuring Callbacks

Configure lifecycle callbacks using `TemplateElement.config()`:

```typescript
import { TemplateElement, type HydrationLifecycleCallbacks } from "@microsoft/fast-element/declarative.js";

// You can configure all callbacks at once
const callbacks: HydrationLifecycleCallbacks = {
    elementDidRegister(name: string) {
        console.log(`Element registered: ${name}`);
    },
    templateWillUpdate(name: string) {
        console.log(`Template updating: ${name}`);
    },
    templateDidUpdate(name: string) {
        console.log(`Template updated: ${name}`);
    },
    elementDidDefine(name: string) {
        console.log(`Element defined: ${name}`);
    },
    elementWillHydrate(source: HTMLElement) {
        console.log(`Element will hydrate: ${source.localName}`);
    },
    elementDidHydrate(source: HTMLElement) {
        console.log(`Element hydrated: ${source.localName}`);
    },
    hydrationComplete() {
        console.log('All elements hydrated');
    }
};

TemplateElement.config(callbacks);

// Or configure only the callbacks you need
TemplateElement.config({
    elementDidHydrate(source: HTMLElement) {
        console.log(`${source.localName} is ready`);
    },
    hydrationComplete() {
        console.log('Page is interactive');
    }
});
```

### Lifecycle Order

The lifecycle callbacks occur in the following general sequence:

1. **Registration Phase**: `elementDidRegister` is called when the element class is registered
2. **Template Phase**: `templateWillUpdate` → (template processing) → `templateDidUpdate` → `elementDidDefine`
3. **Hydration Phase**: `hydrationStarted` → `elementWillHydrate` → (hydration) → `elementDidHydrate`
4. **Completion**: `hydrationComplete` is called after all prerendered elements finish hydrating

**Note:** Template processing is asynchronous and happens independently for each element. The template and hydration phases can be interleaved when multiple elements are being processed simultaneously.

### Use Cases

**Performance Monitoring:**
```typescript
TemplateElement.config({
    elementWillHydrate(source: HTMLElement) {
        performance.mark(`${source.localName}-hydration-start`);
    },
    elementDidHydrate(source: HTMLElement) {
        performance.mark(`${source.localName}-hydration-end`);
        performance.measure(
            `${source.localName}-hydration`,
            `${source.localName}-hydration-start`,
            `${source.localName}-hydration-end`
        );
    },
    hydrationComplete() {
        const entries = performance.getEntriesByType('measure');
        console.log('Hydration metrics:', entries);
    }
});
```

**Loading State Management:**
```typescript
TemplateElement.config({
    hydrationStarted() {
        document.body.classList.add('hydrating');
    },
    hydrationComplete() {
        document.body.classList.remove('hydrating');
        document.body.classList.add('hydrated');
    }
});
```

**Debugging and Development:**
```typescript
if (process.env.NODE_ENV === 'development') {
    const events: Array<{callback: string; name?: string; timestamp: number}> = [];
    
    TemplateElement.config({
        elementDidRegister(name) {
            events.push({ callback: 'elementDidRegister', name, timestamp: Date.now() });
        },
        templateWillUpdate(name) {
            events.push({ callback: 'templateWillUpdate', name, timestamp: Date.now() });
        },
        templateDidUpdate(name) {
            events.push({ callback: 'templateDidUpdate', name, timestamp: Date.now() });
        },
        elementDidDefine(name) {
            events.push({ callback: 'elementDidDefine', name, timestamp: Date.now() });
        },
        elementWillHydrate(source) {
            events.push({ callback: 'elementWillHydrate', name: source.localName, timestamp: Date.now() });
        },
        elementDidHydrate(source) {
            events.push({ callback: 'elementDidHydrate', name: source.localName, timestamp: Date.now() });
        },
        hydrationComplete() {
            events.push({ callback: 'hydrationComplete', timestamp: Date.now() });
            console.table(events);
        }
    });
}
```

## `observerMap`

When `observerMap: "all"` (or `observerMap: {}`) is configured for an element,
`@microsoft/fast-element/declarative.js` automatically sets up deep reactive
observation for all root properties discovered in the template. Both `"all"`
and `{}` are equivalent.

For finer control, pass a configuration object with a `properties` key that maps root property names to a recursive path tree:

```typescript
TemplateElement.options({
    "user-profile": {
        observerMap: {
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
        },
    },
}).define({ name: "f-template" });
```

Each path entry can be:
- **`true`** — observe this path and all descendants.
- **`false`** — skip this path and all descendants.
- **An object** with an optional `$observe` boolean and child property overrides.

Use `$observe: false` on a node to skip it by default, then re-include specific children:

```typescript
observerMap: {
    properties: {
        analytics: {
            charts: {
                $observe: false,       // charts NOT observed by default
                activeChart: true,     // ...except activeChart IS observed
            },
        },
    },
}
```

When `properties` is omitted, all root properties are observed (backward compatible). When `properties` is present but empty (`{ properties: {} }`), no root properties are observed.

## `attributeMap`

When `attributeMap: "all"` (or `attributeMap: {}`) is configured for an
element, `@microsoft/fast-element/declarative.js` automatically creates
reactive `@attr` properties for every **leaf binding** in the template —
simple expressions like `{{foo}}` or `id="{{foo-bar}}"` that have no nested
properties. Both `"all"` and `{}` are equivalent and use the default `"none"`
attribute name strategy.

By default, the **attribute name** and **property name** are both the binding key exactly as written in the template — no normalization is applied. Because HTML attributes are case-insensitive, binding keys should use lowercase names (optionally dash-separated). Properties with dashes must be accessed via bracket notation (e.g. `element["foo-bar"]`).

Properties already decorated with `@attr` or `@observable` on the class are left untouched.

```typescript
TemplateElement.options({
    "my-element": {
        attributeMap: "all",
    },
}).define({ name: "f-template" });
```

With the template:

```html
<f-template name="my-element">
    <template>
        <p>{{greeting}}</p>
        <p>{{first-name}}</p>
    </template>
</f-template>
```

This registers `greeting` (attribute `greeting`, property `greeting`) and `first-name` (attribute `first-name`, property `first-name`) as `@attr` properties on the element prototype, enabling `setAttribute("first-name", "Jane")` to trigger a template re-render automatically.

### `attribute-name-strategy`

The `attribute-name-strategy` configuration option controls how template binding keys map to HTML attribute names. This matches the build-time `--attribute-name-strategy` option in `@microsoft/fast-build`.

| Strategy | Behaviour | Example |
|---|---|---|
| `"none"` (default) | Binding key used as-is for both property and attribute | `{{foo-bar}}` → property `foo-bar`, attribute `foo-bar` |
| `"camelCase"` | Binding key is the camelCase property; attribute name derived as kebab-case | `{{fooBar}}` → property `fooBar`, attribute `foo-bar` |

```typescript
TemplateElement.options({
    "my-element": {
        attributeMap: {
            "attribute-name-strategy": "camelCase",
        },
    },
}).define({ name: "f-template" });
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

This registers `greeting` (attribute `greeting`, property `greeting`) and `firstName` (attribute `first-name`, property `firstName`) as `@attr` properties. `setAttribute("first-name", "Jane")` triggers a re-render, and the property is accessible as `element.firstName`.

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
