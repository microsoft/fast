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
import { TemplateElement } from "@microsoft/fast-html";
import { MyCustomElement } from "./my-custom-element";

MyCustomElement.define({
    name: "my-custom-element",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
```

This will include the `<f-template>` custom element and all logic for interpreting the declarative HTML syntax for a FAST web component as well as the `shadowOptions` for any element an `<f-template>` has been used to define.

It is necessary to set the initial `shadowOptions` of your custom elements to `null` otherwise a shadowRoot will be attached and cause a FOUC (Flash Of Unstyled Content). For more information about how this affects hydration, check out our [document](./RENDERING.md#setting-shadow-options) on rendering DOM from a non-browser environment.

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

#### Adding shadowOptions

By default `shadowOptions` via the `TemplateElement` will be with `"mode": "open"` once the template has been set. To set each components `shadowOptions` you can pass an `options` object.

Example:

```typescript
TemplateElement.options({
    "my-custom-element": {
        shadowOptions: {
            mode: "closed",
        }
    },
}).define({
    name: "f-template",
});
```

#### Using the RenderableFASTElement

The exported abstract class `RenderableFASTElement` is available for automatic addition and removal of `defer-hydration` and `needs-hydration`. If you use `FASTElement` you will need to add `defer-hydration` and `needs-hydration` attributes to your rendered markup and remove them via your component.

Example:
```typescript
import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class MyCustomElement extends RenderableFASTElement {
    // component logic
}

MyCustomElement.define({
    name: "my-custom-element",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
```

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

In addition you may include an event or attribute or observable, events are denoted with `e` as a reserved letter.

Event:
```html
<button @click="{handleClick(e)}"></button>
```

Attribute/Observable:
```html
<button @click="{handleClick(foo)}"></button>
```

#### Directives

Directives are assumed to be either an attribute directive or a directive that also serves a template. Both are prepended by `f-`. The logic of these directives and what their use cases are is explained in the [FAST html documentation](https://fast.design/docs/getting-started/html-directives).

Attribute directives are part of [client side binding](#syntax) and therefore use the `{}` syntax.

Attribute directives include:
- **slotted**

    Example:
    ```html
    <slot f-slotted="{slottedNodes}"></slot>
    <slot f-slotted="{slottedNodes filter elements}"></slot>
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

    Should you need to refer to the parent element (not the individual item in the list), you can use `../`. This will map to what `html` tag template literal uses, `c.parent`.

    Example:
    ```html
    <ul><f-repeat value="{{item in list}}"><li>{{item}} - {{../title}}</li></f-repeat></ul>
    ```

- **partial & apply**

    These directives are new to the declarative HTML model and allow for the ability to declare a `partial` directive containing a template partial which can then be referenced by an `apply` directive.

    Example:
    ```html
    <f-partial id="test">
        <ul>
            <f-repeat value="{{item in items}}">
                <li>{{item.text}}<f-apply partial="test" value="{{item.items}}"></f-apply></li>
            </f-repeat>
        </ul>
    </f-partial>
    <f-apply partial="test" value="{{items}}"></f-apply>
    ```

#### Unescaped HTML

You can add unescaped HTML using triple braces, this will create an additional `div` element as the HTML needs an element to bind to. Where possible it is advisable to not use unescaped HTML and instead use other binding techniques as well as partials.

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
