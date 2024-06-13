---
id: html-templates
title: HTML Templates
sidebar_label: HTML Templates
keywords:
  - html
  - template
  - web components
---

# HTML Templates

The `@microsoft/fast-element` package offers a named export `html` which is a [tag template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). It can be used to create HTML snippets which will become your web components shadow DOM.

**Example:**
```typescript
import { html } from "@microsoft/fast-element";

export const template = html`
  <template>Hello world</template>
`;
```

## Binding

When working with the `html` template, bindings allow more complex behavior than simply passing attributes. These bindings are dynamic and are denoted by the [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). By default attributes are assumed to be strings. We typically denote `x` for the element, and `c` for the context.

**Example:**
```ts
import { FASTElement, attr, html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <h3>${x => x.greeting.toUpperCase()}</h3>
`;

export class NameTag extends FASTElement {
  @attr
  greeting: string = 'hello';
}

NameTag.define({
  name: 'name-tag',
  template
});
```

When the greeting attribute is updated, so will the template.

### Booleans

Boolean bindings use the `?` symbol, use these for Boolean attributes.

**Example:**
```typescript
import { html } from "@microsoft/fast-element";

export const template = html`
  <button
    ?disabled="${(x) => x.disabled}"
  >
    Button
  </button>
`;
```

### Events

Events bindings use the `@` symbol. All Element events are available see the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Element#events) for details.

**Example:**
```typescript
import { html } from "@microsoft/fast-element";

export const template = html`
  <button
    @click="${(x, c) => x.clickHandler(c.event)}"
  >
    Button
  </button>
`;
```

:::important
After your event handler is executed, `preventDefault()` will be called on the event object by default. You can return `true` from your handler to opt-out of this behavior.
:::

### Properties

Property bindings use the `:` symbol.

**Example:**
```typescript
import { html } from "@microsoft/fast-element";

export const template = html`
  <input
    :value="${(x) => x.value}"
  />
`;
```

Some complex use cases include binding to a custom property, updating that property and observing it. To learn more about observing properties, check out the [FASTElement](./fast-element.md) document.

## Typed Templates

Your templates can be typed to the data model that they are rendering over. In TypeScript, we provide the type as part of the tag: `html<NameTag>`.

```ts
import { html } from '@microsoft/fast-element';

const template = html<NameTag>`
  <div>${x => x.greeting}</div>
`;
```