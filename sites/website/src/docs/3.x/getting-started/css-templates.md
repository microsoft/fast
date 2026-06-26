---
id: css-templates
title: CSS Templates
layout: 3x
eleventyNavigation:
  key: css-templates3x
  parent: getting-started3x
  title: CSS Templates
navigationOptions:
  activeKey: css-templates3x
keywords:
  - css
  - template
  - web components
---

# CSS Templates

Custom elements are typically styled by attaching a `<style>` element to their shadow root or by adopting a constructable stylesheet. FAST provides a tagged template function called `css`, which lets you author a component's styles in JavaScript and associate them with its definition.

Styles created with `css` produce an `ElementStyles` object that FAST applies to the component's shadow root. Because the Shadow DOM encapsulates style scope, selectors authored there match only elements within the component's shadow tree, so the styles do not affect the rest of the document. When the same styles are used across many instances of a component, FAST reuses a single underlying constructable stylesheet rather than duplicating it. Unlike HTML templates, `css` templates are static and do not support binding expressions.

This document describes how to author styles with the `css` function, including composing styles, partial CSS fragments, CSS directives, and changing styles at runtime.

## Defining Styles

The `css` function is a tagged template that turns CSS into an `ElementStyles` object. The following example defines basic styles for a component:

```ts
import { css, FASTElement, html } from "@microsoft/fast-element";

class HelloWorld extends FASTElement {}

const template = html<HelloWorld>`
  <template>
    <span>Hello World!</span>
  </template>
`;

const styles = css`
  :host {
    border: 1px solid blue;
  }

  span {
    color: green;
  }
`;

HelloWorld.define({
  name: "hello-world",
  template,
  styles,
});
```

The example above defines a `HelloWorld` component with a `span` element that displays a greeting. The component's stylesheet is provided via the `styles` property in the `define()` call. When a `<hello-world>` element is added to the page, it will have a blue border and the text inside the `span` will be green.

## Composing Styles

`ElementStyles` objects created with `css` can be composed into other styles. When you interpolate one `ElementStyles` object into another `css` template, FAST includes it as a complete, reusable stylesheet rather than copying its text. This lets you share common styles across components. For example:

```ts
const baseStyles = css`
  :host {
    display: block;
    padding: 10px;
  }
`;

const helloStyles = css`
  ${baseStyles}

  :host {
    border: 1px solid blue;
  }

  span {
    color: green;
  }
`;
```

This example defines a `baseStyles` fragment that sets common styles for the host element. `helloStyles` interpolates `baseStyles` and adds rules of its own, so a component styled with `helloStyles` receives both sets of styles.

### Mixing Style Sources

The `styles` property of the `define()` method accepts an array of `ElementStyles` objects, `CSSStyleSheet` instances, and raw CSS strings, letting you combine styles from different sources in a single component. For example:

```ts
const resetSheet = new CSSStyleSheet();
resetSheet.replaceSync(`:host { box-sizing: border-box; }`);

const sharedText = `span { font-family: sans-serif; }`;

HelloWorld.define({
  name: "hello-world",
  template,
  styles: [
    resetSheet,                     // a CSSStyleSheet, adopted as-is
    sharedText,                     // a raw CSS string, parsed into its own stylesheet
    css`:host { color: green; }`,   // ElementStyles via the css function
  ],
});
```

The example above combines three kinds of styles. `resetSheet` is a `CSSStyleSheet` that is adopted directly, `sharedText` is a raw CSS string that FAST parses into its own stylesheet, and the `css` function produces an `ElementStyles` object. Each is applied to the component's shadow root as a separate stylesheet.

### Partial CSS

The `css.partial` function creates a reusable fragment of CSS. Unlike a full `ElementStyles` object, which composes as a separate stylesheet, a partial is inlined into the `css` template that interpolates it. This means a partial can appear anywhere in a template, including inside a selector, which lets you share rules, declarations, or selector fragments across components.

```ts
import { css } from "@microsoft/fast-element";

// A partial CSS fragment that matches checked states
const checkedState = css.partial`:is([state--checked], :state(checked))`;

const checkboxStyles = css`
  :host(${checkedState}) {
    font-weight: bold;
  }
`;
```

In this example, `checkedState` is a partial CSS fragment that matches elements with a `state--checked` attribute or a `checked` state. The `checkboxStyles` stylesheet includes this fragment in its selector, allowing it to apply styles to the host element when it is in the checked state.

### CSS Directives

A CSS directive is the general mechanism for contributing computed styles to a `css` template. The `css.partial` function described above is one built-in example. A directive is any object with a `createCSS()` method, registered with `CSSDirective.define()`. When the directive is interpolated into a `css` template, FAST calls `createCSS()` and incorporates the returned value into the stylesheet.

```ts
import { css, CSSDirective } from "@microsoft/fast-element";

class Elevation implements CSSDirective {
  constructor(private level: number) {}

  createCSS(): string {
    const blur = this.level * 2;
    return `box-shadow: 0 ${this.level}px ${blur}px rgba(0, 0, 0, 0.2);`;
  }
}

CSSDirective.define(Elevation);

const cardStyles = css`
  :host {
    ${new Elevation(4)}
  }
`;
```

The `Elevation` directive in the example above returns a `box-shadow` declaration derived from its `level`. Calling `CSSDirective.define()` registers the class so FAST recognizes its instances during composition; without registration, the interpolated object would be stringified. When `cardStyles` is composed, FAST calls `createCSS()` and concatenates the result into the `:host` rule.

:::note
A `cssDirective()` decorator is also available and is equivalent to `CSSDirective.define()`. Annotating the class with `@cssDirective()` registers it the same way.
:::

The value returned from `createCSS()` follows the same composition rules as any interpolated value. A string is concatenated inline into the surrounding CSS, while an `ElementStyles` or `CSSStyleSheet` is composed as a separate stylesheet.

A directive runs once, when the template is composed, and its output is fixed in the resulting `ElementStyles`. Because `css` templates are static, a directive cannot respond to component state or produce different styles per instance. Use one to encapsulate reusable style logic that is computed a single time, such as mapping a value to a set of declarations.

## Changing Styles at Runtime

Because `css` templates are static, you do not change a component's styles by re-evaluating its template. Instead, you add, remove, or replace `ElementStyles` through the component's controller, available as `this.$fastController`.

This is most useful when a style depends on a value that can only be computed at runtime. In the following example, a component derives a custom property from a numeric attribute, then builds an `ElementStyles` object and applies it through the controller:

```ts
import { attr, css, ElementStyles, FASTElement } from "@microsoft/fast-element";

class MyElement extends FASTElement {
  @attr
  ratio = 0;

  private ratioStyles?: ElementStyles;

  ratioChanged() {
    if (this.ratioStyles) {
      this.$fastController.removeStyles(this.ratioStyles);
    }

    this.ratioStyles = css`
      :host {
        --fill: ${this.ratio * 100}%;
      }
    `;

    this.$fastController.addStyles(this.ratioStyles);
  }
}
```

Each time `ratio` changes, the component removes the previous stylesheet, builds a new one with the updated value, and adds it. The current stylesheet is held on a private field so it can be removed before the next one is applied. Because the styles are recomputed from a runtime value, a new `ElementStyles` object is created each time rather than reused.

Applying the value as a stylesheet, rather than writing it to the host's inline `style` attribute, keeps the computed value encapsulated in the component's own styles and leaves the host element's `style` attribute free for consumers.

To replace the component's primary stylesheet rather than layer on top of it, assign a new `ElementStyles` object to the controller's `mainStyles` property. This removes the previous main styles and applies the new set.

For styling that can be expressed declaratively, prefer CSS custom properties and state selectors over runtime changes. Use the controller when a style depends on a value the static template cannot express. See the [working with custom elements](../../advanced/working-with-custom-elements/) guide for more on the element controller.

## Selectors and Custom Properties

Styling a component's shadow DOM uses standard CSS, but a few selectors are specific to custom elements and shadow trees:

- [`:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) targets the component's host element. Its functional form, `:host(selector)`, targets the host only when it matches a selector, such as `:host([disabled])` or `:host(${checkedState})`.
- [`::slotted(selector)`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted) targets light DOM content projected through a `<slot>`. It matches only the top-level slotted nodes, not their descendants.
- [`::part(name)`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) targets an element the component exposes through the `part` attribute, allowing consumers to style it from outside the shadow boundary.

Although selectors are scoped to the shadow tree, CSS custom properties inherit through the shadow boundary. This makes them the primary mechanism for customizing a component from the outside. A component reads a custom property with `var()`, supplying a fallback for when it is not set, and a consumer sets the property from the surrounding document.

```ts
const styles = css`
  :host {
    color: var(--accent-color, blue);
  }

  :host([disabled]) {
    opacity: 0.5;
  }

  ::slotted(strong) {
    color: var(--accent-color, blue);
  }
`;
```

A consumer customizes the component by setting the custom property outside the shadow boundary:

```css
my-element {
  --accent-color: rebeccapurple;
}
```

Because the property inherits into the shadow tree, the component picks up the consumer's value wherever it reads `var(--accent-color)`. Design token systems build on this behavior, exposing a component's customizable values as custom properties.
