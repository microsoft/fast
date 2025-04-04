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

### Syntax

All bindings use a handlebars syntax.

#### Content binding

```html
{{text}}
```

#### Event binding

Event bindings must include the `()` as well as being preceeded by `@` in keeping with `@microsoft/fast-element` tagged template `html` syntax.

```html
<button @click="{{handleClick()}}"></button>
```

#### Directives

Directives are assumed to be either an attribute directive or a directive that also serves a template. Both are prepended by `f-`. The logic of these directives and what their use cases are is explained in the [FAST html documentation](https://fast.design/docs/getting-started/html-directives).

Attribute directives include:
- **slotted**

    Example:
    ```html
    <slot f-slotted="{{slottedNodes}}"></slot>
    ```

- **children**

    Example:
    ```html
    <ul f-children="{{listItems}}"><f-repeat value="{{item in list}}"><li>{{item}}</li></f-repeat></ul>
    ```

- **ref**

    Example:
    ```html
    <video f-ref="{{video}}"></video>
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

### Writing Components

When writing components with the intention of using the declarative HTML syntax, it is imperative that components are written with styling and rendering of the component to be less reliant on any JavaScript state management. An example of this is relying on `elementInterals` state to style a component.

## Acknowledgements

This project has been heavily inspired by [Handlebars](https://handlebarsjs.com/) and [Vue.js](https://vuejs.org/).