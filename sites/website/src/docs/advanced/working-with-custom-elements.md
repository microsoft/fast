---
id: working-with-custom-elements
title: Working with Custom Elements
sidebar_label: Working with Custom Elements
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

## Adding and Removing Styles via `css` tag templates

A similar method of adding and removing styles as seen in `FASTElement` can also be done via behaviors which can allow `css` tag templates to update based on some external factors. The `HostBehavior` and `HostController` utilities can be used to create these behaviors.

`HostBehavior` provides access to a `HostController` in the `connectedCallback` method that can add or remove styles with methods `addStyles()` and `removeStyles()`.

Here is an example using [matchMedia()](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to change behaviors when a media query string is matched.

```ts
import { css, HostBehavior, HostController } from "@microsoft/fast-element";

/**
 * A behavior to add or remove a stylesheet from an element based on a media query. The behavior ensures that
 * styles are applied while the a query matches the environment and that styles are not applied if the query does
 * not match the environment.
 *
 * @public
 */
export class MatchMediaStyleSheetBehavior extends HostBehavior {
  public readonly styles: ElementStyles;

  /**
   * The behavior needs to operate on element instances but elements might share a behavior instance.
   * To ensure proper attachment / detachment per instance, we construct a listener for
   * each bind invocation and cache the listeners by element reference.
   */
  private listenerCache = new WeakMap<HostController, MediaQueryListListener>();

  public readonly query: MediaQueryList;

  /**
   * Binds the behavior to the element.
   * @param controller - The host controller orchestrating this behavior.
   */
  connectedCallback(controller: HostController) {
    const { query } = this;
    let listener = this.listenerCache.get(controller);

    if (!listener) {
      listener = this.constructListener(controller);
      this.listenerCache.set(controller, listener);
    }

    // Invoke immediately to add if the query currently matches
    listener.bind(query)();
    query.addEventListener('change', listener);
  }

  /**
   * Unbinds the behavior from the element.
   * @param controller - The host controller orchestrating this behavior.
   */
  disconnectedCallback(controller: HostController) {
    const listener = this.listenerCache.get(controller);
    if (listener) {
      this.query.removeEventListener('change', listener);
    }
  }

  constructor(query: MediaQueryList, styles: ElementStyles) {
    this.query = query;
    this.styles = styles;
  }

  public static with(query: MediaQueryList) {
    return (styles: ElementStyles) => {
      return new MatchMediaStyleSheetBehavior(query, styles);
    };
  }

  protected constructListener(controller: HostController): MediaQueryListListener {
    let attached = false;
    const styles = this.styles;

    return function listener(this: { matches: boolean }) {
      const { matches } = this;

      if (matches && !attached) {
        controller.addStyles(styles);
        attached = matches;
      } else if (!matches && attached) {
        controller.removeStyles(styles);
        attached = matches;
      }
    };
  }

  public removedCallback(controller: HostController<any>): void {
    controller.removeStyles(this.styles);
  }
}

const darkModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(
  window.matchMedia('(prefers-color-scheme: dark)'),
);

export const styles = css`
  :host {
    border-color: black;
  }
`.withBehaviors(
  darkModeStylesheetBehavior(css`
    :host {
      border-color: white;
    }
  `),
);
```