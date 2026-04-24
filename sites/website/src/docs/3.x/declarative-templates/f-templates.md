---
id: declarative-f-templates
title: Writing f-templates
layout: 3x
eleventyNavigation:
  key: declarative-f-templates3x
  parent: declarative-templates3x
  title: Writing f-templates
navigationOptions:
  activeKey: declarative-f-templates3x
description: Learn the declarative template syntax for bindings, directives, events, and expressions.
keywords:
  - f-template
  - bindings
  - directives
  - declarative
  - repeat
  - when
---

{% raw %}

# Writing f-templates

An `<f-template>` element associates a declarative HTML template with a custom element by name. The inner `<template>` contains the markup that becomes the element's shadow DOM.

```html
<f-template name="my-element">
    <template>
        <!-- template content here -->
    </template>
</f-template>
```

The `name` attribute must match the custom element tag name registered in JavaScript. A single HTML file can contain multiple `<f-template>` elements for different components.

## Binding Syntax

Declarative templates use a handlebars-like syntax for data binding. There are two categories of bindings based on when they are evaluated:

| Syntax | Evaluated | Purpose |
|---|---|---|
| `{{expression}}` | Server and client | Content and attribute bindings (HTML-escaped) |
| `{{{expression}}}` | Server and client | Unescaped HTML content binding |
| `{expression}` | Client only | Event handlers and attribute directives |

Server-evaluated bindings (`{{}}` and `{{{}}}`) are resolved during server-side rendering and hydrated on the client. Client-only bindings (`{}`) are ignored by the server and activated when the component connects in the browser.

## Content Bindings

Use double curly braces to bind text content:

```html
<f-template name="greeting-card">
    <template>
        <h3>{{greeting}}</h3>
        <p>Welcome, {{name}}!</p>
    </template>
</f-template>
```

Content bindings are HTML-escaped for security. To render raw HTML, use triple curly braces:

```html
<f-template name="rich-content">
    <template>
        {{{htmlContent}}}
    </template>
</f-template>
```

:::warning
Triple-brace bindings insert unescaped HTML directly into the DOM. Only use them with trusted content to avoid cross-site scripting (XSS) vulnerabilities. An additional wrapping `div` element is created to host the binding.
:::

## Attribute Bindings

Bind element attributes using double curly braces inside attribute values:

```html
<f-template name="styled-input">
    <template>
        <input type="{{inputType}}" class="{{cssClass}}">
    </template>
</f-template>
```

### Boolean Attributes

Prefix the attribute name with `?` for boolean attribute bindings. When the value is truthy, the attribute is present; when falsy, it is removed:

```html
<f-template name="toggle-button">
    <template>
        <button ?disabled="{{isDisabled}}">Click me</button>
    </template>
</f-template>
```

Boolean bindings also support expressions with comparison operators:

```html
<button ?disabled="{{status == 'locked'}}">Submit</button>
```

## Event Bindings

Event bindings use the `@` prefix and single curly braces (client-only). The handler name must include parentheses `()`:

```html
<f-template name="click-counter">
    <template>
        <button @click="{handleClick()}">Count: {{count}}</button>
    </template>
</f-template>
```

### Event Arguments

You can pass special arguments to event handlers:

| Argument | Description |
|---|---|
| `$e` | The DOM event object |
| `$c` | The execution context |
| `$c.parent` | The parent execution context (useful inside `<f-repeat>`) |
| `$c.event` | The DOM event from the execution context |
| Any other token | Resolved as a binding path on the data source |

**Examples:**

```html
<!-- Pass the DOM event -->
<button @click="{handleClick($e)}">Click</button>

<!-- Pass the execution context -->
<button @click="{handleClick($c)}">Click</button>

<!-- Pass multiple arguments -->
<button @click="{handleClick($e, $c)}">Click</button>

<!-- Pass a data binding as an argument -->
<button @click="{handleClick(user.id)}">Click</button>
```

:::note
Event bindings use single curly braces `{...}` because they are client-only — the server does not need to evaluate them.
:::

## Dot-Notation Paths

Binding expressions support dot-notation for accessing nested properties:

```html
<f-template name="user-card">
    <template>
        <p>{{user.name}}</p>
        <p>{{user.address.city}}, {{user.address.state}}</p>
    </template>
</f-template>
```

## Directives

Directives extend template behavior with conditional rendering, list iteration, element references, and more. Directives that serve as containers use the `<f-*>` element syntax. Directives that attach to an existing element use the `f-*` attribute syntax.

### Conditional Rendering (`f-when`)

The `<f-when>` directive renders its content only when the condition is truthy:

```html
<f-template name="user-status">
    <template>
        <f-when value="{{isLoggedIn}}">
            <p>Welcome back, {{username}}!</p>
        </f-when>
        <f-when value="{{!isLoggedIn}}">
            <p>Please log in.</p>
        </f-when>
    </template>
</f-template>
```

Conditions support these comparison operators:

| Operator | Description |
|---|---|
| `==` | Equal |
| `!=` | Not equal |
| `>` | Greater than |
| `>=` | Greater than or equal |
| `<` | Less than |
| `<=` | Less than or equal |
| `\|\|` | Logical OR |
| `&&` | Logical AND |

The right operand can be a string (`'bar'`), boolean (`true`/`false`), number (`3`), or another binding path:

```html
<f-when value="{{status == 'active'}}">Active</f-when>
<f-when value="{{count > 0}}">Has items</f-when>
<f-when value="{{role == adminRole}}">Admin panel</f-when>
```

### List Iteration (`f-repeat`)

The `<f-repeat>` directive iterates over an array and renders its content for each item:

```html
<f-template name="todo-list">
    <template>
        <ul>
            <f-repeat value="{{item in items}}">
                <li>{{item.text}}</li>
            </f-repeat>
        </ul>
    </template>
</f-template>
```

Inside `<f-repeat>`, bindings without a context prefix resolve to the host element, not the repeat item. Use the declared variable name (e.g. `item`) to access the current iteration value:

```html
<f-repeat value="{{item in list}}">
    <li>{{item}} - {{title}}</li>
    <!-- {{item}} is the current list item -->
    <!-- {{title}} resolves to the host element's title property -->
</f-repeat>
```

#### Accessing the Parent Context

Inside `<f-repeat>`, use `$c.parent` to access the host element's methods and properties from event handlers:

```html
<f-repeat value="{{item in items}}">
    <button @click="{$c.parent.handleItemClick($e)}">
        {{item.name}}
    </button>
</f-repeat>
```

#### Nested Directives

`<f-when>` can be used inside `<f-repeat>` and vice versa:

```html
<f-repeat value="{{item in items}}">
    <f-when value="{{item.visible}}">
        <span>{{item.name}}</span>
    </f-when>
</f-repeat>
```

### Element Reference (`f-ref`)

The `f-ref` attribute directive stores a reference to a DOM element on the component instance:

```html
<f-template name="video-player">
    <template>
        <video f-ref="{videoElement}"></video>
        <button @click="{play()}">Play</button>
    </template>
</f-template>
```

### Slotted Content (`f-slotted`)

The `f-slotted` attribute directive observes elements assigned to a `<slot>`:

```html
<f-template name="card-container">
    <template>
        <slot f-slotted="{slottedItems}"></slot>
        <slot f-slotted="{slottedItems filter elements()}"></slot>
        <slot f-slotted="{slottedItems filter elements(div, p)}"></slot>
    </template>
</f-template>
```

### Children (`f-children`)

The `f-children` attribute directive observes child elements:

```html
<f-template name="item-list">
    <template>
        <ul f-children="{listItems}">
            <f-repeat value="{{item in list}}">
                <li>{{item}}</li>
            </f-repeat>
        </ul>
    </template>
</f-template>
```

:::note
Attribute directives (`f-ref`, `f-slotted`, `f-children`) use single curly braces `{...}` because they are client-only.
:::

## Execution Context

In imperative FAST templates, every binding receives the data source and the execution context: `${(x, c) => ...}`. Declarative templates access the same execution context using the `$c` prefix.

This is especially useful inside `<f-repeat>` blocks:

```html
<!-- Call a method on the host element from inside a repeat -->
<f-repeat value="{{item in items}}">
    <button @click="{$c.parent.handleItemClick($c.event)}">
        {{item.name}}
    </button>
</f-repeat>

<!-- Conditionally render using a host property inside a repeat -->
<f-repeat value="{{item in items}}">
    <f-when value="{{$c.parent.showDetails}}">
        <span>{{item.description}}</span>
    </f-when>
</f-repeat>
```

## Expression Limitations

Declarative template expressions are **not** arbitrary JavaScript. They support:

- Simple property access: `{{propertyName}}`
- Dot-notation paths: `{{object.property.nested}}`
- Negation: `{{!value}}`
- Comparison operators: `==`, `!=`, `>`, `>=`, `<`, `<=`
- Logical operators: `||`, `&&`
- Context access: `$c`, `$c.parent`, `$e`
- Iteration variables: `{{item in array}}`

Complex JavaScript expressions, method calls in bindings (other than event handlers), and ternary operators are not supported.

{% endraw %}
