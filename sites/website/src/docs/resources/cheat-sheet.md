---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
description: A quick reference guide to the documentation.
keywords:
  - cheat sheet
---
# Cheat Sheet

## Packages

### [@microsoft/fast-element](../fast-element/getting-started.md)

**A lightweight library for building performant, memory-efficient, standards-compliant Web Components.**

* Provides a thin layer of opinion on top of [Web Components](./why-web-components.md), lifting the level of abstraction just enough to make it easier and faster to [build components](#building-components).
* Use this library when you want to create new custom web components. 

To install the `fast-element` library, use either `npm` or `yarn`:

```shell
npm install --save @microsoft/fast-element
```

```shell
yarn add @microsoft/fast-element
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { FASTElement } from "@microsoft/fast-element";
```

---

### [@microsoft/fast-foundation](../introduction.md/#how-can-fast-help-me)

**This package is a library of Web Component classes, templates, and other utilities intended to be composed into registered Web Components by design systems.**

* Exports of this package can generally be thought of as un-styled base components that implement semantic and accessible markup and behavior.   
* Use this library when you want to create something like Google's Material Design or Bootstrap.

**Example**

```ts
import {
  Button as FoundationButton,
  buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";

export class MyButton extends FoundationButton {
  ...
}

export const buttonStyles = css`
  :host {
    background-color: azure;
  }
`;

export const myButton = MyButton.compose({
  baseName: "button",
  baseClass: FoundationButton,
  template,
  styles: buttonStyles,
  shadowOptions: {
    delegatesFocus: true,
  },
});
```

---

### [@microsoft/fast-components](../components/getting-started.md)     

**The FAST component library and visual system [FAST Frame](../design-systems/fast-frame.md), which implements fast-foundation.**

* Assembles the building blocks of `@microsoft/fast-foundation` to create its component set. 
* Use this library when you want to integrate [FAST Components](#using-components) into an existing site or app.

To install the components, use either `npm` or `yarn`:

```shell
npm install --save @microsoft/fast-components
``` 

```shell
yarn add @microsoft/fast-components
```

To use a component as a custom element in HTML, the custom element must be registered.

**Example**

```ts
import { 
  fastButton, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
  .register(
    fastButton() // custom element registration
  );
```

---


## [Using components](../components/getting-started.md)

### Setup

**Example** 

To register design system components:

```ts
import { 
  fastButton, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
  .register(
    fastButton() // custom element registration
  );
```

Or, register all system components:

```ts
import { 
  allComponents, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

With the components registered, add any component to the HTML.

**Example**

```html
<fast-button>Hello world</fast-button>
```

---

Launch our [Component Explorer](https://explore.fast.design/) for a comprehensive list of FAST Components.

---
### [Integrations](../integrations/introduction.md)

FAST libraries can also be used in combination with a wide variety of existing technologies:

- [Angular](../integrations/angular.md)
- [ASP.NET](../integrations/aspnet.md)
- [Aurelia](../integrations/aurelia.md)
- [Blazor](../integrations/blazor.md)
- [Ember](../integrations/ember.md)
- [React](../integrations/react.md)
- [Rollup](../integrations/rollup.md)
- [Svelte](../integrations/svelte.md)
- [Vite](..integrations/vite.md)
- [Vue](../integrations/vue.md)
- [Webpack](../integrations/webpack.md)

Not seeing an integration for your preferred technology?  Open an issue on [GitHub](https://github.com/microsoft/fast/issues/new/choose).

---

## [Building components](../fast-element/getting-started.md)

There are two main approaches to building a component:
- The first approach is for simple declarations of non-shared components.
- The second approach is for components designed to be published in [shareable libraries](#design-system).

### Setup


**Example** 

To define a custom element:

```ts
import { FASTElement, customElement } from "@microsoft/fast-element";

@customElement("name-tag") // custom element being created
export class NameTag extends FASTElement {
  ...
}
```

With this in place, you can now use your `<name-tag>` element anywhere in HTML with the following markup:

```html
<name-tag></name-tag>
```

---

### [Attributes](../fast-element/defining-elements.md#customizing-attributes)

To add attributes to your HTML element, create properties decorated by the `@attr` decorator.

All attributes defined this way will be automatically registered with the platform so that they can be updated through the browser's native `setAttribute` API as well as the property. 

You can optionally add a method with the naming convention *propertyName*Changed to your class, and this method will be called whenever your property changes, whether it changes through the property or the attribute API.

**Example**

```ts
import { FASTElement, customElement, attr } from "@microsoft/fast-element";

@customElement("name-tag")
export class NameTag extends FASTElement {
  @attr greeting: string = "Hello";

  // optional method 
  greetingChanged() {
    ...
  }
}
```

**Example: To use a Web Component with Attributes**

```html
<name-tag greeting="Hola"></name-tag>
```

---

#### [Customizing attributes](../fast-element/defining-elements.md#customizing-attributes)

There are three modes available through the `mode` property of the attribute configuration:

| Mode | Guidance |
| :-- | :-- | 
| reflect | The default mode that is used if none is specified. |
| boolean | This mode causes your attribute to function using the HTML boolean attribute behavior. |
| fromView | This mode skips reflecting the value of the property back to the HTML attribute. |

---

In addition to setting the mode, you can also supply a custom `ValueConverter` by setting the `converter` property of the attribute configuration. 

The converter must implement the following interface:

```ts
interface ValueConverter {
  toView(value: any): string;
  fromView(value: string): any;
}
```

**Example: An Attribute in `Reflect` Mode with No Special Conversion**

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
  @attr greeting: string = 'Hello';
}
```

**Example: An Attribute in `Boolean` Mode with Boolean Conversion**

```ts
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('my-checkbox')
export class MyCheckbox extends FASTElement {
  @attr({ mode: 'boolean' }) disabled: boolean = false;
}
```

**Example: An Attribute in `Reflect` Mode with Custom Conversion**

```ts
import { FASTElement, customElement, attr, ValueConverter } from '@microsoft/fast-element';

const numberConverter: ValueConverter = {
  toView(value: number): string {
    return String(value);
  },

  fromView(value: string): number {
    return Number(value);
  }
};

@customElement("my-counter")
export class MyCounter extends FASTElement {
  @attr({
    mode: "reflect",
    converter: numberConverter
  })
  count: number = 0;
}
```

---

### [Templates](../fast-element/declaring-templates.md)

To create an HTML template for an element, import and use the `html` tagged template helper and pass the template to the `@customElement` decorator.

**Example**

```ts
import { FASTElement, customElement, attr, html } from "@microsoft/fast-element";

const template = html<NameTag>`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">TODO: Name Here</div>

  <div class="footer"></div>
`;

@customElement({
  name: "name-tag",
  template
})
export class NameTag extends FASTElement {
  ...
}
```

---

### [Observables](../fast-element/observables-and-state.md#observable-features)

To enable binding tracking and change notification, properties must be decorated with either `@attr` or `@observable`. 

Use `@attr` for primitive properties (string, bool, number) that are intended to be surfaced on your element as HTML [attributes](#attributes). Use `@observable` for all other property types on an HTMLElement and all observable properties on plain classes.

**Example**

```ts
import { Observable } from "@microsoft/fast-element";

export class Person {
  @observable firstName = "";
  @observable lastName = "";

  get fullName() {
    return `${this.firstName} ${this.LastName}`;
  }
}
```

---

### [Bindings](../fast-element/declaring-templates.md#understanding-bindings)

(`x` refers to the custom-element class instance in the examples below.)

| Binding Type | Example  | Notes |
| :--- | :--- | :--- |
| Content | `<p>${x => x.greeting} friend!</p>` | Creates a binding to interpolate text or child templates into element content. |
| HTML Attribute | `<a href=${x => x.aboutLink}></a>` | Creates a binding that uses the setAttribute API. Attribute bindings also support interpolation with text and other bindings. |
| HTML Boolean Attribute | `<input ?disabled=${x => x.isDisabled}>` | Creates a binding that adds or removes the attribute based on truthy/falsey values. |
| JS Property | `<input :value=${x => x.name}>` | Creates a binding that sets a JavaScript property on the element. |
| Event Handler | `<button @click=${x => x.handleClick()}>Button</button>` | Registers an event handler using addEventListener. The listener is automatically removed when the template is unbound. <br /><br />After your event handler is executed, preventDefault() will be called on the event object by default. You can return true from your handler to opt-out of this behavior.|
| HTML Element Reference | `<button ${ref("myButton")}>Button</button>` | Captures a reference to the element and assigns it to the named property on the element instance. |
| Slotted Node Capture | `<slot ${slotted("defaultSlotNodes")}></slot>` | Watches the slot for changes and synchronizes those to an array, assigned to the named property on the element instance. |
| Child Node Capture | `<div ${children("divChildren")}></div>` | Watches the element's children or changes and synchronizes those to an array, assigned to the named property on the element instance. |

---

### [Directives](../fast-element/using-directives.md)

Use the [`when`](../fast-element/using-directives.md#the-when-directive) directive to conditionally render blocks of HTML.

**Example**

```ts
import { FASTElement, customElement, observable, html, when } from "@microsoft/fast-element";

const template = html<MyApp>`
 ...
  ${when(x => !x.ready, html<MyApp>`
    Loading...
  `)}
`;

@customElement({
  name: "my-app",
  template
})
export class MyApp extends FASTElement {
  @observable ready: boolean = false;
  ...
}
```

---

Use the [`repeat`](../fast-element/using-directives.md#the-repeat-directive) directive to render a list of data.

**Example**

```ts
import { FASTElement, customElement, observable, html, repeat } from "@microsoft/fast-element";

const template = html<FriendList>`
  ...
    ${repeat(x => x.friends, html<string>`
      <li>${x => x}</li>
    `)}
`;

@customElement({
  name: "friend-list",
  template
})
export class FriendList extends FASTElement {
  @observable friends: Person[] = [];
  ...
}
```

---

Properties available on the context object within a `repeat` block:

| Property | Definition |
| :-- | :-- |
| event | The event object when inside an event handler. |
| parent | The parent view-model when inside a repeat block. |
| parentContext | The parent ExecutionContext when inside a repeat block. This is useful when repeats are nested and the inner-most repeat needs access to the root view-model. |

`Opt-in` properties that are not available by default:

| Opt-in Properties  | Definition |
| :-- | :-- |
| index | The index of the current item when inside a repeat block. |
| length | The length of the array when inside a repeat block. |
| isEven | True if the index of the current item is even when inside a repeat block. |
| isOdd | True if the index of the current item is odd when inside a repeat block. |
| isFirst | True if the current item is first in the array inside a repeat block. |
| isInMiddle | True if the current item is somewhere in the middle of the array inside a repeat block. |
| isLast | True if the current item is last in the array inside a repeat block. |

To opt into the positioning properties, pass options to the `repeat` directive, with the setting `positioning: true`.

**Example: Rendering a list with Item Index**

```ts
<ul>
  ${repeat(x => x.friends, html<string>`
    <li>${(x, c) => c.index} ${x => x}</li>
  `, { positioning: true })}
</ul>
```

---

### [Styles](../fast-element/leveraging-css.md#basic-styles)

`FASTElement` provides a css tagged template helper that allows for the creation of `ElementStyles`.

**Example: Adding CSS to a `FASTElement`**

```ts
import { FASTElement, customElement } from "@microsoft/fast-element";
import { css, customElement, FASTElement } from "@microsoft/fast-element";
import { disabledOpacity } from "../design-tokens";

const styles = css`
  :host([disabled]) {
    opacity: ${disabledOpacity};
  }
`;

@customElement({
  styles
})
export class MyElement extends FASTElement {}
```

---

#### [Composing styles](../fast-element/leveraging-css.md#composing-styles)

`ElementStyles` can be composed with other styles.

**Example**

```ts
import { normalize } from "./normalize";

const styles = css`
  ${normalize}
  :host {
    ...
  }
`;
```

---

#### [Partial CSS](../fast-element/leveraging-css.md#partial-css)

Use the `cssPartial` tagged template literal to create reusable blocks of partial CSS.

**Example**

```ts
import { css, cssPartial } from "@microsoft/fast-element";

const partial = cssPartial`color: red;`;
const styles = css`:host{ ${partial} }`;
```

---

### [CSSDirective](../fast-element/leveraging-css.md#cssdirective)

To create a `CSSDirective`, import and extend `CSSDirective` from `@microsoft/fast-element`.

**Example**

```ts
import { CSSDirective }  from "@microsoft/fast-element"

class RandomWidth extends CSSDirective {}
```

---

#### [createCSS method](../fast-element/leveraging-css.md#createcss)


`CSSDirective` has a `createCSS()` method that returns a string to be interpolated into an `ElementStyles`.

**Example**

```ts
class RandomWidth extends CSSDirective {
  createCSS() {
    return "width: var(--random-width);"
  }
}
```

---
#### [createBehavior method](../fast-element/leveraging-css.md#createbehavior)

The `createBehavior()` method can be used to create a `Behavior` that is bound to the element using the `CSSDirective`.

**Example**

```ts
class RandomWidth extends CSSDirective {
  private property = "20px";
  createCSS() {
    return `width: ${this.property};`
  }

  createBehavior() {
    return {
      bind(el) {
        el.style.setProperty(this.property, Math.floor(Math.random() * 100) + "px")
      }
      unbind(el) {
        el.style.removeProperty(this.property);
      }
    }
  }
}
```

---

## Design system

### [Creating a design system](../design-systems/creating-a-component-library.md#defining-a-design-system)

1. Start with the base components defined in `@microsoft/fast-foundation` and compose them with your own styles.

**Example**

```ts
import {
  Button,
  buttonTemplate as template,
} from "@microsoft/fast-foundation";
import { buttonStyles as styles } from "./special-button.styles";

export const specialButton = Button.compose({
  baseName: "button",
  template,
  styles,
  shadowOptions: {
    delegatesFocus: true,
  },
});

export const buttonStyles = styles;
```

2. Export a `provider function` for your community to use in setting everything up.

**Example**

```ts
export function provideSpecialDesignSystem(element?: HTMLElement): DesignSystem {
  return DesignSystem.getOrCreate(element).withPrefix("special");
}
```

---

### [Design tokens](../design-systems/design-tokens.md)

**Example: [Creating a token](../design-systems/design-tokens.md#create-a-token)**

```ts
import { DesignToken } from "@microsoft/fast-foundation";

// create a design token
export const specialColor = DesignToken.create<string>("special-color");
```

**Example: [Using design tokens in CSS](../design-systems/design-tokens.md#using-design-tokens-in-css)**

```ts
// use the design token to build styles
const styles = css`
  :host {
    background: ${specialColor};
  }
`;
```

**Example: [Setting values](../design-systems/design-tokens.md#setting-values)**
```ts
// change the value for a given element
specialColor.setValueFor(ancestor, "#FFF");
specialColor.setValueFor(descendent, "#000");
```

**Example: [Getting values](../design-systems/design-tokens.md#getting-values)**
```ts
// get the value
specialColor.getValueFor(ancestor); // "#FFF"
specialColor.getValueFor(descendent); // "#000"
```

**Example: [Deleting values](../design-systems/design-tokens.md#deleting-values)**
```ts
// unset the value (inherits from ancestor)
specialColor.deleteValueFor(descendent);
specialColor.getValueFor(descendent); // "#FFF"
```

---

#### Configuring a FAST design token

FAST exposes non-color related [Design Tokens](../design-systems/fast-frame.md#fast-frame-design-tokens) that can be used to configure components stylistically.  For Design Tokens related to color, see the [adaptive color system](../design-systems/fast-frame.md/#adaptive-color-system).

**Example: Changing the value for the `typeRampBaseFontSize` design token**

```ts
import { typeRampBaseFontSize } from "@microsoft/fast-components";
import { FASTElement } from '@microsoft/fast-element';

const myElement = document.querySelector("my-element") as FASTElement;

typeRampBaseFontSize.setValueFor(myElement, "20px");
```

---

## [Contributing to FAST](../community/join.md)

**Connect with us**:

- Join our [Discord](https://discord.gg/FcSNfg4) server.
- Report bugs, request features through [Github](https://github.com/microsoft/fast/issues/new/choose).

**Unsure of what to work on?**

- Here are [good first issues](https://github.com/microsoft/fast/labels/community:good-first-issue).

---
### [Contributor guide](../community/contributor-guide.md/)
- [Machine setup](../community/contributor-guide.md#machine-setup)
- [Cloning the repository](../community/contributor-guide.md#cloning-the-repository)
- [Installing & building](../community/contributor-guide.md#installing-and-building)
- [Testing](../community/contributor-guide.md/#testing)
- [Submitting a pull request](../community/contributor-guide.md/#submitting-a-pull-request)
- [Merging a pull request](../community/contributor-guide.md#merging-a-pull-request)

---


### [Branch Guide](../community/branch-guide.md)

When contributing to the FAST repository, please follow the standards defined in this guide.

---

### [Contributing to `fast-components`](../community/contributor-guide.md/#developing-in-fast-components)

```shell
cd packages/web-components/fast-components
yarn start
```

[Storybook](https://storybook.js.org/) will open in a browser window at `localhost:6006`.

---

### [Contributing to documentation](../community/writing-documentation.md)

```shell
cd sites/website
yarn start
```

[Docusaurus](https://docusaurus.io/) will open in a browser window at `localhost:3000`.