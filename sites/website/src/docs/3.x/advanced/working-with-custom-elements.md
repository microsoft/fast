---
id: working-with-custom-elements
title: Working with Custom Elements
layout: 3x
eleventyNavigation:
  key: working-with-custom-elements3x
  parent: advanced3x
  title: Working with Custom Elements
navigationOptions:
  activeKey: working-with-custom-elements3x
keywords:
  - shadow
  - DOM
  - fouc
  - flash of unstyled content
  - web components
---

A good starting resource for understanding Web Components are the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components).

## FOUC & Hiding undefined elements

Custom Elements that have not been upgraded and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a [flash of un-styled content (FOUC)](https://webkit.org/blog/66/the-fouc-problem/), visually hide Custom Elements if they have not been defined:

```css
:not(:defined) {
  visibility: hidden;
}
```

## Updating attributes on the host element

Sometimes you want to affect the host element itself, based on property state. For example, a progress component might want to write various `aria` attributes to the host, based on the progress state. In order to facilitate scenarios like this, you can use a `template` element as the root of your template, and it will represent the host element. Any attribute or directive you place on the `template` element will be applied to the host itself. If you do not need to affect the host element you do not need to use the `template` element.

**Example: Host Directive Template**

```ts
const template = html<MyProgress>`
  <template (Represents my-progress element)
      role="progressbar"
      $aria-valuenow={x => x.value}
      $aria-valuemin={x => x.min}
      $aria-valuemax={x => x.max}>
    (template targeted at Shadow DOM here)
  </template>
`;
```

**Example: DOM with Host Directive Output**

```html
<my-progress
    min="0"              (from user)
    max="100"            (from user)
    value="50"           (from user)
    role="progressbar"   (from host directive)
    aria-valuenow="50"   (from host directive)
    aria-valuemin="0"    (from host directive)
    aria-valuemax="100"  (from host directive)>
</my-progress>
```

## Adding and Removing Styles in FASTElement

`FASTElement` has the ability to add and remove styles which may be useful for dynamic updates.

**Example:**
```ts
import { attr, css, FASTElement } from '@microsoft/fast-element';

class MyComponent extends FASTElement {
  private dynamicCSS = css`
    :host {
      color: red;
    }
  `;

  attr({ mode: 'boolean' })
  dynamicStyle!: boolean;

  dynamicStyleChanged = (oldValue: boolean, newValue: boolean) => {
    if (newValue) {
      this.$fastController.addStyles(this.dynamicCSS);
    } else {
      this.$fastController.removeStyles(this.dynamicCSS);
    }
  }
}
```

```html
<!-- turn styles on -->
<my-component dynamicstyle></my-component>

<!-- turn styles off -->
<my-component></my-component>
```

For external signals such as [matchMedia()](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), keep the listener on the element and toggle a separate stylesheet through the same controller APIs. `css` templates stay static, so move runtime conditions into the element rather than binding them inside the stylesheet:

```ts
import { css, FASTElement } from "@microsoft/fast-element";

const darkStyles = css`
  :host {
    border-color: white;
  }
`;

export class MyElement extends FASTElement {
  private readonly darkMode = window.matchMedia("(prefers-color-scheme: dark)");

  private readonly syncDarkMode = () => {
    if (this.darkMode.matches) {
      this.$fastController.addStyles(darkStyles);
    } else {
      this.$fastController.removeStyles(darkStyles);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.darkMode.addEventListener("change", this.syncDarkMode);
    this.syncDarkMode();
  }

  disconnectedCallback() {
    this.darkMode.removeEventListener("change", this.syncDarkMode);
    this.$fastController.removeStyles(darkStyles);
    super.disconnectedCallback();
  }
}
```
