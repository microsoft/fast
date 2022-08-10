---
id: leveraging-css
title: Leveraging CSS
sidebar_label: Leveraging CSS
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/guide/leveraging-css.md
description: Similar to HTML, FASTElement provides a css tagged template helper to allow creating and re-using CSS.
---

## Basic styles

The final piece of our component story is CSS. Similar to HTML, `FASTElement` provides a `css` tagged template helper to allow creating and re-using CSS. Let's add some CSS for our `name-tag` component.

**Example: Adding CSS to a `FASTElement`**

```ts
import { html, css, customElement, attr, FASTElement } from "@microsoft/fast-element";

const template = html<NameTag>`
  <div class="header">
    <slot name="avatar"></slot>
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">
    <slot></slot>
  </div>

  <div class="footer"></div>
`;

const styles = css`
  :host {
    display: inline-block;
    contain: content;
    color: white;
    background: var(--fill-color);
    border-radius: var(--border-radius);
    min-width: 325px;
    text-align: center;
    box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0,0,0,.5);
  }

  :host([hidden]) { 
    display: none;
  }

  .header {
    margin: 16px 0;
    position: relative;
  }

  h3 {
    font-weight: bold;
    font-family: 'Source Sans Pro';
    letter-spacing: 4px;
    font-size: 32px;
    margin: 0;
    padding: 0;
  }

  h4 {
    font-family: sans-serif;
    font-size: 18px;
    margin: 0;
    padding: 0;
  }

  .body {
    background: white;
    color: black;
    padding: 32px 8px;
    font-size: 42px;
    font-family: cursive;
  }

  .footer {
    height: 16px;
    background: var(--fill-color);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }
`;

@customElement({
  name: 'name-tag',
  template,
  styles
})
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

Using the `css` helper, we're able to create `ElementStyles`. We configure this with the element through the `styles` option of the decorator. Internally, `FASTElement` will leverage [Constructable Stylesheet Objects](https://wicg.github.io/construct-stylesheets/) and `ShadowRoot#adoptedStyleSheets` to efficiently re-use CSS across components. This means that even if we have 1k instances of our `name-tag` component, they will all share a single instance of the associated styles, allowing for reduced memory allocation and improved performance. Because the styles are associated with the `ShadowRoot`, they will also be encapsulated. This ensures that your styles don't affect other elements and other element styles don't affect your element.

:::note
We've used [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) throughout our CSS as well as [CSS Calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) in order to enable our component to be styled in basic ways by consumers. Additionally, consider adding [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) to your template, to enable even more powerful customization.
:::

## Composing styles

One of the nice features of `ElementStyles` is that it can be composed with other styles. Imagine that we had a CSS normalize that we wanted to use in our `name-tag` component. We could compose that into our styles like this:

**Example: Composing CSS Registries**

```ts
import { normalize } from './normalize';

const styles = css`
  ${normalize}
  :host {
    display: inline-block;
    contain: content;
    color: white;
    background: var(--fill-color);
    border-radius: var(--border-radius);
    min-width: 325px;
    text-align: center;
    box-shadow: 0 0 calc(var(--depth) * 1px) rgba(0,0,0,.5);
  }

  ...
`;
```

Rather than simply concatenating CSS strings, the `css` helper understands that `normalize` is `ElementStyles` and is able to re-use the same Constructable StyleSheet instance as any other component that uses `normalize`. 

:::note
You can also pass a CSS `string` or a [CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet) instance directly to the element definition, or even a mixed array of `string`, `CSSStyleSheet`, or `ElementStyles`.
:::

### Partial CSS
There are times when you may want to create reusable blocks of *partial* CSS, where the abstraction is not valid CSS in and of itself, such as groups of CSS properties or a complex value. To do that, you can use the `cssPartial` tagged template literal: 

```ts
import { css, cssPartial } from "@microsoft/fast-element";

const partial = cssPartial`color: red;`;
const styles = css`:host{ ${partial} }`;
```

`cssPartial` can also compose all structures that `css` can compose, providing even greater flexibility.

## CSSDirective
The `CSSDirective` allows binding behavior to an element via `ElementStyles`. To create a `CSSDirective`, import and extend `CSSDirective` from `@microsoft/fast-element`:

```ts
import { CSSDirective }  from "@microsoft/fast-element"

class RandomWidth extends CSSDirective {}
```

A CSS directive has two key methods that you can leverage to add dynamic behavior via CSS:

### createCSS
`CSSDirective` has a `createCSS()` method that returns a string to be interpolated into an `ElementStyles`:

```ts
class RandomWidth extends CSSDirective {
  createCSS() {
    return "width: var(--random-width);"
  }
}
```

### createBehavior
The `createBehavior()` method can be used to create a `Behavior` that is bound to the element using the `CSSDirective`:


```ts
class RandomWidth extends CSSDirective {
  private property = "--random-width";
  createCSS() {
    return `width: var(${this.property});`
  }

  createBehavior() {
    return {
      bind(el) {
        el.style.setProperty(this.property, Math.random() * 100)
      }
      unbind(el) {
        el.style.removeProperty(this.property);
      }
    }
  }
}
```

### Usage in ElementStyles
The `CSSDirective` can then be used in an `ElementStyles`, where the CSS string from `createCSS()` will be interpolated into the stylesheet, and the behavior returned from `createBehavior()` will get bound to the element using the stylesheet:

```ts
const styles = css`:host {${new RandomWidth()}}`;
```

## Shadow DOM styling

You may have noticed the `:host` selector we used in our `name-tag` styles. This selector allows us to apply styles directly to our custom element. Here are a few things to consider always configuring for your host element:

* **display** - By default, the `display` property of a custom element is `inline`, so consider whether you want your element's default display behavior to be different.
* **contain** - If your element's painting is contained within its bounds, consider setting the CSS `contain` property to `content`. The right containment model can positively affect your element's performance. [See the MDN docs](https://developer.mozilla.org/en-US/docs/web/css/contain) for more information on the various values of `contain` and what they do. 
* **hidden** - In addition to a default `display` style, add support for `hidden` so that your default `display` does not override this state. This can be done with `:host([hidden]) { display: none }`.

## Slotted content

In addition to providing host styles, you can also provide default styles for content that gets slotted. For example, if we wanted to style all `img` elements that were slotted into our `name-tag`, we could do it like this:

**Example: Slotted Styles**

```ts
const styles = css`
  ...

  ::slotted(img) {
    border-radius: 50%;
    height: 64px;
    width: 64px;
    box-shadow: 0 0 calc(var(--depth) / 2px) rgba(0,0,0,.5);
    position: absolute;
    left: 16px;
    top: -4px;
  }

  ...
`;
```

:::note
Both slotted and host styles can be overridden by the element user. Think of these as the *default* styles that you are providing, so that your elements look and function correctly out-of-the-box.
:::

## Styles and the element lifecycle

It is during the `connectedCallback` phase of the Custom Element lifecycle that `FASTElement` adds the element's styles. The styles are only added the first time the element is connected.

In most cases, the styles that `FASTElement` renders are determined by the `styles` property of the Custom Element's configuration. However, you can also implement a method on your Custom Element class named `resolveStyles()` that returns an `ElementStyles` instance. If this method is present, it will be called during `connectedCallback` to obtain the styles to use. This allows the element author to dynamically select completely different styles based on the state of the element at the time of connection.

In addition to dynamic style selection during the `connectedCallback`, the `$fastController` property of `FASTElement` enables dynamically changing the styles at any time through setting the controller's `styles` property to any valid styles.

### Hiding undefined elements

Custom Elements that have not been [upgraded](https://developers.google.com/web/fundamentals/web-components/customelements#upgrades) and don't have styles attached can still be rendered by the browser but they likely do not look how they are supposed to. To avoid a *flash of un-styled content* (FOUC), visually hide Custom Elements if they have not been *defined*:

```CSS
:not(:defined) {
  visibility: hidden;
}
```

:::important
The consuming application must apply this, as the components themselves do not.
:::
