# FAST HTML

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-html.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-html)

The `@microsoft/fast-html` package contains a method to interpret FAST declarative HTML syntax as a template for a FAST web component.

## Installation

### From NPM

To install the latest `fast-html` library using `npm`:

```shell
npm install --save @microsoft/fast-html
```

## Declarative HTML

### Usage

In your JS bundle you will need to include the `@microsoft/fast-html` package:

```typescript
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { MyCustomElement } from "./my-custom-element";

RenderableFASTElement(MyCustomElement).defineAsync({
    name: "my-custom-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
```

This will include the `<f-template>` custom element and all logic for interpreting the declarative HTML syntax for a FAST web component.

The template must be wrapped in `<f-template name="[custom-element-name]"><template>[template logic]</template></f-template>` with a `name` attribute for the custom elements name, and the template logic inside.

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

#### Non-browser HTML rendering

One of the benefits of FAST declarative HTML templates is that the server can be stack agnostic as JavaScript does not need to be interpreted. By default `@microsoft/fast-html` will expect hydratable content and uses comments and datasets for tracking the binding logic. For more information on what that markup should look like, as well as an example of how initial state may be applied, read our [documentation](./RENDERING.md) to understand what markup should be generated for a hydratable experience. For the sake of brevity hydratable markup will be excluded from the README.

#### Using the RenderableFASTElement

The use of `RenderableFASTElement` as a mixin for your custom element will automatically remove the `defer-hydration` attribute signalling for hydration to begin, and if you need to add state before hydration should occur you can make use of the `prepare` method.

Example:
```typescript
class MyCustomElement extends FASTElement {
    private prepare(): Promise<void> {
        // Get initial state
    }
}

RenderableFASTElement(MyCustomElement).defineAsync({
    name: "my-custom-element",
    templateOptions: "defer-and-hydrate",
});
```

#### Lifecycle Callbacks

FAST HTML provides lifecycle callbacks that allow you to hook into various stages of template processing and element hydration. These callbacks are useful for tracking the rendering lifecycle, gathering analytics, or coordinating complex initialization sequences.

##### Available Callbacks

**Template Lifecycle Callbacks:**
- `elementDidRegister(name: string)` - Called after the JavaScript class definition has been registered
- `templateWillUpdate(name: string)` - Called before the template has been evaluated and assigned
- `templateDidUpdate(name: string)` - Called after the template has been assigned to the definition
- `elementDidDefine(name: string)` - Called after the custom element has been defined

**Hydration Lifecycle Callbacks:**
- `elementWillHydrate(name: string)` - Called before an element begins hydration
- `elementDidHydrate(name: string)` - Called after an element completes hydration
- `hydrationComplete()` - Called after all elements have completed hydration

##### Configuring Callbacks

Configure lifecycle callbacks using `TemplateElement.config()`:

```typescript
import { TemplateElement, type HydrationLifecycleCallbacks } from "@microsoft/fast-html";

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
    elementWillHydrate(name: string) {
        console.log(`Element will hydrate: ${name}`);
    },
    elementDidHydrate(name: string) {
        console.log(`Element hydrated: ${name}`);
    },
    hydrationComplete() {
        console.log('All elements hydrated');
    }
};

TemplateElement.config(callbacks);

// Or configure only the callbacks you need
TemplateElement.config({
    elementDidHydrate(name: string) {
        console.log(`${name} is ready`);
    },
    hydrationComplete() {
        console.log('Page is interactive');
    }
});
```

##### Lifecycle Order

The lifecycle callbacks occur in the following general sequence:

1. **Registration Phase**: `elementDidRegister` is called when the element class is registered
2. **Template Phase**: `templateWillUpdate` → (template processing) → `templateDidUpdate` → `elementDidDefine`
3. **Hydration Phase**: `elementWillHydrate` → (hydration) → `elementDidHydrate`
4. **Completion**: `hydrationComplete` is called after all elements finish hydrating

**Note:** Template processing is asynchronous and happens independently for each element. The template and hydration phases can be interleaved when multiple elements are being processed simultaneously.

##### Use Cases

**Performance Monitoring:**
```typescript
TemplateElement.config({
    elementWillHydrate(name: string) {
        performance.mark(`${name}-hydration-start`);
    },
    elementDidHydrate(name: string) {
        performance.mark(`${name}-hydration-end`);
        performance.measure(
            `${name}-hydration`,
            `${name}-hydration-start`,
            `${name}-hydration-end`
        );
    },
    hydrationComplete() {
        // Report to analytics
        const entries = performance.getEntriesByType('measure');
        console.log('Hydration metrics:', entries);
    }
});
```

**Loading State Management:**
```typescript
TemplateElement.config({
    elementWillHydrate(name: string) {
        // Show loading indicator
        document.body.classList.add('hydrating');
    },
    hydrationComplete() {
        // Hide loading indicator once all elements are ready
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
        elementWillHydrate(name) {
            events.push({ callback: 'elementWillHydrate', name, timestamp: Date.now() });
        },
        elementDidHydrate(name) {
            events.push({ callback: 'elementDidHydrate', name, timestamp: Date.now() });
        },
        hydrationComplete() {
            events.push({ callback: 'hydrationComplete', timestamp: Date.now() });
            console.table(events);
        }
    });
}
```

#### `observerMap`

When `observerMap: "all"` (or `observerMap: {}`) is configured for an element, `@microsoft/fast-html` automatically sets up deep reactive observation for all root properties discovered in the template. Both `"all"` and `{}` are equivalent.

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

#### `attributeMap`

When `attributeMap: "all"` (or `attributeMap: {}`) is configured for an element, `@microsoft/fast-html` automatically creates reactive `@attr` properties for every **leaf binding** in the template — simple expressions like `{{foo}}` or `id="{{fooBar}}"` that have no nested properties. Both `"all"` and `{}` are equivalent and use the default `"camelCase"` attribute name strategy.

By default, the binding key is treated as a **camelCase property name** and the HTML attribute name is derived by converting it to kebab-case (e.g. `{{fooBar}}` → property `fooBar`, attribute `foo-bar`). This matches the build-time `--attribute-name-strategy` option in `@microsoft/fast-build`.

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
        <p>{{firstName}}</p>
    </template>
</f-template>
```

This registers `greeting` (attribute `greeting`, property `greeting`) and `firstName` (attribute `first-name`, property `firstName`) as `@attr` properties on the element prototype, enabling `setAttribute("first-name", "Jane")` to trigger a template re-render automatically, and the property is accessible as `element.firstName`.

##### `attribute-name-strategy`

The `attribute-name-strategy` configuration option controls how template binding keys map to HTML attribute names. This matches the build-time `--attribute-name-strategy` option in `@microsoft/fast-build`.

| Strategy | Behaviour | Example |
|---|---|---|
| `"camelCase"` (default) | Binding key is the camelCase property; attribute name derived as kebab-case | `{{fooBar}}` → property `fooBar`, attribute `foo-bar` |
| `"none"` | Binding key used as-is for both property and attribute | `{{foo-bar}}` → property `foo-bar`, attribute `foo-bar` |

```typescript
TemplateElement.options({
    "my-element": {
        attributeMap: {
            "attribute-name-strategy": "none",
        },
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

This registers `greeting` (attribute `greeting`, property `greeting`) and `first-name` (attribute `first-name`, property `first-name`) as `@attr` properties. `setAttribute("first-name", "Jane")` triggers a re-render, and the property must be accessed via bracket notation as `element["first-name"]`.

### Syntax

All bindings use a handlebars-like syntax.

Some bindings are only relevant to the browser, such as for click handlers or other pieces of dynamic interaction. As such, their bindings use single curly braces `{}`, this is to prevent an intial SSR (Server Side Rendering) or other build time rendering technologies from needing to interpret them.

If a binding is relevant to both client and the back end rendering engine, it will use `{{}}` or `{{{}}}` depending on what type of data injection is being done.

Browser-only bindings:
- Event bindings
- Attribute directives

#### Content binding

```html
{{text}}
```

#### Event binding

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

**Arbitrary binding expressions** — any token that is not `$e`, `$c`, or `e` is resolved as a binding path on the data source:
```html
<button @click="{handleClick(user.id)}"></button>
```

> **Deprecated:** The bare `e` token still works but will emit a console warning once per component. The warning includes the component name to help locate usage. Migrate to `$e`.
> ```html
> <button @click="{handleClick(e)}"></button>
> ```

#### Directives

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

#### Execution Context Access

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

#### Unescaped HTML

You can add unescaped HTML using triple braces, this will create an additional `div` element as the HTML needs an element to bind to. Where possible it is advisable to not use unescaped HTML and instead use other binding techniques.

Example:
```html
{{{html}}}
```

### Writing Components

When writing components with the intention of using the declarative HTML syntax, it is imperative that components are written with styling and rendering of the component to be less reliant on any JavaScript state management. An example of this is relying on `elementInterals` state to style a component.

### Converting Components

FAST Components written using the `html` tag template literal can be partially converted via the supplied `.yml` rules made for use with [ast-grep](https://ast-grep.github.io/).

Example:

```ts
// before
export const template = html`
    <slot ${slotted("slottedNodes")}></slot>
`;
// after
export const template = `
    <slot f-slotted="{slottedNodes}"></slot>
`;
```

Which creates a starting point for converting the tag template literals to the declarative HTML syntax.

If your template includes JavaScript specific logic that does not conform to those rules, the fix may not be applied or may apply incorrectly. It is therefore suggested that complex logic instead leverages the custom elements JavaScript class.

#### Available Rules

- `@microsoft/fast-html/rules/attribute-directive.yml`
- `@microsoft/fast-html/rules/call-expression-with-event-argument.yml`
- `@microsoft/fast-html/rules/member-expression.yml`
- `@microsoft/fast-html/rules/tag-function-to-template-literal.yml`

## Acknowledgements

This project has been heavily inspired by [Handlebars](https://handlebarsjs.com/) and [Vue.js](https://vuejs.org/).

## WebUI Integration Testing

The fixture tests in `test/fixtures/` are also validated against [`@microsoft/webui`](https://github.com/microsoft/webui) to ensure cross-renderer compatibility. The build step renders each fixture's templates with `webui build --plugin=fast`, then the existing Playwright specs run against the webui-rendered output.

```shell
# Build fixtures with webui and run Playwright tests
npm run test:webui-integration -w @microsoft/fast-html

# Or run the steps separately
npm run build:fixtures:webui -w @microsoft/fast-html
npm exec -w @microsoft/fast-html -- playwright test --config=playwright.webui.config.ts
```

This is also run automatically in CI via the `ci-webui-integration.yml` GitHub Action on pull requests and pushes to `main`.

Some tests are conditionally skipped during webui integration runs due to known rendering differences between `fast-build` and `webui`. The `playwright.webui.config.ts` sets `FAST_WEBUI_INTEGRATION=true`, and affected tests use `test.skip()` with a descriptive reason. See the WebUI Integration Tests section in [DESIGN.md](./DESIGN.md) for the full list.
